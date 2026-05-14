export type AssetKind = 'sprite' | 'icon' | 'audio' | 'background' | 'ui';

export type AssetManifestEntry = {
  key: string;
  path: string;
  kind: AssetKind;
};

export class AssetSystem {
  private readonly fallbackKey = 'asset_missing';
  private readonly manifest = new Map<string, AssetManifestEntry>([
    [this.fallbackKey, { key: this.fallbackKey, path: 'generated/fallback.png', kind: 'sprite' }]
  ]);

  register(entry: AssetManifestEntry): void {
    this.manifest.set(entry.key, entry);
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
}
