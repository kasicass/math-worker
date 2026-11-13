/**
 * 六上 · 百分数（一）：求一个数比另一个数多（少）百分之几（讲解）。
 *
 * 两种算法：
 *   ① 相差量 ÷ 单位“1” = 多（少）百分之几；
 *   ② 实际量 ÷ 单位“1” − 100%。
 */
import * as THREE from 'three';
import { createStage } from '../core/three-stage.js';
import { fillPolygon, label, strokePolyline } from '../core/sketch.js';

const INK = '#1c2333';
const MUTED = '#5b6680';
const BASE_COLOR = '#8fb0ff';
const NOW_COLOR = '#ffc24d';
const DIFF = '#e2555b';

const BASES = [10, 12, 20, 25, 40, 50];
const NEWS = [9, 14, 15, 25, 45, 60];

export default async function mount({ stage: stageEl, panel }) {
  const stage = createStage(stageEl, { height: 9 });
  if (import.meta.env.DEV) window.__mathStage = stage;

  const diagram = new THREE.Group();
  stage.scene.add(diagram);

  let base = 12;
  let now = 14;
  let dynamic = [];
  let lastUiKey = '';

  panel.innerHTML = `
    <div class="panel-title">
      <h2>多（少）百分之几</h2>
      <span class="badge">六上 · 百分数（一）</span>
    </div>

    <div class="control">
      <div class="control-head"><span>原计划 / 原来</span><span data-base-out>12</span></div>
      <div class="chip-row" data-bases></div>
    </div>

    <div class="control">
      <div class="control-head"><span>实际 / 现在</span><span data-now-out>14</span></div>
      <div class="chip-row" data-news></div>
    </div>

    <dl class="readouts" style="margin-top:var(--sp-4)">
      <div class="readout"><dt>相差多少</dt><dd data-out="diff">–</dd></div>
      <div class="readout"><dt>比原来多（少）</dt><dd data-out="percent">–</dd></div>
      <div class="readout" style="grid-column:1 / -1"><dt>两种算法</dt><dd data-out="formula">–</dd></div>
    </dl>

    <p class="lesson-note">
      求“比一个数多（少）百分之几”，先找到两数的<b>相差量</b>，
      再除以<b>单位“1”</b>（原来的数量）；也可以先算“现在是原来的百分之几”，
      再减去 100%。谁是“原来”，谁就是单位“1”。
    </p>
  `;

  const baseRow = panel.querySelector('[data-bases]');
  const nowRow = panel.querySelector('[data-news]');
  const baseOut = panel.querySelector('[data-base-out]');
  const nowOut = panel.querySelector('[data-now-out]');
  const outs = {
    diff: panel.querySelector('[data-out="diff"]'),
    percent: panel.querySelector('[data-out="percent"]'),
    formula: panel.querySelector('[data-out="formula"]'),
  };

  baseRow.innerHTML = BASES.map(
    (v) => `<button class="btn btn-ghost btn-num" type="button" data-base="${v}">${v}</button>`,
  ).join('');
  nowRow.innerHTML = NEWS.map(
    (v) => `<button class="btn btn-ghost btn-num" type="button" data-now="${v}">${v}</button>`,
  ).join('');

  stageEl.insertAdjacentHTML(
    'beforeend',
    '<div class="stage-hint">换一换两个数，看"多百分之几"怎么算</div>',
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

    const max = Math.max(base, now);
    const unit = 6.4 / max;
    const height = 0.7;
    const left = -3.2;

    // 原来的线段
    add(
      strokePolyline(
        [
          { x: left, y: 1.0 },
          { x: left + base * unit, y: 1.0 },
          { x: left + base * unit, y: 1.0 + height },
          { x: left, y: 1.0 + height },
        ],
        { closed: true, color: INK, order: 400 },
      ),
    );
    add(rect(left, 1.0, left + base * unit, 1.0 + height, BASE_COLOR, 0.9, 110));
    add(label({ x: left + (base * unit) / 2, y: 1.0 + height + 0.35, text: `原来 ${base}`, color: MUTED, size: 0.36 }));

    // 现在的线段
    add(
      strokePolyline(
        [
          { x: left, y: -0.4 },
          { x: left + now * unit, y: -0.4 },
          { x: left + now * unit, y: -0.4 + height },
          { x: left, y: -0.4 + height },
        ],
        { closed: true, color: INK, order: 400 },
      ),
    );
    add(rect(left, -0.4, left + now * unit, -0.4 + height, NOW_COLOR, 0.9, 110));
    add(label({ x: left + (now * unit) / 2, y: -0.4 - 0.45, text: `现在 ${now}`, color: MUTED, size: 0.36 }));

    // 相差部分用红色标出来
    const diff = now - base;
    if (diff !== 0) {
      const from = Math.min(base, now);
      const to = Math.max(base, now);
      add(rect(left + from * unit, -0.4, left + to * unit, -0.4 + height, DIFF, 0.75, 130));
      add(
        label({
          x: left + ((from + to) / 2) * unit,
          y: -0.4 + height + 0.32,
          text: `${diff > 0 ? '多' : '少'} ${Math.abs(diff)}`,
          color: DIFF,
          size: 0.36,
        }),
      );
    }

    add(
      label({
        x: 0,
        y: -1.9,
        text:
          diff === 0
            ? '两者一样多，多 0%'
            : `${Math.abs(diff)} ÷ ${base} ≈ ${(Math.abs(diff / base) * 100).toFixed(1)}%`,
        color: '#12a375',
        size: 0.4,
      }),
    );

    applyFit();
    syncUi();
  }

  function applyFit() {
    const half = Math.min(stage.view.width, stage.view.height) / 2 - 0.8;
    diagram.scale.setScalar(Math.min(1.1, half / 3.4));
  }

  function syncUi() {
    const key = `${base}|${now}`;
    if (key === lastUiKey) return;
    lastUiKey = key;

    baseOut.textContent = String(base);
    nowOut.textContent = String(now);

    for (const button of baseRow.querySelectorAll('[data-base]')) {
      button.setAttribute('aria-pressed', String(Number(button.dataset.base) === base));
    }
    for (const button of nowRow.querySelectorAll('[data-now]')) {
      button.setAttribute('aria-pressed', String(Number(button.dataset.now) === now));
    }

    const diff = now - base;
    const percent = (Math.abs(diff) / base) * 100;
    outs.diff.textContent = diff === 0 ? '0' : `${diff > 0 ? '+' : '−'}${Math.abs(diff)}`;
    outs.percent.textContent = `${diff >= 0 ? '多' : '少'} ${percent.toFixed(1)}%`;
    outs.formula.textContent =
      diff === 0
        ? '没有变化'
        : `① (${now} − ${base}) ÷ ${base} ≈ ${percent.toFixed(1)}%；② ${now} ÷ ${base} ≈ ${(
            (now / base) * 100
          ).toFixed(1)}% → 再与 100% 相减`;
  }

  baseRow.addEventListener('click', (event) => {
    const button = event.target.closest('[data-base]');
    if (!button) return;
    base = Number(button.dataset.base);
    render();
  });

  nowRow.addEventListener('click', (event) => {
    const button = event.target.closest('[data-now]');
    if (!button) return;
    now = Number(button.dataset.now);
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
