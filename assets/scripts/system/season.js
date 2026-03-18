// I 的世界 - 季节模块，自动匹配真实月份，也可以手动切换

const Season = {
  // 季节定义和配色
  seasons: {
    spring: {
      name: "春天",
      groundColor: "#b8e186",
      treeColor: "#7fbc41",
      flowerColor: "#f1b6da",
      skyColor: "#e5f5e0",
      mood: "新生，希望",
    },
    summer: {
      name: "夏天",
      groundColor: "#41ab5d",
      treeColor: "#238443",
      flowerColor: "#ffeda0",
      skyColor: "#c6dbef",
      mood: "盛放，热情",
    },
    autumn: {
      name: "秋天",
      groundColor: "#fec44f",
      treeColor: "#ec7014",
      flowerColor: "#fff7bc",
      skyColor: "#fee391",
      mood: "收获，沉静",
    },
    winter: {
      name: "冬天",
      groundColor: "#f7fcf5",
      treeColor: "#636363",
      flowerColor: "#bdbdbd",
      skyColor: "#f0f0f0",
      mood: "沉淀，等待",
    }
  },

  // 当前季节
  current: "spring",

  // 初始化，根据当前时间自动匹配
  init() {
    const savedSeason = wx.getStorageSync('iworld-season');
    if (savedSeason && this.seasons[savedSeason]) {
      this.current = savedSeason;
    } else {
      this.autoMatchByDate();
    }
  },

  // 根据当前月份自动匹配季节（北半球
  autoMatchByDate() {
    const month = new Date().getMonth() + 1; // 1-12
    if (month >= 3 && month <= 5) {
      this.current = 'spring';
    } else if (month >= 6 && month <= 8) {
      this.current = 'summer';
    } else if (month >= 9 && month <= 11) {
      this.current = 'autumn';
    } else {
      this.current = 'winter';
    }
    console.log('自动匹配季节：', this.current, this.seasons[this.current].mood);
    this.save();
  },

  // 手动切换
  switchSeason(seasonName) {
    if (this.seasons[seasonName]) {
      this.current = seasonName;
      this.save();
      console.log('手动切换季节到：', this.current);
      return true;
    }
    return false;
  },

  // 获取当前季节配置
  getCurrent() {
    return this.seasons[this.current];
  },

  // 获取所有季节列表用来切换
  getAllSeasons() {
    return Object.keys(this.seasons).map(k => ({
      key: k,
      name: this.seasons[k].name,
      mood: this.seasons[k].mood
    }));
  },

  // 保存
  save() {
    wx.setStorageSync('iworld-season', this.current);
  }
};

module.exports = Season;
