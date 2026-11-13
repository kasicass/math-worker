/**
 * 六上 · 位置与方向（二）（讲解）。
 *
 * 用"方向和距离"确定位置：观测点 + 十字方向标 + 偏角 + 距离 + 比例尺。
 * 拖一拖，看方位描述和线段比例尺怎么变。
 */
import * as THREE from 'three';
import { createStage } from '../core/three-stage.js';
import { dot, label, strokeArc, strokePolyline } from '../core/sketch.js';

const INK = '#1c2333';
const AXIS_COLOR = '#5b6680';
const RAY = '#e2555b';
const MUTED = '#5b6680';

// 0° = 东，90° = 北，180° = 西，270° = 南；sign 决定从基准方向往哪边偏
const BASES = [
  { id: 'es', text: '东偏南', from: 0, sign: -1 },
  { id: 'en', text: '东偏北', from: 0, sign: 1 },
  { id: 'wn', text: '西偏北', from: 180, sign: -1 },
  { id: 'ws', text: '西偏南', from: 180, sign: 1 },
  { id: 'ne', text: '北偏东', from: 90, sign: -1 },
  { id: 'nw', text: '北偏西', from: 90, sign: 1 },
  { id: 'se', text: '南偏东', from: 270, sign: 1 },
  { id: 'sw', text: '南偏西', from: 270, sign: -1 },
];

const KM_PER_UNIT = 100;

export default async function mount({ stage: stageEl, panel }) {
  const stage = createStage(stageEl, { height: 9 });
  if (import.meta.env.DEV) window.__mathStage = stage;

  const diagram = new THREE.Group();
  stage.scene.add(diagram);

  let base = BASES[0];
  let angle = 30;
  let distance = 600;
  let dynamic = [];
  let lastUiKey = '';

  panel.innerHTML = `
    <div class="panel-title">
      <h2>位置与方向</h2>
      <span class="badge">六上 · 位置与方向（二）</span>
    </div>

    <div class="control">
      <div class="control-head"><span>从哪个方向偏</span></div>
      <div class="chip-row" data-bases></div>
    </div>

    <div class="control">
      <label class="control-head" for="dir-angle">
        <span>偏角</span>
        <output id="dir-angle-out">30°</output>
      </label>
      <input id="dir-angle" type="range" min="0" max="90" step="5" value="30" />
    </div>

    <div class="control">
      <label class="control-head" for="dir-distance">
        <span>距离</span>
        <output id="dir-distance-out">600 km</output>
      </label>
      <input id="dir-distance" type="range" min="100" max="800" step="100" value="600" />
    </div>

    <div class="chip-row" style="margin-top:var(--sp-2)">
      <button class="btn btn-ghost" type="button" data-preset="typhoon">台风：东偏南 30°，600 km</button>
      <button class="btn btn-ghost" type="button" data-preset="city">B 市：北偏西 30°，200 km</button>
    </div>

    <dl class="readouts" style="margin-top:var(--sp-4)">
      <div class="readout" style="grid-column:1 / -1">
        <dt>台风中心在 A 市的什么位置</dt><dd data-out="desc">–</dd>
      </div>
      <div class="readout"><dt>南北方向的分量</dt><dd data-out="ns">–</dd></div>
      <div class="readout"><dt>东西方向的分量</dt><dd data-out="ew">–</dd></div>
    </dl>

    <p class="lesson-note">
      只说“东偏南”还不够，只知道方向没有距离，也确定不了具体位置。
      <b>方向 + 距离</b> 才能确定一个点：先画十字方向标，找到偏角，再按线段比例尺量出距离。
    </p>
  `;

  const baseRow = panel.querySelector('[data-bases]');
  const angleSlider = panel.querySelector('#dir-angle');
  const angleOut = panel.querySelector('#dir-angle-out');
  const distanceSlider = panel.querySelector('#dir-distance');
  const distanceOut = panel.querySelector('#dir-distance-out');
  const outs = {
    desc: panel.querySelector('[data-out="desc"]'),
    ns: panel.querySelector('[data-out="ns"]'),
    ew: panel.querySelector('[data-out="ew"]'),
  };

  baseRow.innerHTML = BASES.map(
    (b) => `<button class="btn btn-ghost" type="button" data-base="${b.id}">${b.text}</button>`,
  ).join('');

  stageEl.insertAdjacentHTML(
    'beforeend',
    '<div class="stage-hint">拖滑块改变偏角和距离，看红点怎么移动</div>',
  );

  /** 偏角换算成数学角度（+x 为东，逆时针为正） */
  function directionAngle() {
    const offset = base.sign * angle;
    return ((base.from + offset) * Math.PI) / 180;
  }

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

  function add(drawable) {
    diagram.add(drawable.object);
    drawable.setProgress(1);
    dynamic.push(drawable);
  }

  function render() {
    disposeDynamic();

    const theta = directionAngle();
    const radius = distance / KM_PER_UNIT;
    const target = { x: Math.cos(theta) * radius, y: Math.sin(theta) * radius };
    const axis = 4.6;

    // 十字方向标
    add(
      strokePolyline([{ x: -axis, y: 0 }, { x: axis, y: 0 }], { color: AXIS_COLOR, order: 300 }),
    );
    add(
      strokePolyline([{ x: 0, y: -axis }, { x: 0, y: axis }], { color: AXIS_COLOR, order: 300 }),
    );
    add(label({ x: 0, y: axis + 0.45, text: '北', color: INK, size: 0.4 }));
    add(label({ x: axis + 0.45, y: 0, text: '东', color: INK, size: 0.4 }));
    add(label({ x: 0, y: -axis - 0.45, text: '南', color: INK, size: 0.4 }));
    add(label({ x: -axis - 0.45, y: 0, text: '西', color: INK, size: 0.4 }));
    add(dot({ cx: 0, cy: 0, r: 0.07, order: 420 }));
    add(label({ x: -0.32, y: -0.34, text: 'A 市', color: MUTED, size: 0.36 }));

    // 目标点的方向线
    add(strokePolyline([{ x: 0, y: 0 }, target], { color: RAY, order: 340 }));
    add(dot({ cx: target.x, cy: target.y, r: 0.11, color: RAY, order: 440 }));
    add(
      label({
        x: target.x,
        y: target.y - 0.5,
        text: '台风中心',
        color: RAY,
        size: 0.36,
      }),
    );

    // 偏角弧线 + 角度标注
    const arcRadius = Math.min(1.5, radius * 0.55);
    const startAngle = (base.from * Math.PI) / 180;
    add(
      strokeArc({
        cx: 0,
        cy: 0,
        r: arcRadius,
        start: startAngle,
        sweep: theta - startAngle,
        color: RAY,
        order: 350,
        showRadius: false,
      }),
    );
    const midAngle = (startAngle + theta) / 2;
    add(
      label({
        x: Math.cos(midAngle) * (arcRadius + 0.5),
        y: Math.sin(midAngle) * (arcRadius + 0.5),
        text: `${angle}°`,
        color: RAY,
        size: 0.36,
      }),
    );

    // 距离标注
    add(
      label({
        x: target.x * 0.55 + 0.35,
        y: target.y * 0.55 + 0.28,
        text: `${distance} km`,
        color: MUTED,
        size: 0.36,
      }),
    );

    // 线段比例尺
    add(
      strokePolyline([{ x: -axis, y: -axis + 0.3 }, { x: -axis + 1, y: -axis + 0.3 }], {
        color: AXIS_COLOR,
        order: 320,
      }),
    );
    add(
      label({
        x: -axis + 0.5,
        y: -axis + 0.75,
        text: `${KM_PER_UNIT} km`,
        color: MUTED,
        size: 0.3,
      }),
    );

    applyFit(axis);
    syncUi();
  }

  function applyFit(axis) {
    const half = Math.min(stage.view.width, stage.view.height) / 2 - 0.4;
    diagram.scale.setScalar(Math.min(1, half / (axis + 0.6)));
  }

  function syncUi() {
    const key = `${base.id}|${angle}|${distance}`;
    if (key === lastUiKey) return;
    lastUiKey = key;

    angleOut.textContent = `${angle}°`;
    distanceOut.textContent = `${distance} km`;

    for (const button of baseRow.querySelectorAll('[data-base]')) {
      button.setAttribute('aria-pressed', String(button.dataset.base === base.id));
    }

    const theta = directionAngle();
    outs.desc.textContent = `${base.text} ${angle}° 方向，距离 ${distance} km`;
    const ns = Math.round(Math.sin(theta) * distance * 10) / 10;
    const ew = Math.round(Math.cos(theta) * distance * 10) / 10;
    outs.ns.textContent = `${ns >= 0 ? '北' : '南'} ${Math.abs(ns)} km`;
    outs.ew.textContent = `${ew >= 0 ? '东' : '西'} ${Math.abs(ew)} km`;
  }

  baseRow.addEventListener('click', (event) => {
    const button = event.target.closest('[data-base]');
    if (!button) return;
    base = BASES.find((b) => b.id === button.dataset.base) ?? base;
    render();
  });

  angleSlider.addEventListener('input', () => {
    angle = Number(angleSlider.value);
    render();
  });

  distanceSlider.addEventListener('input', () => {
    distance = Number(distanceSlider.value);
    render();
  });

  panel.addEventListener('click', (event) => {
    const button = event.target.closest('[data-preset]');
    if (!button) return;
    if (button.dataset.preset === 'typhoon') {
      base = BASES[0]; // 东偏南 30°
      angle = 30;
      distance = 600;
    } else {
      base = BASES[5]; // 北偏西 30°
      angle = 30;
      distance = 200;
    }
    angleSlider.value = String(angle);
    distanceSlider.value = String(distance);
    render();
  });

  stage.onResize(() => {
    applyFit(4.6);
  });

  render();

  return () => {
    disposeDynamic();
    stage.dispose();
    panel.replaceChildren();
  };
}
