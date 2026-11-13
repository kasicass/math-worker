/**
 * 六上 · 数学广角——数与形：练习二十二（课本 PDF 第 112–113 页 / 印刷页 107–108 的 5 道题）。
 *
 * 图里找规律：平方数、三角形数、小三角形个数与周长、追及问题、折线图。
 */
import {
  AXIS,
  MUTED,
  SOFT_A,
  SOFT_B,
  createExerciseLesson,
  line,
  point,
  region,
  text,
} from '../core/exercise-player.js';

/** 画一个 n×n 的小正方形方阵，最外圈用另一色 */
function squareRing(step, cx, cy, cells, cell) {
  const side = cells * cell;
  const left = cx - side / 2;
  const bottom = cy - side / 2;
  const items = [];
  items.push(
    region(
      step,
      [
        { x: left, y: bottom },
        { x: left + side, y: bottom },
        { x: left + side, y: bottom + side },
        { x: left, y: bottom + side },
      ],
      { color: SOFT_B, opacity: 0.95 },
    ),
  );
  if (cells > 2) {
    items.push(
      region(
        step,
        [
          { x: left + cell, y: bottom + cell },
          { x: left + side - cell, y: bottom + cell },
          { x: left + side - cell, y: bottom + side - cell },
          { x: left + cell, y: bottom + side - cell },
        ],
        { color: SOFT_A, opacity: 0.95 },
      ),
    );
  }
  for (let i = 0; i <= cells; i += 1) {
    items.push(
      line(step, [{ x: left + i * cell, y: bottom }, { x: left + i * cell, y: bottom + side }], { color: MUTED }),
      line(step, [{ x: left, y: bottom + i * cell }, { x: left + side, y: bottom + i * cell }], { color: MUTED }),
    );
  }
  return items;
}

const QUESTIONS = [
  {
    id: 1,
    title: '最外圈有多少个',
    prompt: `下面每个图中最外圈各有多少个小正方形？<span class="sub">3² − 1² = 8；5² − 3² = 16；7² − 5² = 24。照这样的规律接着画下去，第 5 个图形最外圈有多少个小正方形？你能解释其中的道理吗？</span>`,
    steps: [
      {
        title: '找边长的规律',
        detail: '三个图的边长分别是 3、5、7，所以第 5 个图的边长是 11，第 4 个是 9。',
      },
      {
        title: '用“大正方形 − 里层正方形”',
        detail: '最外圈 = 11² − 9² = 121 − 81 = <b>40</b>（个）。',
      },
      {
        title: '道理',
        detail: '最外圈有 4 条边，每条 11 个，但 4 个角被算了两次：4 × 11 − 4 = 40，也就是 8n（第 n 个图形有 8n 个）。',
      },
    ],
    answer: '第 5 个图形最外圈有 40 个小正方形。规律：第 n 个图形最外圈有 (2n+1)² − (2n−1)² = 8n 个。',
    build() {
      return [
        ...squareRing(0, -3.2, 0, 3, 0.42),
        text(0, -3.2, -1.3, '3² − 1² = 8'),
        ...squareRing(0, 0, 0, 5, 0.26),
        text(0, 0, -1.3, '5² − 3² = 16'),
        ...squareRing(0, 3.2, 0, 7, 0.19),
        text(0, 3.2, -1.3, '7² − 5² = 24'),
        text(1, 0, -2.2, '第 5 个：11² − 9² = 40', { color: AXIS }),
      ];
    },
  },

  {
    id: 2,
    title: '三角形数',
    prompt: '下面图形中的点数依次是 1、3、6、10。如果不画，这样排列下去，第 10 个数是多少？',
    steps: [
      {
        title: '看相邻两数的差',
        detail: '3 − 1 = 2，6 − 3 = 3，10 − 6 = 4，所以下一个差是 5、6、7……',
      },
      {
        title: '第 n 个数 = 1 + 2 + … + n',
        detail: '第 n 个数等于从 1 加到 n：第 5 个是 15，第 6 个是 21，7 个 28，8 个 36，9 个 45，10 个 55。',
      },
      {
        title: '也可以直接用公式',
        detail: 'n × (n + 1) ÷ 2 = 10 × 11 ÷ 2 = <b>55</b>。',
      },
    ],
    answer: '第 10 个数是 55（规律：第 n 个数 = n(n+1)/2）。',
    build() {
      const items = [];
      const startX = -3.6;
      const dots = [1, 3, 6, 10];
      dots.forEach((count, index) => {
        const cx = startX + index * 2.3;
        let placed = 0;
        for (let row = 1; placed < count; row += 1) {
          for (let i = 0; i < row && placed < count; i += 1) {
            items.push(
              point(0, cx + (i - (row - 1) / 2) * 0.34, -1.0 + row * 0.32, {
                r: 0.075,
                color: '#e2555b',
              }),
            );
            placed += 1;
          }
        }
        items.push(text(0, cx, -1.5, String(count)));
      });
      items.push(text(1, 0, -2.2, '第 10 个数 = 1 + 2 + … + 10 = 55', { color: AXIS }));
      return items;
    },
  },

  {
    id: 3,
    title: '小三角形与周长',
    prompt:
      '下面每个三角形图各是由多少个小三角形组成的？如果小三角形的边长为 1，每个三角形图的周长分别是多少？每个三角形图包含小三角形的个数与这个三角形图的周长之间有什么样的关系？',
    steps: [
      {
        title: '数个数',
        detail: '第 1 个 1 个，第 2 个 4 个，第 3 个 9 个，第 4 个 16 个 —— 正好是 n²。',
      },
      {
        title: '算周长',
        detail: '边长是 1 的小三角形拼成大三角形，每边有 n 个，周长 = 3n：3、6、9、12。',
      },
      {
        title: '找关系',
        detail: '个数 = (周长 ÷ 3)²。例如周长 9 时，个数 = 3² = 9 ✓。',
      },
    ],
    answer: '个数依次 1、4、9、16；周长依次 3、6、9、12。关系：个数 = (周长 ÷ 3)²。',
    build: () => [],
  },

  {
    id: 4,
    title: '小狗跑了多远',
    prompt:
      '一条马路长 200 m，小宇和他的小狗分别以均匀的速度同时从马路的起点出发。当小宇走到这条马路一半的时候，小狗已经到达马路的终点。然后小狗返回与小宇相向而行，遇到小宇后再跑向终点，到达终点后再与小宇相向而行……直到小宇到达终点。小狗从出发开始，一共跑了多少米？',
    steps: [
      {
        title: '先看速度关系',
        detail: '小宇走 100 m 时小狗跑了 200 m，说明小狗的速度是小宇的 2 倍。',
      },
      {
        title: '时间相同，路程比就是速度比',
        detail: '小宇走完全程用了一段时间，这段时间里小狗一直在跑，速度是他的 2 倍，所以跑的路程也是 2 倍。',
      },
      {
        title: '结果',
        detail: '小狗一共跑了 200 × 2 = <b>400</b>（m）。',
      },
    ],
    answer: '小狗一共跑了 400 m。',
    build() {
      return [
        line(0, [{ x: -3.2, y: 0 }, { x: 3.2, y: 0 }], { color: MUTED }),
        point(0, -3.2, 0, { r: 0.07 }),
        point(0, 3.2, 0, { r: 0.07 }),
        text(0, -3.2, -0.4, '起点'),
        text(0, 3.2, -0.4, '终点'),
        point(1, 0, 0.5, { r: 0.08, color: AXIS }),
        text(1, 0, 0.9, '小宇走到一半时，小狗已到终点'),
        text(2, 0, -1.2, '小狗速度是小宇的 2 倍 → 一共跑 400 m', { color: '#12a375' }),
      ];
    },
  },

  {
    id: 5,
    title: '三个折线图',
    prompt:
      '小兰和爸爸、妈妈一起步行到离家 800 m 远的公园健身中心，用时 20 分钟。妈妈到了健身中心后直接返回家里，还是用了 20 分钟。小兰和爸爸一起在健身中心锻炼了 10 分钟。然后小兰跑步回到家中，用了 5 分钟，而爸爸是走回家中，用了 15 分钟。下面哪个图是描述妈妈离家时间和离家距离关系的？哪个是描述爸爸的？哪个是描述小兰的？',
    steps: [
      {
        title: '先算三个人各用多少时间',
        detail: '妈妈：20 + 20 = 40 分钟；小兰：20 + 10 + 5 = 35 分钟；爸爸：20 + 10 + 15 = 45 分钟。',
      },
      {
        title: '再看图上的“停留段”',
        detail: '妈妈没有停留（到 800 m 立刻返回），图上没有水平段；小兰和爸爸都有 10 分钟的水平段。',
      },
      {
        title: '对号入座',
        detail: '没有停留、40 分钟回到家的图是妈妈；有停留、到家最快的图是小兰（35 分钟）；有停留、最晚到家的图是爸爸（45 分钟）。',
      },
    ],
    answer: '第一个图是妈妈，第二个图是小兰，第三个图是爸爸。',
    build: () => [],
  },
];

export default createExerciseLesson({ title: '练习二十二', unit: '数学广角', questions: QUESTIONS });
