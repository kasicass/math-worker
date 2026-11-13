/**
 * 六上 · 圆：练习十四（课本 PDF 第 68、69 页 / 印刷页 63、64 的 12 道题）。
 *
 * 这一组练习围绕「圆的周长」：C = πd = 2πr。
 * 引擎见 core/exercise-player.js，这里只写题目数据。
 */
import {
  AXIS,
  MUTED,
  arc,
  circle,
  createExerciseLesson,
  line,
  point,
  text,
} from '../core/exercise-player.js';

const QUESTIONS = [
  {
    id: 1,
    title: '喷水池的周长',
    prompt: '一个圆形喷水池的半径是 5 m，它的周长是多少米？',
    steps: [
      {
        title: '用 C = 2πr',
        detail: '周长 = 2 × 3.14 × 5 = <b>31.4</b>（m）。',
      },
      {
        title: '也可以用 C = πd',
        detail: '先求直径：d = 5 × 2 = 10 m，再算 3.14 × 10 = 31.4 m，结果一样。',
      },
    ],
    answer: '它的周长是 31.4 m。',
    build() {
      const r = 1.7;
      return [
        circle(0, 0, 0, r),
        point(0, 0, 0),
        line(0, [
          { x: 0, y: 0 },
          { x: r, y: 0 },
        ]),
        text(0, r / 2, 0.28, '5 m'),
        text(1, 0, -r - 0.45, 'C = 2 × 3.14 × 5 = 31.4 m'),
      ];
    },
  },

  {
    id: 2,
    title: '亭子里的圆',
    prompt:
      '在一个圆形亭子里，小丽沿着直径从一端走 12 步到达另一端，每步长大约是 55 cm。这个圆的周长大约是多少米？',
    steps: [
      {
        title: '先求直径',
        detail: '走的是直径：12 × 55 = 660（cm），也就是 <b>6.6 m</b>。',
      },
      {
        title: '再求周长',
        detail: 'C = πd = 3.14 × 6.6 = 20.724 ≈ <b>20.72 m</b>（约 20.7 m）。',
      },
      {
        title: '注意单位',
        detail: '题目问的是“多少米”，所以要把 660 cm 换算成 6.6 m 再算。',
      },
    ],
    answer: '这个圆的周长大约是 20.72 m。',
    build() {
      const r = 1.7;
      const items = [circle(0, 0, 0, r), point(0, 0, 0)];
      items.push(
        line(0, [
          { x: -r, y: 0 },
          { x: r, y: 0 },
        ]),
      );
      // 12 步刻度
      for (let i = 1; i < 12; i += 1) {
        const x = -r + (2 * r * i) / 12;
        items.push(
          line(0, [
            { x, y: -0.12 },
            { x, y: 0.12 },
          ]),
        );
      }
      items.push(text(1, 0, -r - 0.45, '12 步 × 55 cm = 660 cm = 6.6 m'));
      return items;
    },
  },

  {
    id: 3,
    title: '圆柱的横截面',
    prompt: '一个古代建筑中大红圆柱横截面的周长是 3.14 m。这个圆柱横截面的直径是多少米？',
    steps: [
      {
        title: '由 C = πd 反求 d',
        detail: 'd = C ÷ π = 3.14 ÷ 3.14 = <b>1</b>（m）。',
      },
      {
        title: '验证一下',
        detail: '直径 1 m 的圆，周长正好是 3.14 × 1 = 3.14 m，和题目一致。',
      },
    ],
    answer: '横截面的直径是 1 m。',
    build() {
      const r = 1.7;
      const items = [
        circle(0, 0, 0, r),
        point(0, 0, 0),
        text(0, 0, r + 0.42, 'C = 3.14 m'),
      ];
      items.push(
        line(1, [
          { x: -r, y: 0 },
          { x: r, y: 0 },
        ], { color: AXIS }),
        text(1, 0, 0.3, 'd = 3.14 ÷ 3.14 = 1 m', { color: AXIS }),
      );
      return items;
    },
  },

  {
    id: 4,
    title: '分针的尖端',
    prompt:
      '一只挂钟的分针长 20 cm，经过 30 分钟后，分针的尖端所走的路程是多少厘米？经过 45 分钟呢？',
    steps: [
      {
        title: '分针尖端的轨迹是一个圆',
        detail: '分针长 20 cm 就是半径，走一圈的路程是 2 × 3.14 × 20 = 125.6 cm。',
      },
      {
        title: '30 分钟 = 半圈',
        detail: '125.6 ÷ 2 = <b>62.8</b>（cm）。也可以直接算 3.14 × 20。',
      },
      {
        title: '45 分钟 = 3/4 圈',
        detail: '125.6 × 3/4 = <b>94.2</b>（cm）。',
      },
    ],
    answer: '30 分钟走 62.8 cm，45 分钟走 94.2 cm。',
    build() {
      const r = 1.9;
      const items = [
        circle(0, 0, 0, r),
        point(0, 0, 0),
        line(0, [
          { x: 0, y: 0 },
          { x: 0, y: r },
        ]),
        text(0, 0.8, r * 0.55, '20 cm'),
        arc(1, 0, 0, r, Math.PI / 2, -Math.PI, { color: AXIS }),
        text(1, 0, -r - 0.45, '30 分钟：半圈 = 62.8 cm', { color: AXIS }),
        arc(2, 0, 0, r * 0.9, Math.PI / 2, -Math.PI * 1.5, { color: '#12a375' }),
        text(2, 0, -r - 0.95, '45 分钟：3/4 圈 = 94.2 cm', { color: '#12a375' }),
      ];
      return items;
    },
  },

  {
    id: 5,
    title: '围牛栏',
    prompt:
      '一个圆形牛栏的半径是 15 m，至少要用多长的粗铁丝才能把牛栏围上 3 圈？（接头处忽略不计。）如果每隔 2 m 打一根木桩，大约要打多少根木桩？',
    steps: [
      {
        title: '先求一圈的周长',
        detail: 'C = 2 × 3.14 × 15 = 94.2（m）。',
      },
      {
        title: '围 3 圈',
        detail: '94.2 × 3 = <b>282.6</b>（m）。',
      },
      {
        title: '每隔 2 m 打一根木桩',
        detail: '一圈 94.2 m 里有几个 2 m：94.2 ÷ 2 = 47.1，所以大约要打 <b>47 根</b>（打桩要围成一圈，不能四舍五入成 47.1 根）。',
      },
    ],
    answer: '铁丝至少 282.6 m；大约要打 47 根木桩。',
    build() {
      const r = 1.7;
      return [
        circle(0, 0, 0, r),
        point(0, 0, 0),
        line(0, [
          { x: 0, y: 0 },
          { x: r, y: 0 },
        ]),
        text(0, r / 2, 0.28, '15 m'),
        text(1, 0, -r - 0.45, '一圈 94.2 m × 3 圈 = 282.6 m'),
        text(2, 0, -r - 0.95, '94.2 ÷ 2 ≈ 47（根木桩）', { color: AXIS }),
      ];
    },
  },

  {
    id: 6,
    title: '独轮车走钢丝',
    prompt:
      '杂技演员表演独轮车走钢丝，车轮的直径为 40 cm，要骑过 50.24 m 长的钢丝，车轮大约要转动多少周？',
    steps: [
      {
        title: '车轮转一周走过的路程 = 车轮的周长',
        detail: 'C = 3.14 × 0.4 = 1.256（m）。注意 40 cm = 0.4 m。',
      },
      {
        title: '总路程 ÷ 一周路程 = 转动周数',
        detail: '50.24 ÷ 1.256 = <b>40</b>（周）。',
      },
    ],
    answer: '车轮大约要转动 40 周。',
    build() {
      const r = 0.9;
      const items = [
        circle(0, 0, 1.2, r),
        point(0, 0, 1.2),
        text(0, 0, 1.2 + r + 0.35, '车轮 d = 40 cm'),
        line(0, [
          { x: -3.4, y: -1.4 },
          { x: 3.4, y: -1.4 },
        ], { color: MUTED }),
        text(0, 0, -1.4 - 0.42, '钢丝 50.24 m', { color: MUTED }),
        text(1, 0, -0.05, '一周 = 3.14 × 0.4 = 1.256 m', { color: AXIS }),
        text(1, 0, -0.62, '50.24 ÷ 1.256 = 40 周', { color: '#12a375' }),
      ];
      return items;
    },
  },

  {
    id: 7,
    title: '看图填空',
    prompt: `看图填空（单位：cm）。
      <span class="sub">（1）正方形里最大的圆，半径 r = 2。正方形的周长（　）cm，圆的周长（　）cm。</span>
      <span class="sub">（2）长方形里两个相等的圆，半径 r = 1.5。其中一个圆的周长（　）cm，长方形的周长（　）cm。</span>`,
    steps: [
      {
        title: '（1）圆的直径 = 正方形边长',
        detail: 'd = 2 × 2 = 4 cm，所以正方形边长是 4 cm，周长 = 4 × 4 = <b>16</b>（cm）。',
      },
      {
        title: '（1）再算圆的周长',
        detail: 'C = 3.14 × 4 = <b>12.56</b>（cm）。',
      },
      {
        title: '（2）一个圆的周长',
        detail: 'd = 1.5 × 2 = 3 cm，C = 3.14 × 3 = <b>9.42</b>（cm）。',
      },
      {
        title: '（2）长方形的长和宽',
        detail: '长 = 两个直径 = 6 cm，宽 = 一个直径 = 3 cm，周长 = (6 + 3) × 2 = <b>18</b>（cm）。',
      },
    ],
    answer: '（1）16 cm、12.56 cm　（2）9.42 cm、18 cm',
    build() {
      const scale = 0.36;
      const items = [];

      // (1) 正方形内切圆 r = 2
      const half1 = 2 * scale;
      const c1 = { x: -2.3, y: 0.6 };
      items.push(
        line(
          0,
          [
            { x: c1.x - half1, y: c1.y - half1 },
            { x: c1.x + half1, y: c1.y - half1 },
            { x: c1.x + half1, y: c1.y + half1 },
            { x: c1.x - half1, y: c1.y + half1 },
          ],
          { closed: true },
        ),
        circle(0, c1.x, c1.y, half1),
        point(0, c1.x, c1.y),
        line(0, [
          { x: c1.x, y: c1.y },
          { x: c1.x + half1, y: c1.y },
        ]),
        text(0, c1.x, c1.y + half1 + 0.3, 'r = 2'),
        text(1, c1.x, c1.y - half1 - 0.4, '正方形周长 = 16 cm'),
      );

      // (2) 长方形内两个圆 r = 1.5
      const r2 = 1.5 * scale;
      const c2 = { x: 2.4, y: 0.3 };
      items.push(
        line(
          2,
          [
            { x: c2.x - 2 * r2, y: c2.y - r2 },
            { x: c2.x + 2 * r2, y: c2.y - r2 },
            { x: c2.x + 2 * r2, y: c2.y + r2 },
            { x: c2.x - 2 * r2, y: c2.y + r2 },
          ],
          { closed: true },
        ),
        circle(2, c2.x - r2, c2.y, r2),
        circle(2, c2.x + r2, c2.y, r2),
        text(2, c2.x, c2.y + r2 + 0.3, 'r = 1.5'),
        text(3, c2.x, c2.y - r2 - 0.4, '长方形周长 = 18 cm'),
      );

      return items;
    },
  },

  {
    id: 8,
    title: '剪一个最大的圆',
    prompt: '在一个周长为 100 cm 的正方形纸片内，要剪一个半径最大的圆，这个圆的半径是多少厘米？',
    steps: [
      {
        title: '正方形的边长',
        detail: '周长 100 cm → 边长 = 100 ÷ 4 = 25（cm）。',
      },
      {
        title: '最大的圆与四条边相切',
        detail: '圆的直径 = 正方形边长 = 25 cm，所以半径 = 25 ÷ 2 = <b>12.5</b>（cm）。',
      },
    ],
    answer: '这个圆的半径是 12.5 cm。',
    build() {
      const half = 1.6;
      const r = half;
      return [
        line(
          0,
          [
            { x: -half, y: -half },
            { x: half, y: -half },
            { x: half, y: half },
            { x: -half, y: half },
          ],
          { closed: true },
        ),
        text(0, 0, -half - 0.42, '周长 100 cm → 边长 25 cm'),
        circle(1, 0, 0, r),
        point(1, 0, 0),
        line(1, [
          { x: 0, y: 0 },
          { x: r, y: 0 },
        ], { color: AXIS }),
        text(1, r * 0.1, 0.3, 'r = 12.5 cm', { color: AXIS }),
      ];
    },
  },

  {
    id: 9,
    title: '门上的装饰木条',
    prompt: '李明家一扇门上要装上形状如右图所示的装饰木条，需要木条多少米？<span class="sub">（上半圆直径 50 cm，下面是一个 50 cm × 50 cm 的部分）</span>',
    steps: [
      {
        title: '木条 = 半圆弧 + 两条竖边 + 底边',
        detail: '半圆弧长 = 3.14 × 50 ÷ 2 = 78.5（cm）。',
      },
      {
        title: '把直边加起来',
        detail: '左右两条竖边各 50 cm，底边 50 cm：50 × 3 = 150（cm）。',
      },
      {
        title: '合计',
        detail: '78.5 + 150 = <b>228.5</b>（cm）= 2.285 m。',
      },
    ],
    answer: '需要木条 228.5 cm（2.285 m）。',
    build() {
      const w = 1.5;
      const h = 1.5;
      return [
        arc(0, 0, 0, w, 0, Math.PI),
        line(0, [
          { x: -w, y: 0 },
          { x: -w, y: -h },
          { x: w, y: -h },
          { x: w, y: 0 },
        ]),
        line(0, [
          { x: -w, y: 0 },
          { x: w, y: 0 },
        ], { color: '#c7d0e4' }),
        text(0, 0, 0.35, 'd = 50 cm'),
        text(0, 0, -h - 0.42, '50 cm'),
        line(1, [
          { x: w + 0.3, y: 0 },
          { x: w + 0.3, y: -h },
        ], { color: AXIS }),
        text(1, w + 1.0, -h / 2, '50 cm', { color: AXIS }),
        arc(2, 0, 0, w, 0, Math.PI, { color: '#12a375' }),
        text(2, 0, w + 0.5, '78.5 + 50 × 3 = 228.5 cm', { color: '#12a375' }),
      ];
    },
  },

  {
    id: 10,
    title: '奇妙的图形周长',
    prompt: '下面图形的周长是多少厘米？你是怎样计算的？',
    steps: [
      {
        title: '把它拆成三个半圆',
        detail: '外面是直径 10 cm 的大半圆，里面是两个直径都是 5 cm 的小半圆。',
      },
      {
        title: '三个半圆弧加起来',
        detail: '周长 = 3.14 × 10 ÷ 2 + 3.14 × 5 ÷ 2 + 3.14 × 5 ÷ 2。',
      },
      {
        title: '换个算法更快',
        detail: '3.14 × (10 + 5 + 5) ÷ 2 = 3.14 × 20 ÷ 2 = <b>31.4</b>（cm）。',
      },
    ],
    answer: '图形的周长是 31.4 cm。',
    build() {
      const r = 2;
      const half = r / 2;
      return [
        arc(0, 0, 0, r, 0, Math.PI),
        line(0, [
          { x: -r, y: 0 },
          { x: r, y: 0 },
        ], { color: MUTED, dashed: true }),
        // 5 cm 标注
        line(0, [
          { x: -r, y: -0.35 },
          { x: -r, y: -0.6 },
        ], { color: AXIS }),
        line(0, [
          { x: 0, y: -0.35 },
          { x: 0, y: -0.6 },
        ], { color: AXIS }),
        line(0, [
          { x: -r, y: -0.48 },
          { x: 0, y: -0.48 },
        ], { color: AXIS }),
        text(0, -half, -0.9, '5 cm', { color: AXIS }),
        text(0, 0.9, 0.34, '10 cm', { color: MUTED }),
        arc(1, -half, 0, half, 0, Math.PI),
        arc(1, half, 0, half, Math.PI, Math.PI),
        text(1, 0, r + 0.45, '3.14 × (10 + 5 + 5) ÷ 2 = 31.4 cm', { color: '#12a375' }),
      ];
    },
  },

  {
    id: 11,
    title: '填表与倍数关系',
    prompt: `把表格补充完整，再填空。
      <table class="data-table" style="margin-top:8px">
        <tr><th>圆</th><th>半径 / cm</th><th>直径 / cm</th><th>周长 / cm</th></tr>
        <tr><td>A</td><td><span class="blank">?</span></td><td><span class="blank">?</span></td><td>12.56</td></tr>
        <tr><td>B</td><td><span class="blank">?</span></td><td>6</td><td><span class="blank">?</span></td></tr>
        <tr><td>C</td><td>4</td><td><span class="blank">?</span></td><td><span class="blank">?</span></td></tr>
      </table>
      <span class="sub">半径扩大到原来的 n 倍，直径扩大到原来的（　）倍，周长扩大到原来的（　）倍。</span>`,
    steps: [
      {
        title: '圆 A：已知周长求直径、半径',
        detail: 'd = 12.56 ÷ 3.14 = 4 cm，r = 2 cm。',
      },
      {
        title: '圆 B：已知直径',
        detail: 'r = 6 ÷ 2 = 3 cm，C = 3.14 × 6 = 18.84 cm。',
      },
      {
        title: '圆 C：已知半径',
        detail: 'd = 4 × 2 = 8 cm，C = 3.14 × 8 = 25.12 cm。',
      },
      {
        title: '看倍数关系',
        detail: '直径 = 2r、周长 = πd，所以半径扩大 n 倍，直径也扩大 n 倍，周长同样扩大 n 倍。',
      },
    ],
    answer:
      'A：r = 2、d = 4；B：r = 3、C = 18.84；C：d = 8、C = 25.12。半径扩大 n 倍，直径、周长都扩大 n 倍。',
    build: () => [],
  },

  {
    id: 12,
    title: '捆圆柱（思考题）',
    prompt: `把圆柱形物体分别捆成如下图的形状（从底面方向看），如果接头处不计，每组至少需要多长的绳子？你发现了什么？
      <span class="sub">每个圆柱底面直径 7 cm；三组分别是 1 个、2×2 个、3×3 个。</span>`,
    steps: [
      {
        title: '1 个圆柱',
        detail: '绳子正好绕一圈：3.14 × 7 = <b>21.98</b>（cm）。',
      },
      {
        title: '2×2 个圆柱：1 个圆 + 4 条直边',
        detail: '四个角各是一段 1/4 圆弧，合起来正好是一个整圆；四条直边每条 = 1 个直径。21.98 + 7 × 4 = <b>49.98</b>（cm）。',
      },
      {
        title: '3×3 个圆柱',
        detail: '还是一个整圆 + 四条直边，但每条直边 = 2 个直径：21.98 + 14 × 4 = <b>77.98</b>（cm）。',
      },
      {
        title: '发现了什么',
        detail: '绳子长度 = 一个圆的周长 + 4 条直边；每多围一层，直边就多 1 个直径，绳子多 4 × 7 = 28 cm。',
      },
    ],
    answer: '分别是 21.98 cm、49.98 cm、77.98 cm。规律：绳子 = 一个圆的周长 + 4 条直边，每多一层多 28 cm。',
    build() {
      const r = 0.52;
      const items = [];

      // 1 个
      items.push(circle(0, -4.2, 0, r), text(0, -4.2, -r - 0.4, '1 个'));
      items.push(...rope(0, -4.2, 0, r, 1));

      // 2×2
      for (const dx of [-1, 1]) {
        for (const dy of [-1, 1]) {
          items.push(circle(0, 0 + dx * r, 0 + dy * r, r));
        }
      }
      items.push(text(0, 0, -2 * r - 0.4, '2×2 个'));
      items.push(...rope(1, 0, 0, r, 2));

      // 3×3
      for (let i = 0; i < 3; i += 1) {
        for (let j = 0; j < 3; j += 1) {
          items.push(circle(0, 4.4 + (i - 1) * 2 * r, (j - 1) * 2 * r, r));
        }
      }
      items.push(text(0, 4.4, -3 * r - 0.4, '3×3 个'));
      items.push(...rope(2, 4.4, 0, r, 3));

      items.push(
        text(1, -4.2, r + 0.75, '21.98', { color: AXIS }),
        text(2, 0, 2 * r + 0.75, '49.98', { color: AXIS }),
        text(3, 4.4, 3 * r + 0.75, '77.98', { color: AXIS }),
      );
      return items;
    },
  },
];

/**
 * 捆绳路径：四个角各一段 1/4 圆弧 + 四条直边。
 * n = 每行/每列的圆柱个数，r = 圆柱半径。
 */
function rope(step, cx, cy, r, n) {
  if (n === 1) {
    return [circle(step, cx, cy, r, { color: AXIS })];
  }
  const half = (n - 1) * r;
  const side = n * r;
  return [
    arc(step, cx - half, cy - half, r, Math.PI, Math.PI / 2, { color: AXIS }),
    arc(step, cx + half, cy - half, r, -Math.PI / 2, Math.PI / 2, { color: AXIS }),
    arc(step, cx + half, cy + half, r, 0, Math.PI / 2, { color: AXIS }),
    arc(step, cx - half, cy + half, r, Math.PI / 2, Math.PI / 2, { color: AXIS }),
    line(step, [{ x: cx - half, y: cy - side }, { x: cx + half, y: cy - side }], { color: AXIS }),
    line(step, [{ x: cx + side, y: cy - half }, { x: cx + side, y: cy + half }], { color: AXIS }),
    line(step, [{ x: cx - half, y: cy + side }, { x: cx + half, y: cy + side }], { color: AXIS }),
    line(step, [{ x: cx - side, y: cy - half }, { x: cx - side, y: cy + half }], { color: AXIS }),
  ];
}

export default createExerciseLesson({ title: '练习十四', questions: QUESTIONS });
