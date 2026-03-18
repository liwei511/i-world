// I 的世界 - 自我见证日记系统
// 记录玩家的足迹和提问，帮助看见自己的成长

const Diary = {
  // 日记条目
  entries: [],

  // 初始化
  init() {
    const saved = wx.getStorageSync('iworld-diary');
    if (saved) {
      this.entries = saved;
    } else {
      this.entries = [];
    }
  },

  // 保存
  save() {
    wx.setStorageSync('iworld-diary', this.entries);
  },

  // 添加来访记录
  addVisit(season, weather) {
    const today = new Date();
    const entry = {
      date: today.toISOString().split('T')[0],
      time: today.toTimeString().slice(0, 5),
      type: 'visit',
      season: season,
      weather: weather
    };
    this.entries.push(entry);
    this.save();
  },

  // 添加提问记录
  addQuestion(question, answer) {
    const today = new Date();
    const entry = {
      date: today.toISOString().split('T')[0],
      time: today.toTimeString().slice(0, 5),
      type: 'question',
      question: question,
      answer: answer
    };
    this.entries.push(entry);
    this.save();
  },

  // 获取所有条目，按时间倒序
  getEntries() {
    return this.entries.sort((a, b) => a.date < b.date ? 1 : -1);
  },

  // 统计：你来了多少次
  countVisits() {
    return this.entries.filter(e => e.type === 'visit').length;
  },

  // 统计：你问过多少问题
  countQuestions() {
    return this.entries.filter(e => e.type === 'question').length;
  },

  // 看看一个月前的自己和现在
  getGrowthCompare() {
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    const oldEntries = this.entries.filter(e => new Date(e.date) < oneMonthAgo);
    const newEntries = this.entries.filter(e => new Date(e.date) >= oneMonthAgo);
    return {
      oldQuestions: oldEntries.filter(e => e.type === 'question').length,
      newQuestions: newEntries.filter(e => e.type === 'question').length,
      totalVisits: this.countVisits()
    };
  },

  // 打开日记页面显示
  openDiaryPage() {
    // 页面渲染数据
    const entries = this.getEntries();
    const stats = {
      totalVisits: this.countVisits(),
      totalQuestions: this.countQuestions(),
      growth: this.getGrowthCompare()
    };
    return {
      entries,
      stats
    };
  }
};

module.exports = Diary;
