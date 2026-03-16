// I的世界 - 天气系统

export const WEATHER_TYPES = {
  sunny: {
    name: '晴天',
    description: '阳光明媚，影子清晰',
    colorFilter: 'rgba(255, 255, 150, 0.1)',
    ambientSound: 'birds',
    mood: 'cheerful'
  },
  cloudy: {
    name: '阴天',
    description: '云层厚重，世界沉静',
    colorFilter: 'rgba(150, 150, 180, 0.2)',
    ambientSound: 'wind',
    mood: 'calm'
  },
  rainy: {
    name: '小雨',
    description: '细雨淅沥，水面涟漪',
    colorFilter: 'rgba(100, 150, 200, 0.2)',
    ambientSound: 'rain',
    mood: 'melancholic'
  },
  windy: {
    name: '大风',
    description: '风吹草动，树影婆娑',
    colorFilter: 'rgba(200, 200, 200, 0.1)',
    ambientSound: 'wind-strong',
    mood: 'restless'
  },
  snowy: {
    name: '下雪',
    description: '雪花飘落，世界变白',
    colorFilter: 'rgba(230, 230, 250, 0.3)',
    ambientSound: 'silence',
    mood: 'peaceful'
  }
};

// 根据季节和情绪随机生成天气
export function randomWeather(season, playerMood) {
  const weights = {
    spring: { sunny: 0.4, cloudy: 0.2, rainy: 0.3, windy: 0.1, snowy: 0 },
    summer: { sunny: 0.5, cloudy: 0.2, rainy: 0.2, windy: 0.1, snowy: 0 },
    autumn: { sunny: 0.3, cloudy: 0.3, rainy: 0.2, windy: 0.2, snowy: 0 },
    winter: { sunny: 0.3, cloudy: 0.2, rainy: 0.1, windy: 0.2, snowy: 0.2 }
  };

  // 情绪影响概率：不好的情绪更容易出阴天/雨天
  let adjustedWeights = { ...weights[season] };
  if (playerMood < 0.3) {
    adjustedWeights.cloudy *= 1.5;
    adjustedWeights.rainy *= 1.5;
  } else if (playerMood > 0.7) {
    adjustedWeights.sunny *= 1.5;
  }

  // 按权重随机
  const total = Object.values(adjustedWeights).reduce((a, b) => a + b, 0);
  let random = Math.random() * total;
  let current = 0;
  
  for (const [type, weight] of Object.entries(adjustedWeights)) {
    current += weight;
    if (random <= current) {
      return type;
    }
  }
  
  return 'sunny'; // 默认
}

// 获取天气对应的滤镜颜色
export function getWeatherFilter(weatherType) {
  return WEATHER_TYPES[weatherType]?.colorFilter || 'rgba(0,0,0,0)';
}
