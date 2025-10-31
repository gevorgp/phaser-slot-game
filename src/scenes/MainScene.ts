import Phaser from "phaser";
import { gsap } from "gsap";
import {SYMBOLS} from "../consts/app.const";
import {TSymbolKey} from "../types/symbol.types";

export default class MainScene extends Phaser.Scene {
  private reels!: Phaser.GameObjects.Container;
  private spinButton!: Phaser.GameObjects.Image;
  private soundOn: boolean = true;
  private spineObj?: any;

  private bgLoop!: Phaser.Sound.BaseSound;
  private spinSfx!: Phaser.Sound.BaseSound;
  private winSfx!: Phaser.Sound.BaseSound;
  private loseSfx!: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: "MainScene" });
  }

  create(): void {
    const { width, height } = this.scale;

    this.add
      .image(width / 2, height / 2, "background")
      .setDisplaySize(width, height);

    const frame = this.add
      .image(width / 2, height / 2 - 20, "reels_frame")
      .setOrigin(0.5)
      .setDisplaySize(600, 300);

    this.reels = this.add.container(width / 2, height / 2 - 20);
    const spacing = 120;
    for (let i = 0; i < 3; i++) {
      const sprite = this.add.image(
        (i - 1) * spacing,
        0,
        Phaser.Utils.Array.GetRandom(SYMBOLS)
      );
      sprite.setData("index", i);
      sprite.setDisplaySize(100, 100);
      this.reels.add(sprite);
    }

    this.spinButton = this.add
      .image(width / 2, height - 80, "spin_button")
      .setInteractive({ useHandCursor: true })
      .setDisplaySize(100, 100)
      .on("pointerdown", () => this.onSpin());

    this.bgLoop = this.sound.add("bg_loop", { loop: true, volume: 0.5 });
    this.spinSfx = this.sound.add("spin_sfx");
    this.winSfx = this.sound.add("win_sfx");
    this.loseSfx = this.sound.add("lose_sfx");

    if (this.soundOn) this.bgLoop.play();

    if (this.cache.json.exists("goblin") || this.textures.exists("goblin")) {
      try {
        // @ts-ignore
        this.spineObj = this.add
          .spine(width - 140, height - 140, "goblin", "idle", true)
          .setScale(0.5);
      } catch {
        console.warn("Spine plugin missing");
      }
    }

    const soundToggle = this.add
      .text(16, 16, "Sound: ON", { color: "#fff", fontSize: "16px" })
      .setInteractive()
      .on("pointerdown", () => {
        this.soundOn = !this.soundOn;
        soundToggle.setText(this.soundOn ? "Sound: ON" : "Sound: OFF");

        if (this.soundOn) {
          if (!this.bgLoop.isPlaying) this.bgLoop.play();
          else this.bgLoop.resume?.();
        } else {
          this.bgLoop.pause?.();
          this.sound.pauseAll?.();
        }
      });

    gsap.from(this.spinButton, {
      duration: 0.8,
      y: height,
      ease: "bounce.out",
    });
  }

  private async onSpin() {
    this.spinButton.setVisible(false);

    if (this.soundOn) this.spinSfx.play();

    const reelSprites = this.reels.list as Phaser.GameObjects.Image[];
    const totalCycles = 20;
    const baseDuration = 0.05;
    const result = await this.mockServerSpin();

    reelSprites.forEach((sprite, reelIndex) => {
      let cycleCount = 0;

      const spinInterval = this.time.addEvent({
        delay: baseDuration * 1000,
        loop: true,
        callback: () => {
          const randomSymbol = Phaser.Utils.Array.GetRandom(SYMBOLS);
          sprite.setTexture(randomSymbol);
          cycleCount++;

          if (cycleCount >= totalCycles + reelIndex * 5) {
            sprite.setTexture(result[reelIndex]);
            sprite.setDisplaySize(100, 100);
            spinInterval.remove(false);

            if (reelIndex === reelSprites.length - 1) {
              this.time.delayedCall(100, () => this.finalizeSpin(result));
            }
          }
        },
      });
    });
  }

  private mockServerSpin(): Promise<TSymbolKey[]> {
    return new Promise((res) => {
      const delay = Phaser.Math.Between(500, 1200);
      this.time.delayedCall(delay, () => {
        const rnd = Phaser.Math.FloatBetween(0, 1);
        let result: TSymbolKey[];
        if (rnd < 0.25) {
          const sym = Phaser.Utils.Array.GetRandom(SYMBOLS);
          result = [sym, sym, sym];
        } else {
          result = [
            Phaser.Utils.Array.GetRandom(SYMBOLS),
            Phaser.Utils.Array.GetRandom(SYMBOLS),
            Phaser.Utils.Array.GetRandom(SYMBOLS),
          ];
        }
        res(result);
      });
    });
  }

  private finalizeSpin(result: TSymbolKey[]) {
    const allSame = result.every((v) => v === result[0]);
    if (allSame) {
      if (this.soundOn) this.winSfx.play();
      this.playWinAnimation();
    } else {
      if (this.soundOn) this.loseSfx.play();
      this.playLoseAnimation();
    }

    this.time.delayedCall(1200, () => this.spinButton.setVisible(true));
  }

  private playWinAnimation() {
    gsap.to(this.reels, { duration: 0.5, scale: 1.08, yoyo: true, repeat: 1 });

    try {
      this.spineObj?.setAnimation(0, "win", false);
      this.spineObj?.addAnimation(0, "idle", true, 0);
    } catch {
      const { width } = this.scale;
      for (let i = 0; i < 12; i++) {
        const c = this.add.circle(
          width / 2 + Phaser.Math.Between(-150, 150),
          0,
          6,
          0xffff00
        );
        gsap.to(c, { duration: 1.2, y: 400, onComplete: () => c.destroy() });
      }
    }
  }

  private playLoseAnimation() {
    try {
      this.spineObj?.setAnimation(0, "lose", false);
      this.spineObj?.addAnimation(0, "idle", true, 0);
    } catch {
      gsap.to(this.reels, { duration: 0.2, x: "-=6", yoyo: true, repeat: 3 });
    }
  }
}
