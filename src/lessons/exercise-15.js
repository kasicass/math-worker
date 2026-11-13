/**
 * 六上 · 圆：练习十五（课本 PDF 第 74–77 页 / 印刷页 69–72 的 18 道题）。
 *
 * 这一组练习围绕「圆的面积」：S = πr²，以及圆环、组合图形。
 * 引擎见 core/exercise-player.js。
 */
import {
  AXIS,
  MUTED,
  SOFT_A,
  SOFT_B,
  arc,
  circle,
  createExerciseLesson,
  disk,
  line,
  point,
  region,
  text,
} from '../core/exercise-player.js';

/** 生成一段圆弧上的点，用来拼扇形/月牙形的填充 */
function arcPts(cx, cy, r, a0, a1, n = 40) {
  return Array.from({ length: n + 1 }, (_, i) => {
    const angle = a0 + ((a1 - a0) * i) / n;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  });
}

/** 圆环填充：外圈实心 + 内圈用背景色盖掉 */
function ringFill(step, cx, cy, outer, inner, color = SOFT_A) {
  return [
    disk(step, cx, cy, outer, 0, Math.PI * 2, { color, opacity: 0.95 }),
    disk(step, cx, cy, inner, 0, Math.PI * 2, { color: '#ffffff', opacity: 1 }),
  ];
}

const QUESTIONS = [
  {
    id: 1,
    title: '补充表格',
    prompt: `把表格补充完整。
      <table class="data-table" style="margin-top:8px">
        <tr><th>圆</th><th>半径</th><th>直径</th><th>面积</th></tr>
        <tr><td>A</td><td>4 cm</td><td><span class="blank">?</span></td><td><span class="blank">?</span></td></tr>
        <tr><td>B</td><td><span class="blank">?</span></td><td>9 cm</td><td><span class="blank">?</span></td></tr>
        <tr><td>C</td><td><span class="blank">?</span></td><td>6 cm</td><td><span class="blank">?</span></td></tr>
        <tr><td>D</td><td>20 cm</td><td><span class="blank">?</span></td><td><span class="blank">?</span></td></tr>
      </table>`,
    steps: [
      {
        title: '先想清楚三个量的关系',
        detail: '直径 d = 2r，面积 S = πr²。已知哪个都能补齐另外两个。',
      },
      {
        title: '圆 A（已知半径）',
        detail: 'd = 4 × 2 = 8 cm，S = 3.14 × 4² = 50.24 cm²。',
      },
      {
        title: '圆 B、C（已知直径）',
        detail: 'B：r = 9 ÷ 2 = 4.5 cm，S = 3.14 × 4.5² = 63.585 cm²；C：r = 6 ÷ 2 = 3 cm，S = 3.14 × 3² = 28.26 cm²。',
      },
      {
        title: '圆 D（半径较大）',
        detail: 'd = 20 × 2 = 40 cm，S = 3.14 × 20² = 1256 cm²。',
      },
    ],
    answer:
      'A：d = 8 cm，S = 50.24 cm²；B：r = 4.5 cm，S = 63.585 cm²；C：r = 3 cm，S = 28.26 cm²；D：d = 40 cm，S = 1256 cm²。',
    build: () => [],
  },

  {
    id: 2,
    title: '算周长和面积',
    prompt: '计算下面各圆的周长和面积。',
    steps: [
      {
        title: '左边：已知直径 10 cm',
        detail: 'C = 3.14 × 10 = 31.4 cm；r = 5 cm，S = 3.14 × 5² = 78.5 cm²。',
      },
      {
        title: '右边：已知半径 3 cm',
        detail: 'C = 2 × 3.14 × 3 = 18.84 cm；S = 3.14 × 3² = 28.26 cm²。',
      },
      {
        title: '别把周长和面积混在一起',
        detail: '周长是“一圈的长度”（cm），面积是“里面的多少”（cm²），单位和算法都不一样。',
      },
    ],
    answer: '左边：C = 31.4 cm，S = 78.5 cm²；右边：C = 18.84 cm，S = 28.26 cm²。',
    build() {
      const items = [];
      // d = 10 cm
      items.push(circle(0, -2.2, 0, 1.3));
      items.push(
        line(0, [
          { x: -3.5, y: 0 },
          { x: -0.9, y: 0 },
        ]),
      );
      items.push(point(0, -2.2, 0), text(0, -2.2, -1.75, 'd = 10 cm'));
      // r = 3 cm
      items.push(circle(0, 2.2, 0, 0.9));
      items.push(
        line(0, [
          { x: 2.2, y: 0 },
          { x: 3.1, y: 0 },
        ]),
      );
      items.push(point(0, 2.2, 0), text(0, 2.2, -1.35, 'r = 3 cm'));
      items.push(
        text(1, -2.2, 1.75, 'C = 31.4 cm，S = 78.5 cm²', { color: AXIS }),
        text(2, 2.2, 1.35, 'C = 18.84 cm，S = 28.26 cm²', { color: '#12a375' }),
      );
      return items;
    },
  },

  {
    id: 3,
    title: '喷灌装置',
    prompt: '公园草地上一个自动旋转喷灌装置的射程是 10 m，它能喷灌的面积是多少？',
    steps: [
      {
        title: '射程就是半径',
        detail: '喷头转一圈，喷灌到的区域是一个半径 10 m 的圆。',
      },
      {
        title: '代入面积公式',
        detail: 'S = 3.14 × 10² = 3.14 × 100 = <b>314</b>（m²）。',
      },
    ],
    answer: '它能喷灌的面积是 314 m²。',
    build() {
      return [
        disk(0, 0, 0, 1.7, 0, Math.PI * 2, { color: SOFT_A, opacity: 0.6 }),
        circle(0, 0, 0, 1.7),
        point(0, 0, 0),
        line(0, [
          { x: 0, y: 0 },
          { x: 1.2, y: 1.2 },
        ]),
        text(0, 0.85, 0.95, '射程 10 m'),
      ];
    },
  },

  {
    id: 4,
    title: '树干横截面',
    prompt: '小刚量得一棵树的树干横截面的周长是 125.6 cm。树干的横截面近似于圆，它的面积大约是多少？',
    steps: [
      {
        title: '先用周长求半径',
        detail: 'r = C ÷ π ÷ 2 = 125.6 ÷ 3.14 ÷ 2 = 20（cm）。',
      },
      {
        title: '再求面积',
        detail: 'S = 3.14 × 20² = 3.14 × 400 = <b>1256</b>（cm²）。',
      },
    ],
    answer: '它的面积大约是 1256 cm²。',
    build() {
      return [
        circle(0, 0, 0, 1.5),
        point(0, 0, 0),
        text(0, 0, 1.95, '横截面周长 125.6 cm'),
        line(1, [
          { x: 0, y: 0 },
          { x: 1.5, y: 0 },
        ], { color: AXIS }),
        text(1, 0.75, 0.3, 'r = 20 cm', { color: AXIS }),
        text(1, 0, -1.95, 'S = 3.14 × 20² = 1256 cm²', { color: '#12a375' }),
      ];
    },
  },

  {
    id: 5,
    title: '玉璧的面积',
    prompt: '右图是一块玉璧，外直径为 18 cm，内直径为 7 cm。这块玉璧的面积是多少？',
    steps: [
      {
        title: '外圆和内圆的半径',
        detail: '外半径 R = 18 ÷ 2 = 9 cm，内半径 r = 7 ÷ 2 = 3.5 cm。',
      },
      {
        title: '圆环面积 = 大圆 − 小圆',
        detail: 'S = 3.14 × (9² − 3.5²) = 3.14 × (81 − 12.25) = 3.14 × 68.75 = <b>215.875</b>（cm²）。',
      },
    ],
    answer: '这块玉璧的面积是 215.875 cm²（约 215.88 cm²）。',
    build() {
      return [
        ...ringFill(0, 0, 0, 1.6, 0.62),
        circle(0, 0, 0, 1.6),
        circle(0, 0, 0, 0.62),
        text(0, 0, 1.95, '外直径 18 cm'),
        text(1, 0, -1.95, '内直径 7 cm', { color: MUTED }),
      ];
    },
  },

  {
    id: 6,
    title: '涂色部分的面积',
    prompt: '左图中的大圆半径等于小圆的直径，请你求出涂色部分的面积。',
    steps: [
      {
        title: '先弄清两个圆的半径',
        detail: '小圆直径是 6 cm，所以小圆半径 r = 3 cm；大圆半径 R = 小圆直径 = 6 cm。',
      },
      {
        title: '涂色 = 大圆 − 小圆',
        detail: 'S = 3.14 × 6² − 3.14 × 3² = 113.04 − 28.26 = <b>84.78</b>（cm²）。',
      },
      {
        title: '也可以先算半径平方差',
        detail: 'S = 3.14 × (6² − 3²) = 3.14 × 27 = 84.78 cm²，结果一样。',
      },
    ],
    answer: '涂色部分的面积是 84.78 cm²。',
    build() {
      return [
        disk(0, 0, 0, 1.7, 0, Math.PI * 2, { color: SOFT_B, opacity: 0.95 }),
        disk(0, 0, 0, 0.85, 0, Math.PI * 2, { color: '#ffffff', opacity: 1 }),
        circle(0, 0, 0, 1.7),
        circle(0, 0, 0, 0.85),
        point(0, 0, 0),
        line(0, [
          { x: -0.85, y: 0 },
          { x: 0.85, y: 0 },
        ]),
        text(0, 0, 0.3, '6 cm'),
        text(0, 0, 1.98, '大圆半径 = 小圆直径'),
      ];
    },
  },

  {
    id: 7,
    title: '半圆环与圆环',
    prompt: '计算下面左边图形的周长和右边圆环的面积。',
    steps: [
      {
        title: '左图：半圆环的周长',
        detail: '外半圆弧 3.14 × 12 ÷ 2 = 18.84 cm，内半圆弧 3.14 × 8 ÷ 2 = 12.56 cm，两端各有 (12 − 8) ÷ 2 = 2 cm 的直边，共 4 cm。',
      },
      {
        title: '左图周长合计',
        detail: '18.84 + 12.56 + 2 + 2 = <b>35.4</b>（cm）。',
      },
      {
        title: '右图：圆环的面积',
        detail: '外半径 12 cm、内半径 8 cm：S = 3.14 × (12² − 8²) = 3.14 × 80 = <b>251.2</b>（cm²）。',
      },
    ],
    answer: '左边图形的周长是 35.4 cm；右边圆环的面积是 251.2 cm²。',
    build() {
      const items = [];
      // 左：半圆环
      const cx = -2.6;
      items.push(arc(0, cx, 0, 1.5, 0, Math.PI));
      items.push(arc(0, cx, 0, 1.0, 0, Math.PI));
      items.push(
        line(0, [
          { x: cx - 1.5, y: 0 },
          { x: cx - 1.0, y: 0 },
          { x: cx + 1.0, y: 0 },
          { x: cx + 1.5, y: 0 },
        ]),
      );
      items.push(text(0, cx, -0.35, '外 d=12，内 d=8'));
      items.push(text(1, cx, -1.9, '周长 = 18.84 + 12.56 + 4', { color: AXIS }));

      // 右：圆环
      const rx = 2.4;
      items.push(...ringFill(2, rx, 0, 1.7, 1.15, '#ffd9dd'));
      items.push(circle(2, rx, 0, 1.7), circle(2, rx, 0, 1.15), point(2, rx, 0));
      items.push(
        line(2, [
          { x: rx, y: 0 },
          { x: rx + 1.7, y: 0 },
        ]),
        line(2, [
          { x: rx, y: 0 },
          { x: rx + 1.15, y: 0.6 },
        ]),
        text(2, rx + 1.0, 0.25, '12'),
        text(2, rx + 0.75, 0.45, '8'),
        text(2, rx, -1.95, '面积 = 251.2 cm²', { color: AXIS }),
      );
      return items;
    },
  },

  {
    id: 8,
    title: '找圆环算面积',
    prompt:
      '在生活中找找圆环形体，测量所需数据，计算出它的面积。<span class="sub">（实践题：量出外直径和内直径，再用 S = π(R² − r²) 计算）</span>',
    steps: [
      {
        title: '先找“圆环”',
        detail: '圆筒形卫生纸的横截面、金属垫片、光盘、救生圈……都是圆环。',
      },
      {
        title: '要量两个数据',
        detail: '外直径和内直径（或者外半径和内半径），量的时候都过圆心。',
      },
      {
        title: '代入公式',
        detail: 'S = πR² − πr² = π(R² − r²)，注意两个半径的平方要先算。',
      },
    ],
    answer: '量出外直径 D、内直径 d，面积 S = 3.14 × [(D÷2)² − (d÷2)²]。',
    build: () => [],
  },

  {
    id: 9,
    title: '铜钱的面积',
    prompt: '右图中铜钱的直径为 28 mm，中间正方形的边长为 6 mm。这枚铜钱的面积是多少？',
    steps: [
      {
        title: '铜钱 = 一个圆减去一个正方形',
        detail: '圆半径 = 28 ÷ 2 = 14 mm，圆的面积 = 3.14 × 14² = 615.44 mm²。',
      },
      {
        title: '减去中间的方孔',
        detail: '正方形面积 = 6 × 6 = 36 mm²。',
      },
      {
        title: '相减',
        detail: '615.44 − 36 = <b>579.44</b>（mm²）。',
      },
    ],
    answer: '这枚铜钱的面积是 579.44 mm²。',
    build() {
      const r = 1.6;
      const half = 0.34;
      return [
        disk(0, 0, 0, r, 0, Math.PI * 2, { color: SOFT_B, opacity: 0.95 }),
        region(0, [
          { x: -half, y: -half },
          { x: half, y: -half },
          { x: half, y: half },
          { x: -half, y: half },
        ], { color: '#ffffff', opacity: 1 }),
        circle(0, 0, 0, r),
        line(0, [
          { x: -half, y: -half },
          { x: half, y: -half },
          { x: half, y: half },
          { x: -half, y: half },
        ], { closed: true }),
        text(0, 0, r + 0.4, '直径 28 mm'),
        text(0, 0, -r - 0.4, '方孔边长 6 mm'),
      ];
    },
  },

  {
    id: 10,
    title: '运动场的周长和面积',
    prompt: '如右图，一个运动场两端是半圆形，中间是长方形。这个运动场的周长是多少米？面积是多少平方米？',
    steps: [
      {
        title: '拆成“两个半圆 + 一个长方形”',
        detail: '两个半圆合起来正好是一个整圆，半径 32 m；长方形长 100 m、宽 2 × 32 = 64 m。',
      },
      {
        title: '周长 = 两条直边 + 一个圆',
        detail: 'C = 100 × 2 + 2 × 3.14 × 32 = 200 + 200.96 = <b>400.96</b>（m）。',
      },
      {
        title: '面积 = 长方形 + 一个圆',
        detail: 'S = 100 × 64 + 3.14 × 32² = 6400 + 3215.36 = <b>9615.36</b>（m²）。',
      },
    ],
    answer: '周长是 400.96 m，面积是 9615.36 m²。',
    build() {
      const halfW = 1.5;
      const r = 0.85;
      return [
        line(1, [
          { x: -halfW, y: -r },
          { x: halfW, y: -r },
          { x: halfW, y: r },
          { x: -halfW, y: r },
        ], { closed: true, color: AXIS }),
        arc(2, -halfW, 0, r, Math.PI / 2, Math.PI, { color: AXIS }),
        arc(2, halfW, 0, r, -Math.PI / 2, Math.PI, { color: AXIS }),
        text(0, 0, r + 0.45, '长 100 m'),
        line(0, [
          { x: halfW, y: 0 },
          { x: halfW + r, y: 0 },
        ]),
        text(0, halfW + r + 0.55, 0, '32 m'),
        text(2, 0, -r - 0.5, '周长 400.96 m，面积 9615.36 m²', { color: '#12a375' }),
      ];
    },
  },

  {
    id: 11,
    title: '花瓣状门洞',
    prompt: '右图中的花瓣状门洞的边是由 4 个直径都是 1 m 的半圆组成的。这个门洞的周长和面积分别是多少？',
    steps: [
      {
        title: '周长：4 条半圆弧',
        detail: '每条半圆弧长 3.14 × 1 ÷ 2 = 1.57 m，4 条 = <b>6.28</b>（m）。',
      },
      {
        title: '面积 = 中间正方形 + 4 个半圆',
        detail: '正方形边长 1 m，面积 1 m²；4 个半圆合起来是 2 个整圆：2 × 3.14 × 0.5² = 1.57 m²。',
      },
      {
        title: '合计',
        detail: '1 + 1.57 = <b>2.57</b>（m²）。',
      },
    ],
    answer: '门洞的周长是 6.28 m，面积是 2.57 m²。',
    build() {
      const s = 1.1;
      const r = s / 2;
      return [
        region(0, [
          { x: -r, y: -r },
          { x: r, y: -r },
          { x: r, y: r },
          { x: -r, y: r },
        ], { color: SOFT_A, opacity: 0.9 }),
        disk(0, 0, r, r, 0, Math.PI, { color: SOFT_A, opacity: 0.9 }),
        disk(0, 0, -r, r, Math.PI, Math.PI, { color: SOFT_A, opacity: 0.9 }),
        disk(0, -r, 0, r, Math.PI / 2, Math.PI, { color: SOFT_A, opacity: 0.9 }),
        disk(0, r, 0, r, -Math.PI / 2, Math.PI, { color: SOFT_A, opacity: 0.9 }),
        line(0, [
          { x: -r, y: -r },
          { x: r, y: -r },
          { x: r, y: r },
          { x: -r, y: r },
        ], { closed: true }),
        arc(0, 0, r, r, 0, Math.PI),
        arc(0, 0, -r, r, Math.PI, Math.PI),
        arc(0, -r, 0, r, Math.PI / 2, Math.PI),
        arc(0, r, 0, r, -Math.PI / 2, Math.PI),
        text(0, 0, s + 0.55, '每个半圆直径 1 m'),
        text(1, 0, -s - 0.55, '4 × 1.57 = 6.28 m', { color: AXIS }),
        text(2, 0, -s - 1.05, '面积 1 + 1.57 = 2.57 m²', { color: '#12a375' }),
      ];
    },
  },

  {
    id: 12,
    title: '两座土楼',
    prompt:
      '有两座底面是圆环形的土楼，其中一座外直径 34 m，内直径 14 m；另一座外直径 26 m，内直径也是 14 m。两座土楼的房屋占地面积相差多少？',
    steps: [
      {
        title: '把圆环面积公式写成半径形式',
        detail: 'S = π(R² − r²)。第一座：R = 17、r = 7；第二座：R = 13、r = 7。',
      },
      {
        title: '第一座',
        detail: 'S₁ = 3.14 × (17² − 7²) = 3.14 × 240 = 753.6（m²）。',
      },
      {
        title: '第二座与相差',
        detail: 'S₂ = 3.14 × (13² − 7²) = 3.14 × 120 = 376.8（m²）；相差 753.6 − 376.8 = <b>376.8</b>（m²）。',
      },
    ],
    answer: '两座土楼的占地面积相差 376.8 m²。',
    build() {
      const items = [];
      items.push(...ringFill(0, -2.3, 0, 1.7, 0.7, SOFT_B));
      items.push(circle(0, -2.3, 0, 1.7), circle(0, -2.3, 0, 0.7));
      items.push(text(0, -2.3, 1.95, '外 34 m / 内 14 m'));
      items.push(...ringFill(1, 2.3, 0, 1.3, 0.7, SOFT_A));
      items.push(circle(1, 2.3, 0, 1.3), circle(1, 2.3, 0, 0.7));
      items.push(text(1, 2.3, 1.55, '外 26 m / 内 14 m'));
      items.push(text(2, 0, -2.15, '相差 376.8 m²', { color: '#12a375' }));
      return items;
    },
  },

  {
    id: 13,
    title: '半径增加 2 m',
    prompt: '一个圆的周长是 62.8 m，半径增加 2 m 后，面积增加多少？',
    steps: [
      {
        title: '先求原来的半径',
        detail: 'r = 62.8 ÷ 3.14 ÷ 2 = 10（m）。',
      },
      {
        title: '半径变成 12 m',
        detail: '增加后的半径 = 10 + 2 = 12（m）。',
      },
      {
        title: '面积增加了多少',
        detail: '3.14 × 12² − 3.14 × 10² = 452.16 − 314 = <b>138.16</b>（m²）。',
      },
    ],
    answer: '面积增加 138.16 m²。',
    build() {
      return [
        circle(0, 0, 0, 1.0),
        point(0, 0, 0),
        text(0, 0, 1.0 + 0.38, 'r = 10 m', { color: MUTED }),
        circle(1, 0, 0, 1.2, { color: AXIS }),
        line(1, [
          { x: 0, y: 0 },
          { x: 1.2, y: 0 },
        ], { color: AXIS }),
        text(1, 0.6, 0.28, '12 m', { color: AXIS }),
        text(2, 0, -1.85, '增加 3.14 × (12² − 10²) = 138.16 m²', { color: '#12a375' }),
      ];
    },
  },

  {
    id: 14,
    title: '两块半圆形草坪',
    prompt: '如右图，公园有两块半圆形的草坪，它们的周长都是 128.5 m，这两块草坪的总面积是多少？',
    steps: [
      {
        title: '半圆的周长 = 半个圆弧 + 一条直径',
        detail: '128.5 = 3.14r + 2r = 5.14r，所以 r = 128.5 ÷ 5.14 = 25（m）。',
      },
      {
        title: '两块半圆 = 一个整圆',
        detail: 'S = 3.14 × 25² = 3.14 × 625 = <b>1962.5</b>（m²）。',
      },
    ],
    answer: '这两块草坪的总面积是 1962.5 m²。',
    build() {
      const r = 1.5;
      return [
        arc(0, -r, 0, r, -Math.PI / 2, Math.PI),
        line(0, [
          { x: -r, y: 0 },
          { x: -r, y: -r },
        ]),
        arc(1, r, 0, r, Math.PI / 2, Math.PI),
        line(1, [
          { x: r, y: 0 },
          { x: r, y: -r },
        ]),
        text(0, -r, 0.45, '半圆周长 128.5 m'),
        text(1, r, 0.45, '半圆周长 128.5 m'),
        text(1, 0, -r - 0.5, 'r = 25 m，总面积 1962.5 m²', { color: '#12a375' }),
      ];
    },
  },

  {
    id: 15,
    title: '正方形里最大的圆',
    prompt: `下表中的圆是从正方形中画出的最大的圆，请根据它们的关系完成下表。
      <table class="data-table" style="margin-top:8px">
        <tr><th>正方形的边长</th><th>1 cm</th><th>2 cm</th><th>3 cm</th><th>4 cm</th></tr>
        <tr><td>正方形的面积</td><td><span class="blank">?</span></td><td><span class="blank">?</span></td><td><span class="blank">?</span></td><td><span class="blank">?</span></td></tr>
        <tr><td>圆的面积</td><td><span class="blank">?</span></td><td><span class="blank">?</span></td><td><span class="blank">?</span></td><td><span class="blank">?</span></td></tr>
        <tr><td>正方形和圆的面积之比</td><td colspan="4"><span class="blank">?</span></td></tr>
      </table>`,
    steps: [
      {
        title: '圆和正方形的关系',
        detail: '正方形里最大的圆与四条边相切，所以圆的直径 = 正方形的边长，半径 = 边长 ÷ 2。',
      },
      {
        title: '逐列算一算',
        detail: '边长 1：1 与 3.14 × 0.5² = 0.785；边长 2：4 与 3.14；边长 3：9 与 7.065；边长 4：16 与 12.56。',
      },
      {
        title: '算面积之比',
        detail: '每一列都是 1 : 0.785 = 4 : 3.14，也就是 <b>200 : 157</b>，比值不变。',
      },
      {
        title: '你发现了什么',
        detail: '不管边长是多少，正方形与内切圆的面积之比始终是 4 : π。',
      },
    ],
    answer:
      '边长 1：正方形 1、圆 0.785；边长 2：4、3.14；边长 3：9、7.065；边长 4：16、12.56。面积之比始终是 4 : π ≈ 200 : 157。',
    build() {
      const half = 1.5;
      return [
        line(0, [
          { x: -half, y: -half },
          { x: half, y: -half },
          { x: half, y: half },
          { x: -half, y: half },
        ], { closed: true }),
        text(0, 0, -half - 0.4, '边长 a'),
        circle(1, 0, 0, half),
        point(1, 0, 0),
        line(1, [
          { x: 0, y: 0 },
          { x: half, y: 0 },
        ], { color: AXIS }),
        text(1, half * 0.5, 0.28, 'r = a/2', { color: AXIS }),
        text(3, 0, half + 0.6, '正方形 : 圆 = 4 : π', { color: '#12a375' }),
      ];
    },
  },

  {
    id: 16,
    title: '两个半圆叠拼（思考题）',
    prompt:
      '右图是由两个相同的半圆叠拼而成的。已知三角形 ABC 是一个等腰直角三角形，AB = BC = 10 dm。图中涂色部分的面积是多少平方分米？',
    steps: [
      {
        title: '看清两个半圆',
        detail: '一个以 AB 为直径、一个以 BC 为直径，直径都是 10 dm，半径都是 5 dm，它们的面积都是 3.14 × 5² ÷ 2 = 39.25 dm²。',
      },
      {
        title: '用“割补”的眼光看',
        detail: '两个半圆叠在一起，中间重叠的部分（白色）被算了两次。把两块涂色的部分拼起来看，正好能拼成和三角形 ABC 一样大小的图形。',
      },
      {
        title: '所以只要求三角形面积',
        detail: 'S = 10 × 10 ÷ 2 = <b>50</b>（dm²）。（可以用计算器验证：两个半圆共 78.5 dm²，重叠部分 14.25 dm²，涂色 = 78.5 − 2×14.25 = 50 dm²。）',
      },
    ],
    answer: '涂色部分的面积是 50 dm²。',
    build() {
      const s = 1.3;
      const A = { x: -0.65, y: 0.65 };
      const B = { x: -0.65, y: -0.65 };
      const C = { x: 0.65, y: -0.65 };
      const D = { x: 0, y: 0 };

      // 涂色区域 1：AB 半圆里除重叠外的部分
      const regionA = [
        ...arcPts(A.x, 0, s / 2, Math.PI / 2, 0),
        ...arcPts(0, C.y, s / 2, Math.PI / 2, Math.PI),
      ];
      // 涂色区域 2：BC 半圆里除重叠外的部分
      const regionB = [
        ...arcPts(0, C.y, s / 2, 0, Math.PI / 2),
        ...arcPts(A.x, 0, s / 2, 0, -Math.PI / 2),
      ];

      return [
        region(0, regionA, { color: SOFT_B, opacity: 0.95 }),
        region(0, regionB, { color: SOFT_B, opacity: 0.95 }),
        line(0, [A, B, C], { closed: true }),
        arc(1, A.x, 0, s / 2, -Math.PI / 2, Math.PI),
        arc(1, 0, C.y, s / 2, 0, Math.PI),
        point(1, D.x, D.y),
        text(1, A.x - 0.18, A.y + 0.12, 'A', { color: MUTED }),
        text(1, B.x - 0.18, B.y - 0.2, 'B', { color: MUTED }),
        text(1, C.x + 0.14, C.y - 0.2, 'C', { color: MUTED }),
        text(1, D.x + 0.16, D.y + 0.14, 'D', { color: MUTED }),
        text(2, 0, A.y + 0.5, '涂色面积 = 10 × 10 ÷ 2 = 50 dm²', { color: '#12a375' }),
      ];
    },
  },

  {
    id: 17,
    title: '狗的活动区域（思考题）',
    prompt:
      '有一栋底面呈长方形的建筑物（如下图），墙角有一根木桩，木桩上拴着一条狗。拴狗的绳子长 4 m，这条狗活动区域的面积有多大？',
    steps: [
      {
        title: '绳子被墙角挡住了一部分',
        detail: '木桩在墙角，墙挡住了四分之一的方向。绳子只有 3/4 圈可以扫到。',
      },
      {
        title: '为什么只算 3/4 个圆',
        detail: '绳子长 4 m，比房子的 6 m、12 m 都短，所以狗绕不过墙角，活动区域就是一个半径 4 m 的 3/4 圆。',
      },
      {
        title: '算面积',
        detail: 'S = 3.14 × 4² × 3/4 = 50.24 × 0.75 = <b>37.68</b>（m²）。',
      },
    ],
    answer: '这条狗活动区域的面积是 37.68 m²。',
    build() {
      const w = 1.5;
      const h = 0.75;
      const r = 0.55;
      const cx = -w / 2;
      const cy = -h / 2;
      return [
        disk(0, cx, cy, r, Math.PI / 2, (Math.PI * 3) / 2, { color: SOFT_A, opacity: 0.75 }),
        arc(0, cx, cy, r, Math.PI / 2, (Math.PI * 3) / 2, { color: AXIS }),
        line(0, [
          { x: -w / 2, y: -h / 2 },
          { x: w / 2, y: -h / 2 },
          { x: w / 2, y: h / 2 },
          { x: -w / 2, y: h / 2 },
        ], { closed: true }),
        text(0, 0, h / 2 + 0.35, '房子 12 m × 6 m'),
        point(0, cx, cy),
        text(1, cx - r - 1.0, cy, '3/4 个半径 4 m 的圆', { color: AXIS }),
        text(2, 0.1, cy - 1.5, '3.14 × 4² × 3/4 = 37.68 m²', { color: '#12a375' }),
      ];
    },
  },

  {
    id: 18,
    title: '怎样围面积最大（思考题）',
    prompt: `（1）一根绳子长 31.4 m，用这根绳子在操场上围出一块地。怎样围面积最大？请你画一画，算一算。
      <span class="sub">（2）为什么草原上蒙古包的底面是圆形的？为什么绝大多数植物的根和茎的横截面是圆形的？</span>`,
    steps: [
      {
        title: '围成正方形试试',
        detail: '周长 31.4 m，边长 = 31.4 ÷ 4 = 7.85 m，面积 = 7.85² ≈ 61.62（m²）。',
      },
      {
        title: '围成圆',
        detail: 'r = 31.4 ÷ 3.14 ÷ 2 = 5 m，面积 = 3.14 × 25 = <b>78.5</b>（m²）。',
      },
      {
        title: '结论：周长一样时，圆的面积最大',
        detail: '78.5 > 61.62。所以围成圆面积最大。',
      },
      {
        title: '为什么生活里到处是圆',
        detail: '周长（用料）相同时圆面积最大，能装得更多；而且圆的受力均匀、不容易被风吹倒、不容易被挤坏，所以蒙古包、树干、茎的横截面都是圆。',
      },
    ],
    answer:
      '围成圆面积最大：31.4 ÷ 3.14 ÷ 2 = 5 m，S = 3.14 × 5² = 78.5 m²（正方形只有约 61.62 m²）。周长相等时圆面积最大，所以很多物体做成圆形。',
    build() {
      const r = 1.4;
      const side = 1.25;
      return [
        line(0, [
          { x: -r - 1.7 - side, y: -side / 2 },
          { x: -r - 1.7, y: -side / 2 },
          { x: -r - 1.7, y: side / 2 },
          { x: -r - 1.7 - side, y: side / 2 },
        ], { closed: true }),
        text(0, -r - 1.7 - side / 2, -side / 2 - 0.4, '正方形 ≈ 61.62 m²'),
        disk(1, 1.7, 0, r, 0, Math.PI * 2, { color: SOFT_A, opacity: 0.8 }),
        circle(1, 1.7, 0, r),
        text(1, 1.7, -r - 0.4, '圆 78.5 m²', { color: '#12a375' }),
        text(2, 0, r + 0.7, '周长都是 31.4 m，圆的面积更大', { color: AXIS }),
      ];
    },
  },
];

export default createExerciseLesson({ title: '练习十五', unit: '圆', questions: QUESTIONS });
