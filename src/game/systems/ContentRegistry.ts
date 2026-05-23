import type { ContentCategory, ContentMetadataDescriptor } from '../types/ContentTypes';

type RegistryEntry = {
  id: string;
  enabled?: boolean;
  [key: string]: unknown;
};

type RegistryCollection = {
  metadata: ContentMetadataDescriptor;
  entries: RegistryEntry[];
  fallbackId: string | null;
};

type ContentFolderConfig = {
  category: ContentCategory;
  folder: string;
  fallbackId?: string;
};

const CONTENT_FOLDERS: ContentFolderConfig[] = [
  { category: 'monster', folder: 'monsters', fallbackId: 'mon_cupcake_slime' },
  { category: 'hero', folder: 'heroes', fallbackId: 'hero_milo_blockmancer' },
  { category: 'weapon', folder: 'weapons', fallbackId: 'wpn_basic_wand' },
  { category: 'spell', folder: 'spells', fallbackId: 'spl_fireball' },
  { category: 'relic', folder: 'relics', fallbackId: 'rel_goblin_coin' },
  { category: 'upgrade', folder: 'upgrades', fallbackId: 'upg_line_sharp_edges' },
  { category: 'statusEffect', folder: 'status-effects', fallbackId: 'status_burn' },
  { category: 'roomEvent', folder: 'room-events', fallbackId: 'evt_shrine_of_gravity' },
  { category: 'lootTable', folder: 'loot-tables', fallbackId: 'loot_battle_default' },
  { category: 'difficultyScaling', folder: 'difficulty-scaling', fallbackId: 'scale_default_run' },
  { category: 'boardBlock', folder: 'board-blocks', fallbackId: 'block_red' },
  { category: 'oopsie', folder: 'oopsies', fallbackId: 'oops_heavy_blocks' },
  { category: 'mapNode', folder: 'map-nodes', fallbackId: 'node_fight' },
  { category: 'item', folder: 'items', fallbackId: 'item_mana_lemonade' },
  { category: 'stage', folder: 'stages', fallbackId: 'stage_sprinkle_sewers' },
  { category: 'currency', folder: 'currencies', fallbackId: 'currency_candy_coin' },
  { category: 'collectible', folder: 'collectibles', fallbackId: 'collectible_festival_token' },
  { category: 'npc', folder: 'npcs', fallbackId: 'npc_festival_guide' },
  { category: 'randomGameplayEvent', folder: 'random-gameplay-events', fallbackId: 'r_evt_sprinkle_rain' },
  { category: 'stageGoal', folder: 'stage-goals', fallbackId: 'goal_stage1_lost_cupcakes' },
  { category: 'chaosRule', folder: 'chaos-rules', fallbackId: 'chaos_sprinkle_storm' },
  { category: 'battleObjective', folder: 'battle-objectives', fallbackId: 'obj_trigger_cascade' },
  { category: 'bossRule', folder: 'boss-rules', fallbackId: 'boss_rule_cupcake_slime_king' },
  { category: 'hubBuilding', folder: 'hub-buildings', fallbackId: 'hub_cake_stall' },
  { category: 'friendship', folder: 'friendship', fallbackId: 'friend_cupcake_slime' },
  { category: 'biomeMonsterPool', folder: 'difficulty-scaling', fallbackId: 'pool_sprinkle_sewers' },
  { category: 'encounterPackScaling', folder: 'difficulty-scaling', fallbackId: 'scale_encounter_stage1_normal' },
  { category: 'enemyEntryEffect', folder: 'difficulty-scaling', fallbackId: 'entry_none_safe' }
];

const jsonModules = (import.meta as unknown as {
  glob: (pattern: string, options: { eager: boolean; import: string }) => Record<string, unknown>;
}).glob('../content/**/*.json', { eager: true, import: 'default' });

function normalizePath(path: string): string {
  return path.replace(/\\/g, '/');
}

function createCollection(config: ContentFolderConfig): RegistryCollection {
  const folderPrefix = `../content/${config.folder}/`;
  const metadata = jsonModules[`${folderPrefix}metadata.json`] as ContentMetadataDescriptor | undefined;
  const entries = Object.entries(jsonModules)
    .filter(([path]) => normalizePath(path).startsWith(folderPrefix) && !path.endsWith('/metadata.json'))
    .flatMap(([, entry]) => (Array.isArray(entry) ? entry : [entry]) as RegistryEntry[])
    .filter((entry) => typeof entry.id === 'string')
    .sort((left, right) => left.id.localeCompare(right.id));

  return {
    metadata: metadata ?? {
      contentType: config.category,
      version: '1.0.0',
      idPrefix: '',
      displayName: config.category,
      description: 'Missing content metadata.',
      idFormat: '',
      exampleIds: [],
      requiredFields: ['id'],
      fields: {},
      dataList: {},
      defaults: {}
    },
    entries,
    fallbackId: config.fallbackId ?? entries[0]?.id ?? null
  };
}

export class ContentRegistry {
  private readonly collections: Record<ContentCategory, RegistryCollection>;
  private readonly warnedMissingMonsterLookups = new Set<string>();

  constructor() {
    this.collections = CONTENT_FOLDERS.reduce((collections, config) => {
      collections[config.category] = createCollection(config);
      return collections;
    }, {} as Record<ContentCategory, RegistryCollection>);
  }

  getMetadata(contentType: ContentCategory): ContentMetadataDescriptor {
    return this.collections[contentType].metadata;
  }

  list<TEntry extends RegistryEntry = RegistryEntry>(contentType: ContentCategory): TEntry[] {
    return this.collections[contentType].entries as TEntry[];
  }

  listEnabled<TEntry extends RegistryEntry = RegistryEntry>(contentType: ContentCategory): TEntry[] {
    return this.list<TEntry>(contentType).filter((entry) => entry.enabled !== false);
  }

  getOptionalById<TEntry extends RegistryEntry = RegistryEntry>(
    contentType: ContentCategory,
    id: string
  ): TEntry | null {
    const lookupId = this.resolveLookupId(contentType, id);
    return (this.collections[contentType].entries.find((entry) => entry.id === lookupId) as TEntry | undefined) ?? null;
  }

  getById<TEntry extends RegistryEntry = RegistryEntry>(contentType: ContentCategory, id: string): TEntry | null {
    const exact = this.getOptionalById<TEntry>(contentType, id);
    if (exact && exact.enabled !== false) {
      return exact;
    }

    const fallbackId = this.collections[contentType].fallbackId;
    if (!fallbackId) {
      return null;
    }

    const fallback = this.getOptionalById<TEntry>(contentType, fallbackId);
    return fallback && fallback.enabled !== false ? fallback : null;
  }

  has(contentType: ContentCategory, id: string): boolean {
    return this.getOptionalById(contentType, id) !== null;
  }

  getMonster(id: string) {
    return this.getById('monster', id);
  }

  getHero(id: string) {
    return this.getById('hero', id);
  }

  getWeapon(id: string) {
    return this.getById('weapon', id);
  }

  getSpell(id: string) {
    return this.getById('spell', id);
  }

  getRelic(id: string) {
    return this.getById('relic', id);
  }

  getUpgrade(id: string) {
    return this.getById('upgrade', id);
  }

  getStatusEffect(id: string) {
    return this.getById('statusEffect', id);
  }

  getRoomEvent(id: string) {
    return this.getById('roomEvent', id);
  }

  getLootTable(id: string) {
    return this.getById('lootTable', id);
  }

  getDifficultyScaling(id: string) {
    return this.getById('difficultyScaling', id);
  }

  getBoardBlock(id: string) {
    return this.getById('boardBlock', id);
  }

  getItem(id: string) {
    return this.getById('item', id);
  }

  getStage(id: string) {
    return this.getById('stage', id);
  }

  getCurrency(id: string) {
    return this.getById('currency', id);
  }

  getCollectible(id: string) {
    return this.getById('collectible', id);
  }

  getNpc(id: string) {
    return this.getById('npc', id);
  }

  getOopsie(id: string) {
    return this.getById('oopsie', id);
  }

  getMapNode(id: string) {
    return this.getById('mapNode', id);
  }

  getRandomGameplayEvent(id: string) {
    return this.getById('randomGameplayEvent', id);
  }

  getStageGoal(id: string) {
    return this.getById('stageGoal', id);
  }

  getChaosRule(id: string) {
    return this.getById('chaosRule', id);
  }

  getBattleObjective(id: string) {
    return this.getById('battleObjective', id);
  }

  getBossRule(id: string) {
    return this.getById('bossRule', id);
  }

  getHubBuilding(id: string) {
    return this.getById('hubBuilding', id);
  }

  getFriendship(id: string) {
    return this.getById('friendship', id);
  }

  getBiomeMonsterPool(id: string) {
    return this.getById('biomeMonsterPool', id);
  }

  getEncounterPackScalingRule(id: string) {
    return this.getById('encounterPackScaling', id);
  }

  getEnemyEntryEffect(id: string) {
    return this.getById('enemyEntryEffect', id);
  }

  /**
   * Get all biome monster pools (for EncounterPackSystem)
   */
  getBiomeMonsterPools() {
    return this.listEnabled('biomeMonsterPool');
  }

  /**
   * Get all encounter pack scaling rules (for EncounterPackSystem)
   */
  getEncounterPackScalingRules() {
    return this.listEnabled('encounterPackScaling');
  }

  /**
   * Get all enemy entry effects (for EncounterPackSystem)
   */
  getEnemyEntryEffects() {
    return this.list('enemyEntryEffect');
  }

  private resolveLookupId(contentType: ContentCategory, id: string): string {
    if (contentType !== 'monster') {
      return id;
    }

    const aliasMap = this.collections.monster.metadata.compatibilityAliases ?? {};
    const resolvedId = aliasMap[id];
    if (resolvedId) {
      return resolvedId;
    }

    const hasExactMatch = this.collections.monster.entries.some((entry) => entry.id === id);
    if (!hasExactMatch && !this.warnedMissingMonsterLookups.has(id) && import.meta.env.DEV) {
      this.warnedMissingMonsterLookups.add(id);
      console.warn(`[ContentRegistry] Unknown monster lookup "${id}". Falling back to the monster category fallback entry.`);
    }

    return id;
  }
}

export const contentRegistry = new ContentRegistry();
