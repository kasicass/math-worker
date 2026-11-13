/**
 * 互动主题页：左侧 three.js 舞台 + 右侧控制面板。
 *
 * 交互脚本契约见 src/lessons/index.js；主题数据见 src/data/curriculum.js。
 */
import { findSection } from '../data/curriculum.js';
import { escapeHtml } from '../app/dom.js';
import { breadcrumb, stateBadge } from '../app/ui.js';
import { loadLesson } from '../lessons/index.js';

export default async function sectionView(ctx) {
  const { book, topic, section } = findSection(
    ctx.params.bookId,
    ctx.params.topicId,
    ctx.params.sectionId,
  );

  if (!book || !topic || !section) {
    ctx.setTitle('主题未找到');
    ctx.root.innerHTML = `<section class="panel empty-state">
      <h2>没有这个主题</h2>
      <p><code>${escapeHtml(ctx.params.sectionId)}</code> 不在课程数据里。</p>
      <p><a class="btn" href="#/">返回首页</a></p>
    </section>`;
    return;
  }

  ctx.setTitle(`${topic.title} · ${section.title}`);

  const crumbs = breadcrumb([
    { label: '全部教材', href: '#/' },
    { label: book.label, href: `#/grade/${book.id}` },
    { label: topic.title, href: `#/grade/${book.id}/topic/${topic.id}` },
    { label: section.title },
  ]);

  const head = `
    <div class="page-head">
      <div>
        <h1>${escapeHtml(section.title)}</h1>
        <p class="lead">${escapeHtml(topic.title)} · 课本 p.${topic.page} · ${escapeHtml(book.label)}</p>
      </div>
      ${stateBadge(section.status)}
    </div>`;

  if (section.status !== 'ready' || !section.lesson) {
    ctx.root.innerHTML = `
      ${crumbs}
      ${head}
      <section class="panel">
        <div class="panel-title"><h2>这一节的互动脚本还在设计中</h2></div>
        <p>补齐一节互动课需要三样东西：</p>
        <ol class="hint-list">
          <li>在 <code>src/data/curriculum.js</code> 里把该 section 的 <code>status</code> 改成
            <code>ready</code>，并填上 <code>lesson</code> 键名。</li>
          <li>在 <code>src/lessons/</code> 下新建脚本，导出 <code>mount({ stage, panel })</code>。</li>
          <li>在 <code>src/lessons/index.js</code> 的注册表里加上对应的懒加载入口。</li>
        </ol>
      </section>`;
    return;
  }

  ctx.root.innerHTML = `
    ${crumbs}
    ${head}
    <div class="workspace">
      <div class="panel stage" data-stage></div>
      <aside class="panel" data-panel></aside>
    </div>`;

  const stage = ctx.root.querySelector('[data-stage]');
  const panel = ctx.root.querySelector('[data-panel]');

  try {
    const mount = await loadLesson(section.lesson);
    if (ctx.abort()) return;
    const cleanup = await mount({ stage, panel });
    return typeof cleanup === 'function' ? cleanup : undefined;
  } catch (error) {
    console.error('[section] lesson mount failed', error);
    stage.innerHTML = `<div class="empty-state" style="padding:var(--sp-6)">
      <h2>互动脚本加载失败</h2>
      <p>${escapeHtml(error?.message ?? error)}</p>
    </div>`;
  }
}
