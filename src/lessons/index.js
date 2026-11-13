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
  'fraction-multiply': () => import('./fraction-multiply.js'),
  'exercise-1': () => import('./exercise-1.js'),
  'exercise-2': () => import('./exercise-2.js'),
  'exercise-3': () => import('./exercise-3.js'),
  direction: () => import('./direction.js'),
  'exercise-5': () => import('./exercise-5.js'),
  'fraction-divide': () => import('./fraction-divide.js'),
  'exercise-6': () => import('./exercise-6.js'),
  'exercise-7': () => import('./exercise-7.js'),
  'solve-by-fraction': () => import('./solve-by-fraction.js'),
  'exercise-8': () => import('./exercise-8.js'),
  ratio: () => import('./ratio.js'),
  'exercise-11': () => import('./exercise-11.js'),
  'ratio-distribution': () => import('./ratio-distribution.js'),
  'exercise-12': () => import('./exercise-12.js'),
  percent: () => import('./percent.js'),
  'exercise-18': () => import('./exercise-18.js'),
  'percent-change': () => import('./percent-change.js'),
  'exercise-19': () => import('./exercise-19.js'),
  'pie-chart': () => import('./pie-chart.js'),
  'exercise-21': () => import('./exercise-21.js'),
  'number-shape': () => import('./number-shape.js'),
  'exercise-22': () => import('./exercise-22.js'),
  'exercise-23': () => import('./exercise-23.js'),
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
