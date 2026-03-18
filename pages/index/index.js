// I 的世界 - 首页游戏主逻辑

const Game = require('../../assets/scripts/game.js');
const Season = require('../../assets/scripts/system/season.js');

Page({
  data: {
    gameStarted: false,
    // 季节颜色
    seasonColors: {},
    // 冥想状态
    isMeditating: false,
    meditationPrompt: '',
    // 提问弹窗
    showQuestionModal: false,
    questionText: '',
    // 日记页面
    showDiary: false,
    diaryEntries: [],
    diaryStats: {},
    // 季节选择弹窗
    showSeasonSelector: false,
    seasonList: [],
  },

  onLoad() {
    console.log('I 的世界 启动');
  },

  // 开始游戏
  startGame() {
    Game.init();
    this.setData({
      gameStarted: true,
      seasonColors: Game.getCurrentSeasonColors(),
      seasonList: Season.getAllSeasons(),
    });
  },

  // 点击石头坐下冥想
  sitDown() {
    const firstPrompt = Game.startMeditation();
    this.setData({
      isMeditating: true,
      meditationPrompt: firstPrompt
    });
  },

  // 冥想下一步
  nextMeditation() {
    const next = Game.nextMeditationStep();
    if (next === null) {
      this.setData({
        isMeditating: false,
        meditationPrompt: ''
      });
    } else {
      this.setData({
        meditationPrompt: next
      });
    }
  },

  // 打开提问弹窗
  openQuestion() {
    this.setData({
      showQuestionModal: true,
      questionText: ''
    });
  },

  // 关闭提问弹窗
  closeQuestion() {
    this.setData({
      showQuestionModal: false
    });
  },

  // 输入问题
  inputQuestion(e) {
    this.setData({
      questionText: e.detail.value
    });
  },

  // 提交问题
  submitQuestion() {
    const q = this.data.questionText.trim();
    if (!q) {
      wx.showToast({ title: '请输入你的问题', icon: 'none' });
      return;
    }
    const result = Game.handleQuestion(q);
    if (!result.ok) {
      wx.showModal({
        title: '提示',
        content: result.answer,
        showCancel: false
      });
      return;
    }
    wx.showModal({
      title: '植物对你说',
      content: result.answer,
      showCancel: false
    });
    this.closeQuestion();
  },

  // 打开日记
  openDiary() {
    const data = Game.getDiaryData();
    this.setData({
      showDiary: true,
      diaryEntries: data.entries,
      diaryStats: data.stats
    });
  },

  // 关闭日记
  closeDiary() {
    this.setData({
      showDiary: false
    });
  },

  // 打开季节选择
  openSeasonSelector() {
    this.setData({
      showSeasonSelector: true
    });
  },

  // 关闭季节选择
  closeSeasonSelector() {
    this.setData({
      showSeasonSelector: false
    });
  },

  // 切换季节
  selectSeason(e) {
    const seasonKey = e.currentTarget.dataset.key;
    Game.changeSeason(seasonKey);
    this.setData({
      seasonColors: Game.getCurrentSeasonColors(),
      showSeasonSelector: false
    });
    wx.showToast({
      title: `切换到${Season.getCurrent().name}`,
      icon: 'none'
    });
  },

  // 画布渲染这里交给canvas处理
  // ...
});
