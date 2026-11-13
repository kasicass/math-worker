/**
 * 六上 · 扇形统计图：练习二十一（课本 PDF 第 103–104 页 / 印刷页 98–99 的 5 道题）。
 *
 * 读扇形统计图：百分比之和是 100%，各部分数量 = 总数 × 百分比。
 */
import { MUTED, createExerciseLesson } from '../core/exercise-player.js';

/** 直接在练习页里画一个饼图（用 three 的图元） */
function pie(step, items, radius, center = { x: 0, y: 0.4 }) {
  const out = [];
  let start = Math.PI / 2;
  for (const item of items) {
    const sweep = (item.percent / 100) * Math.PI * 2;
    out.push({
      step,
      kind: 'fillDisk',
      cx: center.x,
      cy: center.y,
      r: radius,
      start: start - sweep,
      sweep,
      color: item.color,
      opacity: 0.95,
    });
    const mid = start - sweep / 2;
    out.push({
      step,
      kind: 'label',
      x: center.x + Math.cos(mid) * radius * 0.66,
      y: center.y + Math.sin(mid) * radius * 0.66,
      text: `${item.percent}%`,
      size: 0.28,
      color: '#1c2333',
    });
    start -= sweep;
  }
  out.push({
    step,
    kind: 'arc',
    cx: center.x,
    cy: center.y,
    r: radius,
    start: 0,
    sweep: Math.PI * 2,
    color: MUTED,
  });
  return out;
}

const QUESTIONS = [
  {
    id: 1,
    title: '李明的作息时间',
    prompt: `李明每天的作息时间安排如下图（睡眠 41%、上课 17%、活动 13%、做作业 8%、看电视 4%、进餐 4%、其他 13%）。
      <span class="sub">（1）李明每天花多少小时做作业？你还能得到哪些信息？</span>
      <span class="sub">（2）你认为李明的作息时间安排得合理吗？</span>
      <span class="sub">（3）你的作息时间与李明的有什么不同？</span>`,
    steps: [
      {
        title: '一天 24 小时就是 100%',
        detail: '做作业：24 × 8% = <b>1.92</b>（小时）≈ 1 小时 55 分。',
      },
      {
        title: '还能读到很多信息',
        detail: '睡眠 24 × 41% = 9.84 小时；上课 24 × 17% = 4.08 小时；活动 24 × 13% = 3.12 小时。',
      },
      {
        title: '看看是否合理',
        detail: '小学生每天应睡 10 小时左右，李明只睡了约 9.8 小时，稍微少一点；看电视 24 × 4% ≈ 1 小时，比较合适。',
      },
    ],
    answer:
      '做作业约 1.92 小时；睡眠约 9.84 小时、上课约 4.08 小时、活动约 3.12 小时。整体比较合理，睡眠还可以再多一些。',
    build() {
      return pie(0, [
        { percent: 41, color: '#ffd9a8' },
        { percent: 17, color: '#f7a3a8' },
        { percent: 13, color: '#c8b6f0' },
        { percent: 8, color: '#ffe9a8' },
        { percent: 4, color: '#8fb0ff' },
        { percent: 4, color: '#9be0c4' },
        { percent: 13, color: '#cfe0d8' },
      ], 2.2);
    },
  },

  {
    id: 2,
    title: '陈东家的支出',
    prompt: `陈东家每月各种支出计划如下图（食品 30%、还购房贷款 30%、教育 15%、服装 10%、水电 5%、其他 10%）。
      <span class="sub">（1）你能得到哪些信息？</span>
      <span class="sub">（2）如果陈东家每月总计支出 2000 元，你能提出并解决哪些数学问题？</span>`,
    steps: [
      {
        title: '先看谁占得最多',
        detail: '食品和还购房贷款各占 30%，是最大的两项；水电最少，只占 5%。',
      },
      {
        title: '2000 元时各是多少',
        detail: '食品 2000 × 30% = 600 元；房贷 600 元；教育 2000 × 15% = 300 元；服装 200 元；水电 100 元；其他 200 元。',
      },
      {
        title: '验算',
        detail: '600 + 600 + 300 + 200 + 100 + 200 = 2000 ✓；30% + 30% + 15% + 10% + 5% + 10% = 100% ✓。',
      },
    ],
    answer:
      '食品与房贷各占 30% 最多。每月 2000 元时：食品 600 元、房贷 600 元、教育 300 元、服装 200 元、水电 100 元、其他 200 元。',
    build() {
      return pie(0, [
        { percent: 30, color: '#ffc9a8' },
        { percent: 30, color: '#c8b6f0' },
        { percent: 15, color: '#a8e0f0' },
        { percent: 10, color: '#bfe3b8' },
        { percent: 5, color: '#f7b8d0' },
        { percent: 10, color: '#ffe9a8' },
      ], 2.2);
    },
  },

  {
    id: 3,
    title: '空气的主要成分',
    prompt: `空气主要成分的体积所占百分比情况如右图（氮气 78%、氧气 21%、其他 1%）。
      <span class="sub">（1）100 L 空气中含有多少升氧气？</span>
      <span class="sub">（2）估计一下，教室内大约有多少升氧气？</span>`,
    steps: [
      {
        title: '（1）直接乘百分比',
        detail: '100 × 21% = <b>21</b>（L）。',
      },
      {
        title: '（2）先估教室体积',
        detail: '比如教室长 8 m、宽 6 m、高 3 m，体积 = 144 m³ = 144000 L。',
      },
      {
        title: '再乘 21%',
        detail: '144000 × 21% = 30240 L ≈ 3 万升氧气。',
      },
    ],
    answer: '（1）100 L 空气中有 21 L 氧气。（2）以 144 m³ 的教室为例，约 30240 L 氧气。',
    build() {
      return pie(0, [
        { percent: 78, color: '#ffd9a8' },
        { percent: 21, color: '#f7a3a8' },
        { percent: 1, color: '#a8e0f0' },
      ], 2.2);
    },
  },

  {
    id: 4,
    title: '我国各种地形的面积',
    prompt: `我国陆地领土面积约 960 万平方千米，各种地形所占百分比如右图（山地 33%、高原 26%、盆地 19%、平原 12%、丘陵 10%）。
      <span class="sub">（1）计算出各种地形的面积，填入表格。</span>
      <span class="sub">（2）根据这些信息，你能提出什么数学问题？试着解答一下。</span>`,
    steps: [
      {
        title: '（1）都用 960 乘百分比',
        detail: '山地 960 × 33% = 316.8；高原 960 × 26% = 249.6；盆地 960 × 19% = 182.4；平原 960 × 12% = 115.2；丘陵 960 × 10% = 96（万平方千米）。',
      },
      {
        title: '验算',
        detail: '316.8 + 249.6 + 182.4 + 115.2 + 96 = 960 ✓，百分比之和 100% ✓。',
      },
      {
        title: '（2）可以问',
        detail: '“山地比平原多多少万平方千米？” 316.8 − 115.2 = 201.6（万平方千米）。',
      },
    ],
    answer:
      '山地 316.8、高原 249.6、盆地 182.4、平原 115.2、丘陵 96（万平方千米）；例如山地比平原多 201.6 万平方千米。',
    build() {
      return pie(0, [
        { percent: 33, color: '#bfe3b8' },
        { percent: 26, color: '#f7b8d0' },
        { percent: 19, color: '#a8e0f0' },
        { percent: 12, color: '#ffe9a8' },
        { percent: 10, color: '#c8b6f0' },
      ], 2.2);
    },
  },

  {
    id: 5,
    title: '广东省的人口',
    prompt:
      '下面是广东省 2000 年、2010 年、2020 年总常住人口和城镇常住人口变化的情况。<span class="sub">2000 年 8650.03 万（城镇 55%）、2010 年 10440.94 万（城镇 66.2%）、2020 年 12601.25 万（城镇 74.1%）</span>',
    steps: [
      {
        title: '先看总量在增长',
        detail: '总常住人口 8650.03 万 → 10440.94 万 → 12601.25 万，一直在增加。',
      },
      {
        title: '再看城镇人口的比例',
        detail: '55% → 66.2% → 74.1%，城镇人口占比越来越高。',
      },
      {
        title: '还能算出城镇人口数',
        detail: '2020 年城镇人口 = 12601.25 × 74.1% ≈ 9334（万）。',
      },
    ],
    answer:
      '总人口逐年增加（8650→10441→12601 万），城镇人口比例逐年提高（55%→66.2%→74.1%），说明城镇化程度在提高。',
    build: () => [],
  },
];

export default createExerciseLesson({ title: '练习二十一', unit: '扇形统计图', questions: QUESTIONS });
