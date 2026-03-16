// I的世界 - 四季系统

export const SEASONS = {
  spring: {
    name: '春天',
    grassColor: '#8dd866',
    treeColor: '#66bb6a',
    flowerChance: 0.3,
    description: '万物新生，嫩绿满眼',
    bgMusic: 'spring-breeze'
  },
  summer: {
    name: '夏天',
    grassColor: '#388e3c',
    treeColor: '#2e7d32',
    flowerChance: 0.15,
    description: '郁郁葱葱，热情盛放',
    bgMusic: 'summer-cicada'
  },
  autumn: {
    name: '秋天',
    grassColor: '#aed581',
    treeColor: '#f57c00',
    flowerChance: 0.1,
    description: '金黄落叶，天高气爽',
    bgMusic: 'autumn-wind'
  },
  winter: {
    name: '冬天',
    grassColor: '#bcaaa4',
    treeColor: '#8d6e63',
    flowerChance: 0.02,
    description: '白雪覆盖，安静沉淀',
    bgMusic: 'winter-silence'
  }
};

// 根据真实日期或者游戏天数推算季节
export function getSeasonByDay(gameDay) {
  // 游戏里一年 = 24游戏天，一季 = 6天
  const seasonIndex = Math.floor((gameDay % 24) / 6);
  const seasons = ['spring', 'summer', 'autumn', 'winter'];
  return seasons[seasonIndex];
}

// 根据季节获取配色
export function getSeasonColors(seasonKey) {
  return SEASONS[seasonKey] || SEASONS.spring;
}

// 季节对植物生长的影响
export function getPlantGrowthModifier(seasonKey) {
  const modifiers = {
    spring: 1.5, // 春天生长快
    summer: 1.2,
    autumn: 0.8,
    winter: 0.3  // 冬天几乎不长
  };
  return modifiers[seasonKey] || 1;
}
