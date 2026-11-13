/**
 * 六上 · 比：按比分配（讲解）。
 *
 * 把一个总量按 a : b 分配：
 *   归一法：先求总份数 a+b，每份 = 总量 ÷ (a+b)，再乘各自的份数；
 *   分数法：一部分 = 总量 × a/(a+b)。
 */
import * as THREE from 'three';
import { createStage } from '../core/three-stage.js';
import { fillPolygon, label, strokePolyline } from '../core/sketch.js';

const INK = '#1c2333';
const MUTED = '#5b6680';
const A_COLOR = '#8fb0ff';
const B_COLOR = '#ffc24d';

const RATIOS = [
  { a: 1, b: 4 },
  { a: 2, b: 3 },
  { a: 3, b: 5 },
  { a: 5, b: 7 },
  { a: 1, b: 9 },
];

const TOTALS = [100, 200, 300, 400, 600, 800];

export default async function mount({ stage: stageEl, panel }) {
  const stage = createStage(stageEl, { height: 9 });
  if (import.meta.env.DEV) window.__mathStage = stage;

  const diagram = new THREE.Group();
  stage.scene.add(diagram);

  let ratio = RATIOS[0];
  let total = 400;
  let dynamic = [];
  let lastUiKey = '';

  panel.innerHTML = `
    <div class="panel-title">
      <h2>按比分配</h2>
      <span class="badge">六上 · 比</span>
    </div>

    <div class="control">
      <div class="control-head"><span>按什么比分配</span></div>
      <div class="chip-row" data-ratios></div>
    </div>

    <div class="control">
      <div class="control-head"><span>总量</span></div>
      <div class="chip-row" data-totals></div>
    </div>

    <dl class="readouts" style="margin-top:var(--sp-4)">
      <div class="readout"><dt>总份数</dt><dd data-out="parts">–</dd></div>
      <div class="readout"><dt>每份</dt><dd data-out="each">–</dd></div>
      <div class="readout"><dt>前一部分</dt><dd data-out="first">–</dd></div>
      <div class="readout"><dt>后一部分</dt><dd data-out="second">–</dd></div>
    </dl>

    <p class="lesson-note" data-note></p>
  `;

  const ratioRow = panel.querySelector('[data-ratios]');
  const totalRow = panel.querySelector('[data-totals]');
  const outs = {
    parts: panel.querySelector('[data-out="parts"]'),
    each: panel.querySelector('[data-out="each"]'),
    first: panel.querySelector('[data-out="first"]'),
    second: panel.querySelector('[data-out="second"]'),
    note: panel.querySelector('[data-note]'),
  };

  ratioRow.innerHTML = RATIOS.map(
    (r, i) => `<button class="btn btn-ghost" type="button" data-ratio="${i}">${r.a} : ${r.b}</button>`,
  ).join('');
  totalRow.innerHTML = TOTALS.map(
    (value) => `<button class="btn btn-ghost btn-num" type="button" data-total="${value}">${value}</button>`,
  ).join('');

  stageEl.insertAdjacentHTML(
    'beforeend',
    '<div class="stage-hint">换一组数，看总量怎么被"按份"分开</div>',
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

  function render() {
    disposeDynamic();

    const parts = ratio.a + ratio.b;
    const unit = 6.4 / parts;
    const height = 1.0;
    const left = -3.2;
    const y = -0.5;

    // 总量长条
    add(
      strokePolyline(
        [
          { x: left, y },
          { x: left + 6.4, y },
          { x: left + 6.4, y: y + height },
          { x: left, y: y + height },
        ],
        { closed: true, color: INK, order: 400 },
      ),
    );

    // 前一部分
    add(
      fillPolygon({
        vertices: [
          { x: left, y },
          { x: left + ratio.a * unit, y },
          { x: left + ratio.a * unit, y: y + height },
          { x: left, y: y + height },
        ],
        color: A_COLOR,
        opacity: 0.95,
        order: 120,
      }),
    );
    // 后一部分
    add(
      fillPolygon({
        vertices: [
          { x: left + ratio.a * unit, y },
          { x: left + 6.4, y },
          { x: left + 6.4, y: y + height },
          { x: left + ratio.a * unit, y: y + height },
        ],
        color: B_COLOR,
        opacity: 0.95,
        order: 130,
      }),
    );

    // 每一份的分割线
    for (let i = 1; i < parts; i += 1) {
      add(
        strokePolyline(
          [{ x: left + i * unit, y }, { x: left + i * unit, y: y + height }],
          { color: '#ffffff', opacity: 0.9, order: 300 },
        ),
      );
    }

    add(
      label({
        x: left + (ratio.a * unit) / 2,
        y: y + height / 2,
        text: `${ratio.a} 份`,
        color: INK,
        size: 0.34,
      }),
    );
    add(
      label({
        x: left + ratio.a * unit + (ratio.b * unit) / 2,
        y: y + height / 2,
        text: `${ratio.b} 份`,
        color: INK,
        size: 0.34,
      }),
    );
    add(
      label({
        x: 0,
        y: y + height + 0.5,
        text: `总量 ${total}，按 ${ratio.a} : ${ratio.b} 分配`,
        color: MUTED,
        size: 0.38,
      }),
    );
    add(
      label({
        x: 0,
        y: y - 1.0,
        text: `前一部分 = ${total} × ${ratio.a}/${parts}，后一部分 = ${total} × ${ratio.b}/${parts}`,
        color: '#12a375',
        size: 0.36,
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
    const key = `${ratio.a}:${ratio.b}|${total}`;
    if (key === lastUiKey) return;
    lastUiKey = key;

    for (const button of ratioRow.querySelectorAll('[data-ratio]')) {
      button.setAttribute('aria-pressed', String(RATIOS[Number(button.dataset.ratio)] === ratio));
    }
    for (const button of totalRow.querySelectorAll('[data-total]')) {
      button.setAttribute('aria-pressed', String(Number(button.dataset.total) === total));
    }

    const parts = ratio.a + ratio.b;
    const each = total / parts;
    outs.parts.textContent = `${parts} 份`;
    outs.each.textContent = `${Number(each.toFixed(2))}`;
    outs.first.textContent = `${Number((each * ratio.a).toFixed(2))}`;
    outs.second.textContent = `${Number((each * ratio.b).toFixed(2))}`;
    outs.note.innerHTML = `归一法：${total} ÷ ${parts} = ${Number(each.toFixed(2))}（每份），再分别乘 ${ratio.a} 和 ${ratio.b}；<br>分数法：前一部分 = ${total} × ${ratio.a}/${parts}，后一部分 = ${total} × ${ratio.b}/${parts}。`;
  }

  ratioRow.addEventListener('click', (event) => {
    const button = event.target.closest('[data-ratio]');
    if (!button) return;
    ratio = RATIOS[Number(button.dataset.ratio)];
    render();
  });

  totalRow.addEventListener('click', (event) => {
    const button = event.target.closest('[data-total]');
    if (!button) return;
    total = Number(button.dataset.total);
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
