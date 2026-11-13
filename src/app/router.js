/**
 * 极简 hash 路由。
 *
 * 视图模块约定（src/views/*.js）：
 *   export default async function view(ctx) { ... return cleanup? }
 *   ctx = { params, root, navigate, setTitle }
 *   返回值（可选）会在离开该视图前调用，用于释放 three.js 资源 / 事件监听。
 *
 * 路由表：
 *   #/                                         首页，12 册教材入口
 *   #/grade/:bookId                            某册的单元列表
 *   #/grade/:bookId/topic/:topicId             某个单元下的互动主题列表
 *   #/grade/:bookId/topic/:topicId/section/:sectionId  具体一节互动课
 */
import { escapeHtml } from './dom.js';

const routes = [
  {
    match: (path) => path === '/' || path === '',
    load: () => import('../views/home.js'),
    params: () => ({}),
  },
  {
    match: (path) => /^\/grade\/([\w-]+)\/?$/.test(path),
    load: () => import('../views/grade.js'),
    params: (path) => ({ bookId: path.match(/^\/grade\/([\w-]+)/)[1] }),
  },
  {
    match: (path) => /^\/grade\/([\w-]+)\/topic\/([\w-]+)\/section\/([\w-]+)\/?$/.test(path),
    load: () => import('../views/section.js'),
    params: (path) => {
      const m = path.match(/^\/grade\/([\w-]+)\/topic\/([\w-]+)\/section\/([\w-]+)/);
      return { bookId: m[1], topicId: m[2], sectionId: m[3] };
    },
  },
  {
    match: (path) => /^\/grade\/([\w-]+)\/topic\/([\w-]+)\/?$/.test(path),
    load: () => import('../views/topic.js'),
    params: (path) => {
      const m = path.match(/^\/grade\/([\w-]+)\/topic\/([\w-]+)/);
      return { bookId: m[1], topicId: m[2] };
    },
  },
];

const APP_TITLE = 'Math Worker · 小学数学互动课堂';

let cleanup = null;
let renderToken = 0;
let mountRoot = null;

export function currentPath() {
  const raw = window.location.hash.replace(/^#/, '');
  return raw.split('?')[0] || '/';
}

export function navigate(path) {
  if (currentPath() === path) {
    // 已经在这个页面了，给一个可见的反馈：回到顶部
    scrollToTop(true);
    return;
  }
  window.location.hash = path;
}

export function setTitle(text) {
  document.title = text ? `${text} · Math Worker` : APP_TITLE;
}

function scrollToTop(smooth = false) {
  window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
}

/** 顶栏导航高亮：当前已在首页时，把"全部教材"标成当前页 */
function syncNav(path) {
  for (const link of document.querySelectorAll('[data-nav-link]')) {
    if (link.dataset.navLink === 'home' && path === '/') link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
}

/**
 * 点击指向当前页面的链接时，hash 不会变化，也就不会触发 hashchange。
 * 这种情况统一回到页面顶部，避免"点了没反应"。
 */
function handleSamePageClick(event) {
  const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
  if (!link) return;
  if (link.getAttribute('href') !== `#${currentPath()}`) return;
  event.preventDefault();
  scrollToTop(true);
}

function notFound(path) {
  return `<section class="panel empty-state">
    <h2>页面走丢了</h2>
    <p>没有找到 <code>${escapeHtml(path)}</code> 对应的内容。</p>
    <p><a class="btn" href="#/">返回首页</a></p>
  </section>`;
}

async function renderRoute() {
  const token = ++renderToken;
  const path = currentPath();
  const route = routes.find((r) => r.match(path));

  if (typeof cleanup === 'function') {
    try {
      cleanup();
    } catch (error) {
      console.error('[router] cleanup failed', error);
    }
  }
  cleanup = null;

  mountRoot.replaceChildren();
  syncNav(path);

  if (!route) {
    mountRoot.innerHTML = notFound(path);
    setTitle('页面未找到');
    return;
  }

  const params = route.params(path);
  const ctx = {
    params,
    root: mountRoot,
    navigate,
    setTitle,
    abort() {
      // 视图可主动声明"我不再需要渲染结果"（快速切换路由时）
      return token !== renderToken;
    },
  };

  try {
    const mod = await route.load();
    if (token !== renderToken) return;
    const result = await mod.default(ctx);
    if (token !== renderToken) {
      // 渲染期间已经切走了，回收刚创建的视图
      if (typeof result === 'function') result();
      return;
    }
    cleanup = typeof result === 'function' ? result : null;
  } catch (error) {
    console.error('[router] render failed', error);
    mountRoot.innerHTML = `<section class="panel empty-state">
      <h2>页面加载失败</h2>
      <p>${escapeHtml(error?.message ?? error)}</p>
      <p><a class="btn" href="#/">返回首页</a></p>
    </section>`;
    setTitle('加载失败');
  }

  scrollToTop();
}

export function startRouter(root) {
  mountRoot = root;
  document.addEventListener('click', handleSamePageClick);
  window.addEventListener('hashchange', renderRoute);
  if (!window.location.hash) window.location.replace('#/');
  renderRoute();
}
