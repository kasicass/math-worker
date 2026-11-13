/**
 * 六上 · 分数除法：解决问题（讲解）。
 *
 * 已知“一个数的几分之几是多少”，求这个数：
 *   把这个数看作单位“1”，画线段图 → 部分量 ÷ 分率 = 单位“1”。
 * 也演示用方程解：x × 分率 = 部分量。
 */
import * as THREE from 'three';
import { createStage } from '../core/three-stage.js';
import { fillPolygon, label, strokePolyline } from '../core/sketch.js';

const INK = '#1c2333';
const MUTED = '#5b6680';
const SOFT_A = '#8fb0ff';
const PART = '#ffc24d';
const RESULT = '#e2555b';

const RATES = [
  { n: 2, d: 5 },
  { n: 3, d: 5 },
  { n: 5, d: 7 },
  { n: 4, d: 7 },
  { n: 5, d: 8 },
];

const PARTS = [30, 40, 50, 60, 80];

const WIDTH = 6;

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function simplify(n, d) {
  const g = gcd(n, d);
  return [n / g, d / g];
}

export default async function mount({ stage: stageEl, panel }) {
  const stage = createStage(stageEl, { height: 9 });
  if (import.meta.env.DEV) window.__mathStage = stage;

  const diagram = new THREE.Group();
  stage.scene.add(diagram);

  let rate = RATES[0];
  let part = PARTS[1];
  let dynamic = [];
  let lastUiKey = '';

  panel.innerHTML = `
    <div class="panel-title">
      <h2>解决问题</h2>
      <span class="badge">六上 · 分数除法</span>
    </div>

    <div class="control">
      <div class="control-head"><span>已知部分占整体的几分之几</span></div>
      <div class="chip-row" data-rates></div>
    </div>

    <div class="control">
      <div class="control-head"><span>已知这部分是多少</span></div>
      <div class="chip-row" data-parts></div>
    </div>

    <dl class="readouts" style="margin-top:var(--sp-4)">
      <div class="readout" style="grid-column:1 / -1"><dt>整体（单位“1”）</dt><dd data-out="whole">–</dd></div>
      <div class="readout" style="grid-column:1 / -1"><dt>除法解法</dt><dd data-out="divide">–</dd></div>
      <div class="readout" style="grid-column:1 / -1"><dt>方程解法</dt><dd data-out="equation">–</dd></div>
    </dl>

    <p class="lesson-note">
      把要求的量看作单位“1”，画出线段图：部分量 ÷ 它占整体的分率 = 整体。
      也可以设整体为 x，列方程 <b>x × 分率 = 部分量</b> 来解，
      两种方法算出来的结果一定一样。
    </p>
  `;

  const rateRow = panel.querySelector('[data-rates]');
  const partRow = panel.querySelector('[data-parts]');
  const outs = {
    whole: panel.querySelector('[data-out="whole"]'),
    divide: panel.querySelector('[data-out="divide"]'),
    equation: panel.querySelector('[data-out="equation"]'),
  };

  rateRow.innerHTML = RATES.map(
    (r, i) => `<button class="btn btn-ghost" type="button" data-rate="${i}">${r.n}/${r.d}</button>`,
  ).join('');
  partRow.innerHTML = PARTS.map(
    (value, i) => `<button class="btn btn-ghost" type="button" data-part="${i}">${value}</button>`,
  ).join('');

  stageEl.insertAdjacentHTML(
    'beforeend',
    '<div class="stage-hint">换一组数，看线段图和两种解法</div>',
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

  function add(drawable) {
    diagram.add(drawable.object);
    drawable.setProgress(1);
    dynamic.push(drawable);
  }

  function rect(x0, y0, x1, y1, color, opacity, order) {
    return fillPolygon({
      vertices: [
        { x: x0, y: y0 },
        { x: x1, y: y0 },
        { x: x1, y: y1 },
        { x: x0, y: y1 },
      ],
      color,
      opacity,
      order,
    });
  }

  function render() {
    disposeDynamic();

    const left = -WIDTH / 2;
    const unit = WIDTH / rate.d;
    const partWidth = unit * rate.n;
    const height = 0.9;
    const y = -0.2;

    // 整体的线段
    add(
      strokePolyline(
        [
          { x: left, y },
          { x: left + WIDTH, y },
          { x: left + WIDTH, y: y + height },
          { x: left, y: y + height },
        ],
        { closed: true, color: INK, order: 400 },
      ),
    );
    // 已知的部分
    add(rect(left, y, left + partWidth, y + height, PART, 0.95, 120));
    // 等分刻度
    for (let i = 1; i < rate.d; i += 1) {
      add(
        strokePolyline(
          [{ x: left + i * unit, y }, { x: left + i * unit, y: y + height }],
          { color: '#ffffff', opacity: 0.85, order: 300 },
        ),
      );
    }
    // 大括号示意：整体的问号
    add(
      label({
        x: 0,
        y: y - 0.55,
        text: '整体 = ? （看作单位“1”）',
        color: MUTED,
        size: 0.38,
      }),
    );
    add(
      label({
        x: left + partWidth / 2,
        y: y + height + 0.45,
        text: `这部分是 ${part}`,
        color: '#c98a00',
        size: 0.38,
      }),
    );
    add(
      label({
        x: left + partWidth / 2,
        y: y + height / 2,
        text: `${rate.n}/${rate.d}`,
        color: INK,
        size: 0.34,
      }),
    );

    applyFit();
    syncUi();
  }

  function applyFit() {
    const half = Math.min(stage.view.width, stage.view.height) / 2 - 0.6;
    diagram.scale.setScalar(Math.min(1.05, half / 3.6));
  }

  function syncUi() {
    const key = `${rate.n}/${rate.d}|${part}`;
    if (key === lastUiKey) return;
    lastUiKey = key;

    for (const button of rateRow.querySelectorAll('[data-rate]')) {
      button.setAttribute('aria-pressed', String(RATES[Number(button.dataset.rate)] === rate));
    }
    for (const button of partRow.querySelectorAll('[data-part]')) {
      button.setAttribute('aria-pressed', String(PARTS[Number(button.dataset.part)] === part));
    }

    const [wn, wd] = simplify(part * rate.d, rate.n);
    const wholeText = wd === 1 ? `${wn}` : `${wn}/${wd}`;
    const decimal = (part * rate.d) / rate.n;

    outs.whole.innerHTML = `${wholeText}${
      Number.isInteger(decimal) ? '' : `（≈ ${decimal.toFixed(2)}）`
    }`;
    outs.divide.textContent = `${part} ÷ ${rate.n}/${rate.d} = ${part} × ${rate.d}/${rate.n} = ${wholeText}`;
    outs.equation.textContent = `设整体为 x：x × ${rate.n}/${rate.d} = ${part}，解得 x = ${wholeText}`;
  }

  rateRow.addEventListener('click', (event) => {
    const button = event.target.closest('[data-rate]');
    if (!button) return;
    rate = RATES[Number(button.dataset.rate)];
    render();
  });

  partRow.addEventListener('click', (event) => {
    const button = event.target.closest('[data-part]');
    if (!button) return;
    part = PARTS[Number(button.dataset.part)];
    render();
  });

  stage.onResize(() => {
    applyFit();
  });

  render();

  return () => {
    disposeDynamic();
    stage.dispose();
    panel.replaceChildren();
  };
}
