import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload(): void {
    this.load.image("loading_bg", "assets/images/background.png");

    this.load.image("bar_frame", "assets/images/reels_frame.png");
    this.load.image("bar_fill", "assets/images/symbol1.png");
  }

  create(): void {
    this.scene.start('LoadingScene');
  }
}
