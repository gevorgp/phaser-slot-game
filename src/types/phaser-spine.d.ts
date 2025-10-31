declare namespace Phaser.Loader {
  interface LoaderPlugin {
    spine?: (
      key: string,
      jsonURL: string,
      atlasURL: string,
      premultipliedAlpha?: boolean
    ) => void;
  }
}

declare namespace Phaser.GameObjects {
  interface GameObjectFactory {
    spine?: (
      x: number,
      y: number,
      key: string,
      animationName?: string,
      loop?: boolean
    ) => any;
  }
}
