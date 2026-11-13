/**
 * 六上 · 圆：练习十七（课本 PDF 第 81–82 页 / 印刷页 76–77 的 9 道题）。
 *
 * 本单元的整理复习：周长、面积、扇形、组合图形都在这里再过一遍。
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
  text,
} from '../core/exercise-player.js';

const QUESTIONS = [
  {
    id: 1,
    title: '“中国天眼”走一圈',
    prompt:
      '“中国天眼”是世界上最大的单口径射电望远镜，其上方的圈梁是一个直径为 500 m 的圆。工程师沿着圈梁走一圈，大约是多少米？',
    steps: [
      {
        title: '走一圈就是求周长',
        detail: '已知直径 d = 500 m，直接用 C = πd。',
      },
      {
        title: '代入计算',
        detail: 'C = 3.14 × 500 = <b>1570</b>（m）。',
      },
    ],
    answer: '沿着圈梁走一圈大约是 1570 m。',
    build() {
      return [
        circle(0, 0, 0, 1.7),
        point(0, 0, 0),
        line(0, [
          { x: -1.7, y: 0 },
          { x: 1.7, y: 0 },
        ], { color: MUTED }),
        text(0, 0, 0.25, 'd = 500 m', { color: MUTED }),
        text(1, 0, -2.05, 'C = 3.14 × 500 = 1570 m', { color: '#12a375' }),
      ];
    },
  },

  {
    id: 2,
    title: '绣品的面积',
    prompt: '右图中的双面绣作品绣在直径是 20 cm 的圆面上。这个圆的面积是多少？',
    steps: [
      {
        title: '先求半径',
        detail: 'r = 20 ÷ 2 = 10（cm）。',
      },
      {
        title: '再求面积',
        detail: 'S = 3.14 × 10² = 3.14 × 100 = <b>314</b>（cm²）。',
      },
    ],
    answer: '这个圆的面积是 314 cm²。',
    build() {
      return [
        disk(0, 0, 0, 1.6, 0, Math.PI * 2, { color: SOFT_B, opacity: 0.9 }),
        circle(0, 0, 0, 1.6),
        point(0, 0, 0),
        line(0, [
          { x: 0, y: 0 },
          { x: 1.6, y: 0 },
        ], { color: AXIS }),
        text(0, 0.85, 0.28, 'r = 10 cm', { color: AXIS }),
        text(0, 0, -1.98, '直径 20 cm'),
      ];
    },
  },

  {
    id: 3,
    title: '能做几个铁环',
    prompt: '用 10 m 长的铁丝做直径是 50 cm 的圆形铁环，最多可以做多少个？',
    steps: [
      {
        title: '一个铁环要多少铁丝',
        detail: '铁环的周长 = 3.14 × 0.5 = 1.57（m）。注意 50 cm = 0.5 m。',
      },
      {
        title: '看 10 m 里有多少个 1.57 m',
        detail: '10 ÷ 1.57 ≈ 6.37，所以最多做 <b>6 个</b>（不能四舍五入成 6.37 个，剩下的 0.58 m 不够做一个）。',
      },
    ],
    answer: '最多可以做 6 个。',
    build() {
      return [
        circle(0, 1.1, 0, 0.7),
        point(0, 1.1, 0),
        line(0, [
          { x: -0.7, y: 1.1 },
          { x: 0.7, y: 1.1 },
        ], { color: AXIS }),
        text(0, 0, 1.35, 'd = 50 cm → 一周 1.57 m', { color: AXIS }),
        line(0, [
          { x: -3.2, y: -0.8 },
          { x: 3.2, y: -0.8 },
        ], { color: MUTED }),
        text(0, 0, -1.2, '铁丝 10 m', { color: MUTED }),
        text(1, 0, -1.85, '10 ÷ 1.57 ≈ 6（个）', { color: '#12a375' }),
      ];
    },
  },

  {
    id: 4,
    title: '栏杆内的占地面积',
    prompt:
      '儿童乐园要修建一个圆形旋转木马游乐设施，圆的直径是 8 m，周边还要留出 1 m 宽的小路，并在外侧围上栏杆。栏杆内的占地面积是多少平方米？',
    steps: [
      {
        title: '先求栏杆围成的半径',
        detail: '木马半径 = 8 ÷ 2 = 4 m，外面还有 1 m 宽小路，所以栏杆半径 = 4 + 1 = 5（m）。',
      },
      {
        title: '算栏杆内的面积',
        detail: 'S = 3.14 × 5² = 3.14 × 25 = <b>78.5</b>（m²）。',
      },
      {
        title: '别只算木马的面积',
        detail: '3.14 × 4² = 50.24 m² 只是木马本身；栏杆内还包含 1 m 宽的小路，所以要用 5 m 来算。',
      },
    ],
    answer: '栏杆内的占地面积是 78.5 m²。',
    build() {
      return [
        disk(0, 0, 0, 1.6, 0, Math.PI * 2, { color: SOFT_A, opacity: 0.75 }),
        disk(0, 0, 0, 1.28, 0, Math.PI * 2, { color: SOFT_B, opacity: 0.95 }),
        circle(0, 0, 0, 1.6, { color: AXIS }),
        circle(0, 0, 0, 1.28),
        point(0, 0, 0),
        line(0, [
          { x: 0, y: 0 },
          { x: 1.28, y: 0 },
        ]),
        line(0, [
          { x: 1.28, y: 0 },
          { x: 1.6, y: 0 },
        ], { color: AXIS }),
        text(0, 0.7, 0.28, 'r = 4 m'),
        text(0, 1.72, 0.28, '1 m', { color: AXIS }),
        text(1, 0, -1.98, 'S = 3.14 × 5² = 78.5 m²', { color: '#12a375' }),
      ];
    },
  },

  {
    id: 5,
    title: '半圆形羊圈',
    prompt: `一个羊圈依墙而建，呈半圆形，半径是 5 m。
      <span class="sub">（1）修这个羊圈需要多长的栅栏？（2）如果要扩建这个羊圈，把它的直径增加 2 m，羊圈的面积增加了多少平方米？</span>`,
    steps: [
      {
        title: '（1）栅栏只围半圆弧',
        detail: '墙那一面不用栅栏，所以只要半圆弧：3.14 × 5 = <b>15.7</b>（m）。',
      },
      {
        title: '（2）直径增加 2 m，半径增加 1 m',
        detail: '新半径 = 5 + 1 = 6 m。',
      },
      {
        title: '（2）面积增加了多少',
        detail: '增加的是半个圆环：3.14 × (6² − 5²) ÷ 2 = 3.14 × 11 ÷ 2 = <b>17.27</b>（m²）。',
      },
    ],
    answer: '（1）需要 15.7 m 栅栏；（2）面积增加 17.27 m²。',
    build() {
      const r = 1.5;
      return [
        disk(0, 0, 0, r, Math.PI, Math.PI, { color: SOFT_B, opacity: 0.95 }),
        arc(0, 0, 0, r, Math.PI, Math.PI, { color: AXIS }),
        line(0, [
          { x: -r - 0.5, y: 0 },
          { x: r + 0.5, y: 0 },
        ], { color: MUTED }),
        text(0, 0, 0.3, '墙', { color: MUTED }),
        text(0, 0, -0.35, 'r = 5 m'),
        arc(1, 0, 0, r * 1.2, Math.PI, Math.PI, { color: '#12a375' }),
        text(1, 0, -r - 0.45, '栅栏 = 3.14 × 5 = 15.7 m', { color: AXIS }),
        text(2, 0, -r - 1.05, '扩建后半径 6 m', { color: '#12a375' }),
        text(2, 0, -r - 1.45, '增加 3.14 × 11 ÷ 2 = 17.27 m²', { color: '#12a375' }),
      ];
    },
  },

  {
    id: 6,
    title: '判断对错',
    prompt: `下面的说法对吗？对的画“√”，错的画“×”。
      <span class="sub">（1）圆周率 π 就是 3.14。</span>
      <span class="sub">（2）圆的半径扩大到原来的 2 倍，周长和面积也扩大到原来的 2 倍。</span>
      <span class="sub">（3）半径相等的两个圆周长相等。</span>
      <span class="sub">（4）两个圆的直径相等，它们的半径也一定相等。</span>
      <span class="sub">（5）用 4 个圆心角都是 90° 的扇形，一定可以拼成一个圆。</span>`,
    steps: [
      {
        title: '（1）×',
        detail: 'π 是无限不循环小数（3.1415926…），3.14 只是它的近似值。',
      },
      {
        title: '（2）×',
        detail: '半径扩大 2 倍，周长也扩大 2 倍；但面积要扩大 2² = 4 倍。',
      },
      {
        title: '（3）√　（4）√',
        detail: '周长只由半径决定，半径相等周长就相等；直径相等，半径自然相等（都是直径的一半）。',
      },
      {
        title: '（5）×',
        detail: '还得看半径一样大：半径不同的 4 个 90° 扇形拼不成一个圆。',
      },
    ],
    answer: '（1）×　（2）×　（3）√　（4）√　（5）×',
    build() {
      const r = 1.1;
      return [
        disk(0, 0, 0, r, 0, Math.PI / 2, { color: SOFT_B, opacity: 0.95 }),
        disk(0, 0, 0, r * 0.7, Math.PI / 2, Math.PI / 2, { color: SOFT_A, opacity: 0.95 }),
        arc(0, 0, 0, r, 0, Math.PI / 2),
        arc(0, 0, 0, r * 0.7, Math.PI / 2, Math.PI / 2),
        line(0, [
          { x: 0, y: 0 },
          { x: r, y: 0 },
        ]),
        line(0, [
          { x: 0, y: 0 },
          { x: 0, y: r },
        ]),
        text(0, r * 0.45, 0.28, '90°', { color: MUTED }),
        text(0, 0, -r - 0.45, '半径不同，拼不成一个圆', { color: AXIS }),
      ];
    },
  },

  {
    id: 7,
    title: '压路机前进多远',
    prompt: '如图，一台压路机的前轮直径是 1.7 m，如果前轮每分钟转动 6 周，压路机 10 分钟前进多远？',
    steps: [
      {
        title: '转一周前进多少',
        detail: '一周 = 前轮的周长 = 3.14 × 1.7 = 5.338（m）。',
      },
      {
        title: '每分钟、10 分钟',
        detail: '每分钟 6 周 → 5.338 × 6 = 32.028 m；10 分钟 → 32.028 × 10 = <b>320.28</b>（m）。',
      },
    ],
    answer: '压路机 10 分钟前进 320.28 m。',
    build() {
      const r = 0.8;
      return [
        circle(0, r + 0.2, r),
        point(0, r + 0.2, r),
        line(0, [
          { x: -3.0, y: 0.2 },
          { x: 3.0, y: 0.2 },
        ], { color: MUTED }),
        text(0, 0, r * 2 + 0.75, '前轮 d = 1.7 m'),
        line(1, [
          { x: -2.6, y: -0.35 },
          { x: 2.6, y: -0.35 },
        ], { color: AXIS }),
        text(1, 0, -0.75, '一周 5.338 m，每分钟 6 周', { color: AXIS }),
        text(1, 0, -1.35, '5.338 × 6 × 10 = 320.28 m', { color: '#12a375' }),
      ];
    },
  },

  {
    id: 8,
    title: '风车图形的面积',
    prompt:
      '如图，一个图形的中间是边长为 1 cm 的正方形，四周是四个圆心角为 90° 的扇形，整个图形的面积是多少？',
    steps: [
      {
        title: '把 4 个扇形合起来看',
        detail: '4 个圆心角都是 90° 的扇形，半径都是 1 cm（等于正方形的边长），合起来正好是一个整圆。',
      },
      {
        title: '圆的面积',
        detail: '3.14 × 1² = 3.14（cm²）。',
      },
      {
        title: '加上中间的正方形',
        detail: '3.14 + 1 × 1 = <b>4.14</b>（cm²）。',
      },
    ],
    answer: '整个图形的面积是 4.14 cm²。',
    build() {
      const s = 1.0;
      const half = s / 2;
      const items = [];
      const blades = [
        { cx: -half, cy: half, start: 0 }, // 上
        { cx: half, cy: half, start: -Math.PI / 2 }, // 右
        { cx: half, cy: -half, start: Math.PI }, // 下
        { cx: -half, cy: -half, start: Math.PI / 2 }, // 左
      ];
      blades.forEach((blade) => {
        items.push(disk(0, blade.cx, blade.cy, s, blade.start, Math.PI / 2, { color: SOFT_B, opacity: 0.95 }));
      });
      items.push(
        line(0, [
          { x: -half, y: -half },
          { x: half, y: -half },
          { x: half, y: half },
          { x: -half, y: half },
        ], { closed: true }),
      );
      blades.forEach((blade) => {
        items.push(arc(1, blade.cx, blade.cy, s, blade.start, Math.PI / 2, { showRadius: false }));
      });
      items.push(text(2, 0, -s - half - 0.55, '1 × 1 + 3.14 × 1² = 4.14 cm²', { color: '#12a375' }));
      return items;
    },
  },

  {
    id: 9,
    title: '跑道跑 5 圈',
    prompt:
      '右图是某学校操场的形状，跑道最内侧边缘由正方形的一组对边和两个半圆组成。小晨沿着跑道最内侧跑了 5 圈，一共是多少米？',
    steps: [
      {
        title: '一圈 = 两条直边 + 一个整圆',
        detail: '正方形边长 50 m，两条直边共 100 m；两个半圆合起来是一个直径 50 m 的圆，周长 3.14 × 50 = 157 m。',
      },
      {
        title: '一圈多少米',
        detail: '100 + 157 = 257（m）。',
      },
      {
        title: '5 圈',
        detail: '257 × 5 = <b>1285</b>（m）。',
      },
    ],
    answer: '一共跑了 1285 m。',
    build() {
      const half = 0.95;
      const r = 0.7;
      return [
        line(0, [
          { x: -half, y: -r },
          { x: half, y: -r },
          { x: half, y: r },
          { x: -half, y: r },
        ], { color: AXIS }),
        arc(0, -half, 0, r, Math.PI / 2, Math.PI, { color: AXIS }),
        arc(0, half, 0, r, -Math.PI / 2, Math.PI, { color: AXIS }),
        line(0, [
          { x: -half, y: -r - 0.3 },
          { x: half, y: -r - 0.3 },
        ], { color: MUTED }),
        text(0, 0, -r - 0.7, '50 m', { color: MUTED }),
        text(1, 0, r + 0.4, '一圈 = 100 + 157 = 257 m', { color: AXIS }),
        text(2, 0, -r - 1.2, '5 圈 = 257 × 5 = 1285 m', { color: '#12a375' }),
      ];
    },
  },
];

export default createExerciseLesson({ title: '练习十七', questions: QUESTIONS });
