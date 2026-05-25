import Phaser from 'phaser';
import type { UiComponentSpec } from '../../types/ui-layout';
import { validateUiLayoutSpec } from '../UiLayoutValidator';
import { validateAssetDropInReadiness } from '../UiAssetSlotResolver';
import { UiButton, type UiButtonOptions } from './UiButton';
import { UiCard, type UiCardOptions } from './UiCard';
import { UiChip, type UiChipOptions } from './UiChip';
import { UiIconSlot, type UiIconSlotOptions } from './UiIconSlot';
import { UiMeter, type UiMeterOptions } from './UiMeter';
import { UiModalBackdrop, type UiModalBackdropOptions } from './UiModalBackdrop';
import { UiPanel, type UiPanelOptions } from './UiPanel';
import { UiSpriteSlot, type UiSpriteSlotOptions } from './UiSpriteSlot';
import { UiTextLabel, type UiTextLabelOptions } from './UiTextLabel';

export type UiPrimitive =
  | UiPanel
  | UiButton
  | UiIconSlot
  | UiSpriteSlot
  | UiMeter
  | UiTextLabel
  | UiChip
  | UiCard
  | UiModalBackdrop;

export type UiFactoryOptions = {
  debug?: boolean;
  button?: UiButtonOptions;
  iconSlot?: UiIconSlotOptions;
  spriteSlot?: UiSpriteSlotOptions;
  meter?: UiMeterOptions;
  textLabel?: UiTextLabelOptions;
  chip?: UiChipOptions;
  card?: UiCardOptions;
  panel?: UiPanelOptions;
  modalBackdrop?: UiModalBackdropOptions;
};

export function validateUiComponentForFactory(component: UiComponentSpec): void {
  const readiness = validateAssetDropInReadiness(component);
  if (!readiness.isReady) {
    throw new Error(`Invalid UI component ${component.id}: ${readiness.errors.join(' ')}`);
  }
}

export function createPanel(scene: Phaser.Scene, component: UiComponentSpec, options: UiPanelOptions = {}): UiPanel {
  validateUiComponentForFactory(component);
  return new UiPanel(scene, component, options);
}

export function createButton(scene: Phaser.Scene, component: UiComponentSpec, options: UiButtonOptions = {}): UiButton {
  validateUiComponentForFactory(component);
  return new UiButton(scene, component, options);
}

export function createIconSlot(scene: Phaser.Scene, component: UiComponentSpec, options: UiIconSlotOptions = {}): UiIconSlot {
  validateUiComponentForFactory(component);
  return new UiIconSlot(scene, component, options);
}

export function createSpriteSlot(scene: Phaser.Scene, component: UiComponentSpec, options: UiSpriteSlotOptions = {}): UiSpriteSlot {
  validateUiComponentForFactory(component);
  return new UiSpriteSlot(scene, component, options);
}

export function createMeter(scene: Phaser.Scene, component: UiComponentSpec, options: UiMeterOptions = {}): UiMeter {
  validateUiComponentForFactory(component);
  return new UiMeter(scene, component, options);
}

export function createTextLabel(scene: Phaser.Scene, component: UiComponentSpec, text = '', options: UiTextLabelOptions = {}): UiTextLabel {
  validateUiComponentForFactory(component);
  return new UiTextLabel(scene, component, { ...options, text });
}

export function createChip(scene: Phaser.Scene, component: UiComponentSpec, options: UiChipOptions = {}): UiChip {
  validateUiComponentForFactory(component);
  return new UiChip(scene, component, options);
}

export function createCard(scene: Phaser.Scene, component: UiComponentSpec, options: UiCardOptions = {}): UiCard {
  validateUiComponentForFactory(component);
  return new UiCard(scene, component, options);
}

export function createModalBackdrop(scene: Phaser.Scene, component: UiComponentSpec, options: UiModalBackdropOptions = {}): UiModalBackdrop {
  validateUiComponentForFactory(component);
  return new UiModalBackdrop(scene, component, options);
}

export function createFromSpec(scene: Phaser.Scene, component: UiComponentSpec, options: UiFactoryOptions = {}): UiPrimitive {
  const debug = options.debug;
  switch (component.type) {
    case 'button':
      return createButton(scene, component, { debug, ...options.button });
    case 'iconSlot':
    case 'portraitSlot':
    case 'vfxSlot':
      return createIconSlot(scene, component, { debug, ...options.iconSlot });
    case 'spriteSlot':
      return createSpriteSlot(scene, component, { debug, ...options.spriteSlot });
    case 'meter':
      return createMeter(scene, component, { debug, ...options.meter });
    case 'text':
    case 'label':
      return createTextLabel(scene, component, options.textLabel?.text ?? '', { debug, ...options.textLabel });
    case 'chip':
    case 'badge':
      return createChip(scene, component, { debug, ...options.chip });
    case 'card':
      return createCard(scene, component, { debug, ...options.card });
    case 'modal':
    case 'modalBackdrop':
      return createModalBackdrop(scene, component, { debug, ...options.modalBackdrop });
    case 'panel':
    case 'backgroundLayer':
    default:
      return createPanel(scene, component, { debug, ...options.panel });
  }
}

export const UiComponentFactory = {
  validateUiLayoutSpec,
  validateUiComponentForFactory,
  createPanel,
  createButton,
  createIconSlot,
  createSpriteSlot,
  createMeter,
  createTextLabel,
  createChip,
  createCard,
  createModalBackdrop,
  createFromSpec
};
