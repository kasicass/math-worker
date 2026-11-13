/**
 * 六上 · 分数乘法：练习二（课本 PDF 第 15 页 / 印刷页 10 的 7 道题）。
 *
 * 小数乘分数、混合运算、运算律的简便计算。
 * 引擎见 core/exercise-player.js。
 */
import {
  AXIS,
  MUTED,
  SOFT_A,
  createExerciseLesson,
  line,
  region,
  text,
} from '../core/exercise-player.js';

const QUESTIONS = [
  {
    id: 1,
    title: '计算',
    prompt: `计算下面各题。
      <span class="sub">27/50 × 2　　11/28 × 8/33　　20/39 × 7.8</span>
      <span class="sub">7/18 × 0.36　　5/54 × 6　　9/16 × 0.3</span>`,
    steps: [
      {
        title: '第一行',
        detail: '27/50 × 2 = 27/25 = 1 又 2/25；11/28 × 8/33 先约分 = 2/21；20/39 × 7.8 = 20/39 × 39/5 = 4。',
      },
      {
        title: '小数先化成分数更好算',
        detail: '7.8 = 39/5，0.36 = 9/25，0.3 = 3/10。分母是 18 时也可以直接除：0.36 ÷ 18 = 0.02。',
      },
      {
        title: '第二行',
        detail: '7/18 × 0.36 = 7/50（= 0.14）；5/54 × 6 = 5/9；9/16 × 0.3 = 27/160（= 0.16875）。',
      },
    ],
    answer: '27/25、2/21、4；7/50、5/9、27/160',
    build: () => [],
  },

  {
    id: 2,
    title: '2020 年的人均 GDP',
    prompt:
      '2021 年我国人均国内生产总值约为 8.1 万元。2020 年我国人均国内生产总值约为 2021 年的 8/9。2020 年我国人均国内生产总值约为多少万元？',
    steps: [
      {
        title: '把 2021 年的看作单位“1”',
        detail: '2020 年是 2021 年的 8/9，就是求 8.1 万元的 8/9。',
      },
      {
        title: '计算',
        detail: '8.1 × 8/9 = 0.9 × 8 = <b>7.2</b>（万元）。先把 8.1 和分母 9 约分更省力。',
      },
    ],
    answer: '2020 年约为 7.2 万元。',
    build() {
      return [
        ...bar(0, -2.6, 0.4, 3.6, 0.9, 9, 9, SOFT_A),
        ...bar(1, -2.6, -0.8, 3.6, 0.9, 9, 8, '#ffc24d'),
        text(0, 0, 1.6, '2021 年：8.1 万元'),
        text(1, 0, -1.5, '2020 年：8.1 × 8/9 = 7.2 万元', { color: AXIS }),
      ];
    },
  },

  {
    id: 3,
    title: '帝企鹅有多高',
    prompt: '鸵鸟是目前世界上最大的鸟。一只鸵鸟的身高是 2.5 m，一只成年帝企鹅身高是鸵鸟的 12/25。这只成年帝企鹅的身高是多少米？',
    steps: [
      {
        title: '求 2.5 m 的 12/25',
        detail: '2.5 × 12/25，先把 2.5 和 25 约分：2.5 ÷ 25 = 0.1。',
      },
      {
        title: '计算',
        detail: '2.5 × 12/25 = 0.1 × 12 = <b>1.2</b>（m）。',
      },
    ],
    answer: '这只成年帝企鹅的身高是 1.2 m。',
    build() {
      return [
        ...bar(0, -2.4, 0.5, 3.2, 0.8, 25, 25, SOFT_A),
        ...bar(1, -2.4, -0.7, 3.2, 0.8, 25, 12, '#ffc24d'),
        text(0, 0, 1.6, '鸵鸟 2.5 m'),
        text(1, 0, -1.4, '帝企鹅 = 2.5 × 12/25 = 1.2 m', { color: AXIS }),
      ];
    },
  },

  {
    id: 4,
    title: '蜂蜜里的糖',
    prompt:
      '蜂蜜最主要的成分是果糖和葡萄糖，果糖和葡萄糖的质量占蜂蜜总质量的 3/5 以上。有一种蜂蜜，果糖和葡萄糖的质量占蜂蜜总质量的 4/5。有 2.5 kg 这种蜂蜜，其中果糖和葡萄糖共有多少千克？',
    steps: [
      {
        title: '求 2.5 kg 的 4/5',
        detail: '2.5 × 4/5 = 0.5 × 4 = <b>2</b>（kg）。',
      },
      {
        title: '想一想 3/5 那句话',
        detail: '题里的 3/5 是“一般情况”的说明，这道题要用的是这种蜂蜜的 4/5，别拿错数据。',
      },
    ],
    answer: '其中果糖和葡萄糖共有 2 kg。',
    build() {
      return [
        ...bar(0, -2.4, 0.2, 3.2, 1.0, 5, 4, '#ffc24d'),
        text(0, 0, 1.4, '2.5 kg 的蜂蜜，其中 4/5 是果糖和葡萄糖'),
        text(1, 0, -1.1, '2.5 × 4/5 = 2 kg', { color: AXIS }),
      ];
    },
  },

  {
    id: 5,
    title: '判断并改正',
    prompt:
      '下面各题算得对吗？把不对的改正过来。　5 − 3 × 7/9 = 2 × 7/9 = 14/9　　4/11 + 2/11 × 11/6 = 6/11 × 11/6 = 1',
    steps: [
      {
        title: '第一题错在运算顺序',
        detail: '应该先算乘法：5 − 3 × 7/9 = 5 − 7/3 = 15/3 − 7/3 = 8/3 = 2 又 2/3。',
      },
      {
        title: '第二题也错在运算顺序',
        detail: '4/11 + 2/11 × 11/6 = 4/11 + 1/3 = 12/33 + 11/33 = 23/33。（不能把两个分母相加）',
      },
    ],
    answer: '5 − 3 × 7/9 = 8/3 = 2 又 2/3；4/11 + 2/11 × 11/6 = 23/33。',
    build: () => [],
  },

  {
    id: 6,
    title: '混合运算',
    prompt: `计算下面各题。
      <span class="sub">1/3 × 3/5 + 1　　5/7 − 5/9 × 5/7　　1 − 5/7 × 21/25</span>
      <span class="sub">1/2 + 5/4 × 4/5　　1/6 × (5 − 2/3)　　7/8 × 7 + 3/8</span>`,
    steps: [
      {
        title: '先乘后加减',
        detail: '1/3 × 3/5 + 1 = 1/5 + 1 = 1 又 1/5；1 − 5/7 × 21/25 = 1 − 3/5 = 2/5；1/2 + 5/4 × 4/5 = 1/2 + 1 = 1 又 1/2。',
      },
      {
        title: '能简便就简便',
        detail: '5/7 − 5/9 × 5/7 = 5/7 × (1 − 5/9) = 5/7 × 4/9 = 20/63；7/8 × 7 + 3/8 = 49/8 + 3/8 = 6 又 1/2。',
      },
      {
        title: '带括号的先算括号',
        detail: '1/6 × (5 − 2/3) = 1/6 × 13/3 = 13/18。',
      },
    ],
    answer:
      '1 又 1/5、20/63、2/5；1 又 1/2、13/18、6 又 1/2',
    build: () => [],
  },

  {
    id: 7,
    title: '求图形的面积',
    prompt: '计算下面两个图形的面积。<span class="sub">左图：三角形，底 3/4 dm，高 4/9 dm。右图：梯形，上底 11/18 m，下底 8/9 m，高 2/3 m。</span>',
    steps: [
      {
        title: '三角形的面积公式',
        detail: 'S = 底 × 高 ÷ 2 = 3/4 × 4/9 ÷ 2 = 1/3 ÷ 2 = <b>1/6</b>（dm²）。',
      },
      {
        title: '梯形的面积公式',
        detail: '上底 + 下底 = 11/18 + 16/18 = 27/18 = 3/2（m）。',
      },
      {
        title: '算梯形面积',
        detail: 'S = (上底 + 下底) × 高 ÷ 2 = 3/2 × 2/3 ÷ 2 = 1 ÷ 2 = <b>1/2</b>（m²）。',
      },
    ],
    answer: '三角形面积 1/6 dm²；梯形面积 1/2 m²。',
    build() {
      const items = [];

      // 三角形：底 3/4、高 4/9（按 1 单位 ≈ 2 世界单位画）
      const b = 3 / 4;
      const h = 4 / 9;
      const s = 2.6;
      const A = { x: -1.2, y: -0.9 };
      const B = { x: -1.2 + b * s, y: -0.9 };
      const C = { x: -1.2 + b * s, y: -0.9 + h * s };
      items.push(
        region(0, [A, B, C], { color: SOFT_A, opacity: 0.9 }),
        line(0, [A, B, C], { closed: true }),
        line(0, [B, C], { color: AXIS, dashed: true }),
        text(0, (A.x + B.x) / 2, A.y - 0.35, '3/4 dm'),
        text(0, B.x + 0.55, (B.y + C.y) / 2, '4/9 dm', { color: AXIS }),
      );

      // 梯形：上底 11/18、下底 8/9、高 2/3
      const top = 11 / 18;
      const bottom = 8 / 9;
      const hh = 2 / 3;
      const cx = 2.6;
      const y0 = -0.9;
      const P1 = { x: cx, y: y0 };
      const P2 = { x: cx + bottom * s, y: y0 };
      const P3 = { x: cx + (bottom + top) / 2 * s, y: y0 + hh * s };
      const P4 = { x: cx + (bottom - top) / 2 * s, y: y0 + hh * s };
      items.push(
        region(1, [P1, P2, P3, P4], { color: '#ffdca8', opacity: 0.95 }),
        line(1, [P1, P2, P3, P4], { closed: true }),
        text(1, cx + bottom * s * 0.55, y0 - 0.35, '8/9 m'),
        text(1, cx + (bottom + top) / 2 * s, y0 + hh * s + 0.28, '11/18 m'),
        text(1, cx + bottom * s + 0.45, y0 + hh * s / 2, '2/3 m', { color: AXIS }),
      );

      items.push(
        text(2, -0.4, -2.1, 'S三角形 = 1/6 dm²，S梯形 = 1/2 m²', { color: '#12a375' }),
      );
      return items;
    },
  },
];

/** 长条：把整体平均分成 divisions 份，取 shaded 份涂色 */
function bar(step, x, y, width, height, divisions, shaded, color = SOFT_A) {
  const items = [];
  const unit = width / divisions;
  if (shaded > 0) {
    items.push(
      region(
        step,
        [
          { x, y },
          { x: x + shaded * unit, y },
          { x: x + shaded * unit, y: y + height },
          { x, y: y + height },
        ],
        { color, opacity: 0.95 },
      ),
    );
  }
  items.push(
    line(
      step,
      [
        { x, y },
        { x: x + width, y },
        { x: x + width, y: y + height },
        { x, y: y + height },
      ],
      { closed: true },
    ),
  );
  for (let i = 1; i < divisions; i += 1) {
    items.push(
      line(step, [
        { x: x + i * unit, y },
        { x: x + i * unit, y: y + height },
      ], { color: MUTED }),
    );
  }
  return items;
}

export default createExerciseLesson({ title: '练习二', unit: '分数乘法', questions: QUESTIONS });
