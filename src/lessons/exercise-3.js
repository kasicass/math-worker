/**
 * 六上 · 分数乘法：练习三（课本 PDF 第 20 页 / 印刷页 15 的 7 道题）。
 *
 * 这一组全是"求一个数的几分之几 / 比一个数多（少）几分之几"的实际问题。
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

/** 线段图：一条整体线段 + 一条"比它多（少）"的线段 */
function segment(step, x, y, width, height, color = SOFT_A) {
  return [
    region(
      step,
      [
        { x, y },
        { x: x + width, y },
        { x: x + width, y: y + height },
        { x, y: y + height },
      ],
      { color, opacity: 0.95 },
    ),
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
  ];
}

const QUESTIONS = [
  {
    id: 1,
    title: '血液的流速',
    prompt:
      '人体血液在主动脉中的流动速度约为 20 厘米/秒，在静脉中的流动速度约为主动脉中的 2/5，在毛细血管中的流动速度大约只有静脉中的 1/160。血液在毛细血管中每秒约流动多少厘米？',
    steps: [
      {
        title: '先求静脉的流速',
        detail: '20 × 2/5 = 8（厘米/秒）。',
      },
      {
        title: '再求毛细血管的流速',
        detail: '8 × 1/160 = 1/20（厘米/秒）= <b>0.05</b>（厘米/秒）。',
      },
      {
        title: '连着乘也可以',
        detail: '20 × 2/5 × 1/160 一次算完，结果一样：20 × 2/(5×160) = 40/800 = 1/20。',
      },
    ],
    answer: '血液在毛细血管中每秒约流动 0.05 厘米。',
    build() {
      return [
        ...segment(0, -3.0, 1.2, 4.0, 0.55, SOFT_A),
        text(0, -1.0, 1.4, '主动脉 20 厘米/秒'),
        ...segment(1, -3.0, 0.3, 1.6, 0.55, '#ffc24d'),
        text(1, 0.2, 0.5, '静脉 = 20 × 2/5 = 8'),
        ...segment(2, -3.0, -0.6, 1.6 / 160, 0.55, '#f59e0b'),
        text(2, 0.6, -0.35, '毛细血管 = 8 × 1/160 = 0.05', { color: AXIS }),
      ];
    },
  },

  {
    id: 2,
    title: '海豹的寿命',
    prompt: '海象的寿命大约是 40 年，海狮的寿命是海象的 3/4，海豹的寿命是海狮的 2/3。海豹的寿命大约是多少年？',
    steps: [
      {
        title: '海狮的寿命',
        detail: '40 × 3/4 = 30（年）。',
      },
      {
        title: '海豹的寿命',
        detail: '30 × 2/3 = <b>20</b>（年）。',
      },
      {
        title: '连着乘',
        detail: '40 × 3/4 × 2/3 = 20，先把 3 和 3、4 和 2 约分更快。',
      },
    ],
    answer: '海豹的寿命大约是 20 年。',
    build() {
      return [
        ...segment(0, -3.0, 1.3, 4.0, 0.55, SOFT_A),
        text(0, -1.0, 1.5, '海象 40 年'),
        ...segment(1, -3.0, 0.4, 3.0, 0.55, '#ffc24d'),
        text(1, -0.5, 0.6, '海狮 = 40 × 3/4 = 30 年'),
        ...segment(2, -3.0, -0.5, 2.0, 0.55, '#f59e0b'),
        text(2, -1.0, -0.3, '海豹 = 30 × 2/3 = 20 年', { color: AXIS }),
      ];
    },
  },

  {
    id: 3,
    title: '水仙的花期',
    prompt: '芍药的花期是 32 天，玫瑰的花期是芍药的 5/8，水仙的花期是玫瑰的 3/4。水仙的花期是多少天？',
    steps: [
      {
        title: '玫瑰的花期',
        detail: '32 × 5/8 = 20（天）。',
      },
      {
        title: '水仙的花期',
        detail: '20 × 3/4 = <b>15</b>（天）。',
      },
    ],
    answer: '水仙的花期是 15 天。',
    build() {
      return [
        ...segment(0, -3.0, 1.3, 4.0, 0.55, SOFT_A),
        text(0, -1.0, 1.5, '芍药 32 天'),
        ...segment(1, -3.0, 0.4, 2.5, 0.55, '#ffc24d'),
        text(1, -0.6, 0.6, '玫瑰 = 20 天'),
        ...segment(1, -3.0, -0.5, 1.875, 0.55, '#f59e0b'),
        text(1, -1.0, -0.3, '水仙 = 15 天', { color: AXIS }),
      ];
    },
  },

  {
    id: 4,
    title: '蝗虫振翅',
    prompt: '昆虫飞行时需要振动翅膀。蜜蜂每秒振动翅膀 236 次，蝗虫每秒振动翅膀的次数比蜜蜂少 109/118。蝗虫每秒振动翅膀多少次？',
    steps: [
      {
        title: '先算“少多少”',
        detail: '236 × 109/118 = 218（次）。先把 236 和 118 约分：236 ÷ 118 = 2，2 × 109 = 218。',
      },
      {
        title: '再相减',
        detail: '236 − 218 = <b>18</b>（次）。',
      },
      {
        title: '另一种算法',
        detail: '蝗虫是蜜蜂的 1 − 109/118 = 9/118，236 × 9/118 = 18（次），一步到位。',
      },
    ],
    answer: '蝗虫每秒振动翅膀 18 次。',
    build() {
      return [
        ...segment(0, -3.0, 0.9, 4.0, 0.6, SOFT_A),
        text(0, -1.0, 1.1, '蜜蜂 236 次/秒'),
        ...segment(1, -3.0, -0.2, 4.0 * (9 / 118), 0.6, '#ffc24d'),
        text(1, 0.4, 0.1, '蝗虫 = 236 × 9/118 = 18 次/秒', { color: AXIS }),
      ];
    },
  },

  {
    id: 5,
    title: '鸭的孵化期',
    prompt: '鸡的孵化期是 21 天，鸭的孵化期比鸡长 1/3。鸭的孵化期是多少天？',
    steps: [
      {
        title: '把鸡的孵化期看作“1”',
        detail: '鸭比鸡长 1/3，所以鸭是鸡的 1 + 1/3 = 4/3。',
      },
      {
        title: '计算',
        detail: '21 × 4/3 = <b>28</b>（天）。也可以分开算：21 + 21 × 1/3 = 21 + 7 = 28。',
      },
    ],
    answer: '鸭的孵化期是 28 天。',
    build() {
      return [
        ...segment(0, -3.0, 0.8, 3.2, 0.6, SOFT_A),
        text(0, -1.2, 1.0, '鸡 21 天'),
        ...segment(1, -3.0, -0.4, 3.2 * (4 / 3), 0.6, '#ffc24d'),
        text(1, -0.6, 0.1, '鸭 = 21 × 4/3 = 28 天', { color: AXIS }),
        text(1, 2.0, -0.15, '多 1/3', { color: MUTED }),
      ];
    },
  },

  {
    id: 6,
    title: '普通列车的速度',
    prompt: '磁悬浮列车的运行速度是 430 千米/时，普通列车比它慢 31/43。普通列车的速度是多少？',
    steps: [
      {
        title: '普通列车是磁悬浮的几分之几',
        detail: '比它慢 31/43，所以是 1 − 31/43 = 12/43。',
      },
      {
        title: '计算',
        detail: '430 × 12/43 = 10 × 12 = <b>120</b>（千米/时）。',
      },
      {
        title: '也可以先减后算',
        detail: '430 − 430 × 31/43 = 430 − 310 = 120（千米/时）。',
      },
    ],
    answer: '普通列车的速度是 120 千米/时。',
    build() {
      return [
        ...segment(0, -3.0, 0.8, 4.0, 0.6, SOFT_A),
        text(0, -1.0, 1.0, '磁悬浮 430 km/h'),
        ...segment(1, -3.0, -0.4, 4.0 * (12 / 43), 0.6, '#ffc24d'),
        text(1, 0.4, 0.1, '普通列车 = 430 × 12/43 = 120 km/h', { color: AXIS }),
      ];
    },
  },

  {
    id: 7,
    title: '乘法表中的秘密',
    prompt: `照样子完成下面表格，并在 9 个乘积中选择 3 个既不同行、又不同列的数连乘。你发现了什么？
      <table class="data-table" style="margin-top:8px">
        <tr><th>×</th><th>1/2</th><th>2/3</th><th>3/5</th></tr>
        <tr><td>7/4</td><td>7/8</td><td><span class="blank">?</span></td><td><span class="blank">?</span></td></tr>
        <tr><td>6/5</td><td><span class="blank">?</span></td><td><span class="blank">?</span></td><td><span class="blank">?</span></td></tr>
        <tr><td>5/8</td><td><span class="blank">?</span></td><td><span class="blank">?</span></td><td><span class="blank">?</span></td></tr>
      </table>`,
    steps: [
      {
        title: '先把表格填完',
        detail: '7/4 × 2/3 = 7/6，7/4 × 3/5 = 21/20；6/5 × 1/2 = 3/5，6/5 × 2/3 = 4/5，6/5 × 3/5 = 18/25；5/8 × 1/2 = 5/16，5/8 × 2/3 = 5/12，5/8 × 3/5 = 3/8。',
      },
      {
        title: '选 3 个不同行、不同列的数连乘',
        detail: '比如 7/8 × 4/5 × 3/8 = 21/80；再换一组 7/6 × 3/5 × 5/16 = 21/80……结果都一样。',
      },
      {
        title: '为什么相同',
        detail: '不同行不同列地取 3 个数，正好把 3 行（7/4、6/5、5/8）和 3 列（1/2、2/3、3/5）各用了一次，所以总积固定：21/80。',
      },
    ],
    answer:
      '填表：7/6、21/20；3/5、4/5、18/25；5/16、5/12、3/8。不同行不同列的 3 个乘积总是 21/80。',
    build: () => [],
  },
];

export default createExerciseLesson({ title: '练习三', unit: '分数乘法', questions: QUESTIONS });
