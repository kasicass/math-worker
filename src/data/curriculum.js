/**
 * 课程数据（单一数据源）。
 *
 * 结构：
 *   book    —— 一册教材（对应首页一个入口），共 12 册
 *   topic   —— 单元 / 章节（对应课本目录的一条）
 *   section —— 单元下的一个互动主题（可有多个），真正挂交互脚本的是它
 *
 * 兼容两种写法：
 *   A. 单元只有一节：topic.lesson + topic.status（旧写法，仍支持）
 *   B. 单元拆多节：topic.sections = [{ id, title, lesson, status }]
 *
 * section.status:
 *   'ready'   交互脚本已实现，配合 section.lesson 指向 src/lessons 注册表
 *   'planned' 教学设计中
 *
 * 说明：page 为课本页码，来自 doc/ 下教材 PDF 的目录页；verified=false
 * 表示尚未人工核对，需要对照 PDF 目录页确认后再改为 true。
 */

/** 12 册教材的骨架：一年级上册 → 六年级下册 */
const BOOK_META = [
  { id: 'g1a', grade: 1, term: 'upper', label: '一上' },
  { id: 'g1b', grade: 1, term: 'lower', label: '一下' },
  { id: 'g2a', grade: 2, term: 'upper', label: '二上' },
  { id: 'g2b', grade: 2, term: 'lower', label: '二下' },
  { id: 'g3a', grade: 3, term: 'upper', label: '三上' },
  { id: 'g3b', grade: 3, term: 'lower', label: '三下' },
  { id: 'g4a', grade: 4, term: 'upper', label: '四上' },
  { id: 'g4b', grade: 4, term: 'lower', label: '四下' },
  { id: 'g5a', grade: 5, term: 'upper', label: '五上' },
  { id: 'g5b', grade: 5, term: 'lower', label: '五下' },
  { id: 'g6a', grade: 6, term: 'upper', label: '六上' },
  { id: 'g6b', grade: 6, term: 'lower', label: '六下' },
];

/** 各册主题（按课本目录顺序）；目前只有六年级上册已录入，来源于 doc/数学六上.pdf */
const TOPICS = {
  g6a: [
    {
      id: 'fraction-multiply',
      title: '分数乘法',
      page: 2,
      verified: false,
      sections: [
        { id: 'fraction-multiply-model', title: '分数乘法', lesson: 'fraction-multiply', status: 'ready' },
        { id: 'exercise-1', title: '练习一', lesson: 'exercise-1', status: 'ready' },
        { id: 'exercise-2', title: '练习二', lesson: 'exercise-2', status: 'ready' },
        { id: 'exercise-3', title: '练习三', lesson: 'exercise-3', status: 'ready' },
      ],
    },
    {
      id: 'position-direction',
      title: '位置与方向（二）',
      page: 18,
      verified: false,
      sections: [
        { id: 'direction-model', title: '位置与方向', lesson: 'direction', status: 'ready' },
        { id: 'exercise-5', title: '练习五', lesson: 'exercise-5', status: 'ready' },
      ],
    },
    {
      id: 'fraction-divide',
      title: '分数除法',
      page: 27,
      verified: false,
      sections: [
        { id: 'fraction-divide-model', title: '分数除法', lesson: 'fraction-divide', status: 'ready' },
        { id: 'exercise-6', title: '练习六', lesson: 'exercise-6', status: 'ready' },
        { id: 'exercise-7', title: '练习七', lesson: 'exercise-7', status: 'ready' },
        { id: 'solve-by-fraction', title: '解决问题', lesson: 'solve-by-fraction', status: 'ready' },
        { id: 'exercise-8', title: '练习八', lesson: 'exercise-8', status: 'ready' },
      ],
    },
    {
      id: 'ratio',
      title: '比',
      page: 46,
      verified: false,
      sections: [
        { id: 'ratio-model', title: '比', lesson: 'ratio', status: 'ready' },
        { id: 'exercise-11', title: '练习十一', lesson: 'exercise-11', status: 'ready' },
        { id: 'ratio-distribution', title: '按比分配', lesson: 'ratio-distribution', status: 'ready' },
        { id: 'exercise-12', title: '练习十二', lesson: 'exercise-12', status: 'ready' },
      ],
    },
    {
      id: 'circle',
      title: '圆',
      page: 55,
      verified: false,
      sections: [
        {
          id: 'radius-diameter-circumference',
          title: '半径、直径与周长',
          lesson: 'circle',
          status: 'ready',
        },
        {
          id: 'compass-construction',
          title: '尺规作图',
          lesson: 'compass-construction',
          status: 'ready',
        },
        {
          id: 'exercise-13',
          title: '练习十三',
          lesson: 'exercise-13',
          status: 'ready',
        },
        {
          id: 'exercise-14',
          title: '练习十四',
          lesson: 'exercise-14',
          status: 'ready',
        },
        {
          id: 'circle-area',
          title: '圆的面积',
          lesson: 'circle-area',
          status: 'ready',
        },
        {
          id: 'exercise-15',
          title: '练习十五',
          lesson: 'exercise-15',
          status: 'ready',
        },
        {
          id: 'sector',
          title: '扇形',
          lesson: 'sector',
          status: 'ready',
        },
        {
          id: 'exercise-16',
          title: '练习十六',
          lesson: 'exercise-16',
          status: 'ready',
        },
        {
          id: 'exercise-17',
          title: '练习十七',
          lesson: 'exercise-17',
          status: 'ready',
        },
      ],
    },
    {
      id: 'percent',
      title: '百分数（一）',
      page: 80,
      verified: false,
      sections: [
        { id: 'percent-meaning', title: '百分数的意义', lesson: 'percent', status: 'ready' },
        { id: 'exercise-18', title: '练习十八', lesson: 'exercise-18', status: 'ready' },
        { id: 'percent-change', title: '多（少）百分之几', lesson: 'percent-change', status: 'ready' },
        { id: 'exercise-19', title: '练习十九', lesson: 'exercise-19', status: 'ready' },
      ],
    },
    {
      id: 'pie-chart',
      title: '扇形统计图',
      page: 94,
      verified: false,
      sections: [
        { id: 'pie-chart-model', title: '扇形统计图', lesson: 'pie-chart', status: 'ready' },
        { id: 'exercise-21', title: '练习二十一', lesson: 'exercise-21', status: 'ready' },
      ],
    },
    { id: 'number-shape', title: '数学广角——数与形', page: 103, verified: false, status: 'planned' },
    { id: 'review', title: '总复习', page: 110, verified: false, status: 'planned' },
  ],
};

/** 所有册，按课本顺序排序 */
export const books = BOOK_META.map((meta) => ({
  ...meta,
  name: `${meta.grade} 年级${meta.term === 'upper' ? '上册' : '下册'}`,
  topics: TOPICS[meta.id] ?? [],
}));

/** 单元下的互动主题列表（兼容只写 topic.lesson 的旧写法） */
export function sectionsOf(topic) {
  if (!topic) return [];
  if (Array.isArray(topic.sections) && topic.sections.length) return topic.sections;
  if (topic.lesson) {
    return [{ id: topic.id, title: topic.title, lesson: topic.lesson, status: topic.status ?? 'planned' }];
  }
  return [];
}

/** 单元状态由它下面的主题推导 */
export function stateOf(topic) {
  const sections = sectionsOf(topic);
  if (!sections.length) return 'planned';
  const ready = sections.filter((s) => s.status === 'ready').length;
  if (ready === sections.length) return 'ready';
  return ready > 0 ? 'partial' : 'planned';
}

/** 某一册里可互动的主题数量 */
export function readyCountOf(book) {
  return book.topics.reduce(
    (sum, topic) => sum + sectionsOf(topic).filter((s) => s.status === 'ready').length,
    0,
  );
}

/** 全站可互动的主题数量，用于首页统计 */
export function countReadyLessons() {
  return books.reduce((sum, book) => sum + readyCountOf(book), 0);
}

export function findBook(bookId) {
  return books.find((book) => book.id === bookId) ?? null;
}

export function findTopic(bookId, topicId) {
  const book = findBook(bookId);
  if (!book) return { book: null, topic: null };
  return { book, topic: book.topics.find((t) => t.id === topicId) ?? null };
}

export function findSection(bookId, topicId, sectionId) {
  const { book, topic } = findTopic(bookId, topicId);
  if (!topic) return { book, topic: null, section: null };
  return { book, topic, section: sectionsOf(topic).find((s) => s.id === sectionId) ?? null };
}
