/** 极小的 DOM / 字符串工具集，避免为初期项目引入 UI 框架。 */

/** 转义插入 HTML 模板中的动态文本 */
export function escapeHtml(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch],
  );
}

/** 用 HTML 字符串渲染到容器 */
export function render(container, html) {
  container.innerHTML = html;
  return container;
}

/** 创建元素（少量动态节点用，避免 `innerHTML` 拼接） */
export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key.startsWith('on')) node.addEventListener(key.slice(2).toLowerCase(), value);
    else if (value !== undefined && value !== null) node.setAttribute(key, value);
  }
  for (const child of [].concat(children)) {
    if (child) node.append(child);
  }
  return node;
}

/** 数字格式化：最多保留 n 位小数，去掉多余的 0 */
export function num(value, digits = 2) {
  const fixed = Number(value).toFixed(digits);
  return fixed.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
}
