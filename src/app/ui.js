/** 各视图共用的小片段：状态徽标、面包屑。 */
import { escapeHtml } from './dom.js';

const BADGE = {
  ready: ['badge-ready', '可互动'],
  partial: ['badge-partial', '部分可互动'],
  planned: ['badge-planned', '设计中'],
};

export function stateBadge(state) {
  const [cls, label] = BADGE[state] ?? BADGE.planned;
  return `<span class="badge ${cls}">${label}</span>`;
}

/** items: [{ label, href }]，最后一项不带链接 */
export function breadcrumb(items) {
  const parts = items.map((item, i) =>
    i === items.length - 1 || !item.href
      ? `<span>${escapeHtml(item.label)}</span>`
      : `<a href="${item.href}">${escapeHtml(item.label)}</a><span class="sep">/</span>`,
  );
  return `<nav class="breadcrumb">${parts.join('')}</nav>`;
}
