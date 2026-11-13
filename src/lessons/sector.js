/**
 * 六上 · 圆：扇形。
 *
 * 拖圆心角和半径，看扇形怎么变：
 *   - 弧、扇形、圆心角的定义（一条弧 + 两条半径围成）
 *   - 同一个圆里，扇形的大小只由圆心角决定
 *   - 弧长 = 2πr × θ/360，扇形面积 = πr² × θ/360
 */
import * as THREE from 'three';
import { createStage } from '../core/three-stage.js';
import { dot, fillDisk, label, strokeArc, strokePolyline } from '../core/sketch.js';

const INK = '#1c2333';
const ARC = '#e2555b';
const MUTED = '#5b6680';
const FILL = '#ffdca8';

/** 极坐标点 */
function pt(cx, cy, radius, angle) {
  return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
}

export default async function mount({ stage: stageEl, panel }) {
  const stage = createStage(stageEl, { height: 9 });
  if (import.meta.env.DEV) window.__mathStage = stage;

  const diagram = new THREE.Group();
  stage.scene.add(diagram);

  let radius = 2.4;
  let angle = 100;
  let dynamic = [];
  let lastUiKey = '';

  panel.innerHTML = `
    <div class="panel-title">
      <h2>扇形</h2>
      <span class="badge">六上 · 圆</span>
    </div>

    <div class="control">
      <label class="control-head" for="sector-angle">
        <span>圆心角 ∠AOB</span>
        <output id="sector-angle-out">100°</output>
      </label>
      <input id="sector-angle" type="range" min="0" max="360" step="5" value="100" />
      <div class="chip-row" style="margin-top:var(--sp-2)">
        <button class="btn btn-ghost" type="button" data-preset="90">90°</button>
        <button class="btn btn-ghost" type="button" data-preset="180">180°</button>
        <button class="btn btn-ghost" type="button" data-preset="270">270°</button>
        <button class="btn btn-ghost" type="button" data-preset="360">360°</button>
      </div>
    </div>

    <div class="control">
      <label class="control-head" for="sector-radius">
        <span>半径 r</span>
        <output id="sector-radius-out">2.4</output>
      </label>
      <input id="sector-radius" type="range" min="1.4" max="3.2" step="0.1" value="2.4" />
    </div>

    <dl class="readouts" style="margin-top:var(--sp-4)">
      <div class="readout"><dt>圆心角</dt><dd data-out="angle">–</dd></div>
      <div class="readout"><dt>占整圆的</dt><dd data-out="ratio">–</dd></div>
      <div class="readout"><dt>弧长</dt><dd data-out="arc">–</dd></div>
      <div class="readout"><dt>扇形面积</dt><dd data-out="area">–</dd></div>
    </dl>

    <p class="lesson-note">
      一条弧和经过这条弧两端的两条半径所围成的图形叫<b>扇形</b>；
      顶点在圆心的角叫<b>圆心角</b>。半径不变时，圆心角越大扇形越大；
      圆心角占 360° 的几分之几，扇形就是整圆的几分之几。
    </p>
  `;

  const angleSlider = panel.querySelector('#sector-angle');
  const angleOut = panel.querySelector('#sector-angle-out');
  const radiusSlider = panel.querySelector('#sector-radius');
  const radiusOut = panel.querySelector('#sector-radius-out');
  const outs = {
    angle: panel.querySelector('[data-out="angle"]'),
    ratio: panel.querySelector('[data-out="ratio"]'),
    arc: panel.querySelector('[data-out="arc"]'),
    area: panel.querySelector('[data-out="area"]'),
  };

  stageEl.insertAdjacentHTML(
    'beforeend',
    '<div class="stage-hint">拖动滑块，看弧和扇形怎么变</div>',
  );

  function disposeDynamic() {
    for (const drawable of dynamic) {
      diagram.remove(drawable.object);
      drawable.object.traverse((object) => {
        object.geometry?.dispose?.();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        for (const material of materials) {
          if (!material) continue;
          material.map?.dispose?.();
          material.dispose?.();
        }
      });
    }
    dynamic = [];
  }

  function add(drawable, progress = 1) {
    diagram.add(drawable.object);
    drawable.setProgress(progress);
    dynamic.push(drawable);
  }

  function render() {
    disposeDynamic();

    const theta = (angle * Math.PI) / 180;
    const a = pt(0, 0, radius, 0);
    const b = pt(0, 0, radius, theta);

    // 扇形填充
    if (angle > 0.5) {
      add(
        fillDisk({
          cx: 0,
          cy: 0,
          r: radius,
          start: 0,
          sweep: theta,
          color: FILL,
          opacity: 0.95,
          order: 100,
        }),
      );
    }

    // 弧 AB（红色高亮）
    add(
      strokeArc({
        cx: 0,
        cy: 0,
        r: radius,
        start: 0,
        sweep: theta,
        color: ARC,
        order: 320,
        showRadius: false,
      }),
    );
    // 两条半径
    add(strokePolyline([{ x: 0, y: 0 }, a], { color: INK, order: 330 }));
    add(strokePolyline([{ x: 0, y: 0 }, b], { color: INK, order: 331 }));

    // 圆心角的角标
    if (angle > 4) {
      const markerRadius = Math.min(radius * 0.32, 0.72);
      add(
        strokeArc({
          cx: 0,
          cy: 0,
          r: markerRadius,
          start: 0,
          sweep: theta,
          color: ARC,
          order: 340,
          showRadius: false,
          opacity: 0.85,
        }),
      );
      const labelPoint = pt(0, 0, markerRadius + 0.42, theta / 2);
      add(
        label({
          x: labelPoint.x,
          y: labelPoint.y,
          text: `${Math.round(angle)}°`,
          color: ARC,
          size: 0.34,
        }),
      );
    }

    // 顶点与端点标注
    add(dot({ cx: 0, cy: 0, r: 0.06, order: 400 }));
    add(label({ x: -0.3, y: -0.28, text: 'O', color: MUTED, size: 0.34 }));
    add(label({ x: a.x + 0.22, y: a.y - 0.06, text: 'A', color: MUTED, size: 0.34 }));
    const stacked = angle >= 350;
    add(label({ x: b.x + 0.2, y: b.y + (stacked ? -0.36 : 0.2), text: 'B', color: MUTED, size: 0.34 }));

    applyFit();
  }

  function applyFit() {
    const half = Math.min(stage.view.width, stage.view.height) / 2 - 0.6;
    const scale = Math.min(1.3, half / (radius + 0.5));
    diagram.scale.setScalar(scale);
  }

  function syncUi() {
    const key = `${angle}|${radius}`;
    if (key === lastUiKey) return;
    lastUiKey = key;

    angleOut.textContent = `${Math.round(angle)}°`;
    radiusOut.textContent = radius.toFixed(1);

    const circumference = 2 * Math.PI * radius;
    const area = Math.PI * radius * radius;
    const ratio = angle / 360;

    outs.angle.innerHTML = `${Math.round(angle)}<span class="unit">°</span>`;
    outs.ratio.innerHTML = `${(ratio * 100).toFixed(0)}<span class="unit">%</span>`;
    outs.arc.innerHTML = `≈ ${(circumference * ratio).toFixed(2)}`;
    outs.area.innerHTML = `≈ ${(area * ratio).toFixed(2)}`;
  }

  angleSlider.addEventListener('input', () => {
    angle = Number(angleSlider.value);
    render();
    syncUi();
  });

  radiusSlider.addEventListener('input', () => {
    radius = Number(radiusSlider.value);
    render();
    syncUi();
  });

  panel.addEventListener('click', (event) => {
    const button = event.target.closest('[data-preset]');
    if (!button) return;
    angle = Number(button.dataset.preset);
    angleSlider.value = String(angle);
    render();
    syncUi();
  });

  stage.onResize(() => {
    applyFit();
  });

  render();
  syncUi();

  return () => {
    disposeDynamic();
    stage.dispose();
    panel.replaceChildren();
  };
}
