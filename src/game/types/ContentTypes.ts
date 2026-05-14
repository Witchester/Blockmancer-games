export type ContentCategory =
  | 'monster'
  | 'hero'
  | 'weapon'
  | 'spell'
  | 'relic'
  | 'upgrade'
  | 'statusEffect'
  | 'roomEvent'
  | 'lootTable'
  | 'difficultyScaling'
  | 'boardBlock'
  | 'curse'
  | 'mapNode'
  | 'item'
  | 'stage'
  | 'currency'
  | 'collectible'
  | 'npc';

export interface ContentReference<TId extends string = string> {
  id: TId;
  contentType: ContentCategory;
}

export interface ContentMetadataDescriptor {
  contentType: ContentCategory;
  version: string;
  idPrefix: string;
  displayName: string;
  description: string;
  idFormat: string;
  exampleIds: string[];
  requiredFields: string[];
  fields: Record<string, unknown>;
  dataList: Record<string, unknown>;
  commonDataList?: Record<string, unknown>;
  defaults: Record<string, unknown>;
}

export interface ContentCollection<TEntry = unknown> {
  contentType: ContentCategory;
  entries: TEntry[];
}
