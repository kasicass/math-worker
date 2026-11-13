/**
 * 六上 · 分数乘法：练习一（课本 PDF 第 11 页 / 印刷页 6 的 7 道题）。
 *
 * 引擎见 core/exercise-player.js。
 */
import {
  AXIS,
  MUTED,
  SOFT_A,
  SOFT_B,
  createExerciseLesson,
  line,
  region,
  text,
} from '../core/exercise-player.js';

/** 画一条被平均分成的长条，前面 shaded 份涂色 */
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

const QUESTIONS = [
  {
    id: 1,
    title: '加法改成乘法',
    prompt: `填空。　（1）3/4 + 3/4 + 3/4 + 3/4 = （　）×（　）= （　）　　（2）5/8 + 5/8 + 5/8 = （　）×（　）= （　）`,
    steps: [
      {
        title: '看有几个相同的加数',
        detail: '（1）是 4 个 3/4 相加，可以写成 3/4 × 4；（2）是 3 个 5/8 相加，写成 5/8 × 3。',
      },
      {
        title: '算（1）',
        detail: '3/4 × 4 = (3 × 4)/4 = 12/4 = <b>3</b>。也可以这样想：4 个 3/4 就是 3 个“1”。',
      },
      {
        title: '算（2）',
        detail: '5/8 × 3 = 15/8 = <b>1 又 7/8</b>。',
      },
    ],
    answer: '（1）3/4 × 4 = 3　（2）5/8 × 3 = 15/8 = 1 又 7/8',
    build() {
      const items = [];
      items.push(...bar(0, -3.2, 1.6, 2.0, 0.5, 4, 3));
      items.push(...bar(0, -3.2, 0.85, 2.0, 0.5, 4, 3));
      items.push(...bar(0, -3.2, 0.1, 2.0, 0.5, 4, 3));
      items.push(...bar(0, -3.2, -0.65, 2.0, 0.5, 4, 3));
      items.push(text(0, -2.2, -0.95, '4 个 3/4 = 3/4 × 4'));

      items.push(...bar(1, 0.6, 1.6, 2.0, 0.5, 8, 5, SOFT_B));
      items.push(...bar(1, 0.6, 0.85, 2.0, 0.5, 8, 5, SOFT_B));
      items.push(...bar(1, 0.6, 0.1, 2.0, 0.5, 8, 5, SOFT_B));
      items.push(text(1, 1.6, -0.95, '3 个 5/8 = 5/8 × 3'));
      return items;
    },
  },

  {
    id: 2,
    title: '洗衣粉要放几勺',
    prompt: '用洗衣机洗衣服，洗 1 kg 衣物要用 1/2 勺洗衣粉。洗衣机里大约有 5 kg 衣物，一共需要放几勺洗衣粉？',
    steps: [
      {
        title: '求 5 个 1/2 勺',
        detail: '1 kg 用 1/2 勺，5 kg 就是 5 个 1/2 勺：1/2 × 5。',
      },
      {
        title: '计算',
        detail: '1/2 × 5 = 5/2 = <b>2.5 勺</b>（也就是 2 又 1/2 勺）。',
      },
    ],
    answer: '一共需要放 2.5 勺（2 又 1/2 勺）洗衣粉。',
    build() {
      const items = [];
      for (let i = 0; i < 5; i += 1) {
        items.push(...bar(0, -3.0 + i * 1.2, -0.3, 1.0, 1.2, 2, 1, SOFT_A));
      }
      items.push(text(0, 0, -0.9, '5 个 1/2 勺 = 1/2 × 5 = 2.5 勺'));
      return items;
    },
  },

  {
    id: 3,
    title: '高原每年升高多少',
    prompt:
      '大约在一万年前，青藏高原平均每年上升约 7/100 m。按照这个速度，在那个时期，青藏高原 50 年能上升多少米？100 年呢？',
    steps: [
      {
        title: '50 年：7/100 × 50',
        detail: '7/100 × 50 = 350/100 = <b>3.5</b>（m）。',
      },
      {
        title: '100 年：7/100 × 100',
        detail: '7/100 × 100 = <b>7</b>（m）。',
      },
      {
        title: '看得出规律',
        detail: '乘 100 就是把分母 100 约掉，答案正好是分子 7。',
      },
    ],
    answer: '50 年上升 3.5 m，100 年上升 7 m。',
    build() {
      const items = [];
      items.push(...bar(0, -2.4, -0.4, 4.0, 0.9, 100, 7, SOFT_B));
      items.push(text(0, 0, 0.9, '每年 7/100 m'));
      items.push(text(1, 0, -1.0, '50 年：7/100 × 50 = 3.5 m', { color: AXIS }));
      items.push(text(2, 0, -1.6, '100 年：7/100 × 100 = 7 m', { color: '#12a375' }));
      return items;
    },
  },

  {
    id: 4,
    title: '求一个数的几分之几',
    prompt: '（1）1/4 t 的 3/5 是多少吨？　（2）3/8 m 的 3/4 是多少米？',
    steps: [
      {
        title: '“求一个数的几分之几”就用乘法',
        detail: '1/4 的 3/5，就是 1/4 × 3/5。',
      },
      {
        title: '（1）计算',
        detail: '1/4 × 3/5 = 3/20（t）。',
      },
      {
        title: '（2）计算',
        detail: '3/8 × 3/4 = 9/32（m）。可以看看能不能约分——9 和 32 只有公因数 1，已经最简。',
      },
    ],
    answer: '（1）3/20 t　（2）9/32 m',
    build() {
      const items = [];
      // (1) 1/4 的 3/5
      items.push(...bar(0, -2.6, 1.5, 3.0, 0.6, 4, 1));
      items.push(text(0, -2.6, 1.05, '1/4 t', { color: MUTED }));
      items.push(...bar(0, -2.6, 0.15, 3.0, 0.6, 5, 3, SOFT_B));
      items.push(text(0, -2.6, -0.3, '取其中的 3/5', { color: MUTED }));
      items.push(text(1, -2.6, -1.05, '1/4 × 3/5 = 3/20 t', { color: AXIS }));

      // (2) 3/8 的 3/4
      items.push(...bar(2, -2.6, -1.85, 3.0, 0.6, 8, 3));
      items.push(...bar(2, -2.6, -2.75, 3.0, 0.6, 4, 3, SOFT_B));
      items.push(text(2, 1.2, -3.35, '3/8 × 3/4 = 9/32 m', { color: '#12a375' }));
      return items;
    },
  },

  {
    id: 5,
    title: '农药用量',
    prompt: '取某种农药 3/2 kg，加水稀释后可喷洒 1 公顷的菜地。喷洒 1/5 公顷菜地需要多少千克农药？',
    steps: [
      {
        title: '把“1 公顷”看成一个整体',
        detail: '1 公顷用 3/2 kg，1/5 公顷就是 3/2 kg 的 1/5。',
      },
      {
        title: '计算',
        detail: '3/2 × 1/5 = 3/10（kg）。',
      },
    ],
    answer: '需要 3/10 kg 农药。',
    build() {
      return [
        ...bar(0, -2.4, -0.4, 3.6, 1.0, 5, 1, SOFT_B),
        text(0, 0, 0.9, '1 公顷用 3/2 kg，取其中的 1/5'),
        text(1, 0, -1.1, '3/2 × 1/5 = 3/10 kg', { color: '#12a375' }),
      ];
    },
  },

  {
    id: 6,
    title: '判断并改正',
    prompt: '下面各题算得对吗？把不对的改正过来。　4 × 4/7 = 4 × (1/4) × (1/7) = 1/7　　7/10 × 6/5 = (7/10) × (6/5) = 10/10 = 1',
    steps: [
      {
        title: '4 × 4/7 错在哪',
        detail: '把 4 和分母 4 约掉是对的，但分子 4 还要保留：4 × 4/7 = (4 × 4)/7 = 16/7 = 2 又 2/7。',
      },
      {
        title: '7/10 × 6/5 错在哪',
        detail: '约分时把两个分母相乘当成了分母：应是 (7 × 6)/(10 × 5)，先约分 6 和 10（同时除以 2）→ 7/10 × 6/5 = 21/25。',
      },
    ],
    answer: '4 × 4/7 = 16/7 = 2 又 2/7；7/10 × 6/5 = 21/25。',
    build: () => [],
  },

  {
    id: 7,
    title: '计算',
    prompt: `计算下面各题。
      <span class="sub">2/9 × 3/5　　6/7 × 7/9　　5/8 × 4/15　　9/20 × 5/21</span>
      <span class="sub">6/5 × 5/3　　7/25 × 15/14　　3/11 × 1/2　　19/50 × 10/19</span>`,
    steps: [
      {
        title: '第一行',
        detail: '2/9 × 3/5 = 2/15；6/7 × 7/9 = 2/3；5/8 × 4/15 = 1/6；9/20 × 5/21 = 3/28。',
      },
      {
        title: '第二行',
        detail: '6/5 × 5/3 = 2；7/25 × 15/14 = 3/10；3/11 × 1/2 = 3/22；19/50 × 10/19 = 1/5。',
      },
      {
        title: '技巧：先约分再乘',
        detail: '把能约分的数先约掉，数字小、不容易算错；最后结果要是最简分数。',
      },
    ],
    answer:
      '2/15、2/3、1/6、3/28；2、3/10、3/22、1/5',
    build: () => [],
  },
];

export default createExerciseLesson({ title: '练习一', unit: '分数乘法', questions: QUESTIONS });
