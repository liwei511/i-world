// I 的世界 - 情绪跟踪模块
// 玩家行为影响天气概率，遵循心理学优化设计：允许负面情绪，不强迫开心

const Mood = {
  // 情绪分数：-10 到 +10，负=低落，正=开阔
  score: 0,
  // 连续阴天天数
  consecutiveBadWeather: 0,
  // 今天提问次数
  questionsToday: 0,

  // 初始化，从存档读
  init() {
    const saved = wx.getStorageSync('iworld-mood');
    if (saved) {
      this.score = saved.score || 0;
      this.consecutiveBadWeather = saved.consecutiveBadWeather || 0;
      this.questionsToday = saved.questionsToday || 0;
    } else {
      // 初始情绪中等
      this.score = 0;
      this.consecutiveBadWeather = 0;
      this.questionsToday = 0;
    }

    // 重置每日提问计数（如果是新的一天
    const lastDate = wx.getStorageSync('iworld-lastdate');
    const today = new Date().toDateString();
    if (lastDate !== today) {
      this.questionsToday = 0;
      wx.setStorageSync('iworld-lastdate', today);
    }
  },

  // 保存
  save() {
    wx.setStorageSync('iworld-mood', {
      score: this.score,
      consecutiveBadWeather: this.consecutiveBadWeather,
      questionsToday: this.questionsToday
    });
  },

  // 玩家行为改变情绪
  onAction(actionType) {
    switch(actionType) {
      case 'walk_long': // 走了很多路，看了很多风景
        this.score += 1;
        break;
      case 'sit_rest': // 坐下休息冥想
        this.score += 0.5;
        break;
      case 'talk_multiple': // 连续多次提问心情不好
        this.score -= 0.5;
        break;
      case 'stay_long': // 在一个地方待很久不动
        this.score -= 0.5;
        break;
    }

    // 限制范围
    if (this.score < -10) this.score = -10;
    if (this.score > 10) this.score = 10;

    this.save();
  },

  // 获取今天还能提问几次
  getRemainingQuestions() {
    return 3 - this.questionsToday;
  },

  // 增加提问计数
  addQuestion() {
    this.questionsToday++;
    this.save();
  },

  // 根据情绪得到天气概率
  getWeatherProbabilities(currentSeason) {
    // base概率
    let probs = {
      sunny: 40,
      cloudy: 30,
      rain: 20,
      wind: 10
    };

    // 冬天加雪
    if (currentSeason === 'winter') {
      probs.snow = 15;
      probs.sunny -= 5;
      probs.cloudy -= 5;
    }

    // 根据情绪调整：情绪越低落，阴天雨天概率越高
    // 不强迫调整，只是偏向，允许玩家停在坏情绪
    let delta = -Math.floor(this.score / 2); // 情绪越负，delta越正
    probs.sunny += delta;
    probs.cloudy -= delta;

    // 如果连续三天阴天雨天，自动触发"雨后彩虹"
    if (this.consecutiveBadWeather >= 3) {
      probs.rain = 30;
      probs.sunny = 0;
      // 雨后一定出彩虹，就是情绪流动的隐喻
    }

    // 确保概率加起来大概100
    return probs;
  },

  // 记录今天天气类型，更新连续坏天气计数
  recordWeather(type) {
    const isBad = type === 'cloudy' || type === 'rain';
    if (isBad) {
      this.consecutiveBadWeather++;
    } else {
      this.consecutiveBadWeather = 0;
    }
    this.save();
  },

  // 检查是不是雨后该出彩虹
  shouldShowRainbow() {
    return this.consecutiveBadWeather >= 3;
  }
};

module.exports = Mood;
