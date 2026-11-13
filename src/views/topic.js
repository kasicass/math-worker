/**
 * 单元页：列出该单元下的互动主题。
 * 只有一个主题的单元会直接跳到那一节（保持旧链接可用）。
 */
import { findTopic, sectionsOf, stateOf } from '../data/curriculum.js';
import { escapeHtml } from '../app/dom.js';
import { breadcrumb, stateBadge } from '../app/ui.js';

export default function topicView(ctx) {
  const { book, topic } = findTopic(ctx.params.bookId, ctx.params.topicId);

  if (!book || !topic) {
    ctx.setTitle('主题未找到');
    ctx.root.innerHTML = `<section class="panel empty-state">
      <h2>没有这个单元</h2>
      <p><code>${escapeHtml(ctx.params.bookId)}/${escapeHtml(ctx.params.topicId)}</code> 不在课程数据里。</p>
      <p><a class="btn" href="#/">返回首页</a></p>
    </section>`;
    return;
  }

  const sections = sectionsOf(topic);

  // 只有一个可互动主题：直接进那一节
  if (sections.length === 1 && sections[0].status === 'ready') {
    window.location.replace(
      `#/grade/${book.id}/topic/${topic.id}/section/${sections[0].id}`,
    );
    return;
  }

  ctx.setTitle(`${book.label} · ${topic.title}`);

  const rows = sections.length
    ? sections
        .map((section) => {
          const href =
            section.status === 'ready'
              ? `#/grade/${book.id}/topic/${topic.id}/section/${section.id}`
              : null;
          const inner = `
            <span class="index">·</span>
            <span class="title">${escapeHtml(section.title)}</span>
            ${stateBadge(section.status)}`;
          return href
            ? `<li><a class="topic-row" href="${href}">${inner}</a></li>`
            : `<li><div class="topic-row">${inner}</div></li>`;
        })
        .join('')
    : `<li><div class="topic-row">
         <span class="index">·</span>
         <span class="title">这一单元的主题还在设计中</span>
       </div></li>`;

  ctx.root.innerHTML = `
    ${breadcrumb([
      { label: '全部教材', href: '#/' },
      { label: book.label, href: `#/grade/${book.id}` },
      { label: topic.title },
    ])}
    <div class="page-head">
      <div>
        <h1>${escapeHtml(topic.title)}</h1>
        <p class="lead">课本 p.${topic.page} · ${escapeHtml(book.label)} · 共 ${sections.length} 个主题</p>
      </div>
      ${stateBadge(stateOf(topic))}
    </div>
    <ul class="topic-list">${rows}</ul>
  `;
}
