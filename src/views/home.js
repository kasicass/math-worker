/** 首页：12 个入口（一上 → 六下），按课本顺序铺成 4 列网格。 */
import { books, countReadyLessons, readyCountOf, sectionsOf } from '../data/curriculum.js';
import { escapeHtml } from '../app/dom.js';

export default function homeView(ctx) {
  ctx.setTitle('');

  const cards = books
    .map((book) => {
      const sections = book.topics.reduce((n, t) => n + sectionsOf(t).length, 0);
      const ready = readyCountOf(book);
      const meta =
        sections > 0
          ? `${book.topics.length} 个单元${ready ? ` · ${ready} 个可互动` : ''}`
          : '主题待设计';
      return `<a class="book-card${sections > 0 ? '' : ' is-empty'}" href="#/grade/${book.id}">
        <span class="label">${escapeHtml(book.label)}</span>
        <span class="meta">${escapeHtml(meta)}</span>
      </a>`;
    })
    .join('');

  ctx.root.innerHTML = `
    <div class="page-head">
      <div>
        <h1>选一册课本开始</h1>
        <p class="lead">按人教版教材顺序排布 1–6 年级共 12 册。进入某一册后，会看到按目录拆分的单元，
        每个单元下是一节节可操作的互动课堂。</p>
      </div>
      <span class="badge badge-ready">${countReadyLessons()} 节互动课</span>
    </div>
    <div class="book-grid">${cards}</div>
  `;
}
