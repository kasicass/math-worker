/**
 * 六上 · 分数除法（讲解）。
 *
 * 两个要点：
 *   1. 除以一个数（0 除外）= 乘这个数的倒数；
 *   2. 分数除以整数，可以把每一份再平均分（图上看得见）。
 */
import * as THREE from 'three';
import { createStage } from '../core/three-stage.js';
import { fillPolygon, label, strokePolyline } from '../core/sketch.js';

const INK = '#1c2333';
const MUTED = '#5b6680';
const SOFT_A = '#8fb0ff';
const SOFT_B = '#ffc24d';
const RESULT = '#e2555b';

const DIVIDENDS = [
  { n: 1, d: 2 },
  { n: 2, d: 3 },
  { n: 3, d: 4 },
  { n: 4, d: 5 },
  { n: 5, d: 6 },
];

const DIVISORS = [
  { kind: 'int', n: 2, d: 1, text: '2' },
  { kind: 'int', n: 3, d: 1, text: '3' },
  { kind: 'int', n: 4, d: 1, text: '4' },
  { kind: 'frac', n: 1, d: 2, text: '1/2' },
  { kind: 'frac', n: 2, d: 3, text: '2/3' },
  { kind: 'frac', n: 3, d: 5, text: '3/5' },
];

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function simplify(n, d) {
  if (n === 0) return [0, 1];
  const g = gcd(n, d);
  return [n / g, d / g];
}

const WIDTH = 5.2;
const HEIGHT = 0.8;

export default async function mount({ stage: stageEl, panel }) {
  const stage = createStage(stageEl, { height: 9 });
  if (import.meta.env.DEV) window.__mathStage = stage;

  const diagram = new THREE.Group();
  stage.scene.add(diagram);

  let dividend = DIVIDENDS[2];
  let divisor = DIVISORS[0];
  let dynamic = [];
  let lastUiKey = '';

  panel.innerHTML = `
    <div class="panel-title">
      <h2>分数除法</h2>
      <span class="badge">六上 · 分数除法</span>
    </div>

    <div class="control">
      <div class="control-head"><span>被除数</span></div>
      <div class="chip-row" data-dividends></div>
    </div>

    <div class="control">
      <div class="control-head"><span>除数</span></div>
      <div class="chip-row" data-divisors></div>
    </div>

    <dl class="readouts" style="margin-top:var(--sp-4)">
      <div class="readout"><dt>原式</dt><dd data-out="expr">–</dd></div>
      <div class="readout"><dt>转化成乘法</dt><dd data-out="flip">–</dd></div>
      <div class="readout" style="grid-column:1 / -1"><dt>结果</dt><dd data-out="result">–</dd></div>
    </dl>

    <p class="lesson-note">
      除以一个数（0 除外），等于乘这个数的<b>倒数</b>：把除数的分子、分母交换位置，
      除号改成乘号。0 没有倒数，所以除数不能是 0。
    </p>
  `;

  const dividendRow = panel.querySelector('[data-dividends]');
  const divisorRow = panel.querySelector('[data-divisors]');
  const outs = {
    expr: panel.querySelector('[data-out="expr"]'),
    flip: panel.querySelector('[data-out="flip"]'),
    result: panel.querySelector('[data-out="result"]'),
  };

  dividendRow.innerHTML = DIVIDENDS.map(
    (f, i) => `<button class="btn btn-ghost" type="button" data-dividend="${i}">${f.n}/${f.d}</button>`,
  ).join('');
  divisorRow.innerHTML = DIVISORS.map(
    (f, i) => `<button class="btn btn-ghost" type="button" data-divisor="${i}">÷ ${f.text}</button>`,
  ).join('');

  stageEl.insertAdjacentHTML(
    'beforeend',
    '<div class="stage-hint">换一组数，看"变成乘倒数"的过程</div>',
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

  /** 一条被平均分成 d 份、前 n 份涂色的长条 */
  function bar(y, n, d, color, shadedColor) {
    const left = -WIDTH / 2;
    const unit = WIDTH / d;
    add(
      strokePolyline(
        [
          { x: left, y },
          { x: left + WIDTH, y },
          { x: left + WIDTH, y: y + HEIGHT },
          { x: left, y: y + HEIGHT },
        ],
        { closed: true, color: INK, order: 400 },
      ),
    );
    if (n > 0) {
      add(rect(left, y, left + n * unit, y + HEIGHT, shadedColor, 0.95, 120));
    }
    for (let i = 1; i < d; i += 1) {
      add(
        strokePolyline(
          [{ x: left + i * unit, y }, { x: left + i * unit, y: y + HEIGHT }],
          { color: '#ffffff', opacity: 0.9, order: 300 },
        ),
      );
    }
    return { left, unit };
  }

  function render() {
    disposeDynamic();

    // 被除数长条
    bar(1.4, dividend.n, dividend.d, SOFT_A, SOFT_A);
    add(label({ x: 0, y: 2.45, text: `被除数 ${dividend.n}/${dividend.d}`, color: MUTED, size: 0.36 }));

    if (divisor.kind === 'int') {
      // 除以整数：把整条再平均分成 k 组，取其中一组的长度
      const groups = divisor.n;
      const totalDivisions = dividend.d * groups;
      add(label({ x: 0, y: 0.85, text: `平均分成 ${groups} 份，取 1 份`, color: MUTED, size: 0.34 }));
      bar(-0.1, dividend.n, totalDivisions, SOFT_B, '#ffdca8');
      for (let g = 1; g < groups; g += 1) {
        const x = -WIDTH / 2 + (WIDTH * g) / groups;
        add(
          strokePolyline([{ x, y: -0.1 }, { x, y: -0.1 + HEIGHT }], {
            color: RESULT,
            order: 410,
          }),
        );
      }
      const resultWidth = WIDTH / groups;
      add(
        strokePolyline(
          [
            { x: -WIDTH / 2, y: -0.1 },
            { x: -WIDTH / 2, y: -0.1 + HEIGHT },
          ],
          { color: RESULT, order: 410 },
        ),
      );
      add(
        strokePolyline(
          [
            { x: -WIDTH / 2 + resultWidth, y: -0.1 },
            { x: -WIDTH / 2 + resultWidth, y: -0.1 + HEIGHT },
          ],
          { color: RESULT, order: 410 },
        ),
      );
      add(
        label({
          x: -WIDTH / 2 + resultWidth / 2,
          y: -0.75,
          text: `${dividend.n}/${dividend.d * groups}`,
          color: RESULT,
          size: 0.36,
        }),
      );
    } else {
      add(
        label({
          x: 0,
          y: 0.75,
          text: `${dividend.n}/${dividend.d} ÷ ${divisor.n}/${divisor.d} = ${dividend.n}/${dividend.d} × ${divisor.d}/${divisor.n}`,
          color: RESULT,
          size: 0.4,
        }),
      );
      add(
        label({
          x: 0,
          y: -0.1,
          text: `也就是：里面有几个 ${divisor.n}/${divisor.d}`,
          color: MUTED,
          size: 0.34,
        }),
      );
    }

    applyFit();
    syncUi();
  }

  function applyFit() {
    const half = Math.min(stage.view.width, stage.view.height) / 2 - 0.5;
    diagram.scale.setScalar(Math.min(1.1, half / 3.1));
  }

  function syncUi() {
    const key = `${dividend.n}/${dividend.d}|${divisor.text}`;
    if (key === lastUiKey) return;
    lastUiKey = key;

    for (const button of dividendRow.querySelectorAll('[data-dividend]')) {
      button.setAttribute('aria-pressed', String(DIVIDENDS[Number(button.dataset.dividend)] === dividend));
    }
    for (const button of divisorRow.querySelectorAll('[data-divisor]')) {
      button.setAttribute('aria-pressed', String(DIVISORS[Number(button.dataset.divisor)] === divisor));
    }

    const expr = `${dividend.n}/${dividend.d} ÷ ${divisor.text}`;
    const flip = `${dividend.n}/${dividend.d} × ${divisor.d}/${divisor.n}`;
    const [rn, rd] = simplify(dividend.n * divisor.d, dividend.d * divisor.n);

    outs.expr.textContent = expr;
    outs.flip.textContent = flip;
    outs.result.textContent = rd === 1 ? `${rn}` : `${rn}/${rd}`;
  }

  dividendRow.addEventListener('click', (event) => {
    const button = event.target.closest('[data-dividend]');
    if (!button) return;
    dividend = DIVIDENDS[Number(button.dataset.dividend)];
    render();
  });

  divisorRow.addEventListener('click', (event) => {
    const button = event.target.closest('[data-divisor]');
    if (!button) return;
    divisor = DIVISORS[Number(button.dataset.divisor)];
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
