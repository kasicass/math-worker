/**
 * 六上 · 分数除法：练习七（课本 PDF 第 38 页 / 印刷页 33 的 7 道题）。
 * 分数除以整数、分数除以分数、以及"包含几个几"的实际问题。
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

/** 一条平均分成 divisions 份、前 shaded 份涂色的长条 */
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
    title: '根据乘法写除法',
    prompt: `根据乘法算式写出两道除法算式。
      <span class="sub">3/4 × 5 = 15/4　　→　（　）÷（　）=（　）　（　）÷（　）=（　）</span>
      <span class="sub">3/7 × 2/5 = 6/35　→　（　）÷（　）=（　）　（　）÷（　）=（　）</span>`,
    steps: [
      {
        title: '用“积 ÷ 一个因数 = 另一个因数”',
        detail: '乘法里的两个因数就是除法里的除数和商，所以一个乘法能写出两道除法。',
      },
      {
        title: '第一组',
        detail: '15/4 ÷ 5 = 3/4；15/4 ÷ 3/4 = 5。',
      },
      {
        title: '第二组',
        detail: '6/35 ÷ 2/5 = 3/7；6/35 ÷ 3/7 = 2/5。',
      },
    ],
    answer:
      '15/4 ÷ 5 = 3/4，15/4 ÷ 3/4 = 5；6/35 ÷ 2/5 = 3/7，6/35 ÷ 3/7 = 2/5。',
    build: () => [],
  },

  {
    id: 2,
    title: '剪丝带',
    prompt: '小芳将长 4/5 m 的丝带剪成同样长的 8 段，每段丝带有多长？',
    steps: [
      {
        title: '平均分成 8 份',
        detail: '4/5 ÷ 8，就是求 4/5 的 1/8。',
      },
      {
        title: '计算',
        detail: '4/5 ÷ 8 = 4/5 × 1/8 = 1/10（m）。',
      },
    ],
    answer: '每段丝带长 1/10 m。',
    build() {
      return [
        ...bar(0, -2.6, 0.4, 4.0, 0.7, 5, 4),
        text(0, 0, 1.4, '4/5 m'),
        ...bar(1, -2.6, -1.0, 4.0, 0.7, 40, 5, '#ffdca8'),
        text(1, 0, -1.6, '平均分成 8 段，每段 4/5 ÷ 8 = 1/10 m', { color: AXIS }),
      ];
    },
  },

  {
    id: 3,
    title: '填一填',
    prompt: `填一填（都是除以 3）。
      <table class="data-table" style="margin-top:8px">
        <tr><th>3/5</th><th>6/7</th><th>9/8</th></tr>
        <tr><td><span class="blank">?</span></td><td><span class="blank">?</span></td><td><span class="blank">?</span></td></tr>
      </table>
      <table class="data-table" style="margin-top:8px">
        <tr><th>4/5</th><th>5/7</th><th>8/9</th></tr>
        <tr><td><span class="blank">?</span></td><td><span class="blank">?</span></td><td><span class="blank">?</span></td></tr>
      </table>`,
    steps: [
      {
        title: '除以 3 就是乘 1/3',
        detail: '分母乘 3、分子不变即可（能约分的要约分）。',
      },
      {
        title: '第一行',
        detail: '3/5 ÷ 3 = 1/5；6/7 ÷ 3 = 2/7；9/8 ÷ 3 = 3/8。',
      },
      {
        title: '第二行',
        detail: '4/5 ÷ 3 = 4/15；5/7 ÷ 3 = 5/21；8/9 ÷ 3 = 8/27。',
      },
    ],
    answer: '1/5、2/7、3/8；4/15、5/21、8/27',
    build: () => [],
  },

  {
    id: 4,
    title: '计算',
    prompt: `计算下面各题。
      <span class="sub">1/4 ÷ 3/5　　4/5 ÷ 8/15　　1/3 ÷ 3/4　　5/14 ÷ 10/21</span>
      <span class="sub">2/3 ÷ 14/15　　2/7 ÷ 16/35　　8/27 ÷ 2/9　　4/15 ÷ 28/45</span>`,
    steps: [
      {
        title: '第一行',
        detail: '1/4 ÷ 3/5 = 1/4 × 5/3 = 5/12；4/5 ÷ 8/15 = 4/5 × 15/8 = 3/2；1/3 ÷ 3/4 = 4/9；5/14 ÷ 10/21 = 5/14 × 21/10 = 3/4。',
      },
      {
        title: '第二行',
        detail: '2/3 ÷ 14/15 = 2/3 × 15/14 = 5/7；2/7 ÷ 16/35 = 2/7 × 35/16 = 5/8；8/27 ÷ 2/9 = 8/27 × 9/2 = 4/3；4/15 ÷ 28/45 = 4/15 × 45/28 = 3/7。',
      },
      {
        title: '习惯做法',
        detail: '先把除号变乘号、除数变倒数，再约分，最后化成最简分数。',
      },
    ],
    answer: '5/12、3/2、4/9、3/4；5/7、5/8、4/3、3/7',
    build: () => [],
  },

  {
    id: 5,
    title: '能装几瓶',
    prompt: '把 3/4 L 橙汁分装在容量是 1/4 L 的小瓶里，可以装满几瓶？',
    steps: [
      {
        title: '看 3/4 里有几个 1/4',
        detail: '3/4 ÷ 1/4 = 3/4 × 4 = 3（瓶）。',
      },
      {
        title: '也可以这样想',
        detail: '3/4 L 就是 3 个 1/4 L，每瓶装 1 个 1/4 L，正好装 3 瓶。',
      },
    ],
    answer: '可以装满 3 瓶。',
    build() {
      const items = [];
      for (let i = 0; i < 3; i += 1) {
        items.push(...bar(1, -2.6 + i * 1.9, 0.2, 1.4, 0.9, 4, 1, SOFT_B));
      }
      items.push(text(0, 0, 1.6, '每瓶 1/4 L，装满 3 瓶'));
      items.push(text(1, 0, -0.9, '3/4 ÷ 1/4 = 3 瓶', { color: AXIS }));
      return items;
    },
  },

  {
    id: 6,
    title: '检测多少瓶子',
    prompt:
      '某饮料厂使用一种自动检测仪检测饮料瓶是否有缺陷，检测一个瓶子所用的时间为 1/25 秒。1 分钟可以检测多少个瓶子？',
    steps: [
      {
        title: '先把 1 分钟化成秒',
        detail: '1 分钟 = 60 秒。',
      },
      {
        title: '看 60 秒里有几个 1/25 秒',
        detail: '60 ÷ 1/25 = 60 × 25 = <b>1500</b>（个）。',
      },
    ],
    answer: '1 分钟可以检测 1500 个瓶子。',
    build: () => [],
  },

  {
    id: 7,
    title: '电影胶片',
    prompt:
      '我们平时看到的电影画面实际上是由许多连续拍摄的照片以每 1/24 秒一张的速度连续播放的。请你算一算：半秒可以播放多少张照片？1 分钟呢？',
    steps: [
      {
        title: '半秒',
        detail: '1/2 ÷ 1/24 = 1/2 × 24 = <b>12</b>（张）。',
      },
      {
        title: '1 分钟',
        detail: '60 ÷ 1/24 = 60 × 24 = <b>1440</b>（张）。',
      },
      {
        title: '想一想为什么',
        detail: '每张占 1/24 秒，所以 1 秒能放 24 张，1 分钟就是 24 × 60 = 1440 张。',
      },
    ],
    answer: '半秒播放 12 张，1 分钟播放 1440 张。',
    build: () => [],
  },
];

export default createExerciseLesson({ title: '练习七', unit: '分数除法', questions: QUESTIONS });
