/**
 * 六上 · 扇形统计图（讲解）。
 *
 * 扇形统计图表示各部分数量占总数的百分比：
 * 整个圆是 100%，每个扇形的圆心角 = 360° × 百分比。
 */
import * as THREE from 'three';
import { createStage } from '../core/three-stage.js';
import { fillDisk, label, strokeArc } from '../core/sketch.js';

const MUTED = '#5b6680';
const RADIUS = 2.4;

const DATA = [
  { name: '乒乓球', percent: 30, color: '#ffc24d' },
  { name: '足球', percent: 20, color: '#8fb0ff' },
  { name: '跳绳', percent: 12.5, color: '#9be0c4' },
  { name: '踢毽子', percent: 15, color: '#f7a3a8' },
  { name: '其他', percent: 22.5, color: '#c8b6f0' },
];

const TOTALS = [40, 80, 120, 200];

export default async function mount({ stage: stageEl, panel }) {
  const stage = createStage(stageEl, { height: 9 });
  if (import.meta.env.DEV) window.__mathStage = stage;

  const diagram = new THREE.Group();
  stage.scene.add(diagram);

  let total = 40;
  let dynamic = [];
  let lastUiKey = '';

  panel.innerHTML = `
    <div class="panel-title">
      <h2>扇形统计图</h2>
      <span class="badge">六上 · 扇形统计图</span>
    </div>

    <div class="control">
      <div class="control-head"><span>全班人数</span></div>
      <div class="chip-row" data-totals></div>
    </div>

    <dl class="readouts" style="margin-top:var(--sp-4)" data-list></dl>

    <p class="lesson-note">
      扇形统计图用整个圆表示总数（100%），每个扇形表示各部分占的百分比。
      圆心角 = 360° × 百分比；知道总人数后，各部分人数 = 总人数 × 百分比。
    </p>
  `;

  const totalRow = panel.querySelector('[data-totals]');
  const list = panel.querySelector('[data-list]');

  totalRow.innerHTML = TOTALS.map(
    (value) => `<button class="btn btn-ghost btn-num" type="button" data-total="${value}">${value} 人</button>`,
  ).join('');

  stageEl.insertAdjacentHTML(
    'beforeend',
    '<div class="stage-hint">扇形的大小就是百分比的大小</div>',
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

    let start = Math.PI / 2; // 从正上方开始，顺时针排

    for (const item of DATA) {
      const sweep = (item.percent / 100) * Math.PI * 2;
      add(
        fillDisk({
          cx: 0,
          cy: 0,
          r: RADIUS,
          start: start - sweep,
          sweep,
          color: item.color,
          opacity: 0.95,
          order: 110,
        }),
      );
      const mid = start - sweep / 2;
      add(
        label({
          x: Math.cos(mid) * RADIUS * 0.62,
          y: Math.sin(mid) * RADIUS * 0.62,
          text: `${item.percent}%`,
          color: '#1c2333',
          size: 0.34,
        }),
      );
      start -= sweep;
    }

    // 外圈描边
    add(
      strokeArc({
        cx: 0,
        cy: 0,
        r: RADIUS,
        start: 0,
        sweep: Math.PI * 2,
        color: '#5b6680',
        order: 400,
        showRadius: false,
      }),
    );

    add(
      label({
        x: 0,
        y: -RADIUS - 0.75,
        text: `六（1）班最喜欢的运动项目（全班 ${total} 人）`,
        color: MUTED,
        size: 0.38,
      }),
    );

    applyFit();
    syncUi();
  }

  function applyFit() {
    const half = Math.min(stage.view.width, stage.view.height) / 2 - 1.0;
    diagram.scale.setScalar(Math.min(1.1, half / (RADIUS + 0.6)));
  }

  function syncUi() {
    const key = String(total);
    if (key === lastUiKey) return;
    lastUiKey = key;

    for (const button of totalRow.querySelectorAll('[data-total]')) {
      button.setAttribute('aria-pressed', String(Number(button.dataset.total) === total));
    }

    list.innerHTML = DATA.map((item) => {
      const count = (total * item.percent) / 100;
      return `<div class="readout" style="background:${item.color}22">
        <dt>${item.name}（${item.percent}%）</dt>
        <dd>${Number(count.toFixed(2))}<span class="unit">人</span></dd>
      </div>`;
    }).join('');
  }

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
