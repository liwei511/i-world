const { initPlayer, onMove, onInteract, getMoodDescription, updateGrowth } = require('../../utils/player');
const { generateMap, getTileColor, isWalkable } = require('../../utils/mapgen');
const { getSeasonByDay, getSeasonColors, SEASONS } = require('../../utils/season');
const { randomWeather, WEATHER_TYPES } = require('../../utils/weather');
const { generateResponse, recordDialogue } = require('../../utils/dialogue');
const { getDefaultMusicForSeason, getAllMusicList, AudioPlayer } = require('../../utils/audio');

const TILE_SIZE = 16; // 每个格子像素大小

const audioPlayer = new AudioPlayer();

Page({
  data: {
    player: null,
    season: null,
    seasonBgColor: '',
    weather: null,
    moodDesc: '',
    moodColor: '',
    showDialog: false,
    dialogText: '',
    entity: null,
    inputText: '',
    canInput: true,
    // 音乐
    showMusicSettings: false,
    currentMusic: null,
    allMusicList: [],
    volume: 0.3,
    // 摇杆
    joystick: {
      x: 80,
      y: 60,
      knobX: 30,
      knobY: 30,
      active: false,
      dirX: 0,
      dirY: 0
    }
  },

  onLoad() {
    this.initGame();
  },

  onUnload() {
    if (this.animationId) {
      clearTimeout(this.animationId);
    }
    audioPlayer.stop();
  },

  onHide() {
    audioPlayer.pause();
  },

  onShow() {
    audioPlayer.resume();
  },

  initGame() {
    // 初始化玩家
    const player = initPlayer();
    const seasonKey = getSeasonByDay(player.gameDay);
    const weatherKey = randomWeather(seasonKey, player.mood);
    const season = getSeasonColors(seasonKey);
    const weather = WEATHER_TYPES[weatherKey];
    const defaultMusic = getDefaultMusicForSeason(seasonKey, weatherKey);

    // 生成地图
    const map = generateMap(30, 20, seasonKey, weatherKey);
    this.map = map;

    // 玩家出生在小路起点
    player.x = 1;
    player.y = Math.floor(map.length / 2);

    // 背景色根据季节
    const bgColors = {
      spring: '#c8e6c9',
      summer: '#a5d6a7',
      autumn: '#dcedc8',
      winter: '#e3f2fd'
    };

    this.setData({
      player,
      season: SEASONS[seasonKey],
      seasonBgColor: bgColors[seasonKey],
      weather,
      moodDesc: getMoodDescription(player.mood),
      currentMusic: defaultMusic,
      allMusicList: getAllMusicList()
    });

    this.updateMoodColor();
    this.startAnimation();
    // 播放默认音乐
    audioPlayer.play(defaultMusic, true);
    audioPlayer.setVolume(this.data.volume);
  },

  // 渲染地图
  render() {
    const query = wx.createSelectorQuery();
    query.select('.game-canvas').boundingClientRect();
    query.exec(res => {
      if (!res[0]) return;
      const canvasWidth = res[0].width;
      const canvasHeight = res[0].height;
      
      const ctx = wx.createCanvasContext('gameCanvas');
      const player = this.data.player;
      const seasonKey = getSeasonByDay(player.gameDay);

      // 计算摄像机偏移，让玩家在屏幕中心
      const offsetX = Math.floor(canvasWidth / 2 - player.x * TILE_SIZE - TILE_SIZE / 2);
      const offsetY = Math.floor(canvasHeight / 2 - player.y * TILE_SIZE - TILE_SIZE / 2);

      // 绘制每个格子
      for (let y = 0; y < this.map.length; y++) {
        for (let x = 0; x < this.map[y].length; x++) {
          const tile = this.map[y][x];
          const px = x * TILE_SIZE + offsetX;
          const py = y * TILE_SIZE + offsetY;

          // 屏幕外不画
          if (px < -TILE_SIZE || py < -TILE_SIZE || px > canvasWidth || py > canvasHeight) {
            continue;
          }

          const color = getTileColor(tile, seasonKey);
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.roundRect(px, py, TILE_SIZE - 1, TILE_SIZE - 1, 2);
          ctx.fill();
        }
      }

      // 绘制玩家（小圆点）
      const playerPx = player.x * TILE_SIZE + offsetX + TILE_SIZE / 2;
      const playerPy = player.y * TILE_SIZE + offsetY + TILE_SIZE / 2;
      ctx.fillStyle = '#4a148c';
      ctx.beginPath();
      ctx.arc(playerPx, playerPy, TILE_SIZE / 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(playerPx - 3, playerPy - 3, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.draw();
    });
  },

  // 动画循环
  animationId: null,
  startAnimation() {
    const loop = () => {
      this.render();
      this.animationId = setTimeout(loop, 100);
    };
    loop();
  },

  // 摇杆控制
  startJoystick(e) {
    const touch = e.touches[0];
    const joystick = { ...this.data.joystick };
    joystick.active = true;
    // 摇杆中心在触摸位置
    const query = wx.createSelectorQuery();
    query.select('.joystick-area').boundingClientRect();
    query.exec(res => {
      const rect = res[0];
      joystick.x = touch.clientX - rect.left;
      joystick.y = rect.bottom - touch.clientY;
      this.setData({ joystick });
    });
  },

  moveJoystick(e) {
    const touch = e.touches[0];
    const joystick = { ...this.data.joystick };
    if (!joystick.active) return;

    const centerX = joystick.x;
    const centerY = joystick.y;
    let dx = touch.clientX - (centerX + 20); // 20px offset from left
    let dy = (joystick.y + 20) - (window.innerHeight - touch.clientY); // y reversed

    const dist = Math.sqrt(dx*dx + dy*dy);
    const maxDist = 40;
    if (dist > maxDist) {
      dx = dx * maxDist / dist;
      dy = dy * maxDist / dist;
    }

    joystick.knobX = 30 + dx;
    joystick.knobY = 30 + dy;
    joystick.dirX = dx / maxDist;
    joystick.dirY = dy / maxDist;

    this.setData({ joystick });

    // 每帧移动
    this.tryMove(joystick.dirY, joystick.dirX);
  },

  endJoystick() {
    const joystick = { ...this.data.joystick };
    joystick.active = false;
    joystick.knobX = 30;
    joystick.knobY = 30;
    joystick.dirX = 0;
    joystick.dirY = 0;
    this.setData({ joystick });
  },

  // 尝试移动
  tryMove(dy, dx) {
    const player = { ...this.data.player };
    const newX = player.x + Math.round(dx);
    const newY = player.y - Math.round(dy); // y反向

    if (isWalkable(this.map, newX, newY)) {
      player.x = newX;
      player.y = newY;
      onMove(player);
      this.updateMood(player);
      this.setData({ player });

      // 检查是否站在互动元素上
      this.checkInteraction(player.x, player.y);
    }
  },

  checkInteraction(x, y) {
    const tile = this.map[y][x];
    if (tile.interactive && !this.data.showDialog) {
      // 50%几率触发对话
      if (Math.random() > 0.5) {
        this.openDialog(tile);
      }
    }
  },

  openDialog(tile) {
    const response = generateResponse(tile.type);
    const player = this.data.player;
    onInteract(player, tile.type);
    this.updateMood(player);

    this.setData({
      showDialog: true,
      dialogText: response,
      entity: { name: tile.type === 'grass' ? '小草' : tile.type === 'tree' ? '小树' : tile.name },
      canInput: true,
      player
    });
  },

  closeDialog() {
    this.setData({ showDialog: false });
  },

  onInputChange(e) {
    this.setData({ inputText: e.detail.value });
  },

  sendQuestion() {
    const question = this.data.inputText.trim();
    if (!question) return;

    const response = generateResponse(this.data.entity.type, question);
    // 记录到日记
    const player = this.data.player;
    recordDialogue(player.diary, this.data.entity, question, response);
    onInteract(player, this.data.entity.type);
    this.updateMood(player);

    this.setData({
      dialogText: response,
      inputText: '',
      player
    });
  },

  updateMood(player) {
    this.setData({
      moodDesc: getMoodDescription(player.mood)
    });
    this.updateMoodColor();
  },

  updateMoodColor() {
    const mood = this.data.player.mood;
    // 从蓝色（差）到绿色（好）
    const r = Math.floor(100 + 155 * mood);
    const g = Math.floor(100 + 155 * mood);
    const b = 100;
    this.setData({
      moodColor: `rgb(${r}, ${g}, ${b})`
    });
  },

  // 音乐设置
  openMusicSettings() {
    this.setData({ showMusicSettings: true });
  },

  closeMusicSettings() {
    this.setData({ showMusicSettings: false });
  },

  stopPropagation() {},

  selectMusic(e) {
    const music = e.currentTarget.dataset.music;
    this.setData({ currentMusic: music });
    audioPlayer.play(music, true);
    audioPlayer.setVolume(this.data.volume);
  },

  onVolumeChange(e) {
    const volume = e.detail.value / 100;
    this.setData({ volume });
    audioPlayer.setVolume(volume);
  },

  // 触摸点击
  onTouchStart(e) {},
  onTouchMove(e) {},
  onTouchEnd(e) {
    // 点击也可以尝试互动
    // 获取点击位置对应的格子
  }
});
