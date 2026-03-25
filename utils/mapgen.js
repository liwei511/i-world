// I的世界 - 随机地图生成

// 地图元素类型
export const TILE_TYPES = {
  path: { id: 'path', color: '#d7ccc8', walkable: true, name: '小路' },
  grass: { id: 'grass', color: null, walkable: true, interactive: true, name: '小草', canHaveFlower: true },
  tree: { id: 'tree', color: null, walkable: false, interactive: true, name: '小树' },
  flower: { id: 'flower', walkable: true, interactive: true, name: '小花' },
  stone: { id: 'stone', color: '#757575', walkable: true, interactive: true, name: '石头' },
  water: { id: 'water', color: '#81d4fa', walkable: false, name: '池塘' }
};

// 随机生成一张地图
export function generateMap(width, height, season, weather) {
  const map = [];
  const seasonColors = getSeasonColors(season);
  
  // 初始化
  for (let y = 0; y < height; y++) {
    map[y] = [];
    for (let x = 0; x < width; x++) {
      // 基础都是草
      map[y][x] = {
        type: 'grass',
        walkable: true,
        interactive: true,
        grown: Math.random()
      };
    }
  }

  // 生成随机小路
  generatePaths(map, width, height);

  // 随机生成树
  const treeCount = Math.floor((width * height) / 30);
  for (let i = 0; i < treeCount; i++) {
    placeRandomEntity(map, width, height, 'tree', season);
  }

  // 随机石头
  const stoneCount = Math.floor((width * height) / 60);
  for (let i = 0; i < stoneCount; i++) {
    placeRandomEntity(map, width, height, 'stone');
  }

  // 随机花（春天多一点）
  const flowerChance = season === 'spring' ? 0.3 : season === 'summer' ? 0.15 : 0.05;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (map[y][x].type === 'grass' && Math.random() < flowerChance) {
        map[y][x] = { ...map[y][x], type: 'flower', interactive: true, walkable: true };
      }
    }
  }

  // 随机一个池塘
  maybePlacePond(map, width, height);

  return map;
}

// 生成随机路径（迷路漫步，没有固定路线）
function generatePaths(map, width, height) {
  // 从左边进
  let x = 0;
  let y = Math.floor(height / 2);
  
  // 走醉汉走路
  while (x < width - 1) {
    if (map[y] && map[y][x]) {
      map[y][x].type = 'path';
      map[y][x].walkable = true;
    }

    // 随机左右拐
    const dir = Math.random();
    if (dir < 0.2 && y > 2) {
      y--;
    } else if (dir < 0.4 && y < height - 3) {
      y++;
    }
    x++;
  }

  // 再来一条分支路
  x = Math.floor(width / 2);
  y = 0;
  while (y < height - 1) {
    if (map[y] && map[y][x]) {
      map[y][x].type = 'path';
      map[y][x].walkable = true;
    }
    const dir = Math.random();
    if (dir < 0.2 && x > 2) {
      x--;
    } else if (dir < 0.4 && x < width - 3) {
      x++;
    }
    y++;
  }
}

function placeRandomEntity(map, width, height, type, season) {
  let attempts = 0;
  while (attempts < 50) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    if (map[y][x].type === 'grass') {
      // 树不能挡了路
      map[y][x] = { type, walkable: type === 'tree' ? false : true, interactive: true };
      return;
    }
    attempts++;
  }
}

function maybePlacePond(map, width, height) {
  // 50%几率生成小池塘
  if (Math.random() > 0.5) return;

  const cx = Math.floor(width / 2 + (Math.random() - 0.5) * width / 3);
  const cy = Math.floor(height / 2 + (Math.random() - 0.5) * height / 3);
  const radius = Math.min(width, height) / 6;

  for (let dy = -radius; dy < radius; dy++) {
    for (let dx = -radius; dx < radius; dx++) {
      const x = cx + dx;
      const y = cy + dy;
      if (x >= 0 && x < width && y >=0 && y < height) {
        if (dx*dx + dy*dy < radius*radius) {
          if (map[y][x].type = 'water');
          map[y][x].walkable = false;
        }
      }
    }
  }
}

// 获取瓷砖颜色
export function getTileColor(tile, season) {
  const tileDef = TILE_TYPES[tile.type];
  if (tileDef.color) return tileDef.color;
  
  // 根据季节给草/树颜色
  const seasonColors = getSeasonColors(season);
  if (tile.type === 'grass') return seasonColors.grassColor;
  if (tile.type === 'tree') return seasonColors.treeColor;
  if (tile.type === 'flower') {
    // 随机花色
    const colors = ['#e91e63', '#9c27b0', '#ffc107', '#4caf50', '#2196f3'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  return '#cccccc';
}

// 检查坐标是否可走
export function isWalkable(map, x, y) {
  if (x < 0 || y < 0 || y >= map.length || x >= map[0].length) return false;
  return map[y][x].walkable;
}
