import type {
  UiAnchor,
  UiComponentSpec,
  UiFitMode,
  UiLayoutSpec,
  UiLayoutValidationIssue,
  UiLayoutValidationResult,
  UiScaleMode,
  UiSectionSpec
} from '../types/ui-layout';
import { assertIntegerRect, validateNoFractionalCoordinates, validatePixelPerfectFlags, validateRuntimeRenderSize } from './PixelPerfect';

export const UI_LAYOUT_CANVAS_WIDTH = 1080;
export const UI_LAYOUT_CANVAS_HEIGHT = 1920;

export const UI_FIT_MODES: readonly UiFitMode[] = ['exact', 'contain', 'cover', 'nineSlice', 'tile', 'iconCenter', 'spriteAnchor', 'vfxCenter'];
export const UI_SCALE_MODES: readonly UiScaleMode[] = ['none', 'integerOnly', 'fitInteger', 'uiStretchNineSlice', 'backgroundExact', 'textDynamic'];
export const UI_ANCHORS: readonly UiAnchor[] = ['topLeft', 'center', 'bottomCenter', 'gridTopLeft', 'vfxCenter'];

const REQUIRED_COMPONENT_FIELDS: Array<keyof UiComponentSpec> = [
  'id',
  'type',
  'assetKey',
  'fallbackAssetKey',
  'canonicalFolder',
  'expectedSourceSize',
  'runtimeRenderSize',
  'x',
  'y',
  'w',
  'h',
  'anchor',
  'fitMode',
  'scaleMode',
  'safePadding',
  'zIndex',
  'dynamicTextAllowed',
  'pixelPerfect'
];

function issue(
  severity: UiLayoutValidationIssue['severity'],
  code: string,
  message: string,
  context: Partial<UiLayoutValidationIssue> = {}
): UiLayoutValidationIssue {
  return { severity, code, message, ...context };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function hasString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function validSize(value: unknown): boolean {
  return isObject(value) && Number.isInteger(value.w) && Number.isInteger(value.h) && Number(value.w) > 0 && Number(value.h) > 0;
}

function containsRect(container: { x: number; y: number; w: number; h: number }, rect: { x: number; y: number; w: number; h: number }): boolean {
  return rect.x >= container.x && rect.y >= container.y && rect.x + rect.w <= container.x + container.w && rect.y + rect.h <= container.y + container.h;
}

function validateSection(section: UiSectionSpec, screenId: string, errors: UiLayoutValidationIssue[]): void {
  if (!assertIntegerRect(section)) {
    errors.push(issue('error', 'section_fractional_rect', 'Section x/y/w/h must be integer pixels.', { screenId, sectionId: section.id }));
  }
  if (section.w <= 0 || section.h <= 0) {
    errors.push(issue('error', 'section_invalid_size', 'Section width and height must be positive.', { screenId, sectionId: section.id }));
  }
}

function validateComponentShape(component: UiComponentSpec, screenId: string, errors: UiLayoutValidationIssue[]): void {
  const raw = component as unknown as Record<string, unknown>;
  REQUIRED_COMPONENT_FIELDS.forEach((field) => {
    if (!(field in raw)) {
      errors.push(issue('error', 'component_missing_field', `Component is missing required field ${field}.`, { screenId, componentId: component.id, field }));
    }
  });

  if (!hasString(component.assetKey)) {
    errors.push(issue('error', 'asset_key_invalid', 'assetKey must be a non-empty string.', { screenId, componentId: component.id, field: 'assetKey' }));
  }
  if (!hasString(component.fallbackAssetKey)) {
    errors.push(issue('error', 'fallback_key_invalid', 'fallbackAssetKey must be a non-empty string.', { screenId, componentId: component.id, field: 'fallbackAssetKey' }));
  }
  if (!hasString(component.canonicalFolder)) {
    errors.push(issue('error', 'canonical_folder_invalid', 'canonicalFolder must be present for asset-bearing components.', { screenId, componentId: component.id, field: 'canonicalFolder' }));
  }
  if (!validSize(component.expectedSourceSize)) {
    errors.push(issue('error', 'expected_source_size_invalid', 'expectedSourceSize must have positive integer w/h.', { screenId, componentId: component.id, field: 'expectedSourceSize' }));
  }
  if (!validSize(component.runtimeRenderSize)) {
    errors.push(issue('error', 'runtime_render_size_invalid', 'runtimeRenderSize must have positive integer w/h.', { screenId, componentId: component.id, field: 'runtimeRenderSize' }));
  }
  if (typeof component.dynamicTextAllowed !== 'boolean') {
    errors.push(issue('error', 'dynamic_text_flag_invalid', 'dynamicTextAllowed must be boolean.', { screenId, componentId: component.id, field: 'dynamicTextAllowed' }));
  }
  if (!UI_FIT_MODES.includes(component.fitMode)) {
    errors.push(issue('error', 'fit_mode_invalid', `Unsupported fitMode ${String(component.fitMode)}.`, { screenId, componentId: component.id, field: 'fitMode' }));
  }
  if (!UI_SCALE_MODES.includes(component.scaleMode)) {
    errors.push(issue('error', 'scale_mode_invalid', `Unsupported scaleMode ${String(component.scaleMode)}.`, { screenId, componentId: component.id, field: 'scaleMode' }));
  }
  if (!UI_ANCHORS.includes(component.anchor)) {
    errors.push(issue('error', 'anchor_invalid', `Unsupported anchor ${String(component.anchor)}.`, { screenId, componentId: component.id, field: 'anchor' }));
  }
  if (!Number.isFinite(component.zIndex)) {
    errors.push(issue('error', 'z_index_invalid', 'zIndex must be numeric.', { screenId, componentId: component.id, field: 'zIndex' }));
  }
  if (!Number.isFinite(component.safePadding)) {
    errors.push(issue('error', 'safe_padding_invalid', 'safePadding must be numeric.', { screenId, componentId: component.id, field: 'safePadding' }));
  }
}

function validateComponentPixelRules(component: UiComponentSpec, screenId: string, errors: UiLayoutValidationIssue[], warnings: UiLayoutValidationIssue[]): void {
  if (!validateNoFractionalCoordinates(component)) {
    errors.push(issue('error', 'component_fractional_rect', 'Component x/y/w/h must be integer pixels.', { screenId, componentId: component.id }));
  }
  if (!validatePixelPerfectFlags(component)) {
    errors.push(issue('error', 'pixel_perfect_invalid', 'pixelPerfect must request integer coordinates, nearest/pixelated filtering, no anti-aliasing, and rounded pixels.', { screenId, componentId: component.id, field: 'pixelPerfect' }));
  }
  if (!validateRuntimeRenderSize(component) && component.fitMode === 'exact') {
    warnings.push(issue('warning', 'runtime_size_differs_from_slot', 'Exact-fit component runtimeRenderSize differs from slot w/h.', { screenId, componentId: component.id, field: 'runtimeRenderSize' }));
  }
  if (component.pixelPerfect?.allowFractionalScale && component.scaleMode !== 'uiStretchNineSlice') {
    warnings.push(issue('warning', 'fractional_scale_allowed', 'Fractional scale should only be used by explicitly supported UI nine-slice paths.', { screenId, componentId: component.id, field: 'pixelPerfect.allowFractionalScale' }));
  }
}

function validateBattleSections(spec: UiLayoutSpec, errors: UiLayoutValidationIssue[]): void {
  if (spec.screenId !== 'screen_battle') {
    return;
  }
  const expected = new Map([
    ['combat', '0,0,1080,480'],
    ['puzzle', '0,480,1080,1056'],
    ['controls', '0,1536,1080,384']
  ]);
  expected.forEach((rect, sectionId) => {
    const section = spec.sections.find((entry) => entry.id === sectionId);
    if (!section || `${section.x},${section.y},${section.w},${section.h}` !== rect) {
      errors.push(issue('error', 'battle_section_split_invalid', `screen_battle ${sectionId} section must be ${rect}.`, { screenId: spec.screenId, sectionId }));
    }
  });
}

function validateComponentBounds(spec: UiLayoutSpec, component: UiComponentSpec, warnings: UiLayoutValidationIssue[]): void {
  const canvasRect = { x: 0, y: 0, w: spec.canvas.width, h: spec.canvas.height };
  if (!containsRect(canvasRect, component)) {
    warnings.push(issue('warning', 'component_outside_canvas', 'Component extends outside the 1080x1920 canvas.', { screenId: spec.screenId, componentId: component.id }));
  }

  const owningSection = spec.sections.find((section) => section.components.includes(component.id));
  if (owningSection && !containsRect(owningSection, component) && component.type !== 'modal' && component.type !== 'backgroundLayer') {
    warnings.push(issue('warning', 'component_outside_section', 'Component extends outside its declared section.', { screenId: spec.screenId, componentId: component.id, sectionId: owningSection.id }));
  }
}

export function validateUiLayoutSpec(spec: UiLayoutSpec): UiLayoutValidationResult {
  const errors: UiLayoutValidationIssue[] = [];
  const warnings: UiLayoutValidationIssue[] = [];
  const screenId = spec.screenId;

  if (spec.canvas?.width !== UI_LAYOUT_CANVAS_WIDTH || spec.canvas?.height !== UI_LAYOUT_CANVAS_HEIGHT || spec.canvas?.orientation !== 'portrait') {
    errors.push(issue('error', 'canvas_invalid', 'Layout canvas must be 1080x1920 portrait.', { screenId }));
  }
  if (!Array.isArray(spec.sections)) {
    errors.push(issue('error', 'sections_invalid', 'sections must be an array.', { screenId }));
  } else {
    spec.sections.forEach((section) => validateSection(section, screenId, errors));
  }
  if (!Array.isArray(spec.components)) {
    errors.push(issue('error', 'components_invalid', 'components must be an array.', { screenId }));
  } else {
    spec.components.forEach((component) => {
      validateComponentShape(component, screenId, errors);
      validateComponentPixelRules(component, screenId, errors, warnings);
      validateComponentBounds(spec, component, warnings);
    });
  }
  validateBattleSections(spec, errors);

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
