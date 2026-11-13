/**
 * 六上 · 圆：半径 / 直径 / 周长 / 面积的互动模型。
 *
 * 教学点：
 *   1. 拖动半径，观察 d = 2r 的联动；
 *   2. 把圆周"拉直"成一条线段，长度恰好是 C = 2πr；
 *   3. 用 3 段直径铺在这条线段上，剩下的一小段就是 0.14d，于是 C ÷ d ≈ 3.14。
 *
 * 交互脚本契约见 src/lessons/index.js。
 */
import * as THREE from 'three';
import { createStage, circlePoints, createLine } from '../core/three-stage.js';

const R_MIN = 0.8;
const R_MAX = 2.4;
const R_DEFAULT = 2.0;

const FIGURE_CENTER = { x: 0, y: 1.5 };
const BAR_Y = -2.9;
const DIAM_Y = -3.7;
/** 整组图形的纵向重心，用来把内容摆到舞台正中 */
const CONTENT_CENTER_Y = -0.15;

const COLOR = {
  circle: '#3b6ef5',
  radius: '#12a375',
  diameter: '#e2555b',
  bar: '#f59e0b',
  dim: '#9aa4ba',
  ink: '#1c2333',
};

/** 用 canvas 画文字 → 贴到 Sprite 上，世界高度固定，便于随舞台缩放 */
function createLabel(text, { color = COLOR.ink, height = 0.46 } = {}) {
  const fontSize = 64;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const font = `600 ${fontSize}px 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif`;
  ctx.font = font;

  canvas.width = Math.ceil(ctx.measureText(text).width) + 28;
  canvas.height = Math.ceil(fontSize * 1.5);

  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 14, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }),
  );
  sprite.scale.set((height * canvas.width) / canvas.height, height, 1);
  return sprite;
}

export default async function mount({ stage: stageEl, panel }) {
  const stage = createStage(stageEl, { height: 12 });
  if (import.meta.env.DEV) window.__mathStage = stage;

  // 整体容器：屏幕太窄时等比缩小，保证"周长展开条"不被裁掉
  const diagram = new THREE.Group();
  stage.scene.add(diagram);

  /** 圆本体（单位圆，靠 scale 变化半径） */
  const figure = new THREE.Group();
  figure.position.set(FIGURE_CENTER.x, FIGURE_CENTER.y, 0);
  diagram.add(figure);

  const fill = new THREE.Mesh(
    new THREE.CircleGeometry(1, 96),
    new THREE.MeshBasicMaterial({ color: COLOR.circle, transparent: true, opacity: 0.1 }),
  );
  figure.add(fill);

  const outline = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(circlePoints(1, 160)),
    new THREE.LineBasicMaterial({ color: COLOR.circle }),
  );
  figure.add(outline);

  const radiusLine = createLine(
    [new THREE.Vector3(0, 0, 0.1), new THREE.Vector3(1, 0, 0.1)],
    { color: COLOR.radius },
  );
  figure.add(radiusLine);

  const diameterLine = createLine(
    [new THREE.Vector3(-1, 0, 0.05), new THREE.Vector3(1, 0, 0.05)],
    { color: COLOR.diameter, dashed: true },
  );
  figure.add(diameterLine);

  const centerDot = new THREE.Mesh(
    new THREE.CircleGeometry(0.055, 24),
    new THREE.MeshBasicMaterial({ color: COLOR.ink }),
  );
  figure.add(centerDot);

  /** 半径端点上的拖拽手柄 */
  const handle = new THREE.Mesh(
    new THREE.CircleGeometry(0.12, 32),
    new THREE.MeshBasicMaterial({ color: COLOR.radius }),
  );
  handle.position.set(1, 0, 0.2);
  figure.add(handle);

  /** 周长展开条：单位宽平面，长度靠 scale.x 变成 C = 2πr */
  const bar = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 0.28),
    new THREE.MeshBasicMaterial({ color: COLOR.bar, transparent: true, opacity: 0.85 }),
  );
  bar.position.set(0, BAR_Y, 0);
  diagram.add(bar);

  /** 3 段直径 + 余量，用来"量"周长展开条 */
  const diameters = new THREE.Group();
  diameters.position.set(0, DIAM_Y, 0);
  diagram.add(diameters);

  [-1.03, 0, 1.03].forEach((offset) => {
    const segment = new THREE.Mesh(
      new THREE.PlaneGeometry(0.94, 0.22),
      new THREE.MeshBasicMaterial({ color: COLOR.dim, transparent: true, opacity: 0.7 }),
    );
    segment.position.set(offset, 0, 0);
    diameters.add(segment);
  });

  // 3 段直径 + 剩下的 0.1416d 恰好等于 πd，与上方周长条右端对齐
  const remainder = new THREE.Mesh(
    new THREE.PlaneGeometry(0.1416, 0.22),
    new THREE.MeshBasicMaterial({ color: COLOR.diameter, transparent: true, opacity: 0.85 }),
  );
  remainder.position.set(1.5708, 0, 0);
  diameters.add(remainder);

  const radiusLabel = createLabel('r', { color: COLOR.radius });
  diagram.add(radiusLabel);

  const barLabel = createLabel('C = 2πr', { color: COLOR.bar });
  diagram.add(barLabel);

  const diamLabel = createLabel('3d + 0.1416d = πd', { color: COLOR.dim, height: 0.4 });
  diagram.add(diamLabel);

  stageEl.insertAdjacentHTML(
    'beforeend',
    '<div class="stage-hint">拖动绿点，或用右侧滑块调整半径</div>',
  );

  let radius = R_DEFAULT;
  let showDiameter = true;

  function layout() {
    figure.scale.setScalar(radius);
    bar.scale.x = Math.PI * 2 * radius;
    const d = radius * 2;
    diameters.scale.x = d;
    // 让 3d + 0.1416d 这个整体居中，与周长条两端对齐
    diameters.position.x = -0.0708 * d;

    radiusLabel.position.set(FIGURE_CENTER.x + radius * 0.5, FIGURE_CENTER.y + 0.32, 0.3);
    barLabel.position.set(0, BAR_Y + 0.55, 0.3);
    diamLabel.position.set(0, DIAM_Y - 0.5, 0.3);

    diameterLine.visible = showDiameter;
    // 手柄是 figure 的子节点，会被 r 一起放大，这里抵消掉保持视觉大小恒定
    handle.scale.setScalar(1 / Math.max(radius * fitScale(), 0.001));
  }

  function fitScale() {
    const width = stage.view.width - 1.2;
    return Math.min(1, width / (Math.PI * 2 * R_MAX));
  }

  stage.onResize(() => {
    const fit = fitScale();
    diagram.scale.setScalar(fit);
    diagram.position.y = -CONTENT_CENTER_Y * fit;
    layout();
  });

  // ---------- 控制面板 ----------
  panel.innerHTML = `
    <div class="panel-title">
      <h2>半径、直径与周长</h2>
      <span class="badge">六上 · 圆</span>
    </div>

    <div class="control">
      <label class="control-head" for="circle-radius">
        <span>半径 r</span>
        <output id="circle-radius-out">${radius.toFixed(1)}</output>
      </label>
      <input id="circle-radius" type="range" min="${R_MIN}" max="${R_MAX}"
        step="0.1" value="${radius}" />
    </div>

    <div class="control">
      <div class="control-head"><span>显示</span></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-ghost" id="toggle-diameter" aria-pressed="true">直径 d</button>
        <button class="btn btn-ghost" id="toggle-bar" aria-pressed="true">周长展开</button>
      </div>
    </div>

    <dl class="readouts" style="margin-top:var(--sp-4)">
      <div class="readout"><dt>半径 r</dt><dd data-out="r">–</dd></div>
      <div class="readout"><dt>直径 d = 2r</dt><dd data-out="d">–</dd></div>
      <div class="readout"><dt>周长 C = 2πr</dt><dd data-out="c">–</dd></div>
      <div class="readout"><dt>面积 S = πr²</dt><dd data-out="s">–</dd></div>
      <div class="readout" style="grid-column:1 / -1">
        <dt>C ÷ d（所有圆都一样）</dt><dd data-out="pi">–</dd>
      </div>
    </dl>

    <p style="margin-top:var(--sp-4);color:var(--c-text-soft);font-size:14px">
      把圆周剪开拉直，长度正好是 <code>C = 2πr</code>；用直径去量它，
      量满 3 段还差一点点——那一点点就是 <code>0.14d</code>，所以 <code>C = πd ≈ 3.14d</code>。
    </p>
  `;

  const slider = panel.querySelector('#circle-radius');
  const radiusOut = panel.querySelector('#circle-radius-out');
  const diameterBtn = panel.querySelector('#toggle-diameter');
  const barBtn = panel.querySelector('#toggle-bar');
  const outs = {
    r: panel.querySelector('[data-out="r"]'),
    d: panel.querySelector('[data-out="d"]'),
    c: panel.querySelector('[data-out="c"]'),
    s: panel.querySelector('[data-out="s"]'),
    pi: panel.querySelector('[data-out="pi"]'),
  };

  function setReadout(node, value, unit) {
    node.innerHTML = `${value}<span class="unit">${unit}</span>`;
  }

  function updateFromSlider() {
    radius = Number(slider.value);
    radiusOut.textContent = radius.toFixed(1);
    layout();

    setReadout(outs.r, radius.toFixed(1), '');
    setReadout(outs.d, (radius * 2).toFixed(1), '');
    setReadout(outs.c, (2 * Math.PI * radius).toFixed(2), '');
    setReadout(outs.s, (Math.PI * radius * radius).toFixed(2), '');
    setReadout(outs.pi, `≈ ${Math.PI.toFixed(2)}`, '');
  }

  slider.addEventListener('input', updateFromSlider);

  diameterBtn.addEventListener('click', () => {
    showDiameter = !showDiameter;
    diameterBtn.setAttribute('aria-pressed', String(showDiameter));
    layout();
  });

  let showBar = true;
  barBtn.addEventListener('click', () => {
    showBar = !showBar;
    barBtn.setAttribute('aria-pressed', String(showBar));
    bar.visible = showBar;
    diameters.visible = showBar;
    barLabel.visible = showBar;
    diamLabel.visible = showBar;
  });

  // ---------- 拖拽半径端点 ----------
  const canvas = stage.renderer.domElement;
  let dragging = false;

  /** 绿点的世界坐标（diagram 与 figure 两层缩放都要算进去） */
  function handleWorld() {
    const fit = fitScale();
    return {
      x: (FIGURE_CENTER.x + radius) * fit,
      y: diagram.position.y + FIGURE_CENTER.y * fit,
    };
  }

  function pointerRadius(event) {
    const world = stage.toWorld(event.clientX, event.clientY);
    const dx = world.x - FIGURE_CENTER.x * fitScale();
    const dy = world.y - diagram.position.y - FIGURE_CENTER.y * fitScale();
    return Math.min(R_MAX, Math.max(R_MIN, Math.hypot(dx, dy) / Math.max(fitScale(), 0.001)));
  }

  function onPointerDown(event) {
    const world = stage.toWorld(event.clientX, event.clientY);
    const handle = handleWorld();
    if (Math.hypot(world.x - handle.x, world.y - handle.y) > 0.7) return;
    dragging = true;
    canvas.setPointerCapture?.(event.pointerId);
    slider.value = String(pointerRadius(event).toFixed(1));
    updateFromSlider();
  }

  function onPointerMove(event) {
    if (!dragging) return;
    slider.value = String(pointerRadius(event).toFixed(1));
    updateFromSlider();
  }

  function onPointerUp(event) {
    dragging = false;
    canvas.releasePointerCapture?.(event.pointerId);
  }

  function onPointerHover(event) {
    if (dragging) return;
    const world = stage.toWorld(event.clientX, event.clientY);
    const point = handleWorld();
    canvas.style.cursor = Math.hypot(world.x - point.x, world.y - point.y) <= 0.7 ? 'grab' : 'default';
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointermove', onPointerHover);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);

  updateFromSlider();

  return () => {
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointermove', onPointerHover);
    canvas.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('pointercancel', onPointerUp);
    stage.dispose();
    panel.replaceChildren();
  };
}
