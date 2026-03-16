// I的世界 - 背景音乐系统

// 预设背景音乐
export const BACKGROUND_MUSIC = {
  spring: {
    id: 'spring-breeze',
    name: '春风',
    description: '轻柔风声，伴着鸟鸣',
    path: '/audio/spring-breeze.mp3',
    mood: 'gentle-hope'
  },
  summer: {
    id: 'summer-cicada',
    name: '蝉鸣',
    description: '夏日午后，蝉鸣阵阵',
    path: '/audio/summer-cicada.mp3',
    mood: 'warm-lazy'
  },
  autumn: {
    id: 'autumn-wind',
    name: '秋风',
    description: '落叶沙沙，沉静悠远',
    path: '/audio/autumn-wind.mp3',
    mood: 'melancholy-calm'
  },
  winter: {
    id: 'winter-silence',
    name: '静雪',
    description: '安静，雪花飘落的声音',
    path: '/audio/winter-silence.mp3',
    mood: 'quiet-silent'
  },
  rain: {
    id: 'rain-rain',
    name: '雨声',
    description: '细雨打在树叶上',
    path: '/audio/rain.mp3',
    mood: 'calm-melancholy'
  },
  meditation: {
    id: 'mindfulness',
    name: '正念',
    description: '适合静坐冥想',
    path: '/audio/meditation.mp3',
    mood: 'calm-mindful'
  },
  lonely: {
    id: 'lonely-heart',
    name: '孤独',
    description: '淡淡的孤独感',
    path: '/audio/lonely.mp3',
    mood: 'lonely-peace'
  }
};

// 根据季节自动选音乐
export function getDefaultMusicForSeason(seasonKey, weatherKey) {
  // 天气优先
  if (weatherKey === 'rainy') {
    return BACKGROUND_MUSIC.rain;
  }
  if (weatherKey === 'snowy') {
    return BACKGROUND_MUSIC.winter;
  }

  switch (seasonKey) {
    case 'spring': return BACKGROUND_MUSIC.spring;
    case 'summer': return BACKGROUND_MUSIC.summer;
    case 'autumn': return BACKGROUND_MUSIC.autumn;
    case 'winter': return BACKGROUND_MUSIC.winter;
    default: return BACKGROUND_MUSIC.spring;
  }
}

// 根据心情推荐音乐
export function recommendMusicByMood(mood) {
  if (mood < 0.3) {
    return [BACKGROUND_MUSIC.lonely, BACKGROUND_MUSIC.rain];
  } else if (mood < 0.6) {
    return [BACKGROUND_MUSIC.autumn, BACKGROUND_MUSIC.meditation];
  } else {
    return [BACKGROUND_MUSIC.spring, BACKGROUND_MUSIC.summer];
  }
}

// 获取所有音乐列表供选择
export function getAllMusicList() {
  return Object.values(BACKGROUND_MUSIC);
}

// 音频控制类
export class AudioPlayer {
  constructor() {
    this.audioContext = null;
    this.currentMusicId = null;
    this.playing = false;
    this.volume = 0.3; // 默认低音量，不干扰心情
  }

  play(music, loop = true) {
    // 如果已经在播放同一个，不用重启
    if (this.currentMusicId === music.id && this.playing) {
      return;
    }

    // 停止之前的
    this.stop();

    // 创建新的
    const audio = wx.createInnerAudioContext();
    audio.src = music.path;
    audio.loop = loop;
    audio.volume = this.volume;
    audio.play();

    this.audioContext = audio;
    this.currentMusicId = music.id;
    this.playing = true;
  }

  stop() {
    if (this.audioContext) {
      this.audioContext.stop();
      this.audioContext.destroy();
      this.audioContext = null;
    }
    this.playing = false;
    this.currentMusicId = null;
  }

  pause() {
    if (this.audioContext && this.playing) {
      this.audioContext.pause();
      this.playing = false;
    }
  }

  resume() {
    if (this.audioContext && !this.playing) {
      this.audioContext.play();
      this.playing = true;
    }
  }

  setVolume(v) {
    this.volume = v;
    if (this.audioContext) {
      this.audioContext.volume = v;
    }
  }
}
