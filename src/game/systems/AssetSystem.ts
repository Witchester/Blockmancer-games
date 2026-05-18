import Phaser from 'phaser';
import { ASSET_MANIFEST, type AssetKind, type AssetManifestEntry } from '../data/assets';
import {
  ANIMATION_DEFINITIONS,
  getAnimationDefinition,
  getAnimationFrameKeys,
  getBoardBlockStandard,
  hasAnimationDefinition,
  type AnimationCategory
} from '../data/animations';
import { BLOCK_ANIM } from '../utils/constants';
import { contentRegistry } from './ContentRegistry';

export type { AssetKind, AssetManifestEntry };

export type AssetRefs = Record<string, string | string[] | undefined>;
export type AssetRefContent = {
  id?: string;
  spriteKey?: string;
  iconKey?: string;
  animationKey?: string;
  animations?: Record<string, string | undefined>;
  vfxKey?: string;
  useVfxKey?: string;
  hitVfxKey?: string;
  clearAnimationKey?: string;
  glowAnimationKey?: string;
  warningAnimationKey?: string;
  portraitKey?: string;
  backgroundKey?: string;
  assetRefs?: AssetRefs;
  backgrounds?: Record<string, string | undefined>;
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
      if (import.meta.env.DEV) {
        console.warn(`[assets] Missing ${file.key} at ${file.url}`);
      }
    });

    this.preloadAnimationFrames(scene);

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

  preloadAnimationFrames(scene: Phaser.Scene): void {
    for (const definition of ANIMATION_DEFINITIONS) {
      const frameKeys = getAnimationFrameKeys(definition.id);
      frameKeys.forEach((key, index) => {
        if (scene.textures.exists(key)) {
          return;
        }
        const entry = this.manifest.get(key);
        if (entry) {
          return;
        }
        this.register({
          key,
          path: definition.expectedFiles[index],
          kind: definition.category === 'ui' || definition.category === 'hazardUi' ? 'ui' : 'sprite'
        });
      });
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

  hasAnimationDefinition(animationId: string | null | undefined): boolean {
    return hasAnimationDefinition(animationId);
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
    const value = content.assetRefs?.[variant] ?? (fallbackVariant ? content.assetRefs?.[fallbackVariant] : undefined);
    return typeof value === 'string' ? value : null;
  }

  getBoardBlockBaseKey(blockId: string | null | undefined): string {
    const block = blockId ? contentRegistry.getBoardBlock(blockId) as AssetRefContent | null : null;
    return this.getAssetRef(block, 'base') ?? this.boardBlockStem(blockId, block);
  }

  getBoardBlockGlowKey(blockId: string | null | undefined): string {
    const block = blockId ? contentRegistry.getBoardBlock(blockId) as AssetRefContent | null : null;
    return this.getAssetRef(block, 'glow') ?? `${this.boardBlockStem(blockId, block)}_glow`;
  }

  getBoardBlockClearKey(blockId: string | null | undefined): string {
    const block = blockId ? contentRegistry.getBoardBlock(blockId) as AssetRefContent | null : null;
    return this.getAssetRef(block, 'clear') ?? `${this.boardBlockStem(blockId, block)}_clear`;
  }

  getBoardBlockGlowFrames(blockId: string | null | undefined): string[] {
    const block = blockId ? contentRegistry.getBoardBlock(blockId) as AssetRefContent | null : null;
    const explicit = block?.assetRefs?.glowFrames;
    if (Array.isArray(explicit)) {
      return explicit.filter((key): key is string => typeof key === 'string' && key.length > 0);
    }
    const stem = this.boardBlockStem(blockId, block);
    return this.inferBoardBlockFrameKeys(stem, 'glow');
  }

  getBoardBlockClearFrames(blockId: string | null | undefined): string[] {
    const block = blockId ? contentRegistry.getBoardBlock(blockId) as AssetRefContent | null : null;
    const explicit = block?.assetRefs?.clearFrames;
    if (Array.isArray(explicit)) {
      return explicit.filter((key): key is string => typeof key === 'string' && key.length > 0);
    }
    const stem = this.boardBlockStem(blockId, block);
    return this.inferBoardBlockFrameKeys(stem, 'clear');
  }

  getLoadedBoardBlockGlowFrames(scene: Phaser.Scene, blockId: string | null | undefined): string[] {
    const animationId = this.getBoardBlockAnimationId(blockId, 'glow');
    const manifestFrames = this.getLoadedAnimationFrameKeys(scene, animationId);
    return manifestFrames.length > 0 ? manifestFrames : this.getLoadedBoardBlockFrames(scene, this.getBoardBlockGlowFrames(blockId));
  }

  getLoadedBoardBlockClearFrames(scene: Phaser.Scene, blockId: string | null | undefined): string[] {
    const animationId = this.getBoardBlockAnimationId(blockId, 'clear');
    const manifestFrames = this.getLoadedAnimationFrameKeys(scene, animationId);
    return manifestFrames.length > 0 ? manifestFrames : this.getLoadedBoardBlockFrames(scene, this.getBoardBlockClearFrames(blockId));
  }

  getBoardBlockAnimationId(blockId: string | null | undefined, state: 'glow' | 'clear' | 'special'): string | null {
    const block = blockId ? contentRegistry.getBoardBlock(blockId) as AssetRefContent | null : null;
    const explicit = state === 'glow'
      ? block?.glowAnimationKey ?? block?.animations?.glow
      : state === 'clear'
        ? block?.clearAnimationKey ?? block?.animations?.clear
        : block?.animationKey ?? block?.animations?.special;
    if (explicit && hasAnimationDefinition(explicit)) {
      return explicit;
    }

    if (!blockId) {
      return null;
    }
    const standard = getBoardBlockStandard(blockId);
    if (!standard) {
      return null;
    }
    const animationName = state === 'glow'
      ? 'glow'
      : state === 'clear'
        ? this.getDefaultBoardBlockClearAnimationName(blockId)
        : this.getDefaultBoardBlockSpecialAnimationName(blockId);
    const inferredId = `anim_${standard.assetId.replace(/^spr_/, '')}_${animationName}`;
    return hasAnimationDefinition(inferredId) ? inferredId : null;
  }

  getBoardBlockIconKey(blockId: string | null | undefined): string {
    const block = blockId ? contentRegistry.getBoardBlock(blockId) as AssetRefContent | null : null;
    return this.getAssetRef(block, 'icon') ?? block?.iconKey ?? this.boardBlockStem(blockId, block).replace(/^spr_/, 'ico_');
  }

  getBoardBlockTexture(
    scene: Phaser.Scene,
    blockId: string | null | undefined,
    state: BoardBlockVisualState = 'base'
  ): string {
    const block = blockId ? contentRegistry.getBoardBlock(blockId) as AssetRefContent | null : null;
    const stem = this.boardBlockStem(blockId, block);
    const stateKey = state === 'base'
      ? this.getBoardBlockBaseKey(blockId)
      : state === 'icon'
        ? this.getBoardBlockIconKey(blockId)
        : state === 'glow'
          ? this.getBoardBlockGlowKey(blockId)
          : this.getBoardBlockClearKey(blockId);
    const baseKey = this.getBoardBlockBaseKey(blockId);
    return this.getFirstTextureKey(scene, [
      ...this.withLegacyTextureKeys(stateKey),
      ...(state !== 'base' && state !== 'icon' ? this.withLegacyTextureKeys(baseKey) : []),
      ...this.withLegacyTextureKeys(stem),
      block?.spriteKey,
      blockId
    ], state === 'icon' ? 'icon' : 'block');
  }

  getHeroTexture(scene: Phaser.Scene, heroId: string | null | undefined, state: HeroVisualState = 'portrait'): string {
    const hero = heroId ? contentRegistry.getHero(heroId) as AssetRefContent | null : null;
    const normalizedState = state === 'locked' ? 'silhouette_locked' : state;
    return this.getFirstTextureKey(scene, [
      this.getAssetRef(hero, state),
      this.getAssetRef(hero, normalizedState),
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
      this.getAssetRef(monster, state),
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

  getLoadedAnimationFrameKeys(scene: Phaser.Scene, animationId: string | null | undefined): string[] {
    const definition = getAnimationDefinition(animationId);
    if (!definition) {
      if (animationId && import.meta.env.DEV) {
        console.warn(`[animations] Unknown animation id: ${animationId}`);
      }
      return [];
    }
    const frameKeys = getAnimationFrameKeys(definition.id);
    const loaded = frameKeys.filter((key) => scene.textures.exists(key));
    return loaded.length === definition.frameCount ? loaded : [];
  }

  registerGameAnimations(scene: Phaser.Scene): void {
    for (const definition of ANIMATION_DEFINITIONS) {
      this.createAnimationIfLoaded(scene, definition.id);
    }
  }

  playAnimationSafe(spriteOrScene: Phaser.GameObjects.Sprite | Phaser.Scene, animationId: string | null | undefined): boolean {
    const scene = spriteOrScene instanceof Phaser.Scene ? spriteOrScene : spriteOrScene.scene;
    const definition = getAnimationDefinition(animationId);
    if (!definition) {
      if (animationId && import.meta.env.DEV) {
        console.warn(`[animations] Unknown animation id: ${animationId}`);
      }
      return false;
    }

    if (!this.createAnimationIfLoaded(scene, definition.id)) {
      if (!(spriteOrScene instanceof Phaser.Scene)) {
        const fallbackKey = this.getTextureKey(scene, definition.fallbackKey, this.fallbackKindForAnimation(definition.category));
        spriteOrScene.setTexture(fallbackKey);
      }
      return false;
    }

    if (spriteOrScene instanceof Phaser.Scene) {
      return true;
    }

    spriteOrScene.play(definition.id);
    return true;
  }

  getIcon(
    scene: Phaser.Scene,
    contentType: string,
    id: string | null | undefined,
    explicitKey?: string | null
  ): string {
    if (contentType === 'boardBlock') {
      return this.getBoardBlockTexture(scene, id, 'icon');
    }

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

  resolveBoardBlockAssetPath(
    key: string,
    variant: 'base' | 'glow' | 'clear' | 'glowFrame' | 'clearFrame' | 'icon' = 'base'
  ): string {
    if (variant === 'icon') {
      return `assets/icons/board-blocks/${key}.png`;
    }

    const type = this.boardBlockTypeFromKey(key);
    if (variant === 'glowFrame') {
      return `assets/sprites/board-blocks/${type}/animations/glow/${key}.png`;
    }
    if (variant === 'clearFrame') {
      return `assets/sprites/board-blocks/${type}/animations/clear/${key}.png`;
    }
    return `assets/sprites/board-blocks/${type}/${key}.png`;
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
    const key = this.getAssetRef(block, 'base') ?? block?.spriteKey ?? blockId ?? 'block_red';
    const aliases: Record<string, string> = {
      block_red: 'spr_block_red_rune',
      block_blue: 'spr_block_blue_rune',
      block_green: 'spr_block_green_rune',
      block_yellow: 'spr_block_yellow_rune'
    };
    return aliases[key] ?? (key.startsWith('spr_') ? key : `spr_${key}`);
  }

  private inferBoardBlockFrameKeys(stem: string, state: 'glow' | 'clear'): string[] {
    const count = state === 'glow' ? BLOCK_ANIM.GLOW_FRAME_COUNT : BLOCK_ANIM.CLEAR_FRAME_COUNT;
    return Array.from({ length: count }, (_, index) => `${stem}_${state}_frame_${String(index + 1).padStart(2, '0')}`);
  }

  private createAnimationIfLoaded(scene: Phaser.Scene, animationId: string): boolean {
    const definition = getAnimationDefinition(animationId);
    if (!definition) {
      return false;
    }
    if (scene.anims.exists(definition.id)) {
      return true;
    }
    const frames = this.getLoadedAnimationFrameKeys(scene, definition.id);
    if (frames.length !== definition.frameCount) {
      return false;
    }
    scene.anims.create({
      key: definition.id,
      frames: frames.map((key) => ({ key })),
      frameRate: definition.frameRate,
      repeat: definition.loop ? -1 : 0
    });
    return true;
  }

  private fallbackKindForAnimation(category: AnimationCategory): AssetKind | 'block' {
    if (category === 'boardBlock') {
      return 'block';
    }
    if (category === 'hazardUi' || category === 'ui') {
      return 'icon';
    }
    return 'sprite';
  }

  private getDefaultBoardBlockClearAnimationName(blockId: string): string {
    const names: Record<string, string> = {
      block_bomb: 'explode',
      block_star: 'clear_burst',
      block_jelly: 'squish_clear',
      block_ice: 'crack_clear',
      block_sticky: 'stretch_clear',
      block_crumb_junk: 'break',
      block_cracked_junk: 'break',
      block_royal: 'break',
      block_floaty_rune: 'expire_to_junk',
      block_cloud_junk: 'expire_to_junk',
      block_locked_rune: 'break'
    };
    return names[blockId] ?? 'clear';
  }

  private getDefaultBoardBlockSpecialAnimationName(blockId: string): string {
    const names: Record<string, string> = {
      block_bomb: 'fuse',
      block_star: 'cascade_boost',
      block_jelly: 'cascade_bounce',
      block_ice: 'freeze_effect',
      block_sticky: 'sticky_warning',
      block_royal: 'pattern_lock',
      block_floaty_rune: 'hover',
      block_cloud_junk: 'hover',
      block_locked_rune: 'lock_pulse'
    };
    return names[blockId] ?? 'idle';
  }

  private withLegacyTextureKeys(key: string | null | undefined): string[] {
    return key ? [key, `${key}__legacy`] : [];
  }

  private getLoadedBoardBlockFrames(scene: Phaser.Scene, keys: string[]): string[] {
    return keys
      .map((key) => this.getFirstTextureKey(scene, this.withLegacyTextureKeys(key), 'block'))
      .filter((key) => key !== this.blockFallbackKey);
  }

  private boardBlockTypeFromKey(key: string): string {
    const stem = key
      .replace(/^ico_block_/, '')
      .replace(/^spr_block_/, '')
      .replace(/_(?:glow|clear)(?:_frame_\d{2})?$/, '');
    return stem.endsWith('_rune') ? stem.slice(0, -'_rune'.length) : stem;
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
