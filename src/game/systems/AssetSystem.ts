import Phaser from 'phaser';
import { ASSET_MANIFEST, type AssetKind, type AssetManifestEntry } from '../data/assets';

export type { AssetKind, AssetManifestEntry };

export class AssetSystem {
  private readonly fallbackKey = 'asset_missing';
  private readonly iconFallbackKey = 'asset_missing_icon';
  private readonly blockFallbackKey = 'asset_missing_block';
  private readonly backgroundFallbackKey = 'asset_missing_background';
  private readonly manifest = new Map<string, AssetManifestEntry>();

  constructor(entries: AssetManifestEntry[] = ASSET_MANIFEST) {
    entries.forEach((entry) => this.register(entry));
  }

  register(entry: AssetManifestEntry): void {
    this.manifest.set(entry.key, entry);
  }

  list(): AssetManifestEntry[] {
    return [...this.manifest.values()];
  }

  preload(scene: Phaser.Scene): void {
    this.ensureFallbackTextures(scene);

    scene.load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, (file: Phaser.Loader.File) => {
      // Missing art should keep development playable; renderers resolve back to generated fallbacks.
      console.warn(`[assets] Missing ${file.key} at ${file.url}`);
    });

    for (const entry of this.manifest.values()) {
      if (this.isGeneratedFallback(entry.key) || scene.textures.exists(entry.key)) {
        continue;
      }
      if (entry.kind === 'audio') {
        scene.load.audio(entry.key, entry.path);
        continue;
      }
      scene.load.image(entry.key, entry.path);
    }
  }

  get(key: string | null | undefined): AssetManifestEntry {
    if (!key) {
      return this.manifest.get(this.fallbackKey)!;
    }

    return this.manifest.get(key) ?? {
      key: this.fallbackKey,
      path: 'generated/fallback.png',
      kind: 'sprite'
    };
  }

  has(key: string): boolean {
    return this.manifest.has(key);
  }

  fallbackFor(kind: AssetKind | 'block' = 'sprite'): string {
    if (kind === 'icon') {
      return this.iconFallbackKey;
    }
    if (kind === 'background') {
      return this.backgroundFallbackKey;
    }
    if (kind === 'block') {
      return this.blockFallbackKey;
    }
    return this.fallbackKey;
  }

  getTextureKey(
    scene: Phaser.Scene,
    key: string | null | undefined,
    kind: AssetKind | 'block' = 'sprite'
  ): string {
    this.ensureFallbackTextures(scene);
    if (key && scene.textures.exists(key)) {
      return key;
    }

    const entry = key ? this.get(key) : null;
    if (entry && entry.key !== this.fallbackKey && scene.textures.exists(entry.key)) {
      return entry.key;
    }

    return this.fallbackFor(kind);
  }

  addImage(
    scene: Phaser.Scene,
    x: number,
    y: number,
    key: string | null | undefined,
    kind: AssetKind | 'block' = 'sprite'
  ): Phaser.GameObjects.Image {
    return scene.add.image(x, y, this.getTextureKey(scene, key, kind));
  }

  ensureFallbackTextures(scene: Phaser.Scene): void {
    this.generateFallback(scene, this.fallbackKey, 64, 64, 0x7f5af0, 0xffca6b);
    this.generateFallback(scene, this.iconFallbackKey, 32, 32, 0x303750, 0x65d6a5);
    this.generateFallback(scene, this.blockFallbackKey, 32, 32, 0x38416a, 0xffca6b);
    this.generateFallback(scene, this.backgroundFallbackKey, 256, 144, 0x171b2d, 0x38416a);
  }

  private isGeneratedFallback(key: string): boolean {
    return [
      this.fallbackKey,
      this.iconFallbackKey,
      this.blockFallbackKey,
      this.backgroundFallbackKey
    ].includes(key);
  }

  private generateFallback(
    scene: Phaser.Scene,
    key: string,
    width: number,
    height: number,
    fill: number,
    stroke: number
  ): void {
    if (scene.textures.exists(key)) {
      return;
    }

    const graphics = scene.make.graphics({ x: 0, y: 0 }, false);
    graphics.fillStyle(fill, 1);
    graphics.fillRoundedRect(0, 0, width, height, Math.max(4, Math.round(width * 0.12)));
    graphics.lineStyle(Math.max(2, Math.round(width * 0.06)), stroke, 1);
    graphics.strokeRoundedRect(2, 2, width - 4, height - 4, Math.max(4, Math.round(width * 0.12)));
    graphics.lineStyle(Math.max(1, Math.round(width * 0.04)), stroke, 0.55);
    graphics.lineBetween(width * 0.25, height * 0.25, width * 0.75, height * 0.75);
    graphics.lineBetween(width * 0.75, height * 0.25, width * 0.25, height * 0.75);
    graphics.generateTexture(key, width, height);
    graphics.destroy();
  }
}
