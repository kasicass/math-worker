/**
 * 六上 · 位置与方向（二）：练习五（课本 PDF 第 27–28 页 / 印刷页 22–23 的 5 道题）。
 *
 * 这组题的核心技能：以观测点画十字方向标 → 量出偏角 → 按线段比例尺换算距离。
 * 图形按教材布局重画，答案就是"在图上一量"得到的结果。
 * 引擎见 core/exercise-player.js。
 */
import {
  AXIS,
  MUTED,
  SOFT_A,
  arc,
  createExerciseLesson,
  line,
  point,
  text,
} from '../core/exercise-player.js';

const AXIS_COLOR = '#5b6680';

/**
 * 十字方向标 + 从观测点出发的一束方向线。
 * rays: [{ dx, dy, name, color }]（单位：世界坐标）
 */
function compass(step, { axis = 4.2, rays = [], origin = '观测点', scaleText }) {
  const items = [
    line(step, [{ x: -axis, y: 0 }, { x: axis, y: 0 }], { color: AXIS_COLOR }),
    line(step, [{ x: 0, y: -axis }, { x: 0, y: axis }], { color: AXIS_COLOR }),
    text(step, 0, axis + 0.42, '北', { size: 0.34 }),
    text(step, axis + 0.4, 0, '东', { size: 0.34 }),
    text(step, 0, -axis - 0.42, '南', { size: 0.34 }),
    text(step, -axis - 0.4, 0, '西', { size: 0.34 }),
    point(step, 0, 0, { r: 0.06 }),
    text(step, -0.36, -0.34, origin, { color: MUTED, size: 0.32 }),
  ];

  for (const ray of rays) {
    items.push(
      line(step, [{ x: 0, y: 0 }, { x: ray.dx, y: ray.dy }], { color: ray.color ?? AXIS }),
      point(step, ray.dx, ray.dy, { r: 0.07, color: ray.color ?? AXIS }),
      text(step, ray.dx + (ray.labelDx ?? 0.15), ray.dy + (ray.labelDy ?? 0.22), ray.name, {
        color: ray.color ?? MUTED,
        size: 0.32,
      }),
    );
  }

  if (scaleText) {
    items.push(
      line(step, [{ x: -axis, y: -axis + 0.35 }, { x: -axis + 1, y: -axis + 0.35 }], {
        color: AXIS_COLOR,
      }),
      text(step, -axis + 0.5, -axis + 0.8, scaleText, { color: MUTED, size: 0.28 }),
    );
  }

  return items;
}

const QUESTIONS = [
  {
    id: 1,
    title: '各城市在北京的什么方向',
    prompt: '量一量，说一说沈阳、海口、昆明、西安和乌鲁木齐分别在北京的什么方向上。',
    steps: [
      {
        title: '把观测点放在北京',
        detail: '以北京为观测点画十字方向标，量角器的中心对准北京，零刻度线对准正北或正东。',
      },
      {
        title: '先量偏哪一边，再量角度',
        detail: '乌鲁木齐在西边偏上（西偏北 15°）；沈阳在东边偏上（东偏北 25°）。',
      },
      {
        title: '南边的三个城市',
        detail: '西安在南偏西 37°；昆明在南偏西 44°；海口几乎在正南，南偏西 12°。',
      },
      {
        title: '说方向时的习惯',
        detail: '一般先说“偏”的方向再报角度，如“西偏北 15°”，也可以说“北偏西 75°”——两种说法指的是同一条射线。',
      },
    ],
    answer: '乌鲁木齐在西偏北 15°；沈阳在东偏北 25°；西安在南偏西 37°；昆明在南偏西 44°；海口在南偏西 12°。',
    build() {
      return compass(0, {
        origin: '北京',
        rays: [
          { dx: -4 * Math.cos(Math.PI / 12), dy: 4 * Math.sin(Math.PI / 12), name: '乌鲁木齐', labelDx: -0.9 },
          { dx: 2.0 * Math.cos(Math.PI * 25 / 180), dy: 2.0 * Math.sin(Math.PI * 25 / 180), name: '沈阳', labelDx: 0.2 },
          { dx: -3.2 * Math.cos(Math.PI * 37 / 180), dy: -3.2 * Math.sin(Math.PI * 37 / 180), name: '西安', labelDx: -0.7 },
          { dx: -3.4 * Math.cos(Math.PI * 44 / 180), dy: -3.4 * Math.sin(Math.PI * 44 / 180), name: '昆明', labelDx: -0.7 },
          { dx: -2.6 * Math.cos(Math.PI * 12 / 180), dy: -2.6 * Math.sin(Math.PI * 12 / 180), name: '海口', labelDx: -0.2, labelDy: -0.3 },
        ],
      });
    },
  },

  {
    id: 2,
    title: '以人民广场为观测点',
    prompt: `量一量，填一填。以人民广场为观测点（比例尺：1 段 = 100 m），
      <span class="sub">（1）市政府在什么方向上，距离是多少米？　（2）电信大楼呢？　（3）工人文化宫呢？　（4）科技大厦呢？　（5）银行呢？</span>`,
    steps: [
      {
        title: '先量方向',
        detail: '市政府在正西方向；银行在西偏南方向，量得偏角 45°。',
      },
      {
        title: '北边两个建筑',
        detail: '电信大楼在北偏西 55°；工人文化宫在东偏北 30°。',
      },
      {
        title: '南边的科技大厦',
        detail: '科技大厦在东偏南 30°。',
      },
      {
        title: '再量距离',
        detail: '图上 1 段 = 100 m：市政府 3 段 = 300 m；电信大楼 4 段 = 400 m；工人文化宫 4 段 = 400 m；科技大厦 4 段 = 400 m；银行 3 段 = 300 m。',
      },
    ],
    answer:
      '（1）正西方向 300 m（2）北偏西 55° 方向 400 m（3）东偏北 30° 方向 400 m（4）东偏南 30° 方向 400 m（5）西偏南 45° 方向 300 m',
    build() {
      return compass(0, {
        origin: '人民广场',
        scaleText: '1 段 = 100 m',
        rays: [
          { dx: -3, dy: 0, name: '市政府', labelDx: -0.2, labelDy: 0.28 },
          { dx: -4 * Math.sin(Math.PI * 55 / 180), dy: 4 * Math.cos(Math.PI * 55 / 180), name: '电信大楼', labelDx: -1.3 },
          { dx: 4 * Math.cos(Math.PI / 6), dy: 4 * Math.sin(Math.PI / 6), name: '工人文化宫', labelDx: 0.6 },
          { dx: 4 * Math.cos(Math.PI / 6), dy: -4 * Math.sin(Math.PI / 6), name: '科技大厦', labelDx: 0.6, labelDy: -0.35 },
          { dx: -3 * Math.cos(Math.PI / 4), dy: -3 * Math.sin(Math.PI / 4), name: '银行', labelDx: -0.9, labelDy: -0.35 },
        ],
      });
    },
  },

  {
    id: 3,
    title: '北京和哈尔滨',
    prompt: '找一幅中国地图，量一量，说一说：北京在哈尔滨的什么方向上，哈尔滨在北京的什么方向上。',
    steps: [
      {
        title: '看清观测点是谁',
        detail: '“北京在哈尔滨的什么方向”，观测点就是哈尔滨；“哈尔滨在北京的什么方向”，观测点换成北京。',
      },
      {
        title: '量出来的结果',
        detail: '哈尔滨在北京的东北方向（约东偏北 30°），所以北京在哈尔滨的相反方向——西南方向。',
      },
      {
        title: '记住这个规律',
        detail: '互为观测点时，方向正好相反：东北 ↔ 西南，东南 ↔ 西北，角度相同。',
      },
    ],
    answer: '北京在哈尔滨的西南方向；哈尔滨在北京的东北方向。',
    build() {
      return [
        ...compass(0, {
          origin: '哈尔滨',
          rays: [{ dx: -2.6 * Math.cos(Math.PI / 6), dy: -2.6 * Math.sin(Math.PI / 6), name: '北京', labelDx: -0.7, labelDy: -0.3, color: AXIS }],
        }),
        text(1, 0, -4.9, '反过来：哈尔滨在北京的东偏北 30° 方向', { color: '#12a375' }),
      ];
    },
  },

  {
    id: 4,
    title: '谁家在学校的什么方向',
    prompt: `量一量，说一说（比例尺：1 段 = 200 m）。
      <span class="sub">（1）小刚家在学校的什么方向上？学校在小刚家的什么方向上？小刚家和学校相距多少米？</span>
      <span class="sub">（2）其他小朋友的家和学校的位置关系，也能这样说一说吗？</span>`,
    steps: [
      {
        title: '以学校为观测点',
        detail: '小刚家在学校的东偏北 35° 方向，图上 2 段 = 400 m。',
      },
      {
        title: '反过来怎么说',
        detail: '以小明家为观测点时方向相反：学校在小刚家的西偏南 35° 方向，距离不变，还是 400 m。',
      },
      {
        title: '其他三位',
        detail: '小芳家在西偏北 25° 方向 600 m；小亮家在东偏南 40° 方向 600 m；小红家在西偏南 30° 方向 800 m。',
      },
    ],
    answer:
      '小刚家在东偏北 35° 方向 400 m；学校在小刚家的西偏南 35° 方向 400 m。小芳家西偏北 25° 600 m，小亮家东偏南 40° 600 m，小红家西偏南 30° 800 m。',
    build() {
      return compass(0, {
        origin: '学校',
        axis: 4.4,
        scaleText: '1 段 = 200 m',
        rays: [
          { dx: 2 * Math.cos(Math.PI * 35 / 180), dy: 2 * Math.sin(Math.PI * 35 / 180), name: '小刚家', labelDx: 0.3 },
          { dx: -3 * Math.sin(Math.PI * 25 / 180), dy: 3 * Math.cos(Math.PI * 25 / 180), name: '小芳家', labelDx: -1.1 },
          { dx: 3 * Math.cos(Math.PI * 40 / 180), dy: -3 * Math.sin(Math.PI * 40 / 180), name: '小亮家', labelDx: 0.5, labelDy: -0.35 },
          { dx: -4 * Math.cos(Math.PI * 30 / 180), dy: -4 * Math.sin(Math.PI * 30 / 180), name: '小红家', labelDx: -1.1, labelDy: -0.1 },
        ],
      });
    },
  },

  {
    id: 5,
    title: '在图上确定油井的位置',
    prompt:
      '石油勘探队在 A 城东偏北 40° 方向上、距离 A 城 45 km 处打出一口油井。请你在平面图上确定油井的位置。',
    steps: [
      {
        title: '先看比例尺',
        detail: '线段比例尺 1 段 = 15 km，45 km 里有 45 ÷ 15 = 3 段。',
      },
      {
        title: '画方向线',
        detail: '以 A 城为观测点，量角器的中心对准 A 城，从正东方向向北量出 40°，画一条射线。',
      },
      {
        title: '按比例截取 3 段',
        detail: '在这条射线上从 A 城开始连量 3 段，终点就是油井的位置。',
      },
      {
        title: '检查一遍',
        detail: '方向对不对（东偏北 40°）、段数对不对（3 段 = 45 km），两点都符合才算画对。',
      },
    ],
    answer: '在 A 城东偏北 40° 的射线上取 3 段（每段 15 km），终点就是油井的位置。',
    build() {
      const theta = Math.PI * 40 / 180;
      const items = compass(0, {
        origin: 'A 城',
        scaleText: '1 段 = 15 km',
        rays: [
          {
            dx: 3 * Math.cos(theta),
            dy: 3 * Math.sin(theta),
            name: '油井',
            labelDx: 0.1,
            labelDy: 0.45,
            color: AXIS,
          },
        ],
      });
      // 三段刻度
      for (let i = 1; i <= 3; i += 1) {
        const x = i * Math.cos(theta);
        const y = i * Math.sin(theta);
        items.push(
          line(1, [
            { x: x - 0.12 * Math.sin(theta), y: y + 0.12 * Math.cos(theta) },
            { x: x + 0.12 * Math.sin(theta), y: y - 0.12 * Math.cos(theta) },
          ], { color: MUTED }),
        );
      }
      items.push(
        arc(1, 0, 0, 1.4, 0, theta, { color: AXIS, showRadius: false }),
        text(1, 1.7, 0.75, '40°', { color: AXIS, size: 0.32 }),
        text(2, 0, -4.9, '3 段 × 15 km = 45 km', { color: '#12a375' }),
      );
      return items;
    },
  },
];

export default createExerciseLesson({ title: '练习五', unit: '位置与方向（二）', questions: QUESTIONS });
