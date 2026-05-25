import type { UiLayoutSpec } from '../types/ui-layout';
import { validateAssetDropInReadiness } from './UiAssetSlotResolver';
import { validateUiLayoutSpec } from './UiLayoutValidator';

export type UiLayoutDebugReport = {
  screenId: string;
  componentCount: number;
  missingRequiredFields: string[];
  invalidPixelPerfectFields: string[];
  assetDropInReady: boolean;
  battleSectionsCorrect: boolean | null;
  unsupportedValues: string[];
  errors: string[];
  warnings: string[];
};

function battleSectionsCorrect(spec: UiLayoutSpec): boolean | null {
  if (spec.screenId !== 'screen_battle') {
    return null;
  }
  const expected = new Map([
    ['combat', '0,0,1080,480'],
    ['puzzle', '0,480,1080,1056'],
    ['controls', '0,1536,1080,384']
  ]);
  return [...expected.entries()].every(([id, rect]) => {
    const section = spec.sections.find((entry) => entry.id === id);
    return Boolean(section && `${section.x},${section.y},${section.w},${section.h}` === rect);
  });
}

export function createUiLayoutDebugReport(spec: UiLayoutSpec): UiLayoutDebugReport {
  const validation = validateUiLayoutSpec(spec);
  const readiness = spec.components.map((component) => ({ component, result: validateAssetDropInReadiness(component) }));
  return {
    screenId: spec.screenId,
    componentCount: spec.components.length,
    missingRequiredFields: validation.errors.filter((entry) => entry.code === 'component_missing_field').map((entry) => `${entry.componentId ?? 'unknown'}:${entry.field ?? 'unknown'}`),
    invalidPixelPerfectFields: validation.errors.filter((entry) => entry.code === 'pixel_perfect_invalid' || entry.code === 'component_fractional_rect').map((entry) => entry.componentId ?? 'unknown'),
    assetDropInReady: readiness.every((entry) => entry.result.isReady),
    battleSectionsCorrect: battleSectionsCorrect(spec),
    unsupportedValues: validation.errors.filter((entry) => entry.code.endsWith('_invalid')).map((entry) => `${entry.componentId ?? spec.screenId}:${entry.field ?? entry.code}`),
    errors: validation.errors.map((entry) => `[${entry.code}] ${entry.componentId ? `${entry.componentId}: ` : ''}${entry.message}`),
    warnings: [
      ...validation.warnings.map((entry) => `[${entry.code}] ${entry.componentId ? `${entry.componentId}: ` : ''}${entry.message}`),
      ...readiness.flatMap((entry) => entry.result.warnings.map((warning) => `[asset_drop_in] ${entry.component.id}: ${warning}`))
    ]
  };
}

export function formatUiLayoutDebugReport(report: UiLayoutDebugReport): string {
  return [
    `UI layout debug report: ${report.screenId}`,
    `components: ${report.componentCount}`,
    `assetDropInReady: ${report.assetDropInReady ? 'yes' : 'no'}`,
    `battleSectionsCorrect: ${report.battleSectionsCorrect === null ? 'n/a' : report.battleSectionsCorrect ? 'yes' : 'no'}`,
    report.missingRequiredFields.length ? `missingRequiredFields: ${report.missingRequiredFields.join(', ')}` : 'missingRequiredFields: none',
    report.invalidPixelPerfectFields.length ? `invalidPixelPerfectFields: ${report.invalidPixelPerfectFields.join(', ')}` : 'invalidPixelPerfectFields: none',
    report.unsupportedValues.length ? `unsupportedValues: ${report.unsupportedValues.join(', ')}` : 'unsupportedValues: none',
    report.errors.length ? `errors:\n- ${report.errors.join('\n- ')}` : 'errors: none',
    report.warnings.length ? `warnings:\n- ${report.warnings.join('\n- ')}` : 'warnings: none'
  ].join('\n');
}
