/**
 * 六上 · 圆：练习十三（课本 PDF 第 63、64 页 / 印刷页 58、59 的 10 道题）。
 *
 * 引擎见 core/exercise-player.js，这里只写题目数据。
 */
import {
  AXIS,
  MUTED,
  SOFT_A,
  SOFT_B,
  arc,
  axisThrough,
  circle,
  createExerciseLesson,
  disk,
  line,
  point,
  region,
  text,
} from '../core/exercise-player.js';

const QUESTIONS = [
  {
    id: 1,
    title: '用圆规画圆',
    prompt: `按下面的要求，用圆规画圆。<span class="sub">（1）r = 3 cm　（2）d = 5 cm　（3）r = 3.5 cm</span>`,
    steps: [
      {
        title: '圆规张口就是半径',
        detail: '把圆规两脚分开，两脚间的距离等于半径；针尖扎在圆心 O，带铅笔的一脚转一圈。所以第（1）题直接把两脚张开 3 cm。',
      },
      {
        title: '先求半径，再画圆',
        detail: '第（2）题给的是直径 5 cm：半径 = 5 ÷ 2 = 2.5 cm，圆规张开 2.5 cm 再画。',
      },
      {
        title: '照同样的方法画第（3）题',
        detail: 'r = 3.5 cm，两脚张开 3.5 cm。画完别忘了标出圆心 O 和半径 r。',
      },
    ],
    answer: '三个圆的半径分别是 3 cm、2.5 cm（直径 5 cm）、3.5 cm。',
    build() {
      const cm = 0.42;
      const items = [];
      const list = [
        { x: -3.2, r: 3, label: 'r = 3 cm' },
        { x: 0, r: 2.5, label: 'r = 2.5 cm' },
        { x: 3.4, r: 3.5, label: 'r = 3.5 cm' },
      ];
      list.forEach((item, i) => {
        const r = item.r * cm;
        items.push(circle(i, item.x, 0, r));
        items.push(point(i, item.x, 0));
        items.push(text(i, item.x, -(r + 0.45), item.label));
      });
      return items;
    },
  },

  {
    id: 2,
    title: '看图填空',
    prompt: `看图填空。四幅图分别求：<span class="sub">（1）半径 3 cm 的圆，直径是多少？　（2）直径 6 cm 的圆，半径是多少？</span><span class="sub">（3）正方形里最大的圆，直径是多少？　（4）梯形里的半圆，半径是多少？</span>`,
    steps: [
      {
        title: '（1）同圆里 d = 2r',
        detail: '半径 3 cm，直径 = 3 × 2 = <b>6 cm</b>。',
      },
      {
        title: '（2）反过来 r = d ÷ 2',
        detail: '直径 6 cm，半径 = 6 ÷ 2 = <b>3 cm</b>。',
      },
      {
        title: '（3）正方形里最大的圆',
        detail: '这个圆与正方形的四条边都相切，所以直径正好等于边长：<b>d = 10 cm</b>（半径 5 cm）。',
      },
      {
        title: '（4）梯形里的半圆',
        detail: '半圆的直径落在梯形的上底上，最低点与下底相切，所以半径正好等于梯形的高：<b>r = 3.5 cm</b>。',
      },
    ],
    answer: '（1）d = 6 cm　（2）r = 3 cm　（3）d = 10 cm　（4）r = 3.5 cm',
    build() {
      const cm = 0.34;
      const items = [];

      // (1) 半径 3cm
      const r1 = 3 * cm;
      items.push(circle(0, -2.4, 1.9, r1));
      items.push(point(0, -2.4, 1.9));
      items.push(
        line(0, [
          { x: -2.4, y: 1.9 },
          { x: -2.4 + r1 * 0.83, y: 1.9 + r1 * 0.55 },
        ]),
      );
      items.push(text(0, -2.4 + r1 * 0.45, 1.9 - 0.32, '3 cm'));
      items.push(text(0, -2.4, 1.9 - r1 - 0.4, 'd = ?'));

      // (2) 直径 6cm
      const r2 = 3 * cm;
      items.push(circle(1, 2.4, 1.9, r2));
      items.push(point(1, 2.4, 1.9));
      items.push(
        line(1, [
          { x: 2.4 - r2, y: 1.9 },
          { x: 2.4 + r2, y: 1.9 },
        ]),
      );
      items.push(text(1, 2.4, 1.9 + 0.3, '6 cm'));
      items.push(text(1, 2.4, 1.9 - r2 - 0.4, 'r = ?'));

      // (3) 正方形边长 10cm，内切圆
      const half = 5 * cm;
      const square = [
        { x: -2.4 - half, y: -1.85 - half },
        { x: -2.4 + half, y: -1.85 - half },
        { x: -2.4 + half, y: -1.85 + half },
        { x: -2.4 - half, y: -1.85 + half },
      ];
      items.push(line(2, square, { closed: true }));
      items.push(circle(2, -2.4, -1.85, half));
      items.push(point(2, -2.4, -1.85));
      items.push(text(2, -2.4, -1.85 - half - 0.35, '10 cm'));

      // (4) 梯形高 3.5cm，内接半圆
      const r4 = 3.5 * cm;
      const cy = -0.55;
      items.push(arc(3, 2.4, cy, r4, Math.PI, Math.PI));
      items.push(
        line(3, [
          { x: 2.4 - r4, y: cy },
          { x: 2.4 + r4, y: cy },
        ]),
      );
      items.push(
        line(
          3,
          [
            { x: 2.4 - r4 - 0.28, y: cy - r4 },
            { x: 2.4 + r4 + 0.28, y: cy - r4 },
            { x: 2.4 + r4, y: cy },
            { x: 2.4 - r4, y: cy },
          ],
          { closed: true },
        ),
      );
      items.push(point(3, 2.4, cy));
      items.push(text(3, 2.4, cy - r4 - 0.35, '高 3.5 cm'));

      return items;
    },
  },

  {
    id: 3,
    title: '量出圆的直径',
    prompt: `用下面的方法可以测量没有标出圆心的圆的直径。请你试一试。<span class="sub">（两块三角尺把圆夹在中间）</span>`,
    steps: [
      {
        title: '关键：直径 = 两条平行切线之间的距离',
        detail: '圆的直径是这个圆上最长的“宽度”，而这个宽度在任何一个方向上都是一样的。',
      },
      {
        title: '用两块三角尺夹住圆',
        detail: '把圆放在桌面上，用两把三角尺（或直尺＋三角尺）从两侧推过去夹紧，让两条尺边保持平行。',
      },
      {
        title: '量两条尺边之间的距离',
        detail: '两条平行尺边之间的距离就是直径，量出来即可；不用先找到圆心。',
      },
    ],
    answer: '直径 = 两条平行尺边之间的距离。',
    build() {
      const r = 1.7;
      return [
        circle(0, 0, 0.2, r),
        point(0, 0, 0.2),
        line(0, [{ x: -2.6, y: 0.2 + r }, { x: 2.6, y: 0.2 + r }]),
        line(0, [{ x: -2.6, y: 0.2 - r }, { x: 2.6, y: 0.2 - r }]),
        line(1, [{ x: -2.9, y: 0.2 + r }, { x: 3.1, y: 0.2 + r }], { color: MUTED }),
        line(1, [{ x: -2.9, y: 0.2 - r }, { x: 3.1, y: 0.2 - r }], { color: MUTED }),
        text(1, 0, 0.2 + r + 0.42, '三角尺', { color: MUTED }),
        line(
          2,
          [
            { x: 2.7, y: 0.2 - r },
            { x: 2.7, y: 0.2 + r },
          ],
          { color: AXIS },
        ),
        text(2, 3.15, 0.2, 'd', { color: AXIS }),
      ];
    },
  },

  {
    id: 4,
    title: '画直径 10 m 的花坛',
    prompt: `学校要建一个直径是 10 m 的圆形花坛，你能用什么方法画出这个圆？`,
    steps: [
      {
        title: '先定圆心',
        detail: '在空地中间打一根木桩（或插一根竹竿），它就是圆心。',
      },
      {
        title: '算出半径，做出“大圆规”',
        detail: '半径 = 10 ÷ 2 = 5 m。把绳子一端拴在木桩上，量出 5 m 长。',
      },
      {
        title: '拉直绳子绕一圈',
        detail: '把绳子拉直，绕木桩走一圈，边走边撒白灰，就画出了直径 10 m 的圆——绳长就是半径。',
      },
    ],
    answer: '木桩当圆心，5 m 长的绳子当半径，绕一圈撒灰画圆。',
    build() {
      const r = 1.9;
      return [
        point(0, 0, 0),
        line(
          0,
          [
            { x: -0.12, y: -0.5 },
            { x: 0.12, y: -0.5 },
            { x: 0.12, y: 0 },
            { x: -0.12, y: 0 },
          ],
          { closed: true },
        ),
        text(0, 0.9, -0.4, '木桩 = 圆心', { color: MUTED }),
        line(1, [{ x: 0, y: 0 }, { x: r * 0.7, y: r * 0.7 }], { color: AXIS }),
        text(1, r * 0.45, r * 0.32, '半径 5 m', { color: AXIS }),
        circle(2, 0, 0, r),
        text(2, 0, -r - 0.45, '直径 10 m'),
      ];
    },
  },

  {
    id: 5,
    title: '填表',
    prompt: `填表（单位：m）。<span class="sub">已知半径求直径，已知直径求半径。</span>
      <table class="data-table" style="margin-top:8px">
        <tr><th>r</th><td>0.24</td><td><span class="blank">?</span></td><td>1.42</td><td><span class="blank">?</span></td><td>2.6</td></tr>
        <tr><th>d</th><td><span class="blank">?</span></td><td>0.86</td><td><span class="blank">?</span></td><td>1.04</td><td><span class="blank">?</span></td></tr>
      </table>`,
    steps: [
      {
        title: '已知半径，用 d = 2r',
        detail: 'r = 0.24 → d = 0.48；r = 1.42 → d = 2.84；r = 2.6 → d = 5.2。',
      },
      {
        title: '已知直径，用 r = d ÷ 2',
        detail: 'd = 0.86 → r = 0.43；d = 1.04 → r = 0.52。',
      },
      {
        title: '检查一遍',
        detail: '每一列里，直径都是半径的 2 倍；半径都是直径的一半。',
      },
    ],
    answer: `r：0.24、<b>0.43</b>、1.42、<b>0.52</b>、2.6　　d：<b>0.48</b>、0.86、<b>2.84</b>、1.04、<b>5.2</b>`,
    build: () => [],
  },

  {
    id: 6,
    title: '哪些是轴对称图形',
    prompt: `想一想，我们已经学过的平面图形中哪些是轴对称图形？哪些图形的对称轴只有一条？哪些不止一条？`,
    steps: [
      {
        title: '先把学过的图形列出来',
        detail: '长方形、正方形、三角形（等腰、等边）、梯形（等腰）、圆、半圆、扇形……',
      },
      {
        title: '只有一条对称轴的',
        detail: '等腰三角形、等腰梯形、半圆、扇形——它们只有一条“折痕”能让两边重合。',
      },
      {
        title: '不止一条的',
        detail: '长方形 2 条、等边三角形 3 条、正方形 4 条、圆有无数条。',
      },
      {
        title: '注意这个“坑”',
        detail: '一般的平行四边形不是轴对称图形（它只是中心对称），长方形和菱形除外。',
      },
    ],
    answer: '一条：等腰三角形、等腰梯形、半圆、扇形；不止一条：长方形 2 条、等边三角形 3 条、正方形 4 条、圆无数条。',
    build() {
      const items = [];
      // 长方形
      items.push(
        line(
          0,
          [
            { x: -5.0, y: -0.55 },
            { x: -3.4, y: -0.55 },
            { x: -3.4, y: 0.55 },
            { x: -5.0, y: 0.55 },
          ],
          { closed: true },
        ),
      );
      items.push(text(0, -4.2, -1.05, '长方形'));
      // 等腰三角形
      items.push(
        line(
          0,
          [
            { x: -2.1, y: -0.7 },
            { x: -0.7, y: -0.7 },
            { x: -1.4, y: 0.95 },
          ],
          { closed: true },
        ),
      );
      items.push(text(0, -1.4, -1.05, '等腰三角形'));
      // 等边三角形
      items.push(
        line(
          0,
          [
            { x: 0.7, y: -0.7 },
            { x: 2.1, y: -0.7 },
            { x: 1.4, y: 0.95 },
          ],
          { closed: true },
        ),
      );
      items.push(text(0, 1.4, -1.05, '等边三角形'));
      // 圆
      items.push(circle(0, 4.4, 0.1, 0.85));
      items.push(point(0, 4.4, 0.1));
      items.push(text(0, 4.4, -1.05, '圆'));

      // 对称轴
      items.push(line(1, [{ x: -1.4, y: -1.1 }, { x: -1.4, y: 1.2 }], { color: AXIS, dashed: true }));
      items.push(text(1, -1.4, 1.45, '1 条', { color: AXIS }));

      items.push(line(2, [{ x: -5.2, y: 0 }, { x: -3.2, y: 0 }], { color: AXIS, dashed: true }));
      items.push(line(2, [{ x: -4.2, y: -0.85 }, { x: -4.2, y: 0.85 }], { color: AXIS, dashed: true }));
      items.push(text(2, -4.2, 1.2, '2 条', { color: AXIS }));

      for (const angle of [Math.PI / 2, Math.PI / 6, -Math.PI / 6]) {
        items.push(axisThrough(3, 1.4, 0.1, 1.05, angle));
      }
      items.push(text(3, 1.4, 1.45, '3 条', { color: AXIS }));
      items.push(axisThrough(3, 4.4, 0.1, 1.05, Math.PI / 2));
      items.push(axisThrough(3, 4.4, 0.1, 1.05, Math.PI / 4));
      items.push(text(3, 4.4, 1.45, '无数条', { color: AXIS }));
      return items;
    },
  },

  {
    id: 7,
    title: '补全轴对称图形',
    prompt: `根据对称轴画出轴对称图形的另外一半。`,
    steps: [
      {
        title: '看清对称轴和已知的一半',
        detail: '红色虚线是对称轴，左边是已经画好的一半。',
      },
      {
        title: '找出关键点',
        detail: '在已知一半上标出端点和转折点（红线小点），这几个点决定了图形的形状。',
      },
      {
        title: '在另一侧作对称点',
        detail: '数一数每个关键点到对称轴有几格，在另一侧同样的格数处点出对称点。',
      },
      {
        title: '把对称点连起来',
        detail: '按原来的顺序把对称点依次连起来，另一半就画好了——对折后两边完全重合。',
      },
    ],
    answer: '关键点关于对称轴找对称点，再依次连线。',
    build() {
      const items = [];
      const half = [
        { x: 0, y: 1.2 },
        { x: -0.6, y: 1.0 },
        { x: -1.2, y: 0.6 },
        { x: -1.5, y: 0 },
        { x: -1.2, y: -0.6 },
        { x: -0.6, y: -1.0 },
        { x: 0, y: -1.2 },
      ];
      const mirrored = half.map((p) => ({ x: -p.x, y: p.y }));

      // 网格
      for (let x = -3; x <= 3; x += 0.6) {
        items.push(
          line(0, [{ x, y: -2.4 }, { x, y: 2.4 }], { color: '#e6eaf4', opacity: 0.9 }),
        );
      }
      for (let y = -2.4; y <= 2.4; y += 0.6) {
        items.push(
          line(0, [{ x: -3, y }, { x: 3, y }], { color: '#e6eaf4', opacity: 0.9 }),
        );
      }
      items.push(line(0, [{ x: 0, y: -2.6 }, { x: 0, y: 2.6 }], { color: AXIS, dashed: true }));
      items.push(line(0, half));

      items.push(...half.map((p) => point(1, p.x, p.y, { r: 0.062, color: AXIS })));
      items.push(...mirrored.map((p) => point(2, p.x, p.y, { r: 0.062, color: '#12a375' })));
      items.push(line(3, mirrored, { color: '#12a375' }));
      return items;
    },
  },

  {
    id: 8,
    title: '数对称轴',
    prompt: `在下列各图形中，你能分别画出几条对称轴？<span class="sub">（1）圆　（2）两个同心圆　（3）两个相交的等圆　（4）大圆与两个小圆相切　（5）三个等圆　（6）长方形内切一个圆</span>`,
    steps: [
      {
        title: '先看图形是由哪些基本图形拼成的',
        detail: '有圆的部分，任何一条直径所在直线都可能是对称轴；有直边的部分，还要看直线是否“两等分”。',
      },
      { title: '（1）圆：无数条', detail: '每条直径所在的直线都是对称轴。' },
      { title: '（2）同心圆：无数条', detail: '两个圆共用一个圆心，同样每条直径所在直线都是对称轴。' },
      { title: '（3）两个相交的等圆：2 条', detail: '连心线一条，两个交点的中垂线一条。' },
      { title: '（4）大圆与两个小圆相切：2 条', detail: '一条过所有圆心（横），一条过切点（竖）。' },
      { title: '（5）三个等圆：3 条', detail: '每个圆心到另外两个圆心连线的中点，各有一条。' },
      { title: '（6）长方形内切圆：2 条', detail: '两条中垂线，正好就是长方形的两条对称轴。' },
    ],
    answer: '（1）无数条　（2）无数条　（3）2 条　（4）2 条　（5）3 条　（6）2 条',
    build() {
      const items = [];
      const r = 0.95;
      const cells = [
        { x: -3.9, y: 1.7 },
        { x: 0, y: 1.7 },
        { x: 3.9, y: 1.7 },
        { x: -3.9, y: -1.7 },
        { x: 0, y: -1.7 },
        { x: 3.9, y: -1.7 },
      ];

      // (1) 单圆
      items.push(circle(0, cells[0].x, cells[0].y, r), point(0, cells[0].x, cells[0].y));
      // (2) 同心圆
      items.push(circle(0, cells[1].x, cells[1].y, r), circle(0, cells[1].x, cells[1].y, r * 0.58));
      items.push(point(0, cells[1].x, cells[1].y));
      // (3) 两个相交的等圆
      const c3 = cells[2];
      items.push(circle(0, c3.x - 0.5, c3.y, r * 0.9), circle(0, c3.x + 0.5, c3.y, r * 0.9));
      // (4) 大圆 + 两个小圆相切
      const c4 = cells[3];
      const bigR = 0.95;
      const smallR = 0.42;
      // 与小圆外切时圆心的水平距离：dx² + smallR² = (bigR + smallR)²
      const offset = Math.sqrt(bigR * bigR + 2 * bigR * smallR);
      items.push(circle(0, c4.x - 0.35, c4.y, bigR));
      items.push(circle(0, c4.x - 0.35 + offset, c4.y + smallR, smallR));
      items.push(circle(0, c4.x - 0.35 + offset, c4.y - smallR, smallR));
      // (5) 三个等圆
      const c5 = cells[4];
      const sr = 0.55;
      items.push(circle(0, c5.x - sr, c5.y - 0.45, sr));
      items.push(circle(0, c5.x + sr, c5.y - 0.45, sr));
      items.push(circle(0, c5.x, c5.y - 0.45 + sr * Math.sqrt(3), sr));
      // (6) 长方形 + 内切圆
      const c6 = cells[5];
      items.push(
        line(
          0,
          [
            { x: c6.x - 1.3, y: c6.y - 0.8 },
            { x: c6.x + 1.3, y: c6.y - 0.8 },
            { x: c6.x + 1.3, y: c6.y + 0.8 },
            { x: c6.x - 1.3, y: c6.y + 0.8 },
          ],
          { closed: true },
        ),
        circle(0, c6.x, c6.y, 0.8),
      );

      // 对称轴
      for (const angle of [0, Math.PI / 2, Math.PI / 4, -Math.PI / 4]) {
        items.push(axisThrough(1, cells[0].x, cells[0].y, r * 1.15, angle));
      }
      items.push(text(1, cells[0].x, cells[0].y - r - 0.35, '无数条', { color: AXIS }));

      for (const angle of [0, Math.PI / 2, Math.PI / 4, -Math.PI / 4]) {
        items.push(axisThrough(2, cells[1].x, cells[1].y, r * 1.15, angle));
      }
      items.push(text(2, cells[1].x, cells[1].y - r - 0.35, '无数条', { color: AXIS }));

      items.push(
        line(3, [{ x: c3.x - 1.6, y: c3.y }, { x: c3.x + 1.6, y: c3.y }], {
          color: AXIS,
          dashed: true,
        }),
        line(3, [{ x: c3.x, y: c3.y - 1.3 }, { x: c3.x, y: c3.y + 1.3 }], {
          color: AXIS,
          dashed: true,
        }),
        text(3, c3.x, c3.y - r - 0.35, '2 条', { color: AXIS }),
      );

      items.push(
        line(4, [{ x: c4.x - 1.6, y: c4.y }, { x: c4.x + 1.5, y: c4.y }], {
          color: AXIS,
          dashed: true,
        }),
        line(4, [{ x: c4.x - 0.35 + offset, y: c4.y - 1.2 }, { x: c4.x - 0.35 + offset, y: c4.y + 1.2 }], {
          color: AXIS,
          dashed: true,
        }),
        text(4, c4.x, c4.y - 1.5, '2 条', { color: AXIS }),
      );

      const centroidY = c5.y - 0.45 + (sr * Math.sqrt(3)) / 3;
      for (const angle of [Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6]) {
        items.push(axisThrough(5, c5.x, centroidY, 1.35, angle));
      }
      items.push(text(5, c5.x, c5.y - 1.5, '3 条', { color: AXIS }));

      items.push(
        line(6, [{ x: c6.x, y: c6.y - 1.15 }, { x: c6.x, y: c6.y + 1.15 }], {
          color: AXIS,
          dashed: true,
        }),
        line(6, [{ x: c6.x - 1.5, y: c6.y }, { x: c6.x + 1.5, y: c6.y }], {
          color: AXIS,
          dashed: true,
        }),
        text(6, c6.x, c6.y - 1.35, '2 条', { color: AXIS }),
      );

      return items;
    },
  },

  {
    id: 9,
    title: '长方形里的三个圆',
    prompt: `如图，长方形中有三个大小相等的圆，已知这个长方形的长是 18 cm，圆的直径是多少？长方形的周长是多少？`,
    steps: [
      {
        title: '长 = 3 个直径',
        detail: '三个圆并排且相等，长方形的长正好是 3 个直径：直径 = 18 ÷ 3 = <b>6 cm</b>。',
      },
      {
        title: '宽 = 1 个直径',
        detail: '圆与长方形的上下边相切，所以长方形的宽就等于直径 = 6 cm。',
      },
      {
        title: '算周长',
        detail: '周长 = (长 + 宽) × 2 = (18 + 6) × 2 = <b>48 cm</b>。',
      },
    ],
    answer: '圆的直径是 6 cm，长方形的周长是 48 cm。',
    build() {
      const cm = 0.24;
      const halfW = 9 * cm;
      const halfH = 3 * cm;
      const r = 3 * cm;
      const items = [
        line(
          0,
          [
            { x: -halfW, y: -halfH },
            { x: halfW, y: -halfH },
            { x: halfW, y: halfH },
            { x: -halfW, y: halfH },
          ],
          { closed: true },
        ),
        text(0, 0, -halfH - 0.4, '18 cm'),
      ];
      for (const x of [-halfW + r, 0, halfW - r]) {
        items.push(circle(0, x, 0, r));
        items.push(point(0, x, 0));
      }
      items.push(line(1, [{ x: -r, y: 0 }, { x: r, y: 0 }], { color: AXIS }));
      items.push(text(1, 0, halfH + 0.4, 'd = 6 cm', { color: AXIS }));
      items.push(line(2, [{ x: halfW + 0.25, y: -halfH }, { x: halfW + 0.25, y: halfH }], { color: '#12a375' }));
      items.push(text(2, halfW + 0.9, 0, '宽 6 cm', { color: '#12a375' }));
      items.push(text(2, 0, halfH + 1.0, '周长 = (18 + 6) × 2 = 48 cm'));
      return items;
    },
  },

  {
    id: 10,
    title: '画美丽的图形',
    prompt: `利用圆规和三角尺，你能画出下面这些美丽的图形吗？试试看。`,
    steps: [
      {
        title: '这些图案都是“基本图形 + 圆弧”',
        detail: '先看骨架：一个正方形、一个圆。用圆规和三角尺把这些基本图形画出来。',
      },
      {
        title: '在等分点/中点画半圆',
        detail: '把圆四等分，或者取正方形四条边的中点，用同样的半径画半圆，花瓣就出现了。',
      },
      {
        title: '按对称涂色',
        detail: '对称的位置用同一种颜色，相邻的花瓣换颜色，图案就“活”了。',
      },
    ],
    answer: '先定圆心与等分点，再用同样的半径画弧，最后按对称涂色。',
    build() {
      const items = [];
      const s = 1.15;
      const cx1 = -2.4;
      const cy1 = 1.7;
      // (1) 正方形 + 四瓣
      items.push(
        line(
          0,
          [
            { x: cx1 - s, y: cy1 - s },
            { x: cx1 + s, y: cy1 - s },
            { x: cx1 + s, y: cy1 + s },
            { x: cx1 - s, y: cy1 + s },
          ],
          { closed: true },
        ),
      );
      const petals1 = [
        { cx: cx1, cy: cy1 + s, start: Math.PI, sweep: Math.PI },
        { cx: cx1, cy: cy1 - s, start: 0, sweep: Math.PI },
        { cx: cx1 - s, cy: cy1, start: -Math.PI / 2, sweep: Math.PI },
        { cx: cx1 + s, cy: cy1, start: Math.PI / 2, sweep: Math.PI },
      ];
      petals1.forEach((p, i) => {
        items.push(arc(1, p.cx, p.cy, s, p.start, p.sweep));
        items.push(disk(2, p.cx, p.cy, s, p.start, p.sweep, { color: i % 2 ? SOFT_B : SOFT_A, opacity: 0.85 }));
      });

      // (2) 圆 + 四个半圆
      const cx2 = 2.4;
      const cy2 = 1.7;
      const R2 = 1.3;
      items.push(circle(0, cx2, cy2, R2));
      const petals2 = [
        { cx: cx2, cy: cy2 + R2 / 2, start: Math.PI, sweep: Math.PI },
        { cx: cx2, cy: cy2 - R2 / 2, start: 0, sweep: Math.PI },
        { cx: cx2 - R2 / 2, cy: cy2, start: -Math.PI / 2, sweep: Math.PI },
        { cx: cx2 + R2 / 2, cy: cy2, start: Math.PI / 2, sweep: Math.PI },
      ];
      petals2.forEach((p, i) => {
        items.push(arc(1, p.cx, p.cy, R2 / 2, p.start, p.sweep));
        items.push(disk(2, p.cx, p.cy, R2 / 2, p.start, p.sweep, { color: i % 2 ? SOFT_A : SOFT_B, opacity: 0.85 }));
      });

      // (3) 太极
      const cx3 = 0;
      const cy3 = -1.9;
      const R3 = 1.3;
      const h3 = R3 / 2;
      items.push(circle(0, cx3, cy3, R3));
      items.push(arc(1, cx3, cy3 + h3, h3, -Math.PI / 2, Math.PI));
      items.push(arc(1, cx3, cy3 - h3, h3, Math.PI / 2, Math.PI));
      items.push(disk(2, cx3, cy3, R3, 0, Math.PI * 2, { color: SOFT_A, opacity: 0.95 }));
      items.push(
        disk(2, cx3, cy3, R3, -Math.PI / 2, Math.PI, { color: SOFT_B, opacity: 0.95 }),
      );
      items.push(disk(2, cx3, cy3 + h3, h3, 0, Math.PI * 2, { color: SOFT_A, opacity: 0.95 }));
      items.push(disk(2, cx3, cy3 - h3, h3, 0, Math.PI * 2, { color: SOFT_B, opacity: 0.95 }));
      items.push(disk(2, cx3, cy3 + h3, R3 / 6, 0, Math.PI * 2, { color: SOFT_B }));
      items.push(disk(2, cx3, cy3 - h3, R3 / 6, 0, Math.PI * 2, { color: SOFT_A }));
      items.push(text(0, cx1, cy1 - s - 0.4, '正方形 + 四瓣'));
      items.push(text(0, cx2, cy2 - R2 - 0.4, '圆 + 四瓣'));
      items.push(text(0, cx3, cy3 - R3 - 0.4, '太极图'));
      return items;
    },
  },
];

export default createExerciseLesson({ title: '练习十三', questions: QUESTIONS });
