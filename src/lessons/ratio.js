/**
 * 六上 · 比（讲解）。
 *
 * 两个量相除又叫两个数的比：前项 : 后项 = 比值；
 * 前项后项同时乘或除以相同的数（0 除外），比值不变 —— 由此化简比。
 */
import * as THREE from 'three';
import { createStage } from '../core/three-stage.js';
import { fillPolygon, label, strokePolyline } from '../core/sketch.js';

const INK = '#1c2333';
const MUTED = '#5b6680';
const A_COLOR = '#8fb0ff';
const B_COLOR = '#ffc24d';

const VALUES = [2, 3, 4, 5, 6, 8, 9, 10, 12, 14, 16];

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

export default async function mount({ stage: stageEl, panel }) {
  const stage = createStage(stageEl, { height: 9 });
  if (import.meta.env.DEV) window.__mathStage = stage;

  const diagram = new THREE.Group();
  stage.scene.add(diagram);

  let a = 14;
  let b = 8;
  let dynamic = [];
  let lastUiKey = '';

  panel.innerHTML = `
    <div class="panel-title">
      <h2>比</h2>
      <span class="badge">六上 · 比</span>
    </div>

    <div class="control">
      <div class="control-head"><span>前项（男生人数）</span><span data-a-out>14</span></div>
      <div class="chip-row" data-a></div>
    </div>

    <div class="control">
      <div class="control-head"><span>后项（女生人数）</span><span data-b-out>8</span></div>
      <div class="chip-row" data-b></div>
    </div>

    <dl class="readouts" style="margin-top:var(--sp-4)">
      <div class="readout"><dt>这个比</dt><dd data-out="ratio">–</dd></div>
      <div class="readout"><dt>比值</dt><dd data-out="value">–</dd></div>
      <div class="readout" style="grid-column:1 / -1"><dt>最简整数比</dt><dd data-out="simple">–</dd></div>
    </dl>

    <p class="lesson-note">
      两个数相除又叫两个数的<b>比</b>：前项 : 后项 = 比值（后项不能是 0）。
      前项和后项同时乘或除以相同的数（0 除外），比值不变，
      所以可以把比化成最简整数比。
    </p>
  `;

  const aRow = panel.querySelector('[data-a]');
  const bRow = panel.querySelector('[data-b]');
  const aOut = panel.querySelector('[data-a-out]');
  const bOut = panel.querySelector('[data-b-out]');
  const outs = {
    ratio: panel.querySelector('[data-out="ratio"]'),
    value: panel.querySelector('[data-out="value"]'),
    simple: panel.querySelector('[data-out="simple"]'),
  };

  aRow.innerHTML = VALUES.map(
    (v) => `<button class="btn btn-ghost btn-num" type="button" data-a="${v}">${v}</button>`,
  ).join('');
  bRow.innerHTML = VALUES.map(
    (v) => `<button class="btn btn-ghost btn-num" type="button" data-b="${v}">${v}</button>`,
  ).join('');

  stageEl.insertAdjacentHTML(
    'beforeend',
    '<div class="stage-hint">换一换两个数，看比和比值怎么变</div>',
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

    const max = Math.max(a, b);
    const unit = 5.6 / max; // 最长那条占 5.6 个世界单位
    const height = 0.7;
    const left = -2.8;

    const bars = [
      { value: a, y: 0.9, color: A_COLOR, text: `前项 ${a}` },
      { value: b, y: -0.5, color: B_COLOR, text: `后项 ${b}` },
    ];

    for (const bar of bars) {
      add(
        fillPolygon({
          vertices: [
            { x: left, y: bar.y },
            { x: left + bar.value * unit, y: bar.y },
            { x: left + bar.value * unit, y: bar.y + height },
            { x: left, y: bar.y + height },
          ],
          color: bar.color,
          opacity: 0.95,
          order: 120,
        }),
      );
      add(
        strokePolyline(
          [
            { x: left, y: bar.y },
            { x: left + bar.value * unit, y: bar.y },
            { x: left + bar.value * unit, y: bar.y + height },
            { x: left, y: bar.y + height },
          ],
          { closed: true, color: INK, order: 400 },
        ),
      );
      add(
        label({
          x: left + (bar.value * unit) / 2,
          y: bar.y + height / 2,
          text: bar.text,
          color: INK,
          size: 0.34,
        }),
      );
    }

    // 最简整数比的意思：把两条都按"一份"重新量
    const g = gcd(a, b);
    add(
      label({
        x: 0,
        y: -1.55,
        text: `同时除以 ${g}：${a} : ${b} = ${a / g} : ${b / g}`,
        color: '#12a375',
        size: 0.36,
      }),
    );
    add(
      label({
        x: 0,
        y: -2.15,
        text: `比值 = ${a} ÷ ${b} = ${(a / b).toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}`,
        color: MUTED,
        size: 0.34,
      }),
    );

    applyFit();
    syncUi();
  }

  function applyFit() {
    const half = Math.min(stage.view.width, stage.view.height) / 2 - 0.5;
    diagram.scale.setScalar(Math.min(1.1, half / 3.3));
  }

  function syncUi() {
    const key = `${a}:${b}`;
    if (key === lastUiKey) return;
    lastUiKey = key;

    aOut.textContent = String(a);
    bOut.textContent = String(b);

    for (const button of aRow.querySelectorAll('[data-a]')) {
      button.setAttribute('aria-pressed', String(Number(button.dataset.a) === a));
    }
    for (const button of bRow.querySelectorAll('[data-b]')) {
      button.setAttribute('aria-pressed', String(Number(button.dataset.b) === b));
    }

    const g = gcd(a, b);
    outs.ratio.textContent = `${a} : ${b}`;
    outs.value.textContent = (a / b).toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
    outs.simple.textContent = `${a / g} : ${b / g}`;
  }

  aRow.addEventListener('click', (event) => {
    const button = event.target.closest('[data-a]');
    if (!button) return;
    a = Number(button.dataset.a);
    render();
  });

  bRow.addEventListener('click', (event) => {
    const button = event.target.closest('[data-b]');
    if (!button) return;
    b = Number(button.dataset.b);
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
