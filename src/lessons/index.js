/**
 * 交互脚本注册表。
 *
 * 每个 lesson 模块约定：
 *   export default function mount({ stage, panel }) => cleanup | Promise<cleanup>
 *   - stage：左侧 three.js 舞台容器（.stage）
 *   - panel：右侧控制面板容器
 *   - 返回值：清理函数，负责 dispose 舞台、解绑事件
 *
 * 用动态 import，保证只有进入主题页时才加载 three.js。
 */
const registry = {
  circle: () => import('./circle.js'),
  'compass-construction': () => import('./compass-construction.js'),
  'exercise-13': () => import('./exercise-13.js'),
  'exercise-14': () => import('./exercise-14.js'),
  'circle-area': () => import('./circle-area.js'),
  'exercise-15': () => import('./exercise-15.js'),
  sector: () => import('./sector.js'),
  'exercise-16': () => import('./exercise-16.js'),
  'exercise-17': () => import('./exercise-17.js'),
};

export function hasLesson(key) {
  return Object.hasOwn(registry, key);
}

export async function loadLesson(key) {
  const load = registry[key];
  if (!load) throw new Error(`未注册的交互脚本: ${key}`);
  const mod = await load();
  if (typeof mod.default !== 'function') {
    throw new Error(`交互脚本 ${key} 没有导出默认的 mount 函数`);
  }
  return mod.default;
}
