import Phaser from 'phaser';
import { BlockmancerGame } from '../../BlockmancerGame';
import type { EnemyInstance, HeroState, PlayerState, RunState, StatusEffectState } from '../../types/GameTypes';
import type { UiComponentSpec } from '../../types/ui-layout';
import { COLORS } from '../../utils/constants';
import { roundPixel, type UiRect } from '../PixelPerfect';
import { UiChip, UiMeter, UiPanel, createUiTextStyle } from '../components';
import type { BattleScreenShell } from './BattleScreenShell';

export type BattleHudHeaderState = {
  stage: number;
  nodeCurrent?: number;
  nodeTotal?: number;
  label?: string;
};

export type BattleHeroHudState = {
  hero: HeroState;
  player: PlayerState;
  statuses?: StatusEffectState[];
};

export type BattleEnemyHudState = {
  enemy: EnemyInstance | null;
  statuses?: StatusEffectState[];
};

const PIXEL_PERFECT = {
  integerCoordinates: true,
  allowFractionalScale: false,
  filtering: 'nearest' as const,
  antiAliasing: false,
  roundPixels: true
};

export const BATTLE_COMBAT_HUD_BOUNDS = {
  header: { x: 270, y: 18, w: 540, h: 48 },
  heroSprite: { x: 204, y: 276, w: 220, h: 220 },
  heroStats: { x: 48, y: 286, w: 300, h: 66 },
  enemySprite: { x: 876, y: 276, w: 240, h: 240 },
  enemyStats: { x: 732, y: 286, w: 300, h: 66 },
  vfxLane: { x: 360, y: 96, w: 360, h: 240 }
} satisfies Record<string, UiRect>;

function spec(
  id: string,
  type: UiComponentSpec['type'],
  rect: UiRect,
  assetKey: string,
  fallbackAssetKey: string,
  zIndex: number,
  options: Partial<Pick<UiComponentSpec, 'canonicalFolder' | 'anchor' | 'fitMode' | 'scaleMode' | 'safePadding' | 'dynamicTextAllowed' | 'expectedSourceSize'>> = {}
): UiComponentSpec {
  return {
    id,
    type,
    assetKey,
    fallbackAssetKey,
    canonicalFolder: options.canonicalFolder ?? 'public/assets/ui/panels/',
    expectedSourceSize: options.expectedSourceSize ?? { w: rect.w, h: rect.h },
    runtimeRenderSize: { w: rect.w, h: rect.h },
    x: rect.x,
    y: rect.y,
    w: rect.w,
    h: rect.h,
    anchor: options.anchor ?? 'topLeft',
    fitMode: options.fitMode ?? 'nineSlice',
    scaleMode: options.scaleMode ?? 'uiStretchNineSlice',
    safePadding: options.safePadding ?? 10,
    zIndex,
    dynamicTextAllowed: options.dynamicTextAllowed ?? true,
    pixelPerfect: PIXEL_PERFECT,
    notes: `UI-5 ${id}.`
  };
}

export class BattleCombatHud {
  readonly root: Phaser.GameObjects.Container;
  readonly vfxLaneBounds: UiRect = { ...BATTLE_COMBAT_HUD_BOUNDS.vfxLane };
  heroSprite?: Phaser.GameObjects.Sprite;
  enemySprite?: Phaser.GameObjects.Sprite;

  private readonly scene: Phaser.Scene;
  private readonly shell: BattleScreenShell;
  private headerPanel?: UiPanel;
  private headerText?: Phaser.GameObjects.Text;
  private heroNameText?: Phaser.GameObjects.Text;
  private enemyNameText?: Phaser.GameObjects.Text;
  private heroHpMeter?: UiMeter;
  private heroMpMeter?: UiMeter;
  private enemyHpMeter?: UiMeter;
  private heroShieldChip?: UiChip;
  private heroStatusChip?: UiChip;
  private enemyShieldChip?: UiChip;
  private enemyStatusChip?: UiChip;
  private enemyIntentChip?: UiChip;
  private vfxDebugRect?: Phaser.GameObjects.Rectangle;
  private currentHeroId?: string;
  private currentEnemyId?: string;
  private debugVisible = false;

  constructor(scene: Phaser.Scene, shell: BattleScreenShell) {
    this.scene = scene;
    this.shell = shell;
    this.root = scene.add.container(0, 0).setName('battleCombatHud.root');
  }

  create(initialState?: RunState): this {
    this.shell.combatUiLayer.add(this.root);

    this.headerPanel = new UiPanel(this.scene, spec('battle_header_panel_ui5', 'panel', BATTLE_COMBAT_HUD_BOUNDS.header, 'ui_panel_battle', 'ui_panel_default', 70), {
      fillColor: COLORS.panelAlt,
      fillAlpha: 0.5
    });
    this.root.add(this.headerPanel.root);
    this.headerText = this.scene.add.text(540, 42, 'Stage 1 \u2014 Node 1/1', createUiTextStyle({
      textStyle: 'hudLabel',
      align: 'center',
      color: '#f6f7ff',
      outline: true,
      wordWrapWidth: 500
    })).setOrigin(0.5, 0.5);
    this.root.add(this.headerText);

    this.heroNameText = this.scene.add.text(204, 258, '', createUiTextStyle({
      textStyle: 'hudLabel',
      align: 'center',
      color: '#ffca6b',
      outline: true,
      wordWrapWidth: 250
    })).setOrigin(0.5, 1);
    this.enemyNameText = this.scene.add.text(876, 258, '', createUiTextStyle({
      textStyle: 'hudLabel',
      align: 'center',
      color: '#ffca6b',
      outline: true,
      wordWrapWidth: 270
    })).setOrigin(0.5, 1);
    this.root.add([this.heroNameText, this.enemyNameText]);

    this.createMetersAndChips();
    this.createVfxLanePlaceholder();

    if (initialState) {
      this.updateHeader(this.toHeaderState(initialState));
      this.updateHeroHud({ hero: initialState.hero, player: initialState.player, statuses: initialState.statusEffects });
      this.updateEnemyHud({ enemy: initialState.activeEnemy, statuses: initialState.statusEffects });
    }

    return this;
  }

  destroy(): void {
    [
      this.headerPanel,
      this.heroHpMeter,
      this.heroMpMeter,
      this.enemyHpMeter,
      this.heroShieldChip,
      this.heroStatusChip,
      this.enemyShieldChip,
      this.enemyStatusChip,
      this.enemyIntentChip
    ].forEach((component) => component?.destroy());
    this.heroSprite?.destroy();
    this.enemySprite?.destroy();
    this.vfxDebugRect?.destroy();
    this.root.destroy(true);
  }

  updateHeader(stageState: BattleHudHeaderState): void {
    const text = stageState.label
      ?? `Stage ${stageState.stage} \u2014 Node ${stageState.nodeCurrent ?? 1}/${stageState.nodeTotal ?? 1}`;
    this.headerText?.setText(text);
  }

  updateHeroHud(heroState: BattleHeroHudState): void {
    this.heroNameText?.setText(heroState.hero.name);
    this.ensureHeroSprite(heroState.hero.id);
    this.heroHpMeter?.setValue(heroState.player.hp, heroState.player.maxHp);
    this.heroMpMeter?.setValue(heroState.player.mana, heroState.player.maxMana);
    this.heroShieldChip?.setText(`Shield ${heroState.player.shield}`);
    const statusCount = Math.max(0, heroState.player.oopsies.length + (heroState.statuses?.filter((status) => status.source === 'player').length ?? 0));
    this.heroStatusChip?.setText(statusCount > 0 ? `Status ${statusCount}` : 'Status OK');
  }

  updateEnemyHud(enemyState: BattleEnemyHudState): void {
    const enemy = enemyState.enemy;
    if (!enemy) {
      this.enemyNameText?.setText('No enemy');
      this.enemySprite?.setVisible(false);
      this.enemyHpMeter?.setValue(0, 1);
      this.enemyShieldChip?.setText('Shield 0');
      this.enemyStatusChip?.setText('Status OK');
      this.enemyIntentChip?.setText('Intent -');
      return;
    }

    this.enemyNameText?.setText(enemy.name);
    this.ensureEnemySprite(enemy);
    this.enemySprite?.setVisible(true);
    this.enemyHpMeter?.setValue(enemy.currentHp, enemy.maxHp);
    this.enemyShieldChip?.setText(`Shield ${enemy.shield}`);
    const enemyStatusCount = [
      enemy.previewHiddenTurns,
      enemy.holdHiddenTurns,
      enemy.manaHexTurns,
      enemy.frozenTurns,
      enemy.sleepTurns,
      enemy.reverseControlsTurns,
      enemy.lineDamageBlockedTurns
    ].filter((turns) => turns > 0).length + (enemyState.statuses?.filter((status) => status.source === 'enemy').length ?? 0);
    this.enemyStatusChip?.setText(enemyStatusCount > 0 ? `Status ${enemyStatusCount}` : 'Status OK');
    this.enemyIntentChip?.setText(`${enemy.intent} in ${enemy.attackCounter}`);
  }

  updateStatusChips(statusState: { heroStatuses?: number; enemyStatuses?: number; heroShield?: number; enemyShield?: number }): void {
    if (typeof statusState.heroShield === 'number') this.heroShieldChip?.setText(`Shield ${statusState.heroShield}`);
    if (typeof statusState.enemyShield === 'number') this.enemyShieldChip?.setText(`Shield ${statusState.enemyShield}`);
    if (typeof statusState.heroStatuses === 'number') this.heroStatusChip?.setText(statusState.heroStatuses > 0 ? `Status ${statusState.heroStatuses}` : 'Status OK');
    if (typeof statusState.enemyStatuses === 'number') this.enemyStatusChip?.setText(statusState.enemyStatuses > 0 ? `Status ${statusState.enemyStatuses}` : 'Status OK');
  }

  setVisible(visible: boolean): void {
    this.root.setVisible(visible);
    this.shell.combatVfxLayer.setVisible(visible);
  }

  setDebugVisible(enabled: boolean): void {
    this.debugVisible = enabled;
    this.vfxDebugRect?.setVisible(enabled);
  }

  getBoundsDebugInfo(): Record<string, UiRect> {
    return {
      header: { ...BATTLE_COMBAT_HUD_BOUNDS.header },
      heroSprite: { ...BATTLE_COMBAT_HUD_BOUNDS.heroSprite },
      heroStats: { ...BATTLE_COMBAT_HUD_BOUNDS.heroStats },
      enemySprite: { ...BATTLE_COMBAT_HUD_BOUNDS.enemySprite },
      enemyStats: { ...BATTLE_COMBAT_HUD_BOUNDS.enemyStats },
      vfxLane: { ...this.vfxLaneBounds }
    };
  }

  private createMetersAndChips(): void {
    this.heroHpMeter = new UiMeter(this.scene, spec('hero_hp_meter_ui5', 'meter', { x: 48, y: 286, w: 212, h: 24 }, 'ui_meter_hp', 'ui_meter_fallback', 72, { safePadding: 4 }), {
      label: 'HP',
      fillColor: COLORS.danger,
      trackColor: 0x252c49,
      fillInset: 4
    });
    this.heroMpMeter = new UiMeter(this.scene, spec('hero_mp_meter_ui5', 'meter', { x: 48, y: 316, w: 212, h: 24 }, 'ui_meter_mp', 'ui_meter_fallback', 72, { safePadding: 4 }), {
      label: 'MP',
      fillColor: COLORS.accent,
      trackColor: 0x252c49,
      fillInset: 4
    });
    this.enemyHpMeter = new UiMeter(this.scene, spec('enemy_hp_meter_ui5', 'meter', { x: 820, y: 286, w: 212, h: 24 }, 'ui_meter_hp', 'ui_meter_fallback', 72, { safePadding: 4 }), {
      label: 'HP',
      fillColor: COLORS.danger,
      trackColor: 0x252c49,
      fillInset: 4
    });

    this.heroShieldChip = new UiChip(this.scene, spec('hero_shield_chip_ui5', 'chip', { x: 268, y: 286, w: 84, h: 24 }, 'ui_status_chip', 'ui_panel_default', 72, { safePadding: 6 }), { text: 'Shield 0' });
    this.heroStatusChip = new UiChip(this.scene, spec('hero_status_chip_ui5', 'chip', { x: 268, y: 316, w: 84, h: 24 }, 'ui_status_chip', 'ui_panel_default', 72, { safePadding: 6 }), { text: 'Status OK' });
    this.enemyShieldChip = new UiChip(this.scene, spec('enemy_shield_chip_ui5', 'chip', { x: 732, y: 286, w: 84, h: 24 }, 'ui_status_chip', 'ui_panel_default', 72, { safePadding: 6 }), { text: 'Shield 0' });
    this.enemyStatusChip = new UiChip(this.scene, spec('enemy_status_chip_ui5', 'chip', { x: 732, y: 316, w: 84, h: 24 }, 'ui_status_chip', 'ui_panel_default', 72, { safePadding: 6 }), { text: 'Status OK' });
    this.enemyIntentChip = new UiChip(this.scene, spec('enemy_intent_chip_ui5', 'chip', { x: 732, y: 342, w: 300, h: 28 }, 'ui_status_chip', 'ui_panel_default', 72, { safePadding: 8 }), { text: 'Intent -', state: 'alert' });

    [
      this.heroHpMeter,
      this.heroMpMeter,
      this.enemyHpMeter,
      this.heroShieldChip,
      this.heroStatusChip,
      this.enemyShieldChip,
      this.enemyStatusChip,
      this.enemyIntentChip
    ].forEach((component) => this.root.add(component.root));
  }

  private createVfxLanePlaceholder(): void {
    this.vfxDebugRect = this.scene.add
      .rectangle(this.vfxLaneBounds.x, this.vfxLaneBounds.y, this.vfxLaneBounds.w, this.vfxLaneBounds.h)
      .setOrigin(0, 0)
      .setStrokeStyle(2, COLORS.gold, 0.72)
      .setFillStyle(0x000000, 0);
    this.vfxDebugRect.setName('battleCombatHud.vfxLaneBounds');
    this.vfxDebugRect.setVisible(this.debugVisible);
    this.shell.combatVfxLayer.add(this.vfxDebugRect);
  }

  private ensureHeroSprite(heroId: string): void {
    if (this.heroSprite && this.currentHeroId === heroId) {
      return;
    }
    this.heroSprite?.destroy();
    this.currentHeroId = heroId;
    const game = this.scene.game as BlockmancerGame;
    this.heroSprite = game.assetSystem.createHeroPoseSprite(this.scene, heroId, 'idle', 204, 276, { alpha: 0.95 });
    game.assetSystem.fitSpriteToBox(this.heroSprite, 190, 190);
    this.heroSprite.setOrigin(0.5, 1);
    this.root.add(this.heroSprite);
    this.root.sendToBack(this.heroSprite);
    this.headerPanel?.root.parentContainer?.bringToTop(this.headerPanel.root);
  }

  private ensureEnemySprite(enemy: EnemyInstance): void {
    if (this.enemySprite && this.currentEnemyId === enemy.id) {
      return;
    }
    this.enemySprite?.destroy();
    this.currentEnemyId = enemy.id;
    const game = this.scene.game as BlockmancerGame;
    this.enemySprite = enemy.roomType === 'boss'
      ? game.assetSystem.createBossPoseSprite(this.scene, enemy.id, 'idle', 876, 276, { alpha: 0.95 })
      : game.assetSystem.createMonsterPoseSprite(this.scene, enemy.id, 'idle', 876, 276, { elite: enemy.roomType === 'elite', alpha: 0.95 });
    game.assetSystem.fitSpriteToBox(this.enemySprite, enemy.roomType === 'boss' ? 220 : 196, enemy.roomType === 'boss' ? 220 : 196);
    this.enemySprite.setOrigin(0.5, 1);
    this.root.add(this.enemySprite);
    this.root.sendToBack(this.enemySprite);
    if (this.heroSprite) this.root.sendToBack(this.heroSprite);
  }

  private toHeaderState(state: RunState): BattleHudHeaderState {
    return {
      stage: state.stage,
      nodeCurrent: Math.max(1, state.runStats.roomsCleared + 1),
      nodeTotal: Math.max(1, state.map.length || 1)
    };
  }
}
