/**
 * 六上 · 圆：尺规作图。
 *
 * 用"圆规 + 直尺"把三张经典图案一步步画出来，最后涂色：
 *   六瓣花   —— 半径不变在圆上走 6 步，是圆 6 等分的本质
 *   六边形花窗 —— 正六边形 + 6 个外接半圆
 *   太极图   —— 直径、半径中点、两个半圆
 *
 * 每个图案都是纯数据描述（elements + steps），由 core/sketch.js 负责画。
 */
import * as THREE from 'three';
import { createStage } from '../core/three-stage.js';
import { dot, fillDisk, fillPolygon, strokeArc, strokePolyline } from '../core/sketch.js';

const R = 2.0;
const INK = '#1c2333';
const MARK = '#e2555b';
const STEP_PAUSE = 0.35;
const DOT_DURATION = 0.14;
const STROKE_DURATION = 0.5;
const FILL_DURATION = 0.45;

/** 圆上的等分点，默认从正上方开始 */
function ringPoints(radius, count, offset = Math.PI / 2) {
  return Array.from({ length: count }, (_, i) => {
    const angle = offset + (i * Math.PI * 2) / count;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  });
}

const PALETTES = [
  { name: '蓝', tones: ['#3b6ef5', '#9dbaff', '#e6edff'] },
  { name: '暖', tones: ['#f59e0b', '#e2555b', '#fdeccd'] },
  { name: '绿', tones: ['#12a375', '#84d3b6', '#e0f4eb'] },
];

const PATTERNS = [
  {
    id: 'rosette',
    title: '六瓣花',
    note: '圆规张口不变，从圆上一点出发沿圆量 6 步，第 6 步刚好回到起点——这正是圆能被 6 等分的原因。',
    steps: [
      { title: '画基准圆', detail: '针尖扎在圆心 O，圆规张开半径 R，转一整圈。' },
      { title: '圆上截 6 个点', detail: '张口保持 R 不变，从 A 点开始依次在圆上截点，第 6 次正好回到 A。' },
      { title: '画出 6 个圆', detail: '分别以 6 个截点为圆心、同样用 R 画圆，每个圆都经过圆心 O。' },
      { title: '涂色', detail: '相邻花瓣换一种颜色，六瓣花就出来了。' },
    ],
    build() {
      const ring = ringPoints(R, 6);
      return [
        { step: 0, kind: 'circle', cx: 0, cy: 0, r: R },
        { step: 0, kind: 'dot', cx: 0, cy: 0 },
        ...ring.map((p) => ({ step: 1, kind: 'dot', cx: p.x, cy: p.y, color: MARK })),
        ...ring.map((p) => ({ step: 2, kind: 'circle', cx: p.x, cy: p.y, r: R })),
        ...ring.map((p, i) => ({ step: 3, kind: 'fillDisk', cx: p.x, cy: p.y, r: R, tone: i % 2 })),
      ];
    },
  },
  {
    id: 'window',
    title: '六边形花窗',
    note: '正六边形的边长正好等于圆的半径，所以 6 个外接半圆的直径就是边长。',
    steps: [
      { title: '画基准圆', detail: '针尖扎在圆心 O，圆规张开半径 R，转一整圈。' },
      { title: '圆上截 6 个点', detail: '张口保持 R 不变，在圆上依次截出 6 个点。' },
      { title: '直尺连成正六边形', detail: '用直尺把 6 个点依次连起来，得到一个正六边形。' },
      { title: '向外画 6 个半圆', detail: '以每条边为直径，向外画半圆（半圆半径 = 边长的一半）。' },
      { title: '涂色', detail: '半圆花瓣交替上色，中间的正六边形留浅色。' },
    ],
    build() {
      const ring = ringPoints(R, 6);
      const edges = ring.map((a, i) => ({ a, b: ring[(i + 1) % 6] }));
      const humps = edges.map(({ a, b }) => {
        const cx = (a.x + b.x) / 2;
        const cy = (a.y + b.y) / 2;
        const outward = Math.atan2(cy, cx);
        return { cx, cy, r: R / 2, start: outward - Math.PI / 2, sweep: Math.PI };
      });

      return [
        { step: 0, kind: 'circle', cx: 0, cy: 0, r: R },
        { step: 0, kind: 'dot', cx: 0, cy: 0 },
        ...ring.map((p) => ({ step: 1, kind: 'dot', cx: p.x, cy: p.y, color: MARK })),
        ...edges.map(({ a, b }) => ({ step: 2, kind: 'line', points: [a, b] })),
        ...humps.map((h) => ({ step: 3, kind: 'arc', ...h })),
        { step: 4, kind: 'fillPolygon', points: ring, tone: 2 },
        ...humps.map((h, i) => ({ step: 4, kind: 'fillDisk', ...h, tone: i % 2 })),
      ];
    },
  },
  {
    id: 'taiji',
    title: '太极图',
    note: '一条直径 + 两个半径中点，就能画出这条 S 形分界线。',
    steps: [
      { title: '画基准圆', detail: '针尖扎在圆心 O，圆规张开半径 R，转一整圈。' },
      { title: '画一条直径', detail: '直尺过圆心画一条直线，与圆交于 A、B 两点。' },
      { title: '平分两条半径', detail: '用圆规作中垂线，把 OA、OB 各分成两半，得到中点 P、Q。' },
      { title: '画两个半圆', detail: '以 P 为圆心、R/2 为半径画向上凸的半圆；以 Q 为圆心、R/2 为半径画向下凸的半圆。' },
      { title: '涂色', detail: '左右两半用两种颜色，再在两个小圆心处各画一个 R/6 的小圆当"鱼眼"。' },
    ],
    build() {
      const half = R / 2;
      return [
        { step: 0, kind: 'circle', cx: 0, cy: 0, r: R },
        { step: 0, kind: 'dot', cx: 0, cy: 0 },
        { step: 1, kind: 'line', points: [{ x: 0, y: -R }, { x: 0, y: R }] },
        { step: 1, kind: 'dot', cx: 0, cy: R, color: MARK },
        { step: 1, kind: 'dot', cx: 0, cy: -R, color: MARK },
        { step: 2, kind: 'dot', cx: 0, cy: half, color: MARK },
        { step: 2, kind: 'dot', cx: 0, cy: -half, color: MARK },
        { step: 3, kind: 'arc', cx: 0, cy: half, r: half, start: -Math.PI / 2, sweep: Math.PI },
        { step: 3, kind: 'arc', cx: 0, cy: -half, r: half, start: Math.PI / 2, sweep: Math.PI },
        { step: 4, kind: 'fillDisk', cx: 0, cy: 0, r: R, tone: 0 },
        { step: 4, kind: 'fillDisk', cx: 0, cy: 0, r: R, start: -Math.PI / 2, sweep: Math.PI, tone: 1 },
        { step: 4, kind: 'fillDisk', cx: 0, cy: half, r: half, tone: 0 },
        { step: 4, kind: 'fillDisk', cx: 0, cy: -half, r: half, tone: 1 },
        { step: 4, kind: 'fillDisk', cx: 0, cy: half, r: R / 6, tone: 1 },
        { step: 4, kind: 'fillDisk', cx: 0, cy: -half, r: R / 6, tone: 0 },
        { step: 4, kind: 'circle', cx: 0, cy: half, r: R / 6 },
        { step: 4, kind: 'circle', cx: 0, cy: -half, r: R / 6 },
      ];
    },
  },
];

function durationOf(element) {
  if (element.kind === 'dot') return DOT_DURATION;
  if (element.tone !== undefined) return FILL_DURATION;
  return STROKE_DURATION;
}

function extentOf(elements) {
  let max = 0;
  for (const element of elements) {
    if (element.kind === 'dot') {
      max = Math.max(max, Math.hypot(element.cx ?? 0, element.cy ?? 0));
    } else if (Array.isArray(element.points)) {
      for (const p of element.points) max = Math.max(max, Math.hypot(p.x, p.y));
    } else {
      max = Math.max(max, Math.hypot(element.cx ?? 0, element.cy ?? 0) + Math.abs(element.r ?? 0));
    }
  }
  return max || 1;
}

function createDrawable(element, options) {
  const { tones, fillOrder, strokeOrder } = options;
  const tone = element.tone === undefined ? null : tones[Math.min(element.tone, tones.length - 1)];

  switch (element.kind) {
    case 'circle':
      return strokeArc({
        cx: element.cx,
        cy: element.cy,
        r: element.r,
        color: INK,
        order: strokeOrder,
      });
    case 'arc':
      return strokeArc({
        cx: element.cx,
        cy: element.cy,
        r: element.r,
        start: element.start,
        sweep: element.sweep,
        color: INK,
        order: strokeOrder,
      });
    case 'line':
      return strokePolyline(element.points, {
        closed: element.closed,
        color: INK,
        order: strokeOrder,
      });
    case 'dot':
      return dot({ cx: element.cx, cy: element.cy, r: 0.07, color: element.color ?? INK, order: 900 });
    case 'fillDisk':
      return fillDisk({
        cx: element.cx,
        cy: element.cy,
        r: element.r,
        start: element.start,
        sweep: element.sweep,
        color: tone,
        order: fillOrder,
      });
    case 'fillPolygon':
      return fillPolygon({ vertices: element.points, color: tone, order: fillOrder });
    default:
      throw new Error(`未知的作图元素: ${element.kind}`);
  }
}

export default async function mount({ stage: stageEl, panel }) {
  const stage = createStage(stageEl, { height: 9 });
  if (import.meta.env.DEV) window.__mathStage = stage;

  const diagram = new THREE.Group();
  stage.scene.add(diagram);

  const penDot = new THREE.Mesh(
    new THREE.CircleGeometry(0.09, 24),
    new THREE.MeshBasicMaterial({ color: INK }),
  );
  penDot.renderOrder = 1000;
  penDot.frustumCulled = false;
  penDot.visible = false;
  diagram.add(penDot);

  let pattern = PATTERNS[0];
  let paletteIndex = 0;
  let drawables = [];
  let schedule = [];
  let step = 0;
  let elapsed = 0;
  let playing = false;
  let colored = false;
  let colorAmount = 0;
  let extent = 1;
  let fit = 1;
  let lastUiKey = '';

  // ---------- 面板 ----------
  panel.innerHTML = `
    <div class="panel-title">
      <h2>尺规作图</h2>
      <span class="badge">六上 · 圆</span>
    </div>

    <div class="control">
      <div class="control-head"><span>选一个图案</span></div>
      <div class="chip-row" data-patterns></div>
    </div>

    <div class="control">
      <div class="control-head">
        <span>作图步骤</span>
        <span data-progress>0 / 4</span>
      </div>
      <ol class="step-list" data-steps></ol>
      <div class="chip-row" style="margin-top:var(--sp-3)">
        <button class="btn btn-ghost" type="button" data-act="prev">上一步</button>
        <button class="btn" type="button" data-act="play">开始作图</button>
        <button class="btn btn-ghost" type="button" data-act="next">下一步</button>
      </div>
    </div>

    <div class="control">
      <div class="control-head"><span>涂色与颜色</span></div>
      <div class="chip-row">
        <button class="btn btn-ghost" type="button" data-act="color" aria-pressed="false">开始涂色</button>
        <span class="swatches" data-swatches></span>
        <button class="btn btn-ghost" type="button" data-act="reset">重置</button>
      </div>
    </div>

    <p class="lesson-note" data-note></p>
  `;

  const patternRow = panel.querySelector('[data-patterns]');
  const stepList = panel.querySelector('[data-steps]');
  const progressOut = panel.querySelector('[data-progress]');
  const swatchRow = panel.querySelector('[data-swatches]');
  const noteEl = panel.querySelector('[data-note]');
  const playBtn = panel.querySelector('[data-act="play"]');
  const colorBtn = panel.querySelector('[data-act="color"]');

  patternRow.innerHTML = PATTERNS.map(
    (p) => `<button class="btn btn-ghost" type="button" data-pattern="${p.id}">${p.title}</button>`,
  ).join('');

  stepList.innerHTML = pattern.steps
    .map(
      (s, i) =>
        `<li><button type="button" data-step="${i}"><span class="num">${i + 1}</span><span>${s.title}</span></button></li>`,
    )
    .join('');

  function renderSwatches() {
    swatchRow.innerHTML = PALETTES.map(
      (palette, i) =>
        `<button class="swatch${i === paletteIndex ? ' is-active' : ''}" type="button"
          data-palette="${i}" title="${palette.name}色"
          aria-label="${palette.name}色" aria-pressed="${i === paletteIndex}">
          ${palette.tones
            .slice(0, 2)
            .map((tone) => `<i style="background:${tone}"></i>`)
            .join('')}
        </button>`,
    ).join('');
  }

  stageEl.insertAdjacentHTML(
    'beforeend',
    '<div class="stage-hint">一步一步把图案画出来，最后再涂色</div>',
  );

  // ---------- 场景 ----------
  function disposeDrawables() {
    for (const item of drawables) {
      diagram.remove(item.drawable.object);
      item.drawable.object.traverse((object) => {
        object.geometry?.dispose?.();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        for (const material of materials) {
          if (!material) continue;
          material.map?.dispose?.();
          material.dispose?.();
        }
      });
    }
    drawables = [];
  }

  function buildScene({ reset }) {
    disposeDrawables();

    const tones = PALETTES[paletteIndex].tones;
    const elements = pattern.build();
    extent = extentOf(elements);

    let fillOrder = 100;
    let strokeOrder = 300;
    const cursor = new Map();
    schedule = [];

    for (const element of elements) {
      const drawable = createDrawable(element, { tones, fillOrder: fillOrder++, strokeOrder: strokeOrder++ });
      diagram.add(drawable.object);

      const start = cursor.get(element.step) ?? 0;
      const duration = durationOf(element);
      cursor.set(element.step, start + duration);

      drawables.push({ element, step: element.step, start, duration, drawable });
    }

    const stepCount = pattern.steps.length;
    for (let i = 0; i < stepCount; i += 1) {
      schedule.push((cursor.get(i) ?? 0) + STEP_PAUSE);
    }

    if (reset) {
      step = 0;
      elapsed = 0;
      playing = false;
      colored = false;
      colorAmount = 0;
    }
    applyFit();
    render();
  }

  function applyFit() {
    const half = Math.min(stage.view.width, stage.view.height) / 2 - 0.45;
    fit = Math.min(1, half / extent);
    diagram.scale.setScalar(fit);
    penDot.scale.setScalar(1 / Math.max(fit, 0.001));
  }

  // ---------- 动画 ----------
  function stepDuration(index) {
    return schedule[index] ?? 0;
  }

  function elementProgress(item) {
    if (item.step < step) return 1;
    if (item.step > step) return 0;
    return Math.min(1, Math.max(0, (elapsed - item.start) / item.duration));
  }

  function render() {
    penDot.visible = false;

    for (const item of drawables) {
      const base = elementProgress(item);
      const isFill = item.element.tone !== undefined;
      const progress = isFill ? base * colorAmount : base;
      item.drawable.setProgress(progress);

      if (!isFill && progress > 0.001 && progress < 0.999 && item.drawable.pen) {
        penDot.visible = true;
        penDot.position.set(item.drawable.pen.x, item.drawable.pen.y, 0.5);
      }
    }
  }

  function syncUi() {
    const key = [pattern.id, paletteIndex, step, playing, colored].join('|');
    if (key === lastUiKey) return;
    lastUiKey = key;

    progressOut.textContent = `${step} / ${pattern.steps.length}`;

    for (const button of patternRow.querySelectorAll('[data-pattern]')) {
      button.setAttribute('aria-pressed', String(button.dataset.pattern === pattern.id));
    }

    for (const button of stepList.querySelectorAll('[data-step]')) {
      const index = Number(button.dataset.step);
      const state =
        index < step ? 'done' : index === step && step < pattern.steps.length ? 'current' : 'todo';
      button.dataset.state = state;
    }

    playBtn.textContent = playing
      ? '暂停'
      : step >= pattern.steps.length
        ? '再看一遍'
        : step === 0
          ? '开始作图'
          : '继续作图';

    colorBtn.setAttribute('aria-pressed', String(colored));
    colorBtn.textContent = colored ? '取消涂色' : '开始涂色';

    const current = pattern.steps[Math.min(step, pattern.steps.length - 1)];
    noteEl.textContent =
      step >= pattern.steps.length ? pattern.note : `${current.title}：${current.detail}`;
  }

  stage.onTick((dt) => {
    if (playing) {
      elapsed += dt;
      if (elapsed >= stepDuration(step)) {
        if (step < pattern.steps.length - 1) {
          step += 1;
          elapsed = 0;
        } else {
          step = pattern.steps.length;
          elapsed = 0;
          playing = false;
        }
      }
    }

    const target = colored ? 1 : 0;
    if (Math.abs(colorAmount - target) > 0.001) {
      colorAmount += (target - colorAmount) * Math.min(1, dt * 7);
      if (Math.abs(colorAmount - target) <= 0.001) colorAmount = target;
    }

    render();
    syncUi();
  });

  stage.onResize(() => {
    applyFit();
    render();
  });

  // ---------- 交互 ----------
  patternRow.addEventListener('click', (event) => {
    const button = event.target.closest('[data-pattern]');
    if (!button) return;
    const next = PATTERNS.find((p) => p.id === button.dataset.pattern);
    if (!next || next.id === pattern.id) return;
    pattern = next;
    paletteIndex = 0;
    stepList.innerHTML = pattern.steps
      .map(
        (s, i) =>
          `<li><button type="button" data-step="${i}"><span class="num">${i + 1}</span><span>${s.title}</span></button></li>`,
      )
      .join('');
    renderSwatches();
    lastUiKey = '';
    buildScene({ reset: true });
    syncUi();
  });

  stepList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-step]');
    if (!button) return;
    playing = false;
    step = Math.min(pattern.steps.length, Number(button.dataset.step) + 1);
    elapsed = 0;
    render();
    syncUi();
  });

  swatchRow.addEventListener('click', (event) => {
    const button = event.target.closest('[data-palette]');
    if (!button) return;
    paletteIndex = Number(button.dataset.palette);
    const tones = PALETTES[paletteIndex].tones;
    for (const item of drawables) {
      if (item.element.tone === undefined) continue;
      const color = tones[Math.min(item.element.tone, tones.length - 1)];
      item.drawable.material.color.set(color);
    }
    renderSwatches();
    lastUiKey = '';
    syncUi();
  });

  panel.addEventListener('click', (event) => {
    const button = event.target.closest('[data-act]');
    if (!button) return;
    const action = button.dataset.act;

    if (action === 'play') {
      if (playing) {
        playing = false;
      } else {
        if (step >= pattern.steps.length) {
          step = 0;
          elapsed = 0;
        }
        playing = true;
      }
    }

    if (action === 'next') {
      playing = false;
      step = Math.min(pattern.steps.length, step + 1);
      elapsed = 0;
    }

    if (action === 'prev') {
      playing = false;
      step = Math.max(0, step - 1);
      elapsed = 0;
    }

    if (action === 'color') colored = !colored;

    if (action === 'reset') {
      step = 0;
      elapsed = 0;
      playing = false;
      colored = false;
    }

    render();
    syncUi();
  });

  renderSwatches();
  buildScene({ reset: true });
  syncUi();

  return () => {
    disposeDrawables();
    stage.dispose();
    panel.replaceChildren();
  };
}
