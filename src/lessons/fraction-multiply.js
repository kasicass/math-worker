/**
 * 六上 · 分数乘法（讲解）。
 *
 * 用一张"单位正方形"解释分数乘分数：
 *   横向涂出第一个因数，纵向涂出第二个因数，两次都涂到的小格子就是积，
 *   所以分子乘分子、分母乘分母。
 */
import * as THREE from 'three';
import { createStage } from '../core/three-stage.js';
import { fillPolygon, label, strokePolyline } from '../core/sketch.js';

const INK = '#1c2333';
const MUTED = '#5b6680';
const A_COLOR = '#8fb0ff';
const B_COLOR = '#ffc24d';
const OVERLAP = '#e2555b';
const SIDE = 4;
const HALF = SIDE / 2;

const OPTIONS = [
  { n: 1, d: 2 },
  { n: 1, d: 3 },
  { n: 2, d: 3 },
  { n: 3, d: 4 },
  { n: 3, d: 5 },
  { n: 5, d: 6 },
];

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

  let first = OPTIONS[0];
  let second = OPTIONS[2];
  let dynamic = [];
  let lastUiKey = '';

  panel.innerHTML = `
    <div class="panel-title">
      <h2>分数乘法</h2>
      <span class="badge">六上 · 分数乘法</span>
    </div>

    <div class="control">
      <div class="control-head"><span>第一个因数（横着涂）</span></div>
      <div class="chip-row" data-first></div>
    </div>

    <div class="control">
      <div class="control-head"><span>第二个因数（竖着涂）</span></div>
      <div class="chip-row" data-second></div>
    </div>

    <dl class="readouts" style="margin-top:var(--sp-4)">
      <div class="readout"><dt>算式</dt><dd data-out="expr">–</dd></div>
      <div class="readout"><dt>结果</dt><dd data-out="result">–</dd></div>
      <div class="readout" style="grid-column:1 / -1">
        <dt>整块被分成多少小格 / 取了多少格</dt><dd data-out="grid">–</dd>
      </div>
    </dl>

    <p class="lesson-note">
      把一张纸看作 1，先横着涂出第一个因数，再竖着涂出第二个因数；
      两次都涂到的那部分就是它们的积。所以
      <b>分数乘分数，用分子相乘的积作分子，用分母相乘的积作分母</b>，
      能约分的先约分。
    </p>
  `;

  const firstRow = panel.querySelector('[data-first]');
  const secondRow = panel.querySelector('[data-second]');
  const outs = {
    expr: panel.querySelector('[data-out="expr"]'),
    result: panel.querySelector('[data-out="result"]'),
    grid: panel.querySelector('[data-out="grid"]'),
  };

  const fractionText = (f) => `${f.n}/${f.d}`;
  const chip = (f, i, kind) =>
    `<button class="btn btn-ghost" type="button" data-${kind}="${i}">${fractionText(f)}</button>`;

  firstRow.innerHTML = OPTIONS.map((f, i) => chip(f, i, 'first')).join('');
  secondRow.innerHTML = OPTIONS.map((f, i) => chip(f, i, 'second')).join('');

  stageEl.insertAdjacentHTML(
    'beforeend',
    '<div class="stage-hint">换一组分数，看看重叠的格子怎么变</div>',
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

    const left = -HALF;
    const bottom = -HALF;
    const width = SIDE / first.d;
    const height = SIDE / second.d;

    // 单位正方形
    add(
      strokePolyline(
        [
          { x: left, y: bottom },
          { x: left + SIDE, y: bottom },
          { x: left + SIDE, y: bottom + SIDE },
          { x: left, y: bottom + SIDE },
        ],
        { closed: true, color: INK, order: 400 },
      ),
    );

    // 第一个因数：左侧 n/d 的竖条
    add(rect(left, bottom, left + first.n * width, bottom + SIDE, A_COLOR, 0.6, 100));

    // 第二个因数：底部 n/d 的横条
    add(rect(left, bottom, left + SIDE, bottom + second.n * height, B_COLOR, 0.55, 110));

    // 重叠部分：再叠一层深色，一眼看出"两次都涂到"
    add(
      rect(
        left,
        bottom,
        left + first.n * width,
        bottom + second.n * height,
        '#2f62f0',
        0.35,
        120,
      ),
    );
    add(
      strokePolyline(
        [
          { x: left, y: bottom },
          { x: left + first.n * width, y: bottom },
          { x: left + first.n * width, y: bottom + second.n * height },
          { x: left, y: bottom + second.n * height },
        ],
        { closed: true, color: OVERLAP, order: 420 },
      ),
    );

    // 小格网格
    for (let i = 1; i < first.d; i += 1) {
      const x = left + i * width;
      add(
        strokePolyline(
          [{ x, y: bottom }, { x, y: bottom + SIDE }],
          { color: '#ffffff', opacity: 0.85, order: 300 },
        ),
      );
    }
    for (let j = 1; j < second.d; j += 1) {
      const y = bottom + j * height;
      add(
        strokePolyline(
          [{ x: left, y }, { x: left + SIDE, y }],
          { color: '#ffffff', opacity: 0.85, order: 300 },
        ),
      );
    }

    // 标注：横向取 a 份、纵向取 c 份
    add(
      label({
        x: left + (first.n * width) / 2,
        y: bottom - 0.55,
        text: `${first.n}/${first.d}`,
        color: A_COLOR,
        size: 0.42,
      }),
    );
    add(
      label({
        x: left - 0.6,
        y: bottom + (second.n * height) / 2,
        text: `${second.n}/${second.d}`,
        color: '#c98a00',
        size: 0.42,
      }),
    );
    add(
      label({
        x: 0,
        y: bottom - 1.15,
        text: `${first.d} × ${second.d} = ${first.d * second.d} 小格，涂了 ${first.n * second.n} 格`,
        color: MUTED,
        size: 0.38,
      }),
    );

    applyFit();
    syncUi();
  }

  function applyFit() {
    const half = Math.min(stage.view.width, stage.view.height) / 2 - 1.4;
    diagram.scale.setScalar(Math.min(1.25, half / HALF));
  }

  function syncUi() {
    const key = `${first.n}/${first.d}|${second.n}/${second.d}`;
    if (key === lastUiKey) return;
    lastUiKey = key;

    for (const button of firstRow.querySelectorAll('[data-first]')) {
      button.setAttribute('aria-pressed', String(Number(button.dataset.first) === OPTIONS.indexOf(first)));
    }
    for (const button of secondRow.querySelectorAll('[data-second]')) {
      button.setAttribute('aria-pressed', String(Number(button.dataset.second) === OPTIONS.indexOf(second)));
    }

    const num = first.n * second.n;
    const den = first.d * second.d;
    const [sn, sd] = simplify(num, den);

    outs.expr.innerHTML = `${first.n}/${first.d} × ${second.n}/${second.d}`;
    outs.result.innerHTML = sd === 1 ? `${sn}` : `${sn}/${sd}`;
    outs.grid.textContent = `${first.d * second.d} 格中取了 ${num} 格 = ${sn}/${sd}`;
  }

  firstRow.addEventListener('click', (event) => {
    const button = event.target.closest('[data-first]');
    if (!button) return;
    first = OPTIONS[Number(button.dataset.first)];
    render();
  });

  secondRow.addEventListener('click', (event) => {
    const button = event.target.closest('[data-second]');
    if (!button) return;
    second = OPTIONS[Number(button.dataset.second)];
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
