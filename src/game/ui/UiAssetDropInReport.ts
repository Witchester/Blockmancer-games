import type Phaser from 'phaser';
import type { UiComponentSpec, UiLayoutSpec } from '../types/ui-layout';
import { collectAssetSlotIssues, resolveAssetSlot, type UiAssetSlotIssue, type UiAssetSlotReadiness, type UiAssetSlotStatus } from './UiAssetSlotResolver';

export type UiAssetDropInComponentReport = {
  componentId: string;
  type: string;
  assetKey: string;
  fallbackAssetKey: string;
  canonicalFolder: string;
  status: UiAssetSlotStatus;
  readiness: UiAssetSlotReadiness;
  textureKey: string | null;
  issues: UiAssetSlotIssue[];
};

export type UiAssetDropInReport = {
  screenId: string;
  totalVisualComponents: number;
  readyCount: number;
  fallbackCount: number;
  placeholderCount: number;
  unresolvedCount: number;
  invalidSpecCount: number;
  wrongExpectedSourceSize: string[];
  missingCanonicalFolder: string[];
  missingFallbackAssetKey: string[];
  riskyFitOrScaleMode: string[];
  dynamicTextConcerns: string[];
  recommendedFixes: string[];
  components: UiAssetDropInComponentReport[];
};

const VISUAL_COMPONENT_TYPES = new Set([
  'backgroundLayer',
  'panel',
  'button',
  'iconSlot',
  'portraitSlot',
  'spriteSlot',
  'vfxSlot',
  'meter',
  'chip',
  'badge',
  'card',
  'modal',
  'modalBackdrop',
  'boardGrid'
]);

function isVisualComponent(component: UiComponentSpec): boolean {
  return VISUAL_COMPONENT_TYPES.has(component.type) || Boolean(component.assetKey);
}

function unique(values: string[]): string[] {
  return [...new Set(values)].sort();
}

function recommendedFixesFor(components: UiAssetDropInComponentReport[]): string[] {
  const fixes = new Set<string>();
  if (components.some((component) => component.issues.some((issue) => issue.code === 'asset_key_raw_path' || issue.code === 'fallback_key_raw_path'))) {
    fixes.add('Replace raw public/assets paths with stable runtime asset keys.');
  }
  if (components.some((component) => component.issues.some((issue) => issue.code === 'fallback_key_missing'))) {
    fixes.add('Add fallbackAssetKey to every visual component.');
  }
  if (components.some((component) => component.issues.some((issue) => issue.code === 'canonical_folder_missing'))) {
    fixes.add('Document canonicalFolder for each asset slot before final art import.');
  }
  if (components.some((component) => component.issues.some((issue) => issue.code === 'expected_source_size_mismatch'))) {
    fixes.add('Align expectedSourceSize with the UI pixel-perfect asset contract.');
  }
  if (components.some((component) => component.status === 'usingPlaceholder' || component.status === 'unresolved')) {
    fixes.add('Register or generate fallback placeholder textures for missing fallback keys.');
  }
  if (components.some((component) => component.issues.some((issue) => issue.code === 'dynamic_text_concern'))) {
    fixes.add('Verify labels, counters, values, and localized text are rendered as game text.');
  }
  return [...fixes];
}

export function createAssetDropInReport(scene: Phaser.Scene | null | undefined, layoutSpec: UiLayoutSpec): UiAssetDropInReport {
  return createAssetDropInReportFromComponents(scene, layoutSpec.components, layoutSpec.screenId);
}

export function createAssetDropInReportFromComponents(
  scene: Phaser.Scene | null | undefined,
  components: UiComponentSpec[],
  screenId = 'components'
): UiAssetDropInReport {
  const componentReports = components.filter(isVisualComponent).map((component) => {
    const resolved = resolveAssetSlot(scene, component);
    return {
      componentId: component.id,
      type: component.type,
      assetKey: component.assetKey,
      fallbackAssetKey: component.fallbackAssetKey,
      canonicalFolder: component.canonicalFolder,
      status: resolved.status,
      readiness: resolved.readiness,
      textureKey: resolved.textureKey,
      issues: [...collectAssetSlotIssues(component), ...resolved.issues]
    };
  });

  return {
    screenId,
    totalVisualComponents: componentReports.length,
    readyCount: componentReports.filter((component) => component.status === 'ready').length,
    fallbackCount: componentReports.filter((component) => component.status === 'usingFallback').length,
    placeholderCount: componentReports.filter((component) => component.status === 'usingPlaceholder').length,
    unresolvedCount: componentReports.filter((component) => component.status === 'unresolved').length,
    invalidSpecCount: componentReports.filter((component) => component.status === 'invalidSpec').length,
    wrongExpectedSourceSize: unique(componentReports.filter((component) => component.issues.some((issue) => issue.code === 'expected_source_size_mismatch')).map((component) => component.componentId)),
    missingCanonicalFolder: unique(componentReports.filter((component) => component.issues.some((issue) => issue.code === 'canonical_folder_missing')).map((component) => component.componentId)),
    missingFallbackAssetKey: unique(componentReports.filter((component) => component.issues.some((issue) => issue.code === 'fallback_key_missing')).map((component) => component.componentId)),
    riskyFitOrScaleMode: unique(componentReports.filter((component) => component.issues.some((issue) => issue.code === 'risky_fit_or_scale_mode')).map((component) => component.componentId)),
    dynamicTextConcerns: unique(componentReports.filter((component) => component.issues.some((issue) => issue.code === 'dynamic_text_concern')).map((component) => component.componentId)),
    recommendedFixes: recommendedFixesFor(componentReports),
    components: componentReports
  };
}

export function summarizeAssetReadiness(report: UiAssetDropInReport): UiAssetSlotReadiness {
  if (report.invalidSpecCount > 0 || report.unresolvedCount > 0) return 'missing';
  if (report.placeholderCount > 0 || report.wrongExpectedSourceSize.length > 0 || report.missingFallbackAssetKey.length > 0) return 'risky';
  if (report.fallbackCount > 0 || report.riskyFitOrScaleMode.length > 0 || report.dynamicTextConcerns.length > 0) return 'partial';
  return 'ready';
}

export function formatAssetDropInReport(report: UiAssetDropInReport): string {
  return [
    `UI asset drop-in report: ${report.screenId}`,
    `readiness: ${summarizeAssetReadiness(report)}`,
    `components: ${report.totalVisualComponents}`,
    `ready/fallback/placeholder/unresolved/invalid: ${report.readyCount}/${report.fallbackCount}/${report.placeholderCount}/${report.unresolvedCount}/${report.invalidSpecCount}`,
    report.wrongExpectedSourceSize.length ? `wrongExpectedSourceSize: ${report.wrongExpectedSourceSize.join(', ')}` : 'wrongExpectedSourceSize: none',
    report.missingCanonicalFolder.length ? `missingCanonicalFolder: ${report.missingCanonicalFolder.join(', ')}` : 'missingCanonicalFolder: none',
    report.missingFallbackAssetKey.length ? `missingFallbackAssetKey: ${report.missingFallbackAssetKey.join(', ')}` : 'missingFallbackAssetKey: none',
    report.riskyFitOrScaleMode.length ? `riskyFitOrScaleMode: ${report.riskyFitOrScaleMode.join(', ')}` : 'riskyFitOrScaleMode: none',
    report.dynamicTextConcerns.length ? `dynamicTextConcerns: ${report.dynamicTextConcerns.join(', ')}` : 'dynamicTextConcerns: none',
    report.recommendedFixes.length ? `recommendedFixes:\n- ${report.recommendedFixes.join('\n- ')}` : 'recommendedFixes: none'
  ].join('\n');
}
