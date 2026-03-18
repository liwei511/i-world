// I 的世界 - 游戏主逻辑
// 整合所有心理学模块

// 引入模块
const Season = require('./system/season.js');
const Mood = require('./system/mood.js');
const Diary = require('./system/diary.js');
const Answers = require('./dialogue/answers.js');
const Meditation = require('./mind/meditation.js');

const Game = {
  // 游戏状态
  gameStarted: false,
  screenDimmed: false,
  // 当前天气
  currentWeather: null,

  // 初始化所有模块
  init() {
    Season.init();
    Mood.init();
    Diary.init();
    this.gameStarted = true;

    // 记录今天来访
    Diary.addVisit(Season.current, this.currentWeather);

    // 随机天气，考虑情绪
    this.rollWeather();

    console.log('I 的世界 初始化完成');
    console.log('季节：', Season.getCurrent().name);
    console.log('天气：', this.currentWeather);
  },

  // 随机roll天气，结合情绪概率
  rollWeather() {
    const probs = Mood.getWeatherProbabilities(Season.current);
    let rand = Math.random() * 100;
    let currentSum = 0;
    for (const type in probs) {
      currentSum += probs[type];
      if (rand <= currentSum) {
        this.currentWeather = type;
        break;
      }
    }
    // 记录天气给情绪统计
    Mood.recordWeather(this.currentWeather);
    return this.currentWeather;
  },

  // 暗屏（冥想用
  dimScreen() {
    this.screenDimmed = true;
  },

  // 恢复亮度
  restoreScreen() {
    this.screenDimmed = false;
  },

  // 处理用户提问
  handleQuestion(questionText) {
    // 检查今天还能不能提问
    if (Mood.getRemainingQuestions() <= 0) {
      return {
        ok: false,
        answer: "今天已经问了三个问题啦，留着明天再问吧，答案已经在你心里了。"
      };
    }
    // 得到回答
    const answer = Answers.getAnswer(questionText);
    // 增加提问计数，记录到日记
    Mood.addQuestion();
    Diary.addQuestion(questionText, answer);
    // 情绪轻度下降（因为提问大多是带着困惑
    Mood.onAction('talk_multiple');
    // 加上提示语
    const fullAnswer = answer + "\n\n——它说的，其实是你心里已经知道的话。";
    return {
      ok: true,
      answer: fullAnswer
    };
  },

  // 开始坐下冥想
  startMeditation() {
    const firstPrompt = Meditation.start();
    return firstPrompt;
  },

  // 冥想下一步
  nextMeditationStep() {
    return Meditation.nextStep();
  },

  // 获取当前季节配色
  getCurrentSeasonColors() {
    return Season.getCurrent();
  },

  // 切换季节
  changeSeason(name) {
    Season.switchSeason(name);
    this.rollWeather();
    return this.getCurrentSeasonColors();
  },

  // 获取日记数据展示
  getDiaryData() {
    return Diary.openDiaryPage();
  }
};

// 暴露给全局
module.exports = Game;
