/** 某一册教材的主题列表（按课本目录顺序）；单元下有多个主题时展开为子项。 */
import { findBook, sectionsOf, stateOf } from '../data/curriculum.js';
import { escapeHtml } from '../app/dom.js';
import { breadcrumb, stateBadge } from '../app/ui.js';

export default function gradeView(ctx) {
  const book = findBook(ctx.params.bookId);

  if (!book) {
    ctx.setTitle('教材未找到');
    ctx.root.innerHTML = `<section class="panel empty-state">
      <h2>没有这册教材</h2>
      <p><code>${escapeHtml(ctx.params.bookId)}</code> 不在课程数据里。</p>
      <p><a class="btn" href="#/">返回首页</a></p>
    </section>`;
    return;
  }

  ctx.setTitle(book.label);

  const rows = book.topics.length
    ? book.topics.map((topic, i) => rowOf(book, topic, i)).join('')
    : `<li><div class="topic-row">
         <span class="index">·</span>
         <span class="title">这册的主题还没有录入</span>
       </div></li>`;

  const totalSections = book.topics.reduce((sum, t) => sum + sectionsOf(t).length, 0);

  ctx.root.innerHTML = `
    ${breadcrumb([{ label: '全部教材', href: '#/' }, { label: book.label }])}
    <div class="page-head">
      <div>
        <h1>${escapeHtml(book.label)}</h1>
        <p class="lead">${escapeHtml(book.name)} · 按课本目录顺序排列，共 ${book.topics.length} 个单元${
          totalSections > book.topics.length ? `、${totalSections} 个互动主题` : ''
        }。</p>
      </div>
    </div>
    <ul class="topic-list">${rows}</ul>
  `;
}

function rowOf(book, topic, index) {
  const sections = sectionsOf(topic);
  const state = stateOf(topic);
  const head = `
    <span class="index">${index + 1}</span>
    <span class="title">${escapeHtml(topic.title)}</span>
    <span class="page">p.${topic.page}</span>`;

  // 只有一个主题（或还没录入）：整行就是一个入口
  if (sections.length <= 1) {
    const section = sections[0];
    const href =
      section && section.status === 'ready'
        ? `#/grade/${book.id}/topic/${topic.id}/section/${section.id}`
        : null;
    const inner = `${head}${stateBadge(section?.status ?? 'planned')}`;
    return href
      ? `<li><a class="topic-row" href="${href}">${inner}</a></li>`
      : `<li><div class="topic-row">${inner}</div></li>`;
  }

  // 多个主题的单元：单元行做标题，下面缩进列出各主题
  const count = sections.filter((s) => s.status === 'ready').length;
  const children = sections
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
        ? `<li><a class="topic-row topic-row-sub" href="${href}">${inner}</a></li>`
        : `<li><div class="topic-row topic-row-sub">${inner}</div></li>`;
    })
    .join('');

  return `<li class="topic-group">
    <a class="topic-row topic-row-group" href="#/grade/${book.id}/topic/${topic.id}">
      ${head}
      <span class="badge">${sections.length} 个主题${count ? ` · ${count} 个可互动` : ''}</span>
    </a>
    <ul class="topic-sublist">${children}</ul>
  </li>`;
}
