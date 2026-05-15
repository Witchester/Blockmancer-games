import type { ActiveHazardState, ReactiveItemContent, RunState, SpellCatalystModifier } from '../types/GameTypes';
import { clamp } from '../utils/math';
import { TETROMINO_COLORS } from '../utils/constants';
import { contentRegistry } from './ContentRegistry';
import type { BoardSystem } from './BoardSystem';
import type { CombatSystem } from './CombatSystem';

type ItemEffect = NonNullable<ReactiveItemContent['effect']> & {
  mana?: number;
  heal?: number;
  value?: number;
  healAmount?: number;
  damageBonus?: number;
  amount?: number;
};

export class ItemSystem {
  getItem(id: string): ReactiveItemContent | null {
    return contentRegistry.getItem(id) as ReactiveItemContent | null;
  }

  applyItem(state: RunState, itemId: string, boardSystem?: BoardSystem, combatSystem?: CombatSystem): string {
    const item = this.getItem(itemId);
    if (!item) {
      return 'The item fizzles harmlessly.';
    }

    const effect = (item.effect ?? {}) as ItemEffect;
    const effectConfig = item.effectConfig ?? {};
    const type = effect.type;

    if (item.timing === 'before_spell' || type === 'spell_catalyst') {
      const modifier = this.createSpellModifier(item, effectConfig);
      state.reactiveState.nextSpellModifiers = [modifier];
      return `${item.name} sparkles around your next spell.`;
    }

    if (type === 'healAndBoost') {
      state.player.hp = clamp(state.player.hp + (effect.healAmount ?? 0), 0, state.player.maxHp);
      state.player.lineDamageBonus += (effect.damageBonus ?? 0);
      return `${item.name} restores HP and boosts your next attack!`;
    }

    if (type === 'restoreMana') {
      state.player.mana = clamp(state.player.mana + (effect.amount ?? 0), 0, state.player.maxMana);
      return `${item.name} restores mana!`;
    }

    if (type === 'mana_and_heal') {
      state.player.mana = clamp(state.player.mana + (effect.mana ?? 0), 0, state.player.maxMana);
      state.player.hp = clamp(state.player.hp + (effect.heal ?? 0), 0, state.player.maxHp);
      return `${item.name} restores mana and health!`;
    }

    if (type === 'luck') {
      state.player.gold += (effect.value ?? 10) * 5;
      state.gold = state.player.gold;
      return `${item.name} gleams! You found some quick gold!`;
    }

    // Following effects require battle context
    if (!boardSystem || !combatSystem) {
      return `${item.name} can only be used during battle!`;
    }

    if (type === 'clear_junk') {
      const cleared = boardSystem.clearBlocksByIds(['block_crumb_junk', 'block_cloud_junk', 'block_cracked_junk'], this.numberConfig(effectConfig, 'count', 5));
      return `${item.name} vacuums ${cleared} junk block${cleared === 1 ? '' : 's'}.`;
    }

    if (type === 'clear_sticky') {
      const cleared = boardSystem.clearBlocksByIds(['block_sticky'], this.numberConfig(effectConfig, 'count', 5));
      return `${item.name} mops up ${cleared} sticky block${cleared === 1 ? '' : 's'}.`;
    }

    if (type === 'pin_floating') {
      const pinned = this.clearHazardsByKind(state, 'floating_block');
      return pinned > 0
        ? `${item.name} pins ${pinned} floaty block${pinned === 1 ? '' : 's'} safely.`
        : `${item.name} is ready, but no floaty blocks are overhead.`;
    }

    if (type === 'delay_incoming_junk') {
      const delayed = this.modifyHazards(state, 'incoming_junk', (hazard) => {
        hazard.remainingPieces += this.numberConfig(effectConfig, 'pieces', 3);
      });
      return delayed > 0 ? `${item.name} delays incoming junk.` : `${item.name} finds no incoming junk to delay.`;
    }

    if (type === 'reflect_incoming_junk') {
      let reflected = 0;
      const changed = this.modifyHazards(state, 'incoming_junk', (hazard) => {
        reflected += Math.ceil((hazard.amount ?? 0) / 2);
        hazard.amount = Math.max(0, (hazard.amount ?? 0) - reflected);
      });
      if (reflected > 0) {
        combatSystem.applyDirectDamage(reflected * 2, item.name);
      }
      state.activeHazards = state.activeHazards.filter((hazard) => hazard.kind !== 'incoming_junk' || (hazard.amount ?? 0) > 0);
      return changed > 0 ? `${item.name} returns ${reflected} junk pieces as a snacky thump.` : `${item.name} has no incoming junk to stamp.`;
    }

    if (type === 'reveal_preview') {
      state.reactiveState.previewRevealPieces = Math.max(state.reactiveState.previewRevealPieces, this.numberConfig(effectConfig, 'pieces', 5));
      this.clearHazardsByKind(state, 'preview');
      if (state.activeEnemy) {
        state.activeEnemy.previewHiddenTurns = 0;
        state.activeEnemy.holdHiddenTurns = 0;
      }
      return `${item.name} clears up the preview window.`;
    }

    if (type === 'counter_freeze') {
      state.reactiveState.freezeGuardPieces = Math.max(state.reactiveState.freezeGuardPieces, this.numberConfig(effectConfig, 'pieces', 4));
      this.clearHazardsByKind(state, 'freeze');
      if (state.activeEnemy) {
        state.activeEnemy.frozenTurns = 0;
      }
      state.player.mana = clamp(state.player.mana + this.numberConfig(effectConfig, 'mana', 8), 0, state.player.maxMana);
      return `${item.name} warms the board and restores a little mana.`;
    }

    if (type === 'speed_brake') {
      state.reactiveState.speedBrakePieces = Math.max(state.reactiveState.speedBrakePieces, this.numberConfig(effectConfig, 'pieces', 6));
      this.clearHazardsByKind(state, 'speed_wave');
      state.fallSpeed = Math.max(0.7, state.fallSpeed - this.numberConfig(effectConfig, 'slow', 0.2));
      return `${item.name} steadies the wobbly floor.`;
    }

    if (type === 'cancel_low_ceiling') {
      state.reactiveState.lowCeilingCanceled = true;
      const cleared = this.clearHazardsByKind(state, 'low_ceiling');
      return cleared > 0 ? `${item.name} props the ceiling back up.` : `${item.name} is set for the next low ceiling.`;
    }

    if (type === 'arm_safety_net') {
      state.reactiveState.safetyNetArmed = true;
      return `${item.name} is ready to catch one overflow.`;
    }

    if (type === 'convert_junk_sticky') {
      const converted = boardSystem.convertBlocksByIds(
        ['block_crumb_junk', 'block_cloud_junk', 'block_sticky'],
        TETROMINO_COLORS.O,
        this.numberConfig(effectConfig, 'count', 4)
      );
      return `${item.name} polishes ${converted} block${converted === 1 ? '' : 's'} back into runes.`;
    }

    if (type === 'clear_row') {
      boardSystem.clearMessiestRow();
      return `${item.name} clears a messy row!`;
    }

    if (type === 'clear_area') {
      boardSystem.clearRandomFilledArea(effect.value ?? 1);
      return `${item.name} blasts an area!`;
    }

    if (type === 'clear_cluster') {
      boardSystem.clearRandomCluster(effect.value ?? 4);
      return `${item.name} clears a cluster of blocks!`;
    }

    if (type === 'shield') {
      combatSystem.addPlayerShield(effect.value ?? 4);
      return `${item.name} grants shield!`;
    }

    if (type === 'refresh_hold') {
      state.board.holdPieceType = null;
      return `${item.name} refreshes your hold box!`;
    }

    if (type === 'delay_enemy') {
      if (state.activeEnemy) {
        state.activeEnemy.sleepTurns += (effect.value ?? 1);
        return `${item.name} puts the enemy to sleep for a moment!`;
      }
      return `${item.name} has no effect.`;
    }

    // Fallback for legacy effect format
    if (effect.mana) {
      state.player.mana = clamp(state.player.mana + effect.mana, 0, state.player.maxMana);
    }
    if (effect.heal || type === 'heal') {
      state.player.hp = clamp(state.player.hp + (effect.heal ?? effect.value ?? 0), 0, state.player.maxHp);
    }

    return `${item.name} is used.`;
  }

  private createSpellModifier(item: ReactiveItemContent, effectConfig: Record<string, unknown>): SpellCatalystModifier {
    return {
      id: String(effectConfig.modifierId ?? item.id),
      sourceItemId: item.id,
      remainingCasts: 1,
      costMultiplier: typeof effectConfig.costMultiplier === 'number' ? effectConfig.costMultiplier : undefined,
      extraBlockId: typeof effectConfig.extraBlockId === 'string' ? effectConfig.extraBlockId : undefined,
      cleanupTags: Array.isArray(effectConfig.cleanupTags) ? effectConfig.cleanupTags as SpellCatalystModifier['cleanupTags'] : undefined,
      bombRadiusBonus: typeof effectConfig.bombRadiusBonus === 'number' ? effectConfig.bombRadiusBonus : undefined,
      feverMultiplier: typeof effectConfig.feverMultiplier === 'number' ? effectConfig.feverMultiplier : undefined
    };
  }

  private numberConfig(config: Record<string, unknown>, key: string, fallback: number): number {
    return typeof config[key] === 'number' ? config[key] as number : fallback;
  }

  private clearHazardsByKind(state: RunState, kind: ActiveHazardState['kind']): number {
    const before = state.activeHazards.length;
    state.activeHazards = state.activeHazards.filter((hazard) => hazard.kind !== kind);
    return before - state.activeHazards.length;
  }

  private modifyHazards(state: RunState, kind: ActiveHazardState['kind'], update: (hazard: ActiveHazardState) => void): number {
    let changed = 0;
    state.activeHazards.forEach((hazard) => {
      if (hazard.kind === kind) {
        update(hazard);
        changed += 1;
      }
    });
    return changed;
  }
}
