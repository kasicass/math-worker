/**
 * 六上 · 百分数（一）：练习十八（课本 PDF 第 89–90 页 / 印刷页 84–85 的 10 道题）。
 *
 * 百分数的读写法、与分数小数的互化、出油率/发芽率、以及简单的百分数应用。
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

/** 10×10 方格，涂满前 count 格 */
function grid(step, x, y, side, count, color = SOFT_A) {
  const cell = side / 10;
  const items = [];
  const rows = Math.floor(count / 10);
  if (rows > 0) {
    items.push(
      region(
        step,
        [
          { x, y: y + side - rows * cell },
          { x: x + side, y: y + side - rows * cell },
          { x: x + side, y: y + side },
          { x, y: y + side },
        ],
        { color, opacity: 0.95 },
      ),
    );
  }
  const rest = count - rows * 10;
  if (rest > 0) {
    const yTop = y + side - rows * cell;
    items.push(
      region(
        step,
        [
          { x, y: yTop - cell },
          { x: x + rest * cell, y: yTop - cell },
          { x: x + rest * cell, y: yTop },
          { x, y: yTop },
        ],
        { color, opacity: 0.95 },
      ),
    );
  }
  for (let i = 0; i <= 10; i += 1) {
    items.push(
      line(step, [{ x: x + i * cell, y }, { x: x + i * cell, y: y + side }], { color: '#c7d0e4' }),
      line(step, [{ x, y: y + i * cell }, { x: x + side, y: y + i * cell }], { color: '#c7d0e4' }),
    );
  }
  return items;
}

const QUESTIONS = [
  {
    id: 1,
    title: '读出服装成分',
    prompt:
      '读出下面服装中各成分的百分数。<span class="sub">羊毛 86%、羊绒 14%；棉 63.2%、涤纶 36.8%；棉 60.2%、涤纶 36.4%、氨纶 3.4%</span>',
    steps: [
      {
        title: '读法：先读百分号，再读数字',
        detail: '86% 读作“百分之八十六”；14% 读作“百分之十四”。',
      },
      {
        title: '小数也要读出来',
        detail: '63.2% 读作“百分之六十三点二”；3.4% 读作“百分之三点四”。',
      },
      {
        title: '顺便算一算',
        detail: '第一件毛衣：86% + 14% = 100%，说明成分表写得很规范。',
      },
    ],
    answer: '百分之八十六、百分之十四；百分之六十三点二、百分之三十六点八；百分之六十点二、百分之三十六点四、百分之三点四。',
    build: () => [],
  },

  {
    id: 2,
    title: '写出百分数',
    prompt: `写出下面的百分数。
      <span class="sub">（1）第七次全国人口普查结果表明，全国人口中 0～14 岁人口约占百分之十八。</span>
      <span class="sub">（2）有百分之二十九的少年儿童表示“目前最要好的朋友是老师”。</span>
      <span class="sub">（3）感冒百分之九十左右由病毒引起，百分之十左右由细菌引起。</span>`,
    steps: [
      {
        title: '“百分之几”就写成几 %',
        detail: '百分之十八 → 18%；百分之二十九 → 29%。',
      },
      {
        title: '第三题的四个数',
        detail: '百分之九十 → 90%；百分之十 → 10%。',
      },
    ],
    answer: '（1）18%（2）29%（3）90%、10%',
    build: () => [],
  },

  {
    id: 3,
    title: '在方格纸上涂百分数',
    prompt: '在方格纸上按下面的百分数涂出相应数量的方格。<span class="sub">17%、32%、41%</span>',
    steps: [
      {
        title: '100 格就是 100%',
        detail: '每个方格代表 1%，涂 17 格就是 17%。',
      },
      {
        title: '数着涂',
        detail: '17% 涂 17 格；32% 涂满 3 行再加 2 格；41% 涂满 4 行再加 1 格。',
      },
    ],
    answer: '17% 涂 17 格，32% 涂 32 格，41% 涂 41 格。',
    build() {
      return [
        ...grid(0, -5.2, -1.6, 3.0, 17),
        text(0, -3.7, -2.1, '17%'),
        ...grid(1, -1.6, -1.6, 3.0, 32),
        text(1, -0.1, -2.1, '32%'),
        ...grid(1, 2.0, -1.6, 3.0, 41),
        text(1, 3.5, -2.1, '41%'),
      ];
    },
  },

  {
    id: 4,
    title: '把分数写成百分数',
    prompt: `根据下面的信息，你能用百分数表示出这些分数吗？
      <span class="sub">空气中氧气约占 1/5；地球上现存的动物种类中，节肢动物种类约占 4/5；我国陆地领土面积约占世界陆地总面积的 1/15。</span>`,
    steps: [
      {
        title: '分母能变成 100 的，直接化',
        detail: '1/5 = 20/100 = 20%；4/5 = 80/100 = 80%。',
      },
      {
        title: '分母不能变成 100 的，先算小数',
        detail: '1/15 ≈ 0.0667 = 6.67%（约 6.7%）。',
      },
    ],
    answer: '氧气约占 20%；节肢动物约占 80%；我国陆地领土约占世界陆地总面积的 6.7%（约）。',
    build: () => [],
  },

  {
    id: 5,
    title: '出油率',
    prompt: '榨油厂的李叔叔告诉小静：“2000 kg 花生仁能榨出花生油 760 kg。”这些花生仁的出油率是多少？',
    steps: [
      {
        title: '出油率 = 油的质量 ÷ 原料质量',
        detail: '出油率 = 760 ÷ 2000 = 0.38 = <b>38%</b>。',
      },
      {
        title: '记住这个公式',
        detail: '各种“率”都是“部分 ÷ 总数 × 100%”，出油率、发芽率、出勤率都一样。',
      },
    ],
    answer: '出油率是 38%。',
    build: () => [],
  },

  {
    id: 6,
    title: '发芽率',
    prompt: `生物小组进行玉米种子发芽实验，每次实验结果如下。请计算每次实验的发芽率。
      <table class="data-table" style="margin-top:8px">
        <tr><th>实验次数</th><th>实验种子数 / 粒</th><th>发芽种子数 / 粒</th><th>发芽率</th></tr>
        <tr><td>1</td><td>300</td><td>285</td><td><span class="blank">?</span></td></tr>
        <tr><td>2</td><td>300</td><td>282</td><td><span class="blank">?</span></td></tr>
        <tr><td>3</td><td>300</td><td>294</td><td><span class="blank">?</span></td></tr>
        <tr><td>4</td><td>300</td><td>291</td><td><span class="blank">?</span></td></tr>
      </table>`,
    steps: [
      {
        title: '发芽率 = 发芽数 ÷ 实验数',
        detail: '285 ÷ 300 = 0.95 = 95%；282 ÷ 300 = 0.94 = 94%。',
      },
      {
        title: '后两次',
        detail: '294 ÷ 300 = 0.98 = 98%；291 ÷ 300 = 0.97 = 97%。',
      },
    ],
    answer: '依次是 95%、94%、98%、97%。',
    build: () => [],
  },

  {
    id: 7,
    title: '数轴上的三种写法',
    prompt: '分别用百分数、分数、小数表示直线上的各点。<span class="sub">（数轴上依次标出 10%、20%、40%、50%、60%、75%、90% 七个点）</span>',
    steps: [
      {
        title: '先看一个例子',
        detail: '20% = 20/100 = 1/5 = 0.2。三个数说的是同一个点。',
      },
      {
        title: '依次写出来',
        detail: '10% = 1/10 = 0.1；40% = 2/5 = 0.4；50% = 1/2 = 0.5；60% = 3/5 = 0.6；75% = 3/4 = 0.75；90% = 9/10 = 0.9。',
      },
    ],
    answer:
      '10% = 1/10 = 0.1、20% = 1/5 = 0.2、40% = 2/5 = 0.4、50% = 1/2 = 0.5、60% = 3/5 = 0.6、75% = 3/4 = 0.75、90% = 9/10 = 0.9。',
    build: () => [],
  },

  {
    id: 8,
    title: '把表格补充完整',
    prompt: `把表格补充完整。
      <table class="data-table" style="margin-top:8px">
        <tr><th>百分数</th><td>32%</td><td><span class="blank">?</span></td><td><span class="blank">?</span></td><td><span class="blank">?</span></td><td><span class="blank">?</span></td><td>0.5%</td></tr>
        <tr><th>小数</th><td><span class="blank">?</span></td><td>1.5</td><td><span class="blank">?</span></td><td>0.025</td><td><span class="blank">?</span></td><td><span class="blank">?</span></td></tr>
        <tr><th>分数</th><td><span class="blank">?</span></td><td><span class="blank">?</span></td><td><span class="blank">?</span></td><td><span class="blank">?</span></td><td>1/3</td><td><span class="blank">?</span></td></tr>
      </table>`,
    steps: [
      {
        title: '从 32% 开始',
        detail: '32% = 0.32 = 8/25。',
      },
      {
        title: '1.5 和 0.025',
        detail: '1.5 = 150% = 3/2；0.025 = 2.5% = 1/40。',
      },
      {
        title: '1/3 和 0.5%',
        detail: '1/3 ≈ 0.333 = 33.3%；0.5% = 0.005 = 1/200。',
      },
    ],
    answer:
      '32% = 0.32 = 8/25；150% = 1.5 = 3/2；2.5% = 0.025 = 1/40；33.3% ≈ 0.333 = 1/3；0.5% = 0.005 = 1/200。',
    build: () => [],
  },

  {
    id: 9,
    title: '合唱团有多少人',
    prompt: '百花胡同小学有 480 人，有 10% 的学生参加了合唱团。参加合唱团的学生有多少人？',
    steps: [
      {
        title: '求 480 的 10%',
        detail: '480 × 10% = 480 × 0.1 = <b>48</b>（人）。',
      },
      {
        title: '也可以写成分数',
        detail: '10% = 1/10，480 × 1/10 = 48（人），结果一样。',
      },
    ],
    answer: '参加合唱团的学生有 48 人。',
    build: () => [],
  },

  {
    id: 10,
    title: '油菜籽的出油率',
    prompt: `（1）油菜籽的出油率是 42%。2100 kg 油菜籽可榨油多少千克？
      <span class="sub">（2）油菜籽的出油率是 42%。一个榨油厂榨出 2100 kg 菜籽油，用了多少千克油菜籽？</span>`,
    steps: [
      {
        title: '（1）求一个数的百分之几',
        detail: '2100 × 42% = 2100 × 0.42 = <b>882</b>（kg）。',
      },
      {
        title: '（2）已知部分求整体',
        detail: '2100 ÷ 42% = 2100 ÷ 0.42 = <b>5000</b>（kg）。',
      },
      {
        title: '两问正好互为逆运算',
        detail: '第（1）问是“原料 × 出油率 = 油”，第（2）问是“油 ÷ 出油率 = 原料”。',
      },
    ],
    answer: '（1）可榨油 882 kg；（2）用了 5000 kg 油菜籽。',
    build: () => [],
  },
];

export default createExerciseLesson({ title: '练习十八', unit: '百分数（一）', questions: QUESTIONS });
