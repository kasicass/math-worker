/**
 * 六上 · 数学广角——数与形（讲解）。
 *
 * 两种"图形帮我们看懂数"的典型：
 *   ① 1+3+5+…+(2n−1) = n²：第 n 个"L 形"正好是 2n−1 个小正方形；
 *   ② 1/2 + 1/4 + 1/8 + … 越加越接近 1：每次把剩下的部分再对半分。
 */
import * as THREE from 'three';
import { createStage } from '../core/three-stage.js';
import { fillPolygon, label, strokePolyline } from '../core/sketch.js';

const INK = '#1c2333';
const MUTED = '#5b6680';
const RING = '#ffc24d';
const INNER = '#8fb0ff';
const RESULT = '#e2555b';

const MODES = [
  { id: 'square', text: '平方数与 L 形' },
  { id: 'fraction', text: '逼近 1 的分数' },
];

export default async function mount({ stage: stageEl, panel }) {
  const stage = createStage(stageEl, { height: 9 });
  if (import.meta.env.DEV) window.__mathStage = stage;

  const diagram = new THREE.Group();
  stage.scene.add(diagram);

  let mode = 'square';
  let n = 4;
  let terms = 4;
  let dynamic = [];
  let lastUiKey = '';

  panel.innerHTML = `
    <div class="panel-title">
      <h2>数与形</h2>
      <span class="badge">六上 · 数学广角</span>
    </div>

    <div class="control">
      <div class="control-head"><span>看哪一种</span></div>
      <div class="chip-row" data-modes></div>
    </div>

    <div class="control" data-square-control>
      <label class="control-head" for="n-range">
        <span>第几个图形（n）</span>
        <output id="n-out">4</output>
      </label>
      <input id="n-range" type="range" min="1" max="8" step="1" value="4" />
    </div>

    <div class="control" data-fraction-control hidden>
      <label class="control-head" for="terms-range">
        <span>加到第几项</span>
        <output id="terms-out">4</output>
      </label>
      <input id="terms-range" type="range" min="1" max="8" step="1" value="4" />
    </div>

    <dl class="readouts" style="margin-top:var(--sp-4)">
      <div class="readout" style="grid-column:1 / -1"><dt>算式</dt><dd data-out="expr">–</dd></div>
      <div class="readout" style="grid-column:1 / -1"><dt>结果</dt><dd data-out="result">–</dd></div>
    </dl>

    <p class="lesson-note" data-note></p>
  `;

  const modeRow = panel.querySelector('[data-modes]');
  const squareControl = panel.querySelector('[data-square-control]');
  const fractionControl = panel.querySelector('[data-fraction-control]');
  const nRange = panel.querySelector('#n-range');
  const nOut = panel.querySelector('#n-out');
  const termsRange = panel.querySelector('#terms-range');
  const termsOut = panel.querySelector('#terms-out');
  const outs = {
    expr: panel.querySelector('[data-out="expr"]'),
    result: panel.querySelector('[data-out="result"]'),
    note: panel.querySelector('[data-note]'),
  };

  modeRow.innerHTML = MODES.map(
    (m) => `<button class="btn btn-ghost" type="button" data-mode="${m.id}">${m.text}</button>`,
  ).join('');

  stageEl.insertAdjacentHTML(
    'beforeend',
    '<div class="stage-hint">图形里藏着数的规律</div>',
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

  function renderSquare() {
    const side = 5;
    const cell = side / n;
    const left = -side / 2;
    const bottom = -side / 2;

    // 里层 (n−1)² 用蓝色（左下角那块）
    if (n > 1) {
      const inner = (n - 1) * cell;
      add(rect(left, bottom, left + inner, bottom + inner, INNER, 0.85, 110));
    }
    // 最外一圈：第 n 个 L 形 = 顶行 + 右列，共 n + (n−1) = 2n−1 个
    add(rect(left, bottom + (n - 1) * cell, left + side, bottom + side, RING, 0.95, 120));
    add(
      rect(
        left + (n - 1) * cell,
        bottom,
        left + side,
        bottom + (n - 1) * cell,
        RING,
        0.95,
        121,
      ),
    );

    // 网格
    for (let i = 1; i < n; i += 1) {
      add(strokePolyline([{ x: left + i * cell, y: bottom }, { x: left + i * cell, y: bottom + side }], { color: '#ffffff', opacity: 0.9, order: 300 }));
      add(strokePolyline([{ x: left, y: bottom + i * cell }, { x: left + side, y: bottom + i * cell }], { color: '#ffffff', opacity: 0.9, order: 300 }));
    }
    add(
      strokePolyline(
        [
          { x: left, y: bottom },
          { x: left + side, y: bottom },
          { x: left + side, y: bottom + side },
          { x: left, y: bottom + side },
        ],
        { closed: true, color: INK, order: 410 },
      ),
    );

    add(
      label({
        x: 0,
        y: bottom - 0.55,
        text: `最外一圈有 2×${n} − 1 = ${2 * n - 1} 个小正方形`,
        color: RING,
        size: 0.36,
      }),
    );
    add(
      label({
        x: 0,
        y: bottom - 1.15,
        text: `1 + 3 + … + ${2 * n - 1} = ${n}² = ${n * n}`,
        color: RESULT,
        size: 0.4,
      }),
    );
  }

  function renderFraction() {
    const width = 6;
    const height = 0.9;
    const left = -width / 2;
    const y = 0.4;

    // 整条表示 1
    add(
      strokePolyline(
        [
          { x: left, y },
          { x: left + width, y },
          { x: left + width, y: y + height },
          { x: left, y: y + height },
        ],
        { closed: true, color: INK, order: 400 },
      ),
    );

    let cursor = 0;
    for (let i = 1; i <= terms; i += 1) {
      const part = 1 / 2 ** i;
      add(
        rect(
          left + cursor * width,
          y,
          left + (cursor + part) * width,
          y + height,
          i % 2 ? RING : INNER,
          0.95,
          110 + i,
        ),
      );
      cursor += part;
    }

    // 剩下的空白
    add(rect(left + cursor * width, y, left + width, y + height, '#f2f4f9', 0.7, 105));
    add(
      strokePolyline(
        [
          { x: left + cursor * width, y },
          { x: left + cursor * width, y: y + height },
        ],
        { color: RESULT, order: 410 },
      ),
    );

    const sum = 1 - 1 / 2 ** terms;
    add(
      label({
        x: 0,
        y: y - 0.75,
        text: `加了 ${terms} 项：和 = 1 − 1/${2 ** terms} = ${sum.toFixed(4)}`,
        color: RESULT,
        size: 0.38,
      }),
    );
    add(
      label({
        x: 0,
        y: y - 1.35,
        text: '项数越多，和越接近 1（但永远差一小块）',
        color: MUTED,
        size: 0.34,
      }),
    );
  }

  function render() {
    disposeDynamic();
    if (mode === 'square') renderSquare();
    else renderFraction();
    applyFit();
    syncUi();
  }

  function applyFit() {
    const half = Math.min(stage.view.width, stage.view.height) / 2 - 0.8;
    diagram.scale.setScalar(Math.min(1.05, half / 3.6));
  }

  function syncUi() {
    const key = `${mode}|${n}|${terms}`;
    if (key === lastUiKey) return;
    lastUiKey = key;

    for (const button of modeRow.querySelectorAll('[data-mode]')) {
      button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
    }
    squareControl.hidden = mode !== 'square';
    fractionControl.hidden = mode === 'square';

    nOut.textContent = String(n);
    termsOut.textContent = String(terms);

    if (mode === 'square') {
      const odds = Array.from({ length: n }, (_, i) => 2 * i + 1);
      outs.expr.textContent = `1 + 3 + 5 + … + ${2 * n - 1}`;
      outs.result.textContent = `${odds.join(' + ')} = ${n}² = ${n * n}`;
      outs.note.innerHTML = `第 n 个图形是一个 ${n}×${n} 的正方形，最外一圈正好有 <b>2n − 1</b> 个小正方形。
        所以奇数连加的和就是平方数：<b>1+3+5+…+(2n−1) = n²</b>。`;
    } else {
      const sum = 1 - 1 / 2 ** terms;
      outs.expr.textContent = '1/2 + 1/4 + 1/8 + 1/16 + …';
      outs.result.textContent = `前 ${terms} 项和 ≈ ${sum.toFixed(4)}`;
      outs.note.innerHTML = `从第二个数开始，每个数都是前一个数的 1/2，所以每次只补上"剩下部分的一半"，
        和会越来越接近 1，但永远到不了 1 —— 这就是<b>无限逼近</b>。`;
    }
  }

  modeRow.addEventListener('click', (event) => {
    const button = event.target.closest('[data-mode]');
    if (!button) return;
    mode = button.dataset.mode;
    render();
  });

  nRange.addEventListener('input', () => {
    n = Number(nRange.value);
    render();
  });

  termsRange.addEventListener('input', () => {
    terms = Number(termsRange.value);
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
