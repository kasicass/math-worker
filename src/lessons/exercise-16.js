/**
 * 六上 · 圆：练习十六（课本 PDF 第 79 页 / 印刷页 74 的 4 道题）。
 *
 * 这一组练习围绕「扇形」：识别扇形、认识圆心角、画扇形、算扇环面积。
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

function arcPts(cx, cy, r, a0, a1, n = 36) {
  return Array.from({ length: n + 1 }, (_, i) => {
    const angle = a0 + ((a1 - a0) * i) / n;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  });
}

/** 扇环：外弧 + 内弧围成的区域 */
function ringSector(step, cx, cy, rOut, rIn, start, sweep, color = SOFT_A) {
  return region(
    step,
    [
      ...arcPts(cx, cy, rOut, start, start + sweep),
      ...arcPts(cx, cy, rIn, start + sweep, start),
    ],
    { color, opacity: 0.95 },
  );
}

const QUESTIONS = [
  {
    id: 1,
    title: '找出物体中的扇形',
    prompt: '指出下列物体中的扇形。',
    steps: [
      {
        title: '先想清楚扇形的样子',
        detail: '一条弧 + 经过弧两端的两条半径，围成的图形才是扇形。',
      },
      {
        title: '对号入座',
        detail: '拱形窗的上半部分（半个圆）、折扇的扇面、摩天轮的扇形格子，都是扇形。',
      },
      {
        title: '关键看“两条边是不是半径”',
        detail: '扇形一定有两条从圆心出发的直边（半径），另一端由一段圆弧连起来。',
      },
    ],
    answer: '拱形窗的半圆、折扇的扇面、摩天轮的扇形格子等都是扇形。',
    build() {
      const items = [];
      // 半个圆
      items.push(disk(0, -3.2, 0, 1.2, 0, Math.PI, { color: SOFT_B, opacity: 0.95 }));
      items.push(
        arc(0, -3.2, 0, 1.2, 0, Math.PI),
        line(0, [
          { x: -4.4, y: 0 },
          { x: -2.0, y: 0 },
        ]),
        text(0, -3.2, -0.45, '拱形窗：半个圆'),
      );

      // 1/4 圆
      items.push(disk(1, 0, 0, 1.2, 0, Math.PI / 2, { color: SOFT_B, opacity: 0.95 }));
      items.push(
        arc(1, 0, 0, 1.2, 0, Math.PI / 2),
        line(1, [
          { x: 0, y: 0 },
          { x: 1.2, y: 0 },
        ]),
        line(1, [
          { x: 0, y: 0 },
          { x: 0, y: 1.2 },
        ]),
        text(1, 0.35, -0.45, '扇面：1/4 圆'),
      );

      // 小扇形
      items.push(disk(2, 3.2, 0, 1.2, Math.PI / 6, Math.PI / 3, { color: SOFT_B, opacity: 0.95 }));
      items.push(
        arc(2, 3.2, 0, 1.2, Math.PI / 6, Math.PI / 3),
        line(2, [
          { x: 3.2, y: 0 },
          { x: 3.2 + 1.2 * Math.cos(Math.PI / 6), y: 1.2 * Math.sin(Math.PI / 6) },
        ]),
        line(2, [
          { x: 3.2, y: 0 },
          { x: 3.2 + 1.2 * Math.cos(Math.PI / 2), y: 1.2 * Math.sin(Math.PI / 2) },
        ]),
        text(2, 3.2, -0.45, '摩天轮：一小块扇形'),
      );
      return items;
    },
  },

  {
    id: 2,
    title: '哪些角是圆心角',
    prompt: '下面图形中哪些角是圆心角？在（　）里画“√”。',
    steps: [
      {
        title: '圆心角只有一条标准',
        detail: '角的顶点必须在圆心。四条圆弧上都有圆心 O 的点，看图时先盯住顶点和圆心的位置关系。',
      },
      {
        title: '第 1 幅：√',
        detail: '顶点就在圆心 O，两条边都是半径（连到圆上的 A、B）。',
      },
      {
        title: '第 2 幅：×　第 3 幅：×',
        detail: '第 2 幅的顶点在圆心上方，第 3 幅的顶点落在圆上，都不在圆心。',
      },
      {
        title: '第 4 幅：√',
        detail: '顶点也在圆心 O，两条边是半径。所以答案是第 1、4 幅。',
      },
    ],
    answer: '第 1 幅和第 4 幅是圆心角。',
    build() {
      const items = [];
      const r = 1.0;
      const centers = [-3.3, -1.1, 1.1, 3.3];

      // 四个圆
      centers.forEach((cx, i) => {
        items.push(circle(0, cx, 0, r));
        items.push(point(0, cx, 0, { r: 0.045, color: MUTED }));
      });

      // (1) 顶点在圆心
      items.push(
        line(1, [
          { x: centers[0], y: 0 },
          { x: centers[0] + r, y: 0 },
        ]),
        line(1, [
          { x: centers[0], y: 0 },
          { x: centers[0] + r * Math.cos(-Math.PI / 4), y: r * Math.sin(-Math.PI / 4) },
        ]),
        arc(1, centers[0], 0, 0.3, -Math.PI / 4, Math.PI / 4, { color: AXIS, showRadius: false }),
        text(1, centers[0], -1.35, '（√）', { color: '#12a375' }),
      );

      // (2) 顶点在圆心上方
      const v2 = { x: centers[1], y: 0.5 };
      items.push(
        line(2, [v2, { x: centers[1] - r * Math.SQRT1_2, y: r * Math.SQRT1_2 }]),
        line(2, [v2, { x: centers[1] + r * Math.SQRT1_2, y: r * Math.SQRT1_2 }]),
        arc(2, v2.x, v2.y, 0.28, Math.PI * 0.15, Math.PI * 0.7, { color: AXIS, showRadius: false }),
        text(2, centers[1], -1.35, '（×）', { color: AXIS }),
      );

      // (3) 顶点在圆上
      const v3 = { x: centers[2] + 0.62, y: -0.6 };
      items.push(
        line(2, [v3, { x: centers[2] + 0.45, y: 0.85 }]),
        line(2, [v3, { x: centers[2] - 0.72, y: 0.6 }]),
        arc(2, v3.x, v3.y, 0.3, Math.PI * 0.62, Math.PI * 0.55, { color: AXIS, showRadius: false }),
        text(2, centers[2], -1.35, '（×）', { color: AXIS }),
      );

      // (4) 顶点在圆心
      items.push(
        line(3, [
          { x: centers[3], y: 0 },
          { x: centers[3] + r * Math.cos(-Math.PI / 3), y: r * Math.sin(-Math.PI / 3) },
        ]),
        line(3, [
          { x: centers[3], y: 0 },
          { x: centers[3] + r * Math.cos(Math.PI * 0.72), y: r * Math.sin(Math.PI * 0.72) },
        ]),
        arc(3, centers[3], 0, 0.3, -Math.PI / 3, Math.PI * 1.05, { color: AXIS, showRadius: false }),
        text(3, centers[3], -1.35, '（√）', { color: '#12a375' }),
      );

      return items;
    },
  },

  {
    id: 3,
    title: '画一个 100° 的扇形',
    prompt: '先画一个半径是 2 cm 的圆，再在圆中画一个圆心角是 100° 的扇形。',
    steps: [
      {
        title: '先画圆',
        detail: '圆规两脚张开 2 cm，针尖扎在 O 点，转一圈。',
      },
      {
        title: '画一条半径当始边',
        detail: '从 O 画一条半径 OA，作为圆心角的一条边。',
      },
      {
        title: '量出 100°',
        detail: '用量角器的中心对准 O，零刻度对齐 OA，在 100° 处点一个点 B，连 OB。',
      },
      {
        title: '补上弧 AB',
        detail: '两条半径 OA、OB 和弧 AB 围成的部分就是圆心角 100° 的扇形。',
      },
    ],
    answer: '半径 2 cm、圆心角 100° 的扇形：两条半径 + 一段 100° 的弧。',
    build() {
      const r = 1.5;
      const theta = (100 * Math.PI) / 180;
      return [
        circle(0, 0, 0, r),
        point(0, 0, 0),
        text(0, -0.3, -0.26, 'O', { color: MUTED }),
        line(1, [
          { x: 0, y: 0 },
          { x: r, y: 0 },
        ]),
        text(1, r + 0.18, -0.1, 'A', { color: MUTED }),
        line(2, [
          { x: 0, y: 0 },
          { x: r * Math.cos(theta), y: r * Math.sin(theta) },
        ]),
        text(2, r * Math.cos(theta) + 0.16, r * Math.sin(theta) + 0.16, 'B', { color: MUTED }),
        disk(3, 0, 0, r, 0, theta, { color: SOFT_B, opacity: 0.95 }),
        arc(3, 0, 0, r, 0, theta, { color: AXIS, showRadius: false }),
        arc(3, 0, 0, 0.42, 0, theta, { color: AXIS, showRadius: false }),
        text(3, 0.72, 0.62, '100°', { color: AXIS }),
        text(3, 0, -r - 0.45, '半径 2 cm 的圆里，圆心角 100° 的扇形', { color: MUTED }),
      ];
    },
  },

  {
    id: 4,
    title: '扇环的面积（思考题）',
    prompt: `像下面这样从圆环上截取的部分叫作扇环。你能求出下面各扇环的面积吗？
      <span class="sub">左图：外半径 5 dm，环宽 2 dm，圆心角 90°。右图：内半径 4 dm，环宽 1 dm，圆心角 90° 的两块。</span>`,
    steps: [
      {
        title: '扇环 = 圆环的一部分',
        detail: '整圆环的面积是 π(R² − r²)，截取了圆环的几分之几，就乘以几分之几。',
      },
      {
        title: '左图：内半径是多少',
        detail: '外半径 5 dm，环宽 2 dm → 内半径 = 5 − 2 = 3 dm；圆心角 90° 占 90/360 = 1/4。',
      },
      {
        title: '左图面积',
        detail: 'S = 3.14 × (5² − 3²) × 1/4 = 3.14 × 16 ÷ 4 = <b>12.56</b>（dm²）。',
      },
      {
        title: '右图面积',
        detail: '外半径 = 4 + 1 = 5 dm，内半径 4 dm，两块各 90°：S = 3.14 × (5² − 4²) × 1/4 × 2 = 3.14 × 9 ÷ 2 = <b>14.13</b>（dm²）。',
      },
    ],
    answer: '左图扇环面积 12.56 dm²；右图两块扇环共 14.13 dm²。',
    build() {
      const items = [];
      const scale = 0.28;

      // 左图：外 5、内 3，90°
      const cx1 = -2.4;
      const cy1 = -1.4;
      const rOut1 = 5 * scale;
      const rIn1 = 3 * scale;
      items.push(ringSector(0, cx1, cy1, rOut1, rIn1, 0, Math.PI / 2, SOFT_B));
      items.push(
        arc(0, cx1, cy1, rOut1, 0, Math.PI / 2, { showRadius: false }),
        arc(0, cx1, cy1, rIn1, 0, Math.PI / 2, { showRadius: false }),
        line(0, [
          { x: cx1, y: cy1 },
          { x: cx1 + rOut1, y: cy1 },
        ]),
        line(0, [
          { x: cx1, y: cy1 },
          { x: cx1, y: cy1 + rOut1 },
        ]),
        point(0, cx1, cy1),
        text(0, cx1 - 0.3, cy1 - 0.32, 'O', { color: MUTED }),
        text(0, cx1 + rOut1 * 0.55, cy1 + 0.22, '5 dm'),
        text(0, cx1 - 0.42, cy1 + (rOut1 + rIn1) / 2, '2 dm', { color: AXIS }),
      );

      // 右图：两块 90°，内 4、外 5
      const cx2 = 1.6;
      const cy2 = -0.6;
      const rOut2 = 5 * scale;
      const rIn2 = 4 * scale;
      items.push(ringSector(1, cx2, cy2, rOut2, rIn2, 0, Math.PI / 2, SOFT_A));
      items.push(
        arc(1, cx2, cy2, rOut2, 0, Math.PI / 2, { showRadius: false }),
        arc(1, cx2, cy2, rIn2, 0, Math.PI / 2, { showRadius: false }),
        line(1, [
          { x: cx2, y: cy2 },
          { x: cx2 + rOut2, y: cy2 },
        ]),
        line(1, [
          { x: cx2, y: cy2 },
          { x: cx2, y: cy2 + rOut2 },
        ]),
      );
      items.push(ringSector(2, cx2, cy2, rOut2, rIn2, Math.PI, Math.PI / 2, SOFT_A));
      items.push(
        arc(2, cx2, cy2, rOut2, Math.PI, Math.PI / 2, { showRadius: false }),
        arc(2, cx2, cy2, rIn2, Math.PI, Math.PI / 2, { showRadius: false }),
        line(2, [
          { x: cx2, y: cy2 },
          { x: cx2 - rOut2, y: cy2 },
        ]),
        line(2, [
          { x: cx2, y: cy2 },
          { x: cx2, y: cy2 - rOut2 },
        ]),
        point(2, cx2, cy2),
        text(2, cx2 + 0.24, cy2 + 0.22, 'O', { color: MUTED }),
        text(2, cx2 + 0.55, cy2 - 0.34, '4 dm'),
        text(2, cx2 + rOut2 + 0.32, cy2 + 0.72, '1 dm', { color: AXIS }),
        text(3, 0, -2.35, '左 12.56 dm²　右 14.13 dm²', { color: '#12a375' }),
      );

      return items;
    },
  },
];

export default createExerciseLesson({ title: '练习十六', questions: QUESTIONS });
