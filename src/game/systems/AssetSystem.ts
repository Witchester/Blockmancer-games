import Phaser from 'phaser';
import { ASSET_MANIFEST, type AssetKind, type AssetManifestEntry } from '../data/assets';
import { contentRegistry } from './ContentRegistry';

export type { AssetKind, AssetManifestEntry };

export type AssetRefs = Record<string, string | undefined>;
export type AssetRefContent = {
  id?: string;
  spriteKey?: string;
  iconKey?: string;
  portraitKey?: string;
  backgroundKey?: string;
  assetRefs?: AssetRefs;
  backgrounds?: AssetRefs;
  theme?: string;
  bossId?: string;
};

export type BoardBlockVisualState = 'base' | 'glow' | 'clear' | 'icon';
export type HeroVisualState = 'idle' | 'cast' | 'attack' | 'hit' | 'victory' | 'defeat' | 'portrait' | 'locked' | 'icon';
export type MonsterVisualState = 'idle' | 'attack' | 'hit' | 'defeat' | 'special' | 'phase_2' | 'intro_portrait' | 'icon';
export type StageBackgroundState = 'battle' | 'battleFar' | 'battleMid' | 'battleNear' | 'map' | 'bossArena';
export type MapNodeVisualState = 'available' | 'current' | 'completed' | 'locked';

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

  hasAssetKey(key: string): boolean {
    return this.has(key);
  }

  hasLoadedTexture(scene: Phaser.Scene, key: string | null | undefined): boolean {
    return Boolean(key && scene.textures.exists(key));
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

  getFirstTextureKey(
    scene: Phaser.Scene,
    keys: Array<string | null | undefined>,
    kind: AssetKind | 'block' = 'sprite'
  ): string {
    this.ensureFallbackTextures(scene);
    for (const key of keys) {
      if (key && scene.textures.exists(key)) {
        return key;
      }
    }
    for (const key of keys) {
      const entry = key ? this.get(key) : null;
      if (entry && entry.key !== this.fallbackKey && scene.textures.exists(entry.key)) {
        return entry.key;
      }
    }
    return this.fallbackFor(kind);
  }

  getAssetRef(content: AssetRefContent | null | undefined, variant: string, fallbackVariant?: string): string | null {
    if (!content) {
      return null;
    }
    return content.assetRefs?.[variant] ?? (fallbackVariant ? content.assetRefs?.[fallbackVariant] : undefined) ?? null;
  }

  getBoardBlockTexture(
    scene: Phaser.Scene,
    blockId: string | null | undefined,
    state: BoardBlockVisualState = 'base'
  ): string {
    const block = blockId ? contentRegistry.getBoardBlock(blockId) as AssetRefContent | null : null;
    const stem = this.boardBlockStem(blockId, block);
    const variantKey = state === 'base' ? stem : state === 'icon' ? stem.replace(/^spr_/, 'ico_') : `${stem}_${state}`;
    return this.getFirstTextureKey(scene, [
      block?.assetRefs?.[state],
      variantKey,
      state !== 'base' ? block?.assetRefs?.base : undefined,
      stem,
      block?.spriteKey,
      blockId
    ], state === 'icon' ? 'icon' : 'block');
  }

  getHeroTexture(scene: Phaser.Scene, heroId: string | null | undefined, state: HeroVisualState = 'portrait'): string {
    const hero = heroId ? contentRegistry.getHero(heroId) as AssetRefContent | null : null;
    const normalizedState = state === 'locked' ? 'silhouette_locked' : state;
    return this.getFirstTextureKey(scene, [
      hero?.assetRefs?.[state],
      hero?.assetRefs?.[normalizedState],
      state === 'icon' ? `ico_${heroId}` : undefined,
      heroId ? `spr_${heroId}_${normalizedState}` : undefined,
      hero?.portraitKey,
      heroId ? `spr_${heroId}_portrait` : undefined,
      heroId ? `spr_${heroId}_idle` : undefined,
      heroId
    ], state === 'icon' ? 'icon' : 'sprite');
  }

  getMonsterTexture(scene: Phaser.Scene, monsterId: string | null | undefined, state: MonsterVisualState = 'idle'): string {
    const monster = monsterId ? contentRegistry.getMonster(monsterId) as AssetRefContent | null : null;
    return this.getFirstTextureKey(scene, [
      monster?.assetRefs?.[state],
      state === 'icon' ? `ico_${monsterId}` : undefined,
      monsterId ? `spr_${monsterId}_${state}` : undefined,
      monsterId ? `spr_${monsterId}_idle` : undefined,
      monster?.spriteKey,
      monsterId
    ], state === 'icon' ? 'icon' : 'sprite');
  }

  getStageBackground(scene: Phaser.Scene, stageIdOrIndex: string | number | null | undefined, state: StageBackgroundState = 'battle'): string {
    const stage = typeof stageIdOrIndex === 'number'
      ? this.getStageByIndex(stageIdOrIndex)
      : stageIdOrIndex
        ? contentRegistry.getStage(stageIdOrIndex) as AssetRefContent | null
        : null;
    const slug = stage?.id?.replace(/^stage_/, '');
    const bossSlug = stage?.bossId?.replace(/^mon_boss_/, '');
    const legacyTheme = stage?.backgroundKey ?? (stage?.theme ? `bg_${stage.theme}` : undefined);
    const stateKeys: Record<StageBackgroundState, Array<string | undefined>> = {
      battle: [`bg_stage_${slug}_battle`, `bg_stage_${slug}_battle_mid`, legacyTheme],
      battleFar: [`bg_stage_${slug}_battle_far`, `bg_stage_${slug}_battle`, legacyTheme],
      battleMid: [`bg_stage_${slug}_battle_mid`, `bg_stage_${slug}_battle`, legacyTheme],
      battleNear: [`bg_stage_${slug}_battle_near`, `bg_stage_${slug}_battle`, legacyTheme],
      map: [`bg_map_${slug}`, legacyTheme],
      bossArena: [`bg_boss_${bossSlug}_arena`, `bg_stage_${slug}_battle_mid`, legacyTheme]
    };
    return this.getFirstTextureKey(scene, [
      stage?.backgrounds?.[state],
      ...stateKeys[state]
    ], 'background');
  }

  getIcon(
    scene: Phaser.Scene,
    contentType: string,
    id: string | null | undefined,
    explicitKey?: string | null
  ): string {
    const folderIconKey = id ? `ico_${id}` : undefined;
    const genericIconKey = id ? `icon_${id}` : undefined;
    return this.getFirstTextureKey(scene, [explicitKey, folderIconKey, genericIconKey, id], 'icon');
  }

  getMapNodeTexture(
    scene: Phaser.Scene,
    roomType: string,
    state: MapNodeVisualState,
    explicitKey?: string | null
  ): string {
    const normalized = roomType === 'fight' ? 'normal' : roomType;
    return this.getFirstTextureKey(scene, [
      `map_node_${normalized}_${state}`,
      explicitKey,
      `node_${roomType}`
    ], 'icon');
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

  resolveAssetPath(key: string, category?: string): string | null {
    const direct = this.manifest.get(key);
    if (direct) {
      return direct.path;
    }
    if (category) {
      return `assets/${category}/${key}.png`;
    }
    return null;
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

  private boardBlockStem(blockId: string | null | undefined, block: AssetRefContent | null): string {
    const key = block?.spriteKey ?? blockId ?? 'block_red';
    const aliases: Record<string, string> = {
      block_red: 'spr_block_red_rune',
      block_blue: 'spr_block_blue_rune',
      block_green: 'spr_block_green_rune',
      block_yellow: 'spr_block_yellow_rune'
    };
    return aliases[key] ?? (key.startsWith('spr_') ? key : `spr_${key}`);
  }

  private getStageByIndex(index: number): AssetRefContent | null {
    const order = [
      'stage_sprinkle_sewers',
      'stage_goblin_workshop',
      'stage_frosty_pantry',
      'stage_pillow_castle',
      'stage_starfall_arcade',
      'stage_bloxley_block_palace'
    ];
    const stageId = order[Math.max(0, Math.min(order.length - 1, index - 1))];
    return contentRegistry.getStage(stageId) as AssetRefContent | null;
  }
}
