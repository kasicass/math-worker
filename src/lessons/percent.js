/**
 * 六上 · 百分数（一）（讲解）。
 *
 * 百分数表示一个数是另一个数的百分之几 —— 相当于把整体看成 100 份。
 * 用一个 100 格的正方形表示，拖动滑块就能看到"百分之几"到底是多少格，
 * 同时给出它与分数、小数的互化。
 */
import * as THREE from 'three';
import { createStage } from '../core/three-stage.js';
import { fillPolygon, label, strokePolyline } from '../core/sketch.js';

const INK = '#1c2333';
const MUTED = '#5b6680';
const FILL = '#8fb0ff';
const SIDE = 5;

const PRESETS = [14, 25, 40, 62.5, 87.5, 100];

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

/** 百分数 → 最简分数（分母含 2 和 5 的因子时能化成有限小数） */
function toFraction(value) {
  const scale = Number.isInteger(value) ? 100 : 1000;
  const n = Math.round(value * (scale / 100));
  const g = gcd(n, scale);
  return `${n / g}/${scale / g}`;
}

export default async function mount({ stage: stageEl, panel }) {
  const stage = createStage(stageEl, { height: 9 });
  if (import.meta.env.DEV) window.__mathStage = stage;

  const diagram = new THREE.Group();
  stage.scene.add(diagram);

  let value = 40;
  let dynamic = [];
  let lastUiKey = '';

  panel.innerHTML = `
    <div class="panel-title">
      <h2>百分数的意义</h2>
      <span class="badge">六上 · 百分数（一）</span>
    </div>

    <div class="control">
      <label class="control-head" for="percent">
        <span>百分之几</span>
        <output id="percent-out">40%</output>
      </label>
      <input id="percent" type="range" min="0" max="100" step="0.5" value="40" />
      <div class="chip-row" style="margin-top:var(--sp-2)" data-presets></div>
    </div>

    <dl class="readouts" style="margin-top:var(--sp-4)">
      <div class="readout"><dt>百分数</dt><dd data-out="pct">–</dd></div>
      <div class="readout"><dt>化成分数</dt><dd data-out="frac">–</dd></div>
      <div class="readout" style="grid-column:1 / -1"><dt>化成小数</dt><dd data-out="decimal">–</dd></div>
    </dl>

    <p class="lesson-note">
      百分数表示一个数是另一个数的<b>百分之几</b>，相当于把整体平均分成 100 份。
      它只表示两个数的关系，<b>后面不带单位</b>；分数既可以表示关系，也可以表示具体的量。
    </p>
  `;

  const slider = panel.querySelector('#percent');
  const sliderOut = panel.querySelector('#percent-out');
  const presetRow = panel.querySelector('[data-presets]');
  const outs = {
    pct: panel.querySelector('[data-out="pct"]'),
    frac: panel.querySelector('[data-out="frac"]'),
    decimal: panel.querySelector('[data-out="decimal"]'),
  };

  presetRow.innerHTML = PRESETS.map(
    (p) => `<button class="btn btn-ghost" type="button" data-preset="${p}">${p}%</button>`,
  ).join('');

  stageEl.insertAdjacentHTML(
    'beforeend',
    '<div class="stage-hint">拖滑块看"百分之几"占多少个格子</div>',
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

    const cell = SIDE / 10;
    const left = -SIDE / 2;
    const bottom = -SIDE / 2;

    // 已涂的整行
    const rows = Math.floor(value / 10);
    if (rows > 0) {
      add(rect(left, bottom + SIDE - rows * cell, left + SIDE, bottom + SIDE, FILL, 0.95, 110));
    }
    // 剩下的一行里的若干格
    const rest = Math.round(value) - rows * 10;
    if (rest > 0) {
      const yTop = bottom + SIDE - rows * cell;
      add(rect(left, yTop - cell, left + rest * cell, yTop, FILL, 0.95, 111));
    }

    // 100 格网格
    for (let i = 0; i <= 10; i += 1) {
      const x = left + i * cell;
      add(
        strokePolyline(
          [{ x, y: bottom }, { x, y: bottom + SIDE }],
          { color: '#c7d0e4', opacity: 0.9, order: 300 },
        ),
      );
      const y = bottom + i * cell;
      add(
        strokePolyline(
          [{ x: left, y }, { x: left + SIDE, y }],
          { color: '#c7d0e4', opacity: 0.9, order: 300 },
        ),
      );
    }
    add(
      strokePolyline(
        [
          { x: left, y: bottom },
          { x: left + SIDE, y: bottom },
          { x: left + SIDE, y: bottom + SIDE },
          { x: left, y: bottom + SIDE },
        ],
        { closed: true, color: INK, order: 410 },
      ),
    );

    add(
      label({
        x: 0,
        y: bottom - 0.6,
        text: `100 格里涂 ${Math.round(value)} 格，相当于 ${value}%`,
        color: MUTED,
        size: 0.4,
      }),
    );

    applyFit();
    syncUi();
  }

  function applyFit() {
    const half = Math.min(stage.view.width, stage.view.height) / 2 - 0.9;
    diagram.scale.setScalar(Math.min(1.2, half / (SIDE / 2 + 0.4)));
  }

  function syncUi() {
    const key = String(value);
    if (key === lastUiKey) return;
    lastUiKey = key;

    const text = Number.isInteger(value) ? `${value}` : `${value}`;
    sliderOut.textContent = `${text}%`;
    outs.pct.textContent = `${text}%`;
    outs.frac.textContent = toFraction(value);
    outs.decimal.textContent = String(Number((value / 100).toFixed(4)));
  }

  slider.addEventListener('input', () => {
    value = Number(slider.value);
    render();
  });

  presetRow.addEventListener('click', (event) => {
    const button = event.target.closest('[data-preset]');
    if (!button) return;
    value = Number(button.dataset.preset);
    slider.value = String(value);
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
