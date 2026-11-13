/**
 * 六上 · 圆：圆的面积（讲解）。
 *
 * 交互：把圆平均分成 n 份，用滑块把这一堆扇形"剪开、拼好"，
 * 拼成近似平行四边形 —— 底 ≈ πr，高 = r，于是 S = πr · r = πr²。
 *
 * 份数越多，拼出来的图形越接近长方形，这就是"化曲为直"。
 */
import * as THREE from 'three';
import { createStage } from '../core/three-stage.js';
import { label } from '../core/sketch.js';

const R = 2;
const COUNTS = [8, 16, 32, 64];
const COLORS = ['#a7c4ff', '#ffc98a'];

/**
 * 一个扇形：顶点在原点，弧以 +x 轴为中心。
 * 同时返回画边线用的折线（顶点 → 弧 → 顶点），
 * 不能直接拿三角形扇的索引当折线用，否则会画出乱七八糟的放射线。
 */
function sectorShapes(radius, delta, segments = 12) {
  const arc = [];
  for (let k = 0; k <= segments; k += 1) {
    const angle = -delta / 2 + (delta * k) / segments;
    arc.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
  }

  const positions = [0, 0, 0];
  for (const point of arc) positions.push(point.x, point.y, 0);

  const indices = [];
  for (let k = 1; k <= segments; k += 1) indices.push(0, k, k + 1);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);

  const outline = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), ...arc]);
  return { geometry, outline };
}

export default async function mount({ stage: stageEl, panel }) {
  const stage = createStage(stageEl, { height: 9 });
  if (import.meta.env.DEV) window.__mathStage = stage;

  const diagram = new THREE.Group();
  stage.scene.add(diagram);

  const guideCircle = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: 129 }, (_, i) => {
        const a = (i / 128) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(a) * R, Math.sin(a) * R, 0);
      }),
    ),
    new THREE.LineBasicMaterial({ color: '#c7d0e4', transparent: true, opacity: 0.9 }),
  );
  guideCircle.frustumCulled = false;
  diagram.add(guideCircle);

  const baseLabel = label({ x: 0, y: -R - 0.55, text: '底 ≈ 半个周长 = πr', color: '#3b6ef5' });
  const heightLabel = label({ x: 0, y: 0, text: '高 = r', color: '#12a375' });
  diagram.add(baseLabel.object, heightLabel.object);

  let count = COUNTS[0];
  let sectors = [];
  let morph = 0;
  let playDir = 0;
  let extent = R;
  let lastUiKey = '';

  panel.innerHTML = `
    <div class="panel-title">
      <h2>圆的面积</h2>
      <span class="badge">六上 · 圆</span>
    </div>

    <div class="control">
      <div class="control-head"><span>平均分成几份</span></div>
      <div class="chip-row" data-counts></div>
    </div>

    <div class="control">
      <label class="control-head" for="morph">
        <span>拼一拼（拖动看变化）</span>
        <output id="morph-out">0%</output>
      </label>
      <input id="morph" type="range" min="0" max="100" step="1" value="0" />
    </div>

    <div class="control">
      <div class="chip-row">
        <button class="btn" type="button" data-act="play">自动拼一拼</button>
        <button class="btn btn-ghost" type="button" data-act="reset">变回圆</button>
      </div>
    </div>

    <dl class="readouts" style="margin-top:var(--sp-4)">
      <div class="readout"><dt>半径 r</dt><dd>${R.toFixed(1)}</dd></div>
      <div class="readout"><dt>底 = πr</dt><dd>${(Math.PI * R).toFixed(2)}</dd></div>
      <div class="readout"><dt>高 = r</dt><dd>${R.toFixed(1)}</dd></div>
      <div class="readout"><dt>面积 πr²</dt><dd>${(Math.PI * R * R).toFixed(2)}</dd></div>
    </dl>

    <p class="lesson-note">
      把圆剪成许多小扇形，一上一下拼起来，就近似一个平行四边形：
      底是圆周长的一半 πr，高是半径 r。份数越多越接近，于是
      <b>S = πr × r = πr²</b>。
    </p>
  `;

  const countRow = panel.querySelector('[data-counts]');
  const slider = panel.querySelector('#morph');
  const sliderOut = panel.querySelector('#morph-out');
  const playBtn = panel.querySelector('[data-act="play"]');

  countRow.innerHTML = COUNTS.map(
    (n) => `<button class="btn btn-ghost" type="button" data-count="${n}">${n} 份</button>`,
  ).join('');

  stageEl.insertAdjacentHTML(
    'beforeend',
    '<div class="stage-hint">拖动滑块，把圆"剪开"再拼起来</div>',
  );

  function disposeSectors() {
    for (const sector of sectors) {
      diagram.remove(sector.group);
      sector.group.traverse((object) => {
        object.geometry?.dispose?.();
        object.material?.dispose?.();
      });
    }
    sectors = [];
  }

  function buildSectors(n) {
    disposeSectors();
    const delta = (Math.PI * 2) / n;
    const m = n / 2;
    const width = R * delta;
    const totalWidth = m * width + width / 2;

    for (let i = 0; i < n; i += 1) {
      const group = new THREE.Group();
      const { geometry, outline: outlineGeometry } = sectorShapes(R, delta);

      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
          color: COLORS[i % 2],
          transparent: true,
          opacity: 0.95,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
      );
      mesh.renderOrder = 100 + i;
      mesh.frustumCulled = false;
      group.add(mesh);

      const outline = new THREE.LineLoop(
        outlineGeometry,
        new THREE.LineBasicMaterial({
          color: '#ffffff',
          transparent: true,
          opacity: Math.max(0.12, 0.9 - n * 0.012),
          depthTest: false,
        }),
      );
      outline.renderOrder = 100 + i;
      outline.frustumCulled = false;
      group.add(outline);

      const isUp = i % 2 === 0;
      const pair = Math.floor(i / 2);
      const targetX = (isUp ? pair * width + width / 2 : pair * width + width) - totalWidth / 2;
      const targetY = isUp ? -R / 2 : R / 2;
      const targetRot = isUp ? Math.PI / 2 : -Math.PI / 2;

      const startRot = ((i * delta + Math.PI) % (Math.PI * 2)) - Math.PI;
      // 选最近的等价角度，避免转一大圈
      let endRot = targetRot;
      while (endRot - startRot > Math.PI) endRot -= Math.PI * 2;
      while (endRot - startRot < -Math.PI) endRot += Math.PI * 2;

      sectors.push({ group, startRot, endRot, targetX, targetY });
      diagram.add(group);
    }

    extent = Math.max(totalWidth / 2 + width / 2, R);
    applyFit();
    applyMorph();
  }

  function applyFit() {
    const half = Math.min(stage.view.width, stage.view.height) / 2 - 0.55;
    const scale = Math.min(1.5, half / (extent + 0.9));
    diagram.scale.setScalar(scale);
  }

  function ease(t) {
    return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
  }

  function applyMorph() {
    const e = ease(morph);
    for (const sector of sectors) {
      sector.group.position.set(sector.targetX * e, sector.targetY * e, 0);
      sector.group.rotation.set(0, 0, sector.startRot + (sector.endRot - sector.startRot) * e);
    }
    guideCircle.material.opacity = 0.9 * (1 - e);

    const showLabels = Math.max(0, Math.min(1, (e - 0.55) / 0.3));
    baseLabel.setProgress(showLabels);
    heightLabel.setProgress(showLabels);
    baseLabel.object.position.set(0, -R / 2 - 0.6, 0.3);
    heightLabel.object.position.set(extent + 0.75, 0, 0.3);
  }

  function syncUi() {
    const key = `${count}|${Math.round(morph * 100)}`;
    if (key === lastUiKey) return;
    lastUiKey = key;

    sliderOut.textContent = `${Math.round(morph * 100)}%`;
    for (const button of countRow.querySelectorAll('[data-count]')) {
      button.setAttribute('aria-pressed', String(Number(button.dataset.count) === count));
    }
    playBtn.textContent = morph > 0.995 ? '再看一遍' : '自动拼一拼';
  }

  slider.addEventListener('input', () => {
    morph = Number(slider.value) / 100;
    playDir = 0;
    applyMorph();
    syncUi();
  });

  countRow.addEventListener('click', (event) => {
    const button = event.target.closest('[data-count]');
    if (!button) return;
    const next = Number(button.dataset.count);
    if (next === count) return;
    count = next;
    buildSectors(count);
    lastUiKey = '';
    syncUi();
  });

  panel.addEventListener('click', (event) => {
    const button = event.target.closest('[data-act]');
    if (!button) return;

    if (button.dataset.act === 'play') {
      if (morph >= 0.999) {
        morph = 0;
        playDir = 1;
      } else {
        playDir = 1;
      }
    }

    if (button.dataset.act === 'reset') {
      morph = 0;
      playDir = 0;
      slider.value = '0';
      applyMorph();
    }

    lastUiKey = '';
    syncUi();
  });

  stage.onTick((dt) => {
    if (!playDir) return;
    morph = Math.max(0, Math.min(1, morph + playDir * (dt / 1.6)));
    if (morph >= 1 || morph <= 0) playDir = 0;
    slider.value = String(Math.round(morph * 100));
    applyMorph();
    syncUi();
  });

  stage.onResize(() => {
    applyFit();
  });

  buildSectors(count);
  syncUi();

  return () => {
    disposeSectors();
    stage.dispose();
    panel.replaceChildren();
  };
}
