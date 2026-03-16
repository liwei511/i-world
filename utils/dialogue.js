// I的世界 - 对话系统（镜像对话，心理学投射）

// 植物预设对话 - 它们说的话隐喻人生哲理
const PLANT_DIALOGUES = {
  grass: [
    "风来了我就低头，风走了我又站起来。",
    "我长的不高，但我铺满了整片土地。",
    "野火也烧不完我，春天一来我又回来啦。",
    "每天都在慢慢长，不用急。",
    "被踩过也没关系，我还能继续生长。"
  ],
  tree: [
    "根扎的越深，长的越高。",
    "叶子会黄会落，明年还会再发新芽。",
    "我站在这里，看着云来云走好多年了。",
    "夏天给你遮阴，秋天给你结果。",
    "慢慢长，不急，会成为参天大树的。"
  ],
  flower: [
    "我开一季就谢了，但我开过了。",
    "你闻到我的香味了吗？这就是我存在的意义。",
    "不同季节开不同的花，每个人都有自己的花期。",
    "就算没人看我，我也一样开。",
    "开花就够了，结果不重要。"
  ],
  stone: [
    "我在这里待了很久，什么都见过了。",
    "你累了就坐下来歇会吧，不用一直走。",
    "我不动，但是什么也没错过。",
    "安静也是一种力量。"
  ]
};

// 动物对话 - 更活泼，更天真
const ANIMAL_DIALOGUES = {
  rabbit: [
    "我刚才看到一颗好大的胡萝卜！要不要一起去找？",
    "跑累了就休息，没人催你。",
    "我每天都在跳来跳去，开心最重要啦！",
    "你从哪里来？要到哪里去？"
  ],
  squirrel: [
    "我存了好多松果，冬天不怕啦！你存了什么？",
    "爬树真好玩，站的高看的远。",
    "你要不要吃坚果？可香了。"
  ],
  bird: [
    "我飞遍了整个山林，其实最美的地方就在你脚下。",
    "每天都能看到不一样的云，真好。",
    "唱个歌给你听吧🎵"
  ]
};

// 镜像对话：根据玩家提问，生成隐喻回答
// 核心心理学思想：答案其实在你心中，动植物只是镜子
export function generateResponse(entityType, playerQuestion) {
  let candidates = [];
  
  // 从预设中选基础候选
  if (PLANT_DIALOGUES[entityType]) {
    candidates = [...PLANT_DIALOGUES[entityType]];
  } else if (ANIMAL_DIALOGUES[entityType]) {
    candidates = [...ANIMAL_DIALOGUES[entityType]];
  } else {
    candidates = [
      "风会告诉你答案，你听听心里的声音。",
      "你其实已经知道答案了，对不对？",
      "慢慢来，时间会告诉你的。",
      "怎么走都可以，这是你的路。"
    ];
  }

  // 根据问题关键词，做简单的匹配引导
  const question = (playerQuestion || '').toLowerCase();
  
  if (question.includes('辞职') || question.includes('离开') || question.includes('分手')) {
    candidates.push("叶子落了还会再长，旧的走了新的会来。");
    candidates.push("风往哪里吹，就往哪里去呗。");
  }
  
  if (question.includes('迷茫') || question.includes('不知道') || question.includes('怎么办')) {
    candidates.push("你脚下的路就是对的，走着走着就清楚了。");
    candidates.push("停下来看看花，答案会自己出来的。");
  }

  if (question.includes('难过') || question.includes('伤心') || question.includes('累')) {
    candidates.push("雨会停，天会晴，都会过去的。");
    candidates.push("你已经走了很远了，很棒了。");
    candidates.push("累了就坐我旁边歇会，我陪着你。");
  }

  if (question.includes('未来') || question.includes('希望')) {
    candidates.push("春天会来，种子会发芽，你看。");
    candidates.push("你现在走的每一步，都在往未来去。");
  }

  if (question.includes('孤独') || question.includes('一个人')) {
    candidates.push("我也一个人在这里，我们现在不是在一起吗？");
    candidates.push("孤独不是坏事，你可以听听自己心里的声音。");
  }

  // 随机选一个回答，每次都不一样
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}

// 记录对话到日记中
export function recordDialogue(diary, entity, question, answer) {
  diary.push({
    time: Date.now(),
    entity: entity.type + ': ' + entity.name,
    question: question,
    answer: answer
  });
  return diary;
}

// 获取今日日记
export function getTodayDialogues(diary) {
  const today = new Date().toDateString();
  return diary.filter(d => new Date(d.time).toDateString() === today);
}
