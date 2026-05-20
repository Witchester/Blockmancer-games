import Phaser from 'phaser';
import { ASSET_MANIFEST, getAssetEntry, getAssetFallbacks, getAssetPath, getBoardFrameAssetKey, getBossArenaBackgroundKey, getPlaceholderForType, getStageBattleBackgroundKeys, getUiPanelAssetKey, normalizeBossId, normalizeStageId, type AssetKind, type AssetManifestEntry } from '../data/assets';
import {
  ANIMATION_DEFINITIONS,
  getAnimationDefinition,
  getAnimationFrameKeys,
  getBoardBlockStandard,
  hasAnimationDefinition,
  type AnimationCategory
} from '../data/animations';
import { getAssetDisplayRule, type AssetDisplayCategory, type AssetDisplayRule } from '../data/asset-display-rules';
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
export type RouteStoryAssetType =
  | 'dialoguePanel'
  | 'choiceCardPractical'
  | 'choiceCardTrue'
  | 'choiceCardRisky'
  | 'routeTrigger'
  | 'routeBadge'
  | 'heroPortrait'
  | 'npcPortrait'
  | 'ending'
  | 'routeScene';

const POSE_SHEET_FRAME_WIDTH = 627;
const POSE_SHEET_FRAME_HEIGHT = 627;

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
      if (this.isPoseSheetKey(entry.key)) {
        this.preloadSpriteSheetAsset(scene, entry.key, entry.path, 'monsterPoseSheet', POSE_SHEET_FRAME_WIDTH, POSE_SHEET_FRAME_HEIGHT);
        continue;
      }
      this.preloadSingleImageAsset(scene, entry.key, entry.path, this.categoryForAssetKind(entry.kind));
    }
  }

  resolveAssetKey(
    scene: Phaser.Scene,
    assetKey: string | null | undefined,
    category: AssetDisplayCategory,
    kind: AssetKind | 'block' = 'sprite'
  ): string {
    const resolved = this.getTextureKey(scene, assetKey, kind);
    if (resolved !== this.fallbackFor(kind)) {
      return resolved;
    }
    return this.useFallbackAsset(category, scene, kind);
  }

  preloadSingleImageAsset(scene: Phaser.Scene, assetKey: string, path: string, _category: AssetDisplayCategory): void {
    scene.load.image(assetKey, path);
  }

  preloadSpriteSheetAsset(
    scene: Phaser.Scene,
    assetKey: string,
    path: string,
    _category: AssetDisplayCategory,
    frameWidth: number,
    frameHeight: number
  ): void {
    scene.load.spritesheet(assetKey, path, { frameWidth, frameHeight });
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
    const normalizedId = this.normalizeBlockId(blockId);
    const block = normalizedId ? contentRegistry.getBoardBlock(normalizedId) as AssetRefContent | null : null;
    return this.getAssetRef(block, 'base') ?? `${this.boardBlockStem(blockId, block)}__base__f00`;
  }

  getBoardBlockGlowKey(blockId: string | null | undefined): string {
    const normalizedId = this.normalizeBlockId(blockId);
    const block = normalizedId ? contentRegistry.getBoardBlock(normalizedId) as AssetRefContent | null : null;
    return this.getAssetRef(block, 'glow') ?? `${this.boardBlockStem(blockId, block)}__glow__f00`;
  }

  getBoardBlockClearKey(blockId: string | null | undefined): string {
    const normalizedId = this.normalizeBlockId(blockId);
    const block = normalizedId ? contentRegistry.getBoardBlock(normalizedId) as AssetRefContent | null : null;
    return this.getAssetRef(block, 'clear') ?? `${this.boardBlockStem(blockId, block)}__clear__f00`;
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

  getBoardBlockFrames(blockId: string | null | undefined, animationName: string): string[] {
    if (animationName === 'glow') {
      return this.getBoardBlockGlowFrames(blockId);
    }
    if (animationName === 'clear') {
      return this.getBoardBlockClearFrames(blockId);
    }
    const block = blockId ? contentRegistry.getBoardBlock(blockId) as AssetRefContent | null : null;
    const special = block?.assetRefs?.specialFrames;
    if (Array.isArray(special)) {
      return special.filter((key): key is string => typeof key === 'string' && key.length > 0);
    }
    const standard = blockId ? getBoardBlockStandard(blockId) : null;
    if (!standard) {
      return [];
    }
    const inferredId = `anim_${standard.assetId.replace(/^spr_/, '')}_${animationName}`;
    return getAnimationFrameKeys(inferredId);
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
    const normalizedId = this.normalizeBlockId(blockId);
    const block = normalizedId ? contentRegistry.getBoardBlock(normalizedId) as AssetRefContent | null : null;
    return this.getAssetRef(block, 'icon') ?? block?.iconKey ?? `ico_${this.boardBlockStem(blockId, block)}`;
  }

  getBoardBlockTexture(
    scene: Phaser.Scene,
    blockId: string | null | undefined,
    state: BoardBlockVisualState = 'base'
  ): string {
    const normalizedId = this.normalizeBlockId(blockId);
    const block = normalizedId ? contentRegistry.getBoardBlock(normalizedId) as AssetRefContent | null : null;
    const stem = this.boardBlockStem(normalizedId, block);
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
      normalizedId,
      state === 'icon' ? this.legacyBoardBlockIconKey(normalizedId) : undefined,
      block?.spriteKey,
      this.legacyBoardBlockSpriteKey(normalizedId)
    ], state === 'icon' ? 'icon' : 'block');
  }

  getHeroTexture(scene: Phaser.Scene, heroId: string | null | undefined, state: HeroVisualState = 'portrait'): string {
    const hero = heroId ? contentRegistry.getHero(heroId) as AssetRefContent | null : null;
    const normalizedState = state === 'locked' ? 'silhouette_locked' : state === 'cast' ? 'cast_spell' : state === 'defeat' ? 'defeat_tired' : state;
    return this.getFirstTextureKey(scene, [
      this.getAssetRef(hero, state),
      this.getAssetRef(hero, normalizedState),
      state !== 'icon' && state !== 'portrait' && heroId ? `${heroId}__${normalizedState}__f00` : undefined,
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
    const actorId = monsterId?.startsWith('mon_boss_') ? monsterId.replace(/^mon_/, '') : monsterId;
    return this.getFirstTextureKey(scene, [
      this.getAssetRef(monster, state),
      state === 'icon' ? `ico_${actorId}` : undefined,
      state !== 'icon' && actorId ? `${actorId}__${state}__f00` : undefined,
      monsterId ? `spr_${monsterId}_${state}` : undefined,
      monsterId ? `spr_${monsterId}_idle` : undefined,
      monster?.spriteKey,
      monsterId
    ], state === 'icon' ? 'icon' : 'sprite');
  }

  getBossTexture(scene: Phaser.Scene, bossId: string | null | undefined, state: MonsterVisualState = 'idle'): string {
    const monsterId = bossId?.startsWith('mon_boss_') ? bossId : bossId ? `mon_${bossId}` : bossId;
    return this.getMonsterTexture(scene, monsterId, state);
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

  getIconTexture(
    scene: Phaser.Scene,
    category: string,
    id: string | null | undefined,
    explicitKey?: string | null
  ): string {
    return this.getIcon(scene, category, id, explicitKey);
  }

  getRouteStoryTexture(scene: Phaser.Scene, type: RouteStoryAssetType, id: string | null | undefined): string {
    const keys: Record<RouteStoryAssetType, Array<string | undefined>> = {
      dialoguePanel: ['ui_route_dialogue_panel'],
      choiceCardPractical: ['ui_route_choice_card_practical'],
      choiceCardTrue: ['ui_route_choice_card_true'],
      choiceCardRisky: ['ui_route_choice_card_risky'],
      routeTrigger: id ? [`ico_route_trigger_${id}`] : [],
      routeBadge: id ? [`ico_route_badge_${id}`] : [],
      heroPortrait: id ? [`prt_route_${id}`, `prt_route_${id}_neutral`, id] : [],
      npcPortrait: id ? [`prt_route_${id}`, `prt_route_${id}_neutral`] : [],
      ending: id ? [`story_end_${id}`, `story_end_${id}_normal`] : [],
      routeScene: id ? [`bg_route_${id}`] : []
    };
    const kind = type === 'routeTrigger' || type === 'routeBadge'
      ? 'icon'
      : type === 'ending' || type === 'routeScene'
        ? 'background'
        : 'sprite';
    return this.getFirstTextureKey(scene, keys[type], kind);
  }

  getVfxFrames(scene: Phaser.Scene, vfxId: string | null | undefined): string[] {
    return this.getLoadedAnimationFrameKeys(scene, vfxId?.startsWith('anim_') ? vfxId : vfxId ? `anim_${vfxId}` : null);
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
    const image = scene.add.image(x, y, this.getTextureKey(scene, key, kind));
    this.applyPixelArtTextureSettings(image);
    return image;
  }

  getHeroDisplayKey(scene: Phaser.Scene, heroId: string | null | undefined): string {
    return this.getLoadedHeroPoseSheetKey(scene, heroId) ?? this.getHeroTexture(scene, heroId, 'idle');
  }

  getHeroPoseFrame(
    pose: 'idle' | 'cast' | 'attack' | 'hit' | 'victory' | 'defeat' | 'special' | 'menu',
    extendedAvailable = false
  ): number {
    if (!extendedAvailable) {
      if (pose === 'idle') return 0;
      if (pose === 'cast') return 1;
      if (pose === 'attack') return 2;
      if (pose === 'hit') return 3;
      return 0;
    }
    if (pose === 'victory') return 0;
    if (pose === 'defeat') return 1;
    if (pose === 'special') return 2;
    if (pose === 'menu') return 3;
    return 0;
  }

  createHeroPoseSprite(
    scene: Phaser.Scene,
    heroId: string | null | undefined,
    pose: 'idle' | 'cast' | 'attack' | 'hit' | 'victory' | 'defeat' | 'special' | 'menu',
    x: number,
    y: number,
    options?: { extended?: boolean; alpha?: number; depth?: number }
  ): Phaser.GameObjects.Sprite {
    const useExtended = Boolean(options?.extended && this.getLoadedHeroExtendedPoseSheetKey(scene, heroId));
    const sheetKey = useExtended
      ? this.getLoadedHeroExtendedPoseSheetKey(scene, heroId)
      : this.getLoadedHeroPoseSheetKey(scene, heroId);
    const category = useExtended ? 'heroExtendedPoseSheet' : 'heroPoseSheet';
    const fallbackState: HeroVisualState = pose === 'cast'
      ? 'cast'
      : pose === 'attack'
        ? 'attack'
        : pose === 'hit'
          ? 'hit'
          : pose === 'victory'
            ? 'victory'
            : pose === 'defeat'
              ? 'defeat'
              : 'idle';
    const sprite = this.createSpriteByAssetKey(
      scene,
      sheetKey ?? this.getHeroTexture(scene, heroId, fallbackState),
      category,
      x,
      y,
      { kind: 'sprite', originX: 0.5, originY: 1, alpha: options?.alpha, depth: options?.depth }
    );
    if (sheetKey) {
      sprite.setFrame(this.getHeroPoseFrame(pose, useExtended));
    }
    return sprite;
  }

  setHeroPose(
    scene: Phaser.Scene,
    sprite: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image,
    heroId: string | null | undefined,
    pose: 'idle' | 'cast' | 'attack' | 'hit' | 'victory' | 'defeat' | 'special' | 'menu'
  ): void {
    const extendedKey = this.getLoadedHeroExtendedPoseSheetKey(scene, heroId);
    const baseKey = this.getLoadedHeroPoseSheetKey(scene, heroId);
    const useExtended = Boolean(extendedKey && ['victory', 'defeat', 'special', 'menu'].includes(pose));
    const sheetKey = useExtended ? extendedKey : baseKey;
    if (sheetKey) {
      if (sprite.texture.key !== sheetKey) {
        sprite.setTexture(sheetKey);
      }
      sprite.setFrame(this.getHeroPoseFrame(pose, useExtended));
      return;
    }
    const fallbackState: HeroVisualState = pose === 'cast'
      ? 'cast'
      : pose === 'attack'
        ? 'attack'
        : pose === 'hit'
          ? 'hit'
          : pose === 'victory'
            ? 'victory'
            : pose === 'defeat'
              ? 'defeat'
              : 'idle';
    sprite.setTexture(this.getHeroTexture(scene, heroId, fallbackState));
  }

  getMonsterPoseFrame(pose: 'idle' | 'attack' | 'hit' | 'defeat'): number {
    const frameByPose: Record<'idle' | 'attack' | 'hit' | 'defeat', number> = {
      idle: 0,
      attack: 1,
      hit: 2,
      defeat: 3
    };
    return frameByPose[pose];
  }

  getBossPoseFrame(
    scene: Phaser.Scene,
    bossId: string | null | undefined,
    pose: 'idle' | 'attack' | 'hit' | 'phase_change' | 'special_attack' | 'defeat'
  ): number {
    if (pose === 'idle') {
      return 0;
    }
    if (pose === 'attack') {
      return 1;
    }
    if (pose === 'defeat') {
      return 3;
    }
    const hasExtended = this.hasBossExtendedPoseSheet(scene, bossId);
    if (!hasExtended) {
      return 2;
    }
    if (pose === 'hit') {
      return 0;
    }
    if (pose === 'special_attack') {
      return 1;
    }
    return 2;
  }

  createMonsterPoseSprite(
    scene: Phaser.Scene,
    monsterId: string | null | undefined,
    pose: 'idle' | 'attack' | 'hit' | 'defeat',
    x: number,
    y: number,
    options?: { elite?: boolean; alpha?: number; depth?: number }
  ): Phaser.GameObjects.Sprite {
    const sheetKey = this.getLoadedMonsterPoseSheetKey(scene, monsterId);
    const category = options?.elite ? 'eliteMonsterPoseSheet' : 'monsterPoseSheet';
    const sprite = this.createSpriteByAssetKey(
      scene,
      sheetKey ?? this.getMonsterTexture(scene, monsterId, pose),
      category,
      x,
      y,
      { kind: 'sprite', originX: 0.5, originY: 1, alpha: options?.alpha, depth: options?.depth }
    );
    if (sheetKey) {
      sprite.setFrame(this.getMonsterPoseFrame(pose));
    }
    return sprite;
  }

  createBossPoseSprite(
    scene: Phaser.Scene,
    bossId: string | null | undefined,
    pose: 'idle' | 'attack' | 'hit' | 'phase_change' | 'special_attack' | 'defeat',
    x: number,
    y: number,
    options?: { intro?: boolean; alpha?: number; depth?: number }
  ): Phaser.GameObjects.Sprite {
    const sheetKey = this.getLoadedBossPoseSheetKey(scene, bossId);
    const category = options?.intro ? 'bossIntroPoseSheet' : 'bossPoseSheet';
    const sprite = this.createSpriteByAssetKey(
      scene,
      sheetKey ?? this.getBossTexture(scene, bossId, pose === 'special_attack' ? 'special' : pose === 'phase_change' ? 'phase_2' : pose),
      category,
      x,
      y,
      { kind: 'sprite', originX: 0.5, originY: 1, alpha: options?.alpha, depth: options?.depth }
    );
    if (sheetKey) {
      const frameTexture = pose === 'hit' || pose === 'special_attack' || pose === 'phase_change'
        ? this.getLoadedBossExtendedPoseSheetKey(scene, bossId) ?? sheetKey
        : sheetKey;
      if (frameTexture !== sprite.texture.key) {
        sprite.setTexture(frameTexture);
      }
      sprite.setFrame(this.getBossPoseFrame(scene, bossId, pose));
    }
    return sprite;
  }

  setMonsterPose(
    scene: Phaser.Scene,
    sprite: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image,
    monsterId: string | null | undefined,
    pose: 'idle' | 'attack' | 'hit' | 'defeat'
  ): void {
    const sheetKey = this.getLoadedMonsterPoseSheetKey(scene, monsterId);
    if (sheetKey) {
      if (sprite.texture.key !== sheetKey) {
        sprite.setTexture(sheetKey);
      }
      sprite.setFrame(this.getMonsterPoseFrame(pose));
      return;
    }
    sprite.setTexture(this.getMonsterTexture(scene, monsterId, pose));
  }

  setBossPose(
    scene: Phaser.Scene,
    sprite: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image,
    bossId: string | null | undefined,
    pose: 'idle' | 'attack' | 'hit' | 'phase_change' | 'special_attack' | 'defeat'
  ): void {
    const sheetKey = this.getLoadedBossPoseSheetKey(scene, bossId);
    if (sheetKey) {
      const useExtended = pose === 'hit' || pose === 'special_attack' || pose === 'phase_change';
      const textureKey = useExtended
        ? this.getLoadedBossExtendedPoseSheetKey(scene, bossId) ?? sheetKey
        : sheetKey;
      if (sprite.texture.key !== textureKey) {
        sprite.setTexture(textureKey);
      }
      sprite.setFrame(this.getBossPoseFrame(scene, bossId, pose));
      return;
    }
    const fallbackState: MonsterVisualState =
      pose === 'phase_change' ? 'phase_2' : pose === 'special_attack' ? 'special' : pose;
    sprite.setTexture(this.getBossTexture(scene, bossId, fallbackState));
  }

  getAssetDisplayRule(category: AssetDisplayCategory): AssetDisplayRule {
    return getAssetDisplayRule(category);
  }

  applyPixelArtTextureSettings(gameObject: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite): void {
    gameObject.setPipeline('MultiPipeline');
    gameObject.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
  }

  fitSpriteToBox(
    sprite: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite,
    maxWidth: number,
    maxHeight: number
  ): void {
    const sourceWidth = sprite.width || maxWidth;
    const sourceHeight = sprite.height || maxHeight;
    const scale = Math.min(maxWidth / sourceWidth, maxHeight / sourceHeight);
    sprite.setDisplaySize(Math.max(1, Math.round(sourceWidth * scale)), Math.max(1, Math.round(sourceHeight * scale)));
  }

  setSpriteDisplaySizeByCategory(
    sprite: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite,
    category: AssetDisplayCategory
  ): void {
    const rule = this.getAssetDisplayRule(category);
    if (rule.renderWidth && rule.renderHeight) {
      sprite.setDisplaySize(rule.renderWidth, rule.renderHeight);
      this.applyPixelArtTextureSettings(sprite);
      return;
    }
    if (rule.maxRenderWidth && rule.maxRenderHeight) {
      this.fitSpriteToBox(sprite, rule.maxRenderWidth, rule.maxRenderHeight);
    }
    this.applyPixelArtTextureSettings(sprite);
  }

  createImageByAssetKey(
    scene: Phaser.Scene,
    assetKey: string | null | undefined,
    category: AssetDisplayCategory,
    x: number,
    y: number,
    options?: { kind?: AssetKind | 'block'; alpha?: number; depth?: number; originX?: number; originY?: number }
  ): Phaser.GameObjects.Image {
    const image = this.addImage(scene, x, y, this.resolveAssetKey(scene, assetKey, category, options?.kind ?? 'sprite'), options?.kind ?? 'sprite');
    this.setSpriteDisplaySizeByCategory(image, category);
    if (typeof options?.alpha === 'number') {
      image.setAlpha(options.alpha);
    }
    if (typeof options?.depth === 'number') {
      image.setDepth(options.depth);
    }
    if (typeof options?.originX === 'number' || typeof options?.originY === 'number') {
      image.setOrigin(options.originX ?? 0.5, options.originY ?? 0.5);
    }
    return image;
  }

  createSpriteByAssetKey(
    scene: Phaser.Scene,
    assetKey: string | null | undefined,
    category: AssetDisplayCategory,
    x: number,
    y: number,
    options?: { kind?: AssetKind | 'block'; alpha?: number; depth?: number; originX?: number; originY?: number }
  ): Phaser.GameObjects.Sprite {
    const sprite = scene.add.sprite(x, y, this.resolveAssetKey(scene, assetKey, category, options?.kind ?? 'sprite'));
    this.setSpriteDisplaySizeByCategory(sprite, category);
    if (typeof options?.alpha === 'number') {
      sprite.setAlpha(options.alpha);
    }
    if (typeof options?.depth === 'number') {
      sprite.setDepth(options.depth);
    }
    if (typeof options?.originX === 'number' || typeof options?.originY === 'number') {
      sprite.setOrigin(options.originX ?? 0.5, options.originY ?? 0.5);
    }
    return sprite;
  }

  createPoseSheetSprite(
    scene: Phaser.Scene,
    assetKey: string | null | undefined,
    category: AssetDisplayCategory,
    poseFrame: number,
    x: number,
    y: number,
    options?: { kind?: AssetKind | 'block'; alpha?: number; depth?: number; originX?: number; originY?: number }
  ): Phaser.GameObjects.Sprite {
    const sprite = this.createSpriteByAssetKey(scene, assetKey, category, x, y, options);
    sprite.setFrame(poseFrame);
    return sprite;
  }

  resolveAssetPath(key: string, category?: string): string | null {
    const direct = this.manifest.get(key);
    if (direct) {
      return direct.path;
    }
    if (category) {
      return `/assets/${category}/${key}.png`;
    }
    return null;
  }

  resolveBoardBlockAssetPath(
    key: string,
    variant: 'base' | 'glow' | 'clear' | 'glowFrame' | 'clearFrame' | 'specialFrame' | 'icon' = 'base'
  ): string {
    if (variant === 'icon') {
      return `/assets/icons/board-blocks/${key}.png`;
    }

    const blockId = this.normalizeFinalBoardBlockId(key.replace(/__(?:base|glow|clear|[a-z0-9_]+)__f\d{2}$/, '').replace(/_(?:glow|clear)(?:_frame_\d{2})?$/, ''));
    if (variant === 'base') {
      return `/assets/sprites/board-blocks/${blockId}/base/${blockId}__base__f00.png`;
    }
    if (variant === 'glowFrame') {
      return `/assets/sprites/board-blocks/${blockId}/glow/${key}.png`;
    }
    if (variant === 'clearFrame') {
      return `/assets/sprites/board-blocks/${blockId}/clear/${key}.png`;
    }
    if (variant === 'specialFrame') {
      return `/assets/sprites/board-blocks/${blockId}/special/${key}.png`;
    }
    return `/assets/sprites/board-blocks/${blockId}/${variant}/${key}.png`;
  }

  normalizeBlockId(rawId: string | null | undefined): string {
    if (!rawId) {
      return 'block_red';
    }
    const aliases: Record<string, string> = {
      red: 'block_red',
      blue: 'block_blue',
      green: 'block_green',
      yellow: 'block_yellow',
      sprinkle: 'block_sprinkle',
      block_red_rune: 'block_red',
      block_blue_rune: 'block_blue',
      block_green_rune: 'block_green',
      block_yellow_rune: 'block_yellow',
      spr_block_red: 'block_red',
      spr_block_blue: 'block_blue',
      spr_block_green: 'block_green',
      spr_block_yellow: 'block_yellow',
      spr_block_sprinkle: 'block_sprinkle',
      spr_block_red_rune: 'block_red',
      spr_block_blue_rune: 'block_blue',
      spr_block_green_rune: 'block_green',
      spr_block_yellow_rune: 'block_yellow'
    };
    return aliases[rawId] ?? rawId.replace(/^spr_/, '');
  }

  ensureFallbackTextures(scene: Phaser.Scene): void {
    this.generateFallback(scene, this.fallbackKey, 64, 64, 0x7f5af0, 0xffca6b);
    this.generateFallback(scene, this.iconFallbackKey, 32, 32, 0x303750, 0x65d6a5);
    this.generateFallback(scene, this.blockFallbackKey, 32, 32, 0x38416a, 0xffca6b);
    this.generateFallback(scene, this.backgroundFallbackKey, 256, 144, 0x171b2d, 0x38416a);
    this.generateFallback(scene, 'missing_hero', 96, 96, 0x27406f, 0xffca6b);
    this.generateFallback(scene, 'missing_monster', 96, 96, 0x4a356a, 0xff6673);
    this.generateFallback(scene, 'missing_boss', 144, 144, 0x4b2436, 0xff6673);
    this.generateFallback(scene, 'missing_portrait', 128, 128, 0x25443b, 0x9adfff);
    this.generateFallback(scene, 'missing_item_icon', 48, 48, 0x303750, 0x65d6a5);
    this.generateFallback(scene, 'missing_spell_icon', 48, 48, 0x303750, 0x65d6a5);
    this.generateFallback(scene, 'missing_relic_icon', 48, 48, 0x303750, 0x65d6a5);
    this.generateFallback(scene, 'missing_upgrade_icon', 48, 48, 0x303750, 0x65d6a5);
    this.generateFallback(scene, 'missing_weapon_icon', 48, 48, 0x303750, 0x65d6a5);
    this.generateFallback(scene, 'missing_status_icon', 32, 32, 0x303750, 0x65d6a5);
    this.generateFallback(scene, 'missing_hazard_icon', 48, 48, 0x303750, 0xffca6b);
    this.generateFallback(scene, 'missing_vfx', 96, 96, 0x2e2e48, 0xffca6b);
    this.generateFallback(scene, 'missing_ui', 64, 64, 0x2e3148, 0x9adfff);
    this.generateFallback(scene, 'missing_map_icon', 48, 48, 0x2e3148, 0x9adfff);
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
    const key = this.getAssetRef(block, 'base') ?? block?.spriteKey ?? this.normalizeBlockId(blockId) ?? 'block_red';
    return this.normalizeBlockId(key).replace(/__(?:base|glow|clear)__f\d{2}$/, '');
  }

  private isPoseSheetKey(key: string): boolean {
    return key.endsWith('__pose_sheet_2x2') || key.endsWith('__extended_sheet_2x2');
  }

  private toMonsterActorId(monsterId: string | null | undefined): string | null {
    if (!monsterId) {
      return null;
    }
    return monsterId.startsWith('mon_boss_') ? monsterId.replace(/^mon_/, '') : monsterId;
  }

  private toBossActorId(bossId: string | null | undefined): string | null {
    if (!bossId) {
      return null;
    }
    if (bossId.startsWith('boss_')) {
      return bossId;
    }
    if (bossId.startsWith('mon_boss_')) {
      return bossId.replace(/^mon_/, '');
    }
    if (bossId.startsWith('mon_')) {
      return bossId.replace(/^mon_/, '');
    }
    return `boss_${bossId}`;
  }

  private getLoadedHeroPoseSheetKey(scene: Phaser.Scene, heroId: string | null | undefined): string | null {
    if (!heroId) {
      return null;
    }
    const hero = contentRegistry.getHero(heroId) as AssetRefContent | null;
    const explicit = this.getAssetRef(hero, 'poseSheet') ?? this.getAssetRef(hero, 'poseSheetKey');
    const preferred = `${heroId}__pose_sheet_2x2`;
    return this.getFirstLoadedTextureKey(scene, [explicit, preferred]);
  }

  private getLoadedHeroExtendedPoseSheetKey(scene: Phaser.Scene, heroId: string | null | undefined): string | null {
    if (!heroId) {
      return null;
    }
    const hero = contentRegistry.getHero(heroId) as AssetRefContent | null;
    const explicit = this.getAssetRef(hero, 'extendedPoseSheet') ?? this.getAssetRef(hero, 'extendedPoseSheetKey');
    const preferred = `${heroId}__extended_sheet_2x2`;
    return this.getFirstLoadedTextureKey(scene, [explicit, preferred]);
  }

  private getLoadedMonsterPoseSheetKey(scene: Phaser.Scene, monsterId: string | null | undefined): string | null {
    const actorId = this.toMonsterActorId(monsterId);
    if (!actorId) {
      return null;
    }
    const monster = contentRegistry.getMonster(monsterId ?? '') as AssetRefContent | null;
    const explicit = this.getAssetRef(monster, 'poseSheet') ?? this.getAssetRef(monster, 'poseSheetKey');
    const preferred = `${actorId}__pose_sheet_2x2`;
    return this.getFirstLoadedTextureKey(scene, [explicit, preferred]);
  }

  private getLoadedBossPoseSheetKey(scene: Phaser.Scene, bossId: string | null | undefined): string | null {
    const actorId = this.toBossActorId(bossId);
    if (!actorId) {
      return null;
    }
    const monsterId = actorId.startsWith('boss_') ? `mon_${actorId}` : actorId;
    const monster = contentRegistry.getMonster(monsterId) as AssetRefContent | null;
    const explicit = this.getAssetRef(monster, 'poseSheet') ?? this.getAssetRef(monster, 'poseSheetKey');
    const preferred = `${actorId}__pose_sheet_2x2`;
    return this.getFirstLoadedTextureKey(scene, [explicit, preferred]);
  }

  private getLoadedBossExtendedPoseSheetKey(scene: Phaser.Scene, bossId: string | null | undefined): string | null {
    const actorId = this.toBossActorId(bossId);
    if (!actorId) {
      return null;
    }
    const monsterId = actorId.startsWith('boss_') ? `mon_${actorId}` : actorId;
    const monster = contentRegistry.getMonster(monsterId) as AssetRefContent | null;
    const explicit = this.getAssetRef(monster, 'extendedPoseSheet') ?? this.getAssetRef(monster, 'extendedPoseSheetKey');
    const preferred = `${actorId}__extended_sheet_2x2`;
    return this.getFirstLoadedTextureKey(scene, [explicit, preferred]);
  }

  private hasBossExtendedPoseSheet(scene: Phaser.Scene, bossId: string | null | undefined): boolean {
    return this.getLoadedBossExtendedPoseSheetKey(scene, bossId) !== null;
  }

  private getFirstLoadedTextureKey(scene: Phaser.Scene, keys: Array<string | null | undefined>): string | null {
    for (const key of keys) {
      if (key && scene.textures.exists(key)) {
        return key;
      }
    }
    return null;
  }

  private categoryForAssetKind(kind: AssetKind): AssetDisplayCategory {
    if (kind === 'icon') {
      return 'uiIcon';
    }
    if (kind === 'background') {
      return 'stageBackground';
    }
    if (kind === 'ui') {
      return 'uiAnimation';
    }
    return 'heroSprite';
  }

  private useFallbackAsset(
    category: AssetDisplayCategory,
    scene: Phaser.Scene,
    kind: AssetKind | 'block'
  ): string {
    const categoryFallback: Partial<Record<AssetDisplayCategory, string>> = {
      heroPoseSheet: 'missing_hero',
      heroExtendedPoseSheet: 'missing_hero',
      heroSprite: 'missing_hero',
      monsterPoseSheet: 'missing_monster',
      eliteMonsterPoseSheet: 'missing_monster',
      monsterSprite: 'missing_monster',
      bossPoseSheet: 'missing_boss',
      bossIntroPoseSheet: 'missing_boss',
      bossSprite: 'missing_boss',
      portrait: 'missing_portrait',
      itemIcon: 'missing_item_icon',
      spellIcon: 'missing_spell_icon',
      relicIcon: 'missing_relic_icon',
      upgradeIcon: 'missing_upgrade_icon',
      weaponIcon: 'missing_weapon_icon',
      statusIcon: 'missing_status_icon',
      oopsieIcon: 'missing_status_icon',
      hazardIcon: 'missing_hazard_icon',
      mapIcon: 'missing_map_icon',
      roomIcon: 'missing_map_icon',
      routeIcon: 'missing_map_icon',
      routeBadgeIcon: 'missing_map_icon',
      rewardThumbnail: 'missing_ui',
      shopThumbnail: 'missing_ui',
      vfx: 'missing_vfx',
      vfxBoardCell: 'missing_vfx',
      vfxCombatSmall: 'missing_vfx',
      vfxCombatLarge: 'missing_vfx',
      uiIcon: 'missing_ui',
      uiAnimation: 'missing_ui',
      stageBackground: this.backgroundFallbackKey
    };
    const fallback = categoryFallback[category];
    if (fallback && scene.textures.exists(fallback)) {
      return fallback;
    }
    return this.fallbackFor(kind);
  }

  getDisplayCategoryForContentType(contentType: string, context: 'compact' | 'card' | 'portrait' = 'compact'): AssetDisplayCategory {
    const compactMap: Record<string, AssetDisplayCategory> = {
      item: 'itemIcon',
      spell: 'spellIcon',
      relic: 'relicIcon',
      upgrade: 'upgradeIcon',
      weapon: 'weaponIcon',
      status: 'statusIcon',
      statusEffect: 'statusIcon',
      oopsie: 'oopsieIcon',
      hazard: 'hazardIcon',
      map: 'mapIcon',
      mapNode: 'mapIcon',
      room: 'roomIcon',
      route: 'routeIcon',
      routeBadge: 'routeBadgeIcon',
      reward: 'rewardThumbnail',
      shop: 'shopThumbnail',
      portrait: 'portrait'
    };
    const base = compactMap[contentType] ?? 'uiIcon';
    if (context === 'card' && (base === 'itemIcon' || base === 'spellIcon' || base === 'relicIcon' || base === 'upgradeIcon' || base === 'weaponIcon')) {
      return 'rewardThumbnail';
    }
    if (context === 'portrait') {
      return 'portrait';
    }
    return base;
  }

  private inferBoardBlockFrameKeys(stem: string, state: 'glow' | 'clear'): string[] {
    const count = state === 'glow' ? BLOCK_ANIM.GLOW_FRAME_COUNT : BLOCK_ANIM.CLEAR_FRAME_COUNT;
    return Array.from({ length: count }, (_, index) => `${stem}__${state}__f${String(index).padStart(2, '0')}`);
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
    if (!key) {
      return [];
    }
    return [key, `${key}__legacy`, this.legacyBoardBlockSpriteKey(key)].filter((value): value is string => Boolean(value));
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

  private normalizeFinalBoardBlockId(key: string): string {
    return this.normalizeBlockId(key);
  }

  private legacyBoardBlockSpriteKey(key: string | null | undefined): string | undefined {
    if (!key) {
      return undefined;
    }
    const aliases: Record<string, string> = {
      block_red: 'spr_block_red_rune',
      block_blue: 'spr_block_blue_rune',
      block_green: 'spr_block_green_rune',
      block_yellow: 'spr_block_yellow_rune'
    };
    const normalized = key.replace(/__(?:base|glow|clear)__f\d{2}$/, '');
    const legacyStem = aliases[normalized] ?? (normalized.startsWith('block_') ? `spr_${normalized}` : undefined);
    if (!legacyStem) {
      return undefined;
    }
    if (key.includes('__glow__')) {
      return `${legacyStem}_glow`;
    }
    if (key.includes('__clear__')) {
      return `${legacyStem}_clear`;
    }
    return legacyStem;
  }

  private legacyBoardBlockIconKey(blockId: string | null | undefined): string | undefined {
    const aliases: Record<string, string> = {
      block_red: 'ico_block_red_rune',
      block_blue: 'ico_block_blue_rune',
      block_green: 'ico_block_green_rune',
      block_yellow: 'ico_block_yellow_rune'
    };
    return blockId ? aliases[blockId] ?? `ico_${blockId}` : undefined;
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




