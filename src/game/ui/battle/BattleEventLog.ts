import Phaser from 'phaser';
import type { UiComponentSpec } from '../../types/ui-layout';
import { COLORS, FONT_FAMILY_STACKS } from '../../utils/constants';
import { roundPixel, type UiRect } from '../PixelPerfect';
import { UiPanel } from '../components';
import type { BattleScreenShell } from './BattleScreenShell';

export type BattleEventLogMessage = {
  id?: string;
  text: string;
  type?: 'info' | 'damage' | 'heal' | 'status' | 'system' | 'warning';
  timestamp?: number;
};

const PIXEL_PERFECT = {
  integerCoordinates: true,
  allowFractionalScale: false,
  filtering: 'nearest' as const,
  antiAliasing: false,
  roundPixels: true
};

const EVENT_LOG_SPEC: UiComponentSpec = {
  id: 'event_log_strip',
  type: 'panel',
  assetKey: 'ui_event_log_strip',
  fallbackAssetKey: 'ui_panel_default',
  canonicalFolder: 'public/assets/ui/panels/',
  expectedSourceSize: { w: 1032, h: 96 },
  runtimeRenderSize: { w: 1032, h: 96 },
  x: 24,
  y: 12,
  w: 1032,
  h: 96,
  anchor: 'topLeft',
  fitMode: 'nineSlice',
  scaleMode: 'uiStretchNineSlice',
  safePadding: 18,
  zIndex: 80,
  dynamicTextAllowed: true,
  pixelPerfect: PIXEL_PERFECT,
  notes: 'UI-5 event log strip. Dynamic combat messages render as text at the start of puzzle section.'
};

export class BattleEventLog {
  readonly root: Phaser.GameObjects.Container;
  readonly bounds: UiRect = { x: EVENT_LOG_SPEC.x, y: EVENT_LOG_SPEC.y, w: EVENT_LOG_SPEC.w, h: EVENT_LOG_SPEC.h };

  private readonly scene: Phaser.Scene;
  private readonly shell: BattleScreenShell;
  private readonly maxVisibleMessages: number;
  private panel?: UiPanel;
  private messageTexts: Phaser.GameObjects.Text[] = [];
  private messages: BattleEventLogMessage[] = [];

  constructor(scene: Phaser.Scene, shell: BattleScreenShell, options: { maxVisibleMessages?: number } = {}) {
    this.scene = scene;
    this.shell = shell;
    this.maxVisibleMessages = Math.max(1, Math.min(3, options.maxVisibleMessages ?? 3));
    this.root = scene.add.container(0, 0).setName('battleEventLog.root');
  }

  create(): this {
    this.shell.eventLogLayer.add(this.root);
    this.panel = new UiPanel(this.scene, EVENT_LOG_SPEC, {
      fillColor: COLORS.panelAlt,
      fillAlpha: 0.85,
      strokeColor: COLORS.accent,
      strokeAlpha: 0.6
    });
    this.root.add(this.panel.root);

    const lineHeight = 42;
    for (let index = 0; index < this.maxVisibleMessages; index += 1) {
      const label = this.scene.add.text(
        roundPixel(EVENT_LOG_SPEC.x + EVENT_LOG_SPEC.safePadding),
        roundPixel(EVENT_LOG_SPEC.y + EVENT_LOG_SPEC.safePadding + index * lineHeight),
        '',
        {
          color: '#f6f7ff',
          fontFamily: FONT_FAMILY_STACKS.readable,
          fontSize: '22px',
          fontStyle: 'bold',
          align: 'left',
          wordWrap: { width: EVENT_LOG_SPEC.w - EVENT_LOG_SPEC.safePadding * 2 },
          lineSpacing: 6,
          stroke: '#05060a',
          strokeThickness: 3
        }
      ).setOrigin(0, 0);
      label.setMaxLines(2);
      label.setFixedSize(EVENT_LOG_SPEC.w - EVENT_LOG_SPEC.safePadding * 2, lineHeight);
      this.root.add(label);
      this.messageTexts.push(label);
    }

    this.render();
    return this;
  }

  destroy(): void {
    this.panel?.destroy();
    this.panel = undefined;
    this.root.destroy(true);
  }

  pushMessage(message: string | BattleEventLogMessage): void {
    const normalized = typeof message === 'string' ? { text: message } : message;
    this.messages.unshift(normalized);
    this.messages = this.messages.slice(0, this.maxVisibleMessages);
    this.render();
  }

  setMessages(messages: Array<string | BattleEventLogMessage>): void {
    this.messages = messages
      .map((message) => typeof message === 'string' ? { text: message } : message)
      .filter((message) => message.text.trim().length > 0)
      .slice(0, this.maxVisibleMessages);
    this.render();
  }

  clear(): void {
    this.messages = [];
    this.render();
  }

  update(): void {
    this.render();
  }

  setVisible(visible: boolean): void {
    this.root.setVisible(visible);
  }

  private render(): void {
    this.messageTexts.forEach((label, index) => {
      const message = this.messages[index];
      label.setText(message ? this.formatMessage(message) : '');
      label.setColor(this.getMessageColor(message?.type));
    });
  }

  private formatMessage(message: BattleEventLogMessage): string {
    return message.text.length > 128 ? `${message.text.slice(0, 125)}...` : message.text;
  }

  private getMessageColor(type: BattleEventLogMessage['type']): string {
    if (type === 'damage' || type === 'warning') return '#ffca6b';
    if (type === 'heal') return '#65d6a5';
    if (type === 'status') return '#9adfff';
    if (type === 'system') return '#98a0c7';
    return '#f6f7ff';
  }
}
