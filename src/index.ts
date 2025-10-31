import Phaser from 'phaser';
import PreloadScene from './scenes/PreloadScene';
import LoadingScene from './scenes/LoadingScene';
import MainScene from './scenes/MainScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#000000',
  width: 800,
  height: 450,
  scene: [PreloadScene, LoadingScene, MainScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  audio: {
    disableWebAudio: false
  }
};

window.addEventListener('load', () => {
  // @ts-ignore
  window.game = new Phaser.Game(config);
});
