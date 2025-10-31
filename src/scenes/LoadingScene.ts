import Phaser from "phaser";

export default class LoadingScene extends Phaser.Scene {
  private percentText!: Phaser.GameObjects.Text;
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressBox!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: "LoadingScene" });
  }

  preload(): void {
    const { width, height } = this.scale;

    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(width / 2 - 210, height / 2 + 40, 420, 50);

    this.progressBar = this.add.graphics();

    this.percentText = this.add
      .text(width / 2, height / 2 + 110, "0%", {
        color: "#ffffff",
        fontSize: "18px",
      })
      .setOrigin(0.5);

    this.load.image("background", "assets/images/background.png");
    this.load.image("reels_frame", "assets/images/reels_frame.png");
    this.load.image("symbol1", "assets/images/symbol1.png");
    this.load.image("symbol2", "assets/images/symbol2.png");
    this.load.image("symbol3", "assets/images/symbol3.png");
    this.load.image("spin_button", "assets/images/spin_button.png");

    this.load.audio("bg_loop", "assets/audio/bg_loop.mp3");
    this.load.audio("spin_sfx", "assets/audio/spin.mp3");
    this.load.audio("win_sfx", "assets/audio/win.mp3");
    this.load.audio("lose_sfx", "assets/audio/lose.mp3");

    if ((this.load as any).spine) {
      (this.load as any).spine(
        "goblin",
        "assets/spine/goblin.json",
        "assets/spine/goblin.atlas",
        true
      );
    }

    this.load.on("progress", (value: number) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0xffffff, 1);
      this.progressBar.fillRect(
        width / 2 - 200,
        height / 2 + 50,
        400 * value,
        30
      );
      this.percentText.setText(`${Math.floor(value * 100)}%`);
    });

    this.load.on("complete", () => {
      this.progressBox.destroy();
      this.progressBar.destroy();
      this.percentText.destroy();
      this.scene.start("MainScene");
    });
  }

  create(): void {}
}
