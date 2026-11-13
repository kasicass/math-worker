/**
 * 六上 · 分数除法：练习六（课本 PDF 第 33 页 / 印刷页 28 的 5 道题）。
 * 主题是「倒数」：互为倒数的两个数、怎么找一个数的倒数、0 和 1 的特殊情况。
 */
import {
  AXIS,
  MUTED,
  createExerciseLesson,
  line,
  point,
  text,
} from '../core/exercise-player.js';

const LEFT = ['3/13', '8', '6/7', '25/26', '100', '59/99'];
const RIGHT = ['1/8', '26/25', '7/6', '99/59', '13/3', '1/100'];
// 每个左项配对右项的下标
const PAIRS = [4, 0, 2, 1, 5, 3];

const QUESTIONS = [
  {
    id: 1,
    title: '把互为倒数的连起来',
    prompt: '将互为倒数的两个数用线连起来。<span class="sub">左列：3/13、8、6/7、25/26、100、59/99　右列：1/8、26/25、7/6、99/59、13/3、1/100</span>',
    steps: [
      {
        title: '先看乘积是不是 1',
        detail: '互为倒数的两个数相乘等于 1，也可以直接看它们的分子、分母是否正好交换了位置。',
      },
      {
        title: '整数也有倒数',
        detail: '8 = 8/1，所以 8 的倒数是 1/8；100 的倒数是 1/100。',
      },
      {
        title: '连线的结果',
        detail: '3/13↔13/3，8↔1/8，6/7↔7/6，25/26↔26/25，100↔1/100，59/99↔99/59。',
      },
    ],
    answer: '3/13↔13/3，8↔1/8，6/7↔7/6，25/26↔26/25，100↔1/100，59/99↔99/59。',
    build() {
      const items = [];
      const top = 2.4;
      const gap = 0.95;
      LEFT.forEach((value, i) => {
        items.push(text(0, -3.2, top - i * gap, value, { color: MUTED, size: 0.4 }));
        items.push(point(0, -2.5, top - i * gap, { r: 0.05, color: MUTED }));
      });
      RIGHT.forEach((value, i) => {
        items.push(text(0, 3.2, top - i * gap, value, { color: MUTED, size: 0.4 }));
        items.push(point(0, 2.2, top - i * gap, { r: 0.05, color: MUTED }));
      });
      PAIRS.forEach((rightIndex, leftIndex) => {
        items.push(
          line(1, [
            { x: -2.5, y: top - leftIndex * gap },
            { x: 2.2, y: top - rightIndex * gap },
          ], { color: AXIS }),
        );
      });
      return items;
    },
  },

  {
    id: 2,
    title: '判断对错',
    prompt: `下面的说法对不对？为什么？
      <span class="sub">（1）7/12 与 12/7 的乘积为 1，所以 7/12 和 12/7 互为倒数。</span>
      <span class="sub">（2）1/2 × 4/3 × 3/2 = 1，所以 1/2、4/3、3/2 互为倒数。</span>
      <span class="sub">（3）0 的倒数还是 0。</span>
      <span class="sub">（4）一个数的倒数一定比这个数小。</span>`,
    steps: [
      {
        title: '（1）√',
        detail: '乘积是 1 的两个数互为倒数，7/12 与 12/7 正好分子分母交换。',
      },
      {
        title: '（2）×',
        detail: '倒数是两个数之间的关系，三个数相乘等于 1 不能说它们“互为倒数”。',
      },
      {
        title: '（3）×',
        detail: '0 乘任何数都得 0，永远凑不出 1，所以 0 没有倒数。',
      },
      {
        title: '（4）×',
        detail: '1/2 的倒数是 2，比它本身大；1 的倒数是 1，和它相等。',
      },
    ],
    answer: '（1）√（2）×（3）×（4）×',
    build: () => [],
  },

  {
    id: 3,
    title: '说出各数的倒数',
    prompt: '说出下面各数的倒数。<span class="sub">1/9、51/62、8/3、5、12/23、102、16/7</span>',
    steps: [
      {
        title: '分数：分子分母交换',
        detail: '1/9 → 9；51/62 → 62/51；8/3 → 3/8；12/23 → 23/12；16/7 → 7/16。',
      },
      {
        title: '整数：写成几分之一',
        detail: '5 = 5/1 → 1/5；102 → 1/102。',
      },
    ],
    answer: '9、62/51、3/8、1/5、23/12、1/102、7/16',
    build() {
      const items = [];
      const values = ['1/9', '51/62', '8/3', '5', '12/23', '102', '16/7'];
      const answers = ['9', '62/51', '3/8', '1/5', '23/12', '1/102', '7/16'];
      values.forEach((value, i) => {
        const row = 2.4 - i * 0.75;
        items.push(text(0, -3.4, row, value, { color: MUTED, size: 0.36 }));
        items.push(line(1, [{ x: -1.4, y: row }, { x: -0.6, y: row }], { color: AXIS }));
        items.push(text(1, 0.6, row, answers[i], { color: AXIS, size: 0.36 }));
      });
      return items;
    },
  },

  {
    id: 4,
    title: '比一比',
    prompt: `先计算出每组算式的结果，再在 ○ 里填上“>”“<”或“=”。
      <span class="sub">1 ÷ 8 = （　）　1 × 1/8 = （　）</span>
      <span class="sub">6 ÷ 2 = （　）　6 × 1/2 = （　）</span>
      <span class="sub">9 ÷ 4 = （　）　9 × 1/4 = （　）</span>`,
    steps: [
      {
        title: '三组都相等',
        detail: '1 ÷ 8 = 1/8，1 × 1/8 = 1/8；6 ÷ 2 = 3，6 × 1/2 = 3；9 ÷ 4 = 9/4，9 × 1/4 = 9/4。所以三组都填“=”。',
      },
      {
        title: '发现了什么',
        detail: '除以一个整数，就等于乘这个整数的倒数。',
      },
    ],
    answer: '三组都相等，都是“=”。规律：a ÷ n = a × 1/n。',
    build: () => [],
  },

  {
    id: 5,
    title: '小兵和小丽谁说得对',
    prompt:
      '小兵说：“因为 4/3 × 0.75 = 1，所以 4/3 的倒数是 0.75。”小丽说：“分数的倒数不可能是小数。”谁说得对？',
    steps: [
      {
        title: '小兵说得对',
        detail: '0.75 = 3/4，而 4/3 × 3/4 = 1，所以 4/3 的倒数确实是 0.75。',
      },
      {
        title: '小丽错在哪',
        detail: '小数和分数只是同一种数的不同写法，0.75 就是 3/4，它当然可以是某个分数的倒数。',
      },
    ],
    answer: '小兵说得对：4/3 的倒数是 0.75（也就是 3/4）。',
    build: () => [],
  },
];

export default createExerciseLesson({ title: '练习六', unit: '分数除法', questions: QUESTIONS });
