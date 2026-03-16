// I的世界 - 玩家状态和心理情绪系统

// 心理学元素：情绪影响天气，影响世界，世界反过来影响情绪
export function initPlayer() {
  return {
    x: 0,
    y: 0,
    mood: 0.5, // 0-1，越低越阴沉，越高越阳光
    steps: 0, // 走过的步数
    diary: [], // 对话日记
    gameDay: 1, // 游戏天数
    plantedTrees: [] // 自己种的树
  };
}

// 移动一步后更新
export function onMove(player) {
  player.steps++;
  // 走路多了心情会变好一点
  if (player.mood < 0.8) {
    player.mood += 0.005;
  }
  return player;
}

// 坐下休息
export function onRest(player) {
  // 休息心情平静下来
  player.mood = 0.5;
  return player;
}

// 和自然互动后改变心情
export function onInteract(player, entityType) {
  // 不同互动对心情不同影响
  const moodChanges = {
    flower: 0.05,
    grass: 0.02,
    tree: 0.03,
    stone: 0.01,
    rabbit: 0.06,
    bird: 0.05
  };

  const change = moodChanges[entityType] || 0;
  player.mood = Math.min(1, Math.max(0, player.mood + change));
  return player;
}

// 种下一棵树
export function plantTree(player, x, y) {
  player.plantedTrees.push({
    x, y,
    plantedAt: player.gameDay,
    grown: 0
  });
  // 种下东西会让心情变好
  player.mood = Math.min(1, player.mood + 0.1);
  return player;
}

// 更新生长（每天）
export function updateGrowth(player, season) {
  const modifier = getPlantGrowthModifier(season);
  player.plantedTrees.forEach(tree => {
    tree.grown += 0.05 * modifier;
    if (tree.grown > 1) tree.grown = 1;
  });
  player.gameDay++;
  return player;
}

// 获取心情描述
export function getMoodDescription(mood) {
  if (mood < 0.2) return "心里有点闷闷的";
  if (mood < 0.4) return "不太开心";
  if (mood < 0.6) return "平静";
  if (mood < 0.8) return "挺开心的";
  return "心情像阳光一样明媚";
}

// 情绪波动（自然随机）
export function randomMoodChange(player) {
  const change = (Math.random() - 0.5) * 0.1;
  player.mood = Math.min(1, Math.max(0, player.mood + change));
  return player;
}
