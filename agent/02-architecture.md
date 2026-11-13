# 代码结构与约定

> 对应 commit 之后的项目骨架。目标：`index.html` 一个入口 → 12 册教材 → 单元 → 互动主题 → 可交互课堂，
> 新增一节互动课只改 3 个文件。

## 1. 目录结构

```
math-worker/
├── index.html              唯一页面入口（header / #view 挂载点 / footer）
├── vite.config.js          Vite 配置：@ → src，base './'（可直接静态托管）
├── package.json            仅两个依赖：three（运行时）、vite（开发/构建）
├── doc/                    教材 PDF（.gitignore 已忽略，不入库）
├── agent/                  设计文档
└── src/
    ├── main.js             启动：import 样式 + 挂载路由
    ├── app/
    │   ├── router.js       hash 路由 + 视图生命周期（含 cleanup 回收）
    │   ├── dom.js          escapeHtml / render / el / num 等极小工具
    │   └── ui.js           共用片段：状态徽标、面包屑
    ├── core/
    │   ├── three-stage.js  three.js 二维正交舞台（相机、resize、渲染循环、dispose）
    │   ├── sketch.js       作图原子：圆/弧/折线/实心区域/标注，带逐笔生长动画
    │   └── exercise-player.js  分步讲解类练习页的通用引擎 + 图形元素工厂
    ├── data/
    │   └── curriculum.js   课程数据（12 册 → 单元 → 互动主题），单一数据源
    ├── views/
    │   ├── home.js         首页：12 个入口
    │   ├── grade.js        某册：单元列表（多主题的单元展开为缩进子项）
    │   ├── topic.js        单元页：列出该单元下的互动主题
    │   └── section.js      互动页：舞台 + 控制面板，或"设计中"占位
    ├── lessons/            交互脚本（按需动态 import，three.js 只在这里加载）
    │   ├── index.js        注册表 + loadLesson()
    │   ├── fraction-multiply.js  六上·分数乘法（面积模型讲解）
    │   ├── exercise-1.js   六上·分数乘法 / 练习一（7 题）
    │   ├── exercise-2.js   六上·分数乘法 / 练习二（7 题）
    │   ├── exercise-3.js   六上·分数乘法 / 练习三（7 题）
    │   ├── direction.js    六上·位置与方向（二）（方位角 + 距离模型）
    │   ├── exercise-5.js   六上·位置与方向 / 练习五（5 题）
    │   ├── fraction-divide.js  六上·分数除法（除以一个数 = 乘倒数）
    │   ├── exercise-6.js   六上·分数除法 / 练习六（倒数，5 题）
    │   ├── exercise-7.js   六上·分数除法 / 练习七（7 题）
    │   ├── solve-by-fraction.js  六上·分数除法 / 解决问题（单位“1”线段图）
    │   ├── exercise-8.js   六上·分数除法 / 练习八（11 题）
    │   ├── ratio.js        六上·比（前项/后项/比值/化简比）
    │   ├── exercise-11.js  六上·比 / 练习十一（10 题）
    │   ├── ratio-distribution.js  六上·比 / 按比分配（归一法 + 分数法）
    │   ├── exercise-12.js  六上·比 / 练习十二（11 题）
    │   ├── percent.js      六上·百分数（一）（100 格模型 + 三种写法互化）
    │   ├── exercise-18.js  六上·百分数 / 练习十八（15 题）
    │   ├── percent-change.js  六上·百分数 / 多（少）百分之几
    │   ├── exercise-19.js  六上·百分数 / 练习十九（14 题）
    │   ├── pie-chart.js    六上·扇形统计图（饼图 + 人数换算）
    │   ├── exercise-21.js  六上·扇形统计图 / 练习二十一（5 题）
    │   ├── number-shape.js 六上·数学广角 / 数与形（平方数 + 逼近 1）
    │   ├── exercise-22.js  六上·数学广角 / 练习二十二（5 题）
    │   ├── exercise-23.js  六上·总复习 / 练习二十三（17 题）
    │   ├── circle.js       六上·圆 / 半径、直径与周长
    │   ├── compass-construction.js   六上·圆 / 尺规作图
    │   ├── exercise-13.js  六上·圆 / 练习十三（10 题，只写题目数据）
    │   ├── exercise-14.js  六上·圆 / 练习十四（12 题，只写题目数据）
    │   ├── circle-area.js  六上·圆 / 圆的面积（扇形割补动画）
    │   ├── exercise-15.js  六上·圆 / 练习十五（18 题，只写题目数据）
    │   ├── sector.js       六上·圆 / 扇形（圆心角与弧长探索）
    │   ├── exercise-16.js  六上·圆 / 练习十六（4 题）
    │   └── exercise-17.js  六上·圆 / 练习十七（9 题，单元复习）
    └── styles/
        ├── base.css        变量、重置、排版
        ├── layout.css      页面骨架、栅格、workpace 双栏
        └── widgets.css     卡片/面板/按钮/徽标/舞台/控件/读数/步骤表/色板
```

选择"无 UI 框架"的原因：页面结构只有 4 个视图，重活都在 canvas 里；
用原生 ESM + 模板字符串可以把注意力留在数学建模上，后续要换 React 也不影响
`core/`、`lessons/`、`data/` 这三块。

## 2. 命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 开发服务器（http://localhost:5173），HMR |
| `npm run build` | 产物输出到 `dist/`，可直接丢到任意静态服务器 |
| `npm run preview` | 本地预览构建产物 |

构建结果已经做了代码分割：`three.js`（约 490 kB）只在进入主题页时加载，
首页/目录页的 JS 都在 5 kB 以内。

## 3. 路由

hash 路由，无服务端配置也能跑，部署后刷新不会 404。

| hash | 视图 |
| --- | --- |
| `#/` | `views/home.js` |
| `#/grade/:bookId` | `views/grade.js` |
| `#/grade/:bookId/topic/:topicId` | `views/topic.js` |
| `#/grade/:bookId/topic/:topicId/section/:sectionId` | `views/section.js` |

视图模块约定：

```js
export default async function view(ctx) {
  // ctx = { params, root, navigate, setTitle, abort }
  ctx.root.innerHTML = '...';
  return () => { /* 可选：离开前清理 three.js / 监听器 */ };
}
```

`router.js` 在切换路由时会先调用上一次返回的 cleanup，再清空 `#view`；
异步视图在渲染期间被切走时，会立刻回收它刚创建的资源（`ctx.abort()` 也是同一判断）。

## 4. 数据模型（src/data/curriculum.js）

```js
book    = { id: 'g6a', grade: 6, term: 'upper', label: '六上', name: '6 年级上册', topics: [...] }
topic   = { id: 'circle', title: '圆', page: 55, verified: false, sections: [...] }
section = { id: 'compass-construction', title: '尺规作图', lesson: 'compass-construction', status: 'ready' }
```

一个单元可以拆成多节互动主题（如“圆” → 半径直径周长 / 尺规作图）。
只有一节时也允许退回旧写法：直接在 topic 上写 `lesson` + `status`。

- `section.status: 'ready'` 才能点进互动页，且必须带 `lesson` 键（对应 `lessons/index.js` 注册表）
- `section.status: 'planned'` 展示“设计中”占位页
- 单元的状态由 `stateOf(topic)` 推导：全 ready → `ready`，部分 → `partial`，没有 → `planned`
- `verified` 表示页码是否已对照教材 PDF 人工核对过（目前六上 9 个单元都是 `false`）

## 5. 交互脚本契约（src/lessons）

```js
// lessons/xxx.js
export default function mount({ stage, panel }) {
  // stage：左侧 .stage 容器（已含 padding，直接丢 canvas 进去）
  // panel：右侧控制面板容器
  return () => { /* dispose 舞台、解绑事件 */ };
}
```

注册：

```js
// lessons/index.js
const registry = { circle: () => import('./circle.js') };
```

### 新增一节互动课的三步

1. `data/curriculum.js`：在对应 topic 的 `sections` 里加一项，`status: 'ready'`, `lesson: 'xxx'`
2. 新建 `lessons/xxx.js`，默认导出 `mount({ stage, panel })`
3. `lessons/index.js`：注册 `xxx: () => import('./xxx.js')`

## 6. three.js 舞台（src/core/three-stage.js）

小学阶段的可视化基本都在平面里，所以默认用**正交相机 + 固定世界高度**：

```js
const stage = createStage(el, { height: 12 });  // 12 个世界单位高
stage.view        // { width, height }，width = height * 容器宽高比，随 resize 更新
stage.onResize(fn) // 尺寸变化回调，注册时立即调用一次
stage.onTick(fn)   // 每帧回调 (dt, elapsed)
stage.toWorld(x, y)// 指针坐标 → 世界坐标（拖拽手柄用）
stage.dispose()    // 取消 rAF、断开 ResizeObserver、释放 geometry/material/texture
```

好处：`1 世界单位 = 固定像素数`，写教学图形时直接按"半径 2 个单位"设计即可；
容器变窄时用 `fitScale` 整体等比缩放，不需要改每个物体的坐标。

`circle.js` 里还提取了 `circlePoints()` / `createLine()`（含虚线）两个几何小工具。

## 6.1 作图原子（src/core/sketch.js）

`尺规作图`类主题需要的“逐笔生长 + 涂色”，封装在四个函数里，用法都是
`const drawable = strokeArc({...})`，然后每帧 `drawable.setProgress(0..1)`：

| 函数 | 用途 | 返回值 |
| --- | --- | --- |
| `strokeArc({ cx, cy, r, start, sweep })` | 画圆 / 圆弧（绘制时附带一条圆心到笔尖的半径线） | `{ object, pen, setProgress }` |
| `strokePolyline(points, { closed })` | 直尺连线、正多边形 | `{ object, pen, setProgress }` |
| `fillDisk({ cx, cy, r, start, sweep, color })` | 涂色：圆盘 / 扇形 | `{ object, material, setProgress }` |
| `fillPolygon({ vertices, color })` | 涂色：多边形 | `{ object, material, setProgress }` |
| `dot({ cx, cy })` | 圆心、圆上截点标记 | `{ object, setProgress }` |
| `label({ x, y, text, size })` | 图上文字标注（canvas 贴图 Sprite） | `{ object, setProgress }` |

`strokePolyline` 支持 `dashed: true`，用来画对称轴等虚线。

实现要点：每条线预先按长度/弧度密集采样，用 `setDrawRange` 控制“画到哪”；
所有材质 `depthTest: false`，靠 `renderOrder` 分层（涂色 100+ < 铅笔线 300+ < 截点 900），
所以涂色不会盖住作图层线。`drawable.pen` 是当前笔尖坐标，用来画“铅笔头”。

## 6.2 两种互动主题

| 类型 | 例子 | 交互骨架 |
| --- | --- | --- |
| 互动模型 | `circle.js`、`circle-area.js`、`sector.js` | 拖动 / 滑块调参数，读数实时联动 |
| 分步演示 | `compass-construction.js`、`exercise-13.js` | 元素带 `step` 序号，点「下一步」时逐步显现，同时推进右侧讲解 |

`exercise-player.js` 在构建图形时会检查 `element.step` 是否超出讲解步数，
超出会 `console.warn`，避免"某段图形永远不显示"的低级错误。

分步类的公共做法：把整张图的每个原子元素都带上 `step`，渲染时
`target = element.step < 当前步 ? 1 : 0`，再对 `progress` 做缓动，
就同时得到了“图形跟着讲解长出来”和“回退时自动擦掉”两种效果。
分步讲解类的引擎在 `core/exercise-player.js`，`exercise-13.js` / `exercise-14.js`
只负责写题目数据（用引擎导出的 `circle / arc / line / point / text / disk / region`
这些工厂拼图形，颜色常量 `INK / AXIS / MUTED / SOFT_A / SOFT_B` 也由引擎导出）。
新增一册练习只需：

```js
import { createExerciseLesson, circle, text } from '../core/exercise-player.js';
const QUESTIONS = [ /* ... */ ];
export default createExerciseLesson({ title: '练习十五', questions: QUESTIONS });
```

题目数据结构如下：

```js
{
  id: 9,
  title: '长方形里的三个圆',
  prompt: '题干（可含 HTML 表格）',
  steps: [{ title: '长 = 3 个直径', detail: '直径 = 18 ÷ 3 = 6 cm' }],
  answer: '直径 6 cm，周长 48 cm',
  build() { return [circle(0, 0, 0, 0.72), text(0, 0, -1.1, '18 cm')]; },
}
```

## 7. 视觉与工程约定

- 颜色、间距、圆角全部走 `styles/base.css` 的 CSS 变量，不写死色值
- 中文字体栈固定 PingFang SC / 微软雅黑；数字读数用等宽字体 + `tabular-nums`，避免跳动
- 所有插入模板的动态文本必须过 `escapeHtml()`
- 交互必须有非拖拽的等价入口（如圆的半径既拖绿点也拖滑块），仅 canvas 的东西要配文字读数
- 一个主题一个文件，禁止在 `views/` 里写具体数学逻辑

## 7.1 提交约定

**每次完成一项改动后直接 `git commit`，不需要先征求确认。** 提交信息用 Conventional Commits
（`feat:` / `fix:` / `docs:` / `chore:`），正文用中文或英文均可，但要说清“改了什么、为什么”。

## 8. 待办（按优先级）

1. 核对六上 9 个单元的页码与目录标题（现在 `verified: false`）
2. 录入一至五年级 11 册的主题列表（先只录目录，交互后补）
3. 六上 9 个单元全部完成（11 个讲解页 + 13 套练习）；只剩两个综合实践活动
   （确定起跑线 p.78、节约用水 p.103）没做，以及 1–5 年级的教材内容（分数乘法面积模型、比、扇形统计图最能体现 three.js 的价值）
4. 继续按单元补“练习”类主题（练习十三、十四已落地，照抄数据文件即可）
5. 尺规作图可考虑增加：量角器工具、自定义半径、导出图形
6. 移动端触控细节（canvas `touch-action: none` 会吃掉页面滚动，需要分区处理）
