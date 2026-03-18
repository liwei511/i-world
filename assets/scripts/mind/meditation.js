// I 的世界 - 坐下休息冥想引导模块

const Meditation = {
  // 是否正在冥想
  isMeditating: false,
  // 当前引导步骤
  step: 0,
  // 可用引导主题
  themes: [
    {
      name: "感受呼吸",
      steps: [
        "现在，停下来，找一个舒服的姿势坐好",
        "慢慢闭上眼睛，或者就看着眼前的草",
        "做一次长长的吸气...感受空气充满你的胸腔",
        "再慢慢呼出来...把紧张也一起呼出去",
        "再来一次，吸气...呼气...",
        "感受你的屁股坐在石头上，重量给出去，放松"
      ]
    },
    {
      name: "感受当下",
      steps: [
        "现在，放下你心里想的那些事，暂时放一放",
        "听听周围的声音...有风吹过草叶的声音",
        "有没有小鸟叫？只是听听，不用判断",
        "感受你皮肤感觉到的温度...风还是阳光？",
        "你不用去任何地方，不用做任何事",
        "就只是，在这里，现在"
      ]
    },
    {
      name: "观察念头",
      steps: [
        "现在，轻轻观察你心里的念头",
        "就像看天上的云，一朵来了，一朵走了",
        "你不用抓住它，也不用推开它",
        "你只是看着它们，来来去去",
        "你不是你的念头，你是那个看见它们的天空",
        "就这样，静静的看一会儿"
      ]
    },
    {
      name: "和自己在一起",
      steps: [
        "今天，你照顾了很多人，很多事",
        "现在，留几分钟，照顾一下你自己",
        "把一只手放在胸口，感受那里的温度",
        "对自己说一句：辛苦了，谢谢你",
        "允许自己停下来，不需要一直跑",
        "你在这里，你陪着你，就很好"
      ]
    }
  ],

  // 开始冥想
  start() {
    this.isMeditating = true;
    this.step = 0;
    // 暗屏，背景音乐调柔
    Game.dimScreen();
    Audio.softenBGM();
    // 随机选一个主题
    this.currentTheme = this.themes[Math.floor(Math.random() * this.themes.length)];
    console.log('开始冥想：', this.currentTheme.name);
    return this.currentTheme.steps[0];
  },

  // 下一步
  nextStep() {
    if (this.step < this.currentTheme.steps.length - 1) {
      this.step++;
      return this.currentTheme.steps[this.step];
    } else {
      // 结束冥想
      return this.end();
    }
  },

  // 结束冥想
  end() {
    this.isMeditating = false;
    Game.restoreScreen();
    Audio.restoreBGM();
    // 行为记录，情绪加分
    Mood.onAction('sit_rest');
    return null;
  },

  // 当前提示文字
  getCurrentPrompt() {
    if (!this.isMeditating) return '';
    return this.currentTheme.steps[this.step];
  }
};

module.exports = Meditation;
