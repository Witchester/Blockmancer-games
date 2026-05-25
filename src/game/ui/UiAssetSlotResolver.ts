import type Phaser from 'phaser';
import { getAssetEntry, getPlaceholderForType, type AssetKind, type AssetManifestType } from '../data/assets';
import type { UiAssetSize, UiComponentSpec } from '../types/ui-layout';
import { UI_ANCHORS, UI_FIT_MODES, UI_SCALE_MODES } from './UiLayoutValidator';
import { getPlaceholderCandidates } from './UiPlaceholderKeys';

export type UiAssetSlotStatus = 'ready' | 'usingFallback' | 'usingPlaceholder' | 'unresolved' | 'invalidSpec';
export type UiAssetSlotReadiness = 'ready' | 'partial' | 'risky' | 'missing';

export type UiAssetSlotIssue = {
  severity: 'error' | 'warning';
  code: string;
  message: string;
  componentId?: string;
  assetKey?: string;
  field?: string;
};

export type UiAssetSlotResolveOptions = {
  debug?: boolean;
  placeholderKeys?: readonly string[];
  warn?: boolean;
};

export type UiResolvedAssetSlot = {
  componentId: string;
  status: UiAssetSlotStatus;
  readiness: UiAssetSlotReadiness;
  assetKey: string | null;
  fallbackAssetKey: string | null;
  textureKey: string | null;
  usedKey: string | null;
  placeholderKey: string | null;
  canonicalFolder: string | null;
  expectedSourceSize: UiAssetSize | null;
  runtimeRenderSize: UiAssetSize | null;
  anchor: UiComponentSpec['anchor'] | null;
  fitMode: UiComponentSpec['fitMode'] | null;
  scaleMode: UiComponentSpec['scaleMode'] | null;
  issues: UiAssetSlotIssue[];
};

export type UiAssetDropInReadiness = {
  isReady: boolean;
  readiness: UiAssetSlotReadiness;
  errors: string[];
  warnings: string[];
  issues: UiAssetSlotIssue[];
};

function isDevWarningEnabled(options?: UiAssetSlotResolveOptions): boolean {
  return options?.debug === true || options?.warn === true || import.meta.env.DEV;
}

function warnIssue(issue: UiAssetSlotIssue, options?: UiAssetSlotResolveOptions): void {
  if (!isDevWarningEnabled(options) || issue.severity !== 'warning') {
    return;
  }
  console.warn(`[ui-assets] ${issue.componentId ?? 'component'}: ${issue.message}`);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isPositiveIntegerSize(value: unknown): value is UiAssetSize {
  return Boolean(
    value &&
      typeof value === 'object' &&
      Number.isInteger((value as UiAssetSize).w) &&
      Number.isInteger((value as UiAssetSize).h) &&
      (value as UiAssetSize).w > 0 &&
      (value as UiAssetSize).h > 0
  );
}

function sameSize(left: UiAssetSize | null | undefined, right: UiAssetSize): boolean {
  return Boolean(left && left.w === right.w && left.h === right.h);
}

function sizeLabel(size: UiAssetSize): string {
  return `${size.w}x${size.h}`;
}

function fallbackTypeForComponent(component: UiComponentSpec): AssetManifestType {
  if (isBackgroundSlot(component)) return 'stage_background';
  if (component.type === 'button' || component.type === 'panel' || component.type === 'meter' || component.type === 'chip' || component.type === 'card') return 'ui';
  if (isIconSlot(component)) return 'icon';
  if (component.type === 'portraitSlot') return 'portrait';
  if (isVfxSlot(component)) return 'effect';
  if (isBoardBlockSlot(component)) return 'board_block';
  return 'sprite';
}

function sceneAssetSystem(scene: Phaser.Scene | null | undefined): { ensureFallbackTextures?: (scene: Phaser.Scene) => void; hasAssetKey?: (key: string) => boolean } | null {
  return (scene?.game as unknown as { assetSystem?: { ensureFallbackTextures?: (scene: Phaser.Scene) => void; hasAssetKey?: (key: string) => boolean } }).assetSystem ?? null;
}

function getStructuralIssues(component: UiComponentSpec): UiAssetSlotIssue[] {
  const issues: UiAssetSlotIssue[] = [];
  const componentId = component.id;

  if (!isNonEmptyString(component.assetKey)) issues.push({ severity: 'error', code: 'asset_key_missing', message: 'assetKey must be a non-empty key, not a raw path.', componentId, field: 'assetKey' });
  if (!isNonEmptyString(component.fallbackAssetKey)) issues.push({ severity: 'error', code: 'fallback_key_missing', message: 'fallbackAssetKey must be non-empty.', componentId, field: 'fallbackAssetKey' });
  if (!isNonEmptyString(component.canonicalFolder)) issues.push({ severity: 'error', code: 'canonical_folder_missing', message: 'canonicalFolder must be documented.', componentId, field: 'canonicalFolder' });
  if (isNonEmptyString(component.assetKey) && isRawAssetPath(component.assetKey)) issues.push({ severity: 'error', code: 'asset_key_raw_path', message: 'assetKey must use a runtime key, not a public/assets path.', componentId, field: 'assetKey', assetKey: component.assetKey });
  if (isNonEmptyString(component.fallbackAssetKey) && isRawAssetPath(component.fallbackAssetKey)) issues.push({ severity: 'error', code: 'fallback_key_raw_path', message: 'fallbackAssetKey must use a runtime key, not a public/assets path.', componentId, field: 'fallbackAssetKey', assetKey: component.fallbackAssetKey });
  if (!isPositiveIntegerSize(component.expectedSourceSize)) issues.push({ severity: 'error', code: 'expected_source_size_invalid', message: 'expectedSourceSize must have positive integer w/h.', componentId, field: 'expectedSourceSize' });
  if (!isPositiveIntegerSize(component.runtimeRenderSize)) issues.push({ severity: 'error', code: 'runtime_render_size_invalid', message: 'runtimeRenderSize must have positive integer w/h.', componentId, field: 'runtimeRenderSize' });
  if (!UI_ANCHORS.includes(component.anchor)) issues.push({ severity: 'error', code: 'anchor_invalid', message: `Unsupported anchor ${String(component.anchor)}.`, componentId, field: 'anchor' });
  if (!UI_FIT_MODES.includes(component.fitMode)) issues.push({ severity: 'error', code: 'fit_mode_invalid', message: `Unsupported fitMode ${String(component.fitMode)}.`, componentId, field: 'fitMode' });
  if (!UI_SCALE_MODES.includes(component.scaleMode)) issues.push({ severity: 'error', code: 'scale_mode_invalid', message: `Unsupported scaleMode ${String(component.scaleMode)}.`, componentId, field: 'scaleMode' });
  if (typeof component.dynamicTextAllowed !== 'boolean') issues.push({ severity: 'error', code: 'dynamic_text_flag_invalid', message: 'dynamicTextAllowed must be boolean.', componentId, field: 'dynamicTextAllowed' });

  return issues;
}

export function hasTexture(scene: Phaser.Scene | null | undefined, textureKey: string | null | undefined): boolean {
  return Boolean(scene && textureKey && scene.textures.exists(textureKey));
}

export function resolveTextureKey(
  scene: Phaser.Scene | null | undefined,
  assetKey: string | null | undefined,
  fallbackAssetKey?: string | null,
  options: UiAssetSlotResolveOptions = {}
): Pick<UiResolvedAssetSlot, 'status' | 'readiness' | 'textureKey' | 'usedKey' | 'placeholderKey' | 'issues'> {
  const issues: UiAssetSlotIssue[] = [];
  const textureCandidates = [assetKey, fallbackAssetKey].filter(isNonEmptyString);

  sceneAssetSystem(scene)?.ensureFallbackTextures?.(scene as Phaser.Scene);

  if (hasTexture(scene, assetKey)) {
    return { status: 'ready', readiness: 'ready', textureKey: assetKey ?? null, usedKey: assetKey ?? null, placeholderKey: null, issues };
  }
  if (hasTexture(scene, fallbackAssetKey)) {
    issues.push({ severity: 'warning', code: 'using_fallback_asset', message: `Primary asset ${assetKey ?? 'none'} is missing; using fallback ${fallbackAssetKey}.`, assetKey: assetKey ?? undefined });
    issues.forEach((issue) => warnIssue(issue, options));
    return { status: 'usingFallback', readiness: 'partial', textureKey: fallbackAssetKey ?? null, usedKey: fallbackAssetKey ?? null, placeholderKey: null, issues };
  }

  const placeholderCandidates = options.placeholderKeys ?? ['asset_missing', 'asset_missing_icon', 'asset_missing_background'];
  const placeholderKey = placeholderCandidates.find((key) => hasTexture(scene, key)) ?? null;
  if (placeholderKey) {
    issues.push({
      severity: 'warning',
      code: 'using_placeholder_asset',
      message: `Asset candidates were not loaded (${textureCandidates.join(', ') || 'none'}); using safe placeholder ${placeholderKey}.`,
      assetKey: assetKey ?? undefined
    });
    issues.forEach((issue) => warnIssue(issue, options));
    return { status: 'usingPlaceholder', readiness: 'risky', textureKey: placeholderKey, usedKey: placeholderKey, placeholderKey, issues };
  }

  issues.push({
    severity: 'warning',
    code: 'asset_unresolved',
    message: `No loaded texture found for ${textureCandidates.join(', ') || 'empty asset slot'} and no safe placeholder texture is loaded.`,
    assetKey: assetKey ?? undefined
  });
  issues.forEach((issue) => warnIssue(issue, options));
  return { status: 'unresolved', readiness: 'missing', textureKey: null, usedKey: null, placeholderKey: null, issues };
}

export function getSafePlaceholderKey(scene: Phaser.Scene | null | undefined, component: UiComponentSpec, options: UiAssetSlotResolveOptions = {}): string | null {
  sceneAssetSystem(scene)?.ensureFallbackTextures?.(scene as Phaser.Scene);
  const candidates = [
    ...(options.placeholderKeys ?? []),
    ...getPlaceholderCandidates(component),
    getPlaceholderForType(fallbackTypeForComponent(component)),
    'asset_missing'
  ];
  return candidates.find((key) => hasTexture(scene, key)) ?? null;
}

export function resolveAssetSlot(scene: Phaser.Scene | null | undefined, component: UiComponentSpec, options: UiAssetSlotResolveOptions = {}): UiResolvedAssetSlot {
  const issues = getStructuralIssues(component);
  const hasStructuralError = issues.some((issue) => issue.severity === 'error');
  const placeholderKeys = [...getPlaceholderCandidates(component), getPlaceholderForType(fallbackTypeForComponent(component)), 'asset_missing'];

  if (hasStructuralError) {
    return {
      componentId: component.id,
      status: 'invalidSpec',
      readiness: 'missing',
      assetKey: component.assetKey ?? null,
      fallbackAssetKey: component.fallbackAssetKey ?? null,
      textureKey: getSafePlaceholderKey(scene, component, { ...options, placeholderKeys }),
      usedKey: null,
      placeholderKey: getSafePlaceholderKey(scene, component, { ...options, placeholderKeys }),
      canonicalFolder: component.canonicalFolder ?? null,
      expectedSourceSize: isPositiveIntegerSize(component.expectedSourceSize) ? component.expectedSourceSize : null,
      runtimeRenderSize: isPositiveIntegerSize(component.runtimeRenderSize) ? component.runtimeRenderSize : null,
      anchor: UI_ANCHORS.includes(component.anchor) ? component.anchor : null,
      fitMode: UI_FIT_MODES.includes(component.fitMode) ? component.fitMode : null,
      scaleMode: UI_SCALE_MODES.includes(component.scaleMode) ? component.scaleMode : null,
      issues
    };
  }

  const resolved = resolveTextureKey(scene, component.assetKey, component.fallbackAssetKey, { ...options, placeholderKeys });
  return {
    componentId: component.id,
    status: resolved.status,
    readiness: resolved.readiness,
    assetKey: getAssetKey(component),
    fallbackAssetKey: getFallbackAssetKey(component),
    textureKey: resolved.textureKey,
    usedKey: resolved.usedKey,
    placeholderKey: resolved.placeholderKey,
    canonicalFolder: getCanonicalFolder(component),
    expectedSourceSize: getExpectedSourceSize(component),
    runtimeRenderSize: getRuntimeRenderSize(component),
    anchor: getAnchor(component),
    fitMode: getFitMode(component),
    scaleMode: getScaleMode(component),
    issues: [...issues, ...resolved.issues]
  };
}

export function getAssetKey(component: UiComponentSpec): string {
  return component.assetKey;
}

export function getFallbackAssetKey(component: UiComponentSpec): string {
  return component.fallbackAssetKey;
}

export function getExpectedSourceSize(component: UiComponentSpec): UiComponentSpec['expectedSourceSize'] {
  return component.expectedSourceSize;
}

export function getRuntimeRenderSize(component: UiComponentSpec): UiComponentSpec['runtimeRenderSize'] {
  return component.runtimeRenderSize;
}

export function getCanonicalFolder(component: UiComponentSpec): string {
  return component.canonicalFolder;
}

export function getAnchor(component: UiComponentSpec): UiComponentSpec['anchor'] {
  return component.anchor;
}

export function getFitMode(component: UiComponentSpec): UiComponentSpec['fitMode'] {
  return component.fitMode;
}

export function getScaleMode(component: UiComponentSpec): UiComponentSpec['scaleMode'] {
  return component.scaleMode;
}

export function isBackgroundSlot(component: UiComponentSpec): boolean {
  return component.type === 'backgroundLayer' || component.scaleMode === 'backgroundExact' || component.canonicalFolder.includes('/stages/') || component.canonicalFolder.includes('/story/endings/');
}

export function isBoardBlockSlot(component: UiComponentSpec): boolean {
  return component.id.includes('board_block') || component.canonicalFolder.includes('/board-blocks/') || component.expectedSourceSize.w === 24;
}

export function isIconSlot(component: UiComponentSpec): boolean {
  return component.type === 'iconSlot' || component.canonicalFolder.includes('/icons/');
}

export function isSpriteSlot(component: UiComponentSpec): boolean {
  return component.type === 'spriteSlot' || component.canonicalFolder.includes('/sprites/');
}

export function isVfxSlot(component: UiComponentSpec): boolean {
  return component.type === 'vfxSlot' || component.canonicalFolder.includes('/effects/');
}

export function inferAssetKind(component: UiComponentSpec): AssetKind | 'block' {
  if (isBackgroundSlot(component)) return 'background';
  if (isIconSlot(component)) return 'icon';
  if (component.type === 'button' || component.type === 'panel' || component.type === 'meter' || component.type === 'chip' || component.type === 'card') return 'ui';
  if (isBoardBlockSlot(component)) return 'block';
  return 'sprite';
}

export function getPlaceholderFallbackKey(component: UiComponentSpec): string {
  return getPlaceholderForType(fallbackTypeForComponent(component));
}

export function resolveFallbackSafeAssetKey(
  component: UiComponentSpec,
  hasAssetKey: (assetKey: string) => boolean = (assetKey) => Boolean(getAssetEntry(assetKey))
): string {
  if (hasAssetKey(component.assetKey)) return component.assetKey;
  if (hasAssetKey(component.fallbackAssetKey)) return component.fallbackAssetKey;
  return getPlaceholderFallbackKey(component);
}

export function isRawAssetPath(assetKey: string): boolean {
  return assetKey.includes('/assets/') || assetKey.startsWith('public/') || assetKey.endsWith('.png') || assetKey.endsWith('.jpg') || assetKey.endsWith('.webp');
}

export function expectedSourceSizeForComponent(component: UiComponentSpec): UiAssetSize | null {
  const folder = component.canonicalFolder.toLowerCase();
  const key = component.assetKey.toLowerCase();
  const id = component.id.toLowerCase();

  if (key.endsWith('__pose_sheet_2x2') || key.endsWith('__extended_sheet_2x2')) return { w: 1254, h: 1254 };
  if (folder.includes('/battle/') || id.includes('battle_background')) return { w: 1080, h: 480 };
  if (folder.includes('/puzzle/') || id.includes('puzzle_background')) return { w: 1080, h: 1056 };
  if (folder.includes('/mobile-controls/') || id.includes('controls_background')) return { w: 1080, h: 384 };
  if (folder.includes('/map/') || folder.includes('/route-scenes/') || folder.includes('/global-scenes/') || folder.includes('/story/endings/') || id.includes('background')) return { w: 1080, h: 1920 };
  if (isBoardBlockSlot(component)) return component.type === 'iconSlot' || folder.includes('/icons/board-blocks/') ? { w: 48, h: 48 } : { w: 24, h: 24 };
  if (folder.includes('/icons/map-nodes/') || folder.includes('/icons/map/')) return { w: 48, h: 48 };
  if (isIconSlot(component) || isSpriteSlot(component) || isVfxSlot(component) || component.type === 'portraitSlot') return { w: 627, h: 627 };

  return null;
}

export function collectAssetSlotIssues(component: UiComponentSpec): UiAssetSlotIssue[] {
  const issues = getStructuralIssues(component);
  const expectedSize = expectedSourceSizeForComponent(component);

  if (expectedSize && isPositiveIntegerSize(component.expectedSourceSize) && !sameSize(component.expectedSourceSize, expectedSize)) {
    issues.push({
      severity: 'warning',
      code: 'expected_source_size_mismatch',
      message: `Expected source size ${sizeLabel(component.expectedSourceSize)} does not match inferred category size ${sizeLabel(expectedSize)}.`,
      componentId: component.id,
      field: 'expectedSourceSize'
    });
  }
  if (component.fitMode === 'cover' || component.scaleMode === 'textDynamic' || component.pixelPerfect?.allowFractionalScale) {
    issues.push({
      severity: 'warning',
      code: 'risky_fit_or_scale_mode',
      message: 'Fit/scale mode needs visual QA to preserve crisp pixel-art rendering.',
      componentId: component.id,
      field: component.fitMode === 'cover' ? 'fitMode' : 'scaleMode'
    });
  }
  if (component.dynamicTextAllowed === false && /label|text|counter|value|count|xp|hp|mp|score|level/.test(component.id)) {
    issues.push({
      severity: 'warning',
      code: 'dynamic_text_concern',
      message: 'Component id suggests dynamic text; verify values are rendered by game text, not PNG art.',
      componentId: component.id,
      field: 'dynamicTextAllowed'
    });
  }

  return issues;
}

export function validateAssetDropInReadiness(component: UiComponentSpec): UiAssetDropInReadiness {
  const issues = collectAssetSlotIssues(component);
  const errors = issues.filter((issue) => issue.severity === 'error').map((issue) => issue.message);
  const warnings = issues.filter((issue) => issue.severity === 'warning').map((issue) => issue.message);
  const readiness: UiAssetSlotReadiness = errors.length > 0 ? 'missing' : warnings.length > 0 ? 'partial' : 'ready';

  return {
    isReady: errors.length === 0,
    readiness,
    errors,
    warnings,
    issues
  };
}

export function toAssetSlotDebugSummary(component: UiComponentSpec): string {
  const readiness = validateAssetDropInReadiness(component);
  return [
    `${component.id}`,
    `asset=${component.assetKey}`,
    `fallback=${component.fallbackAssetKey}`,
    `folder=${component.canonicalFolder}`,
    `source=${component.expectedSourceSize.w}x${component.expectedSourceSize.h}`,
    `render=${component.runtimeRenderSize.w}x${component.runtimeRenderSize.h}`,
    `anchor=${component.anchor}`,
    `fit=${component.fitMode}`,
    `scale=${component.scaleMode}`,
    `readiness=${readiness.readiness}`,
    `z=${component.zIndex}`
  ].join(' | ');
}
