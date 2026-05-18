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

    if (type === 'pop_floating') {
      const popped = this.clearHazardsByKind(state, 'floating_block');
      if (popped > 0) {
        this.queueHazard(state, 'incoming_junk', {
          amount: 1,
          sourceId: item.id,
          blockId: 'block_crumb_junk',
          remainingPieces: 2,
          name: 'Balloon Pop Junk',
          warningText: 'A popped floater is drifting down as one crumb junk.'
        });
      }
      return popped > 0
        ? `${item.name} pops ${popped} floaty block${popped === 1 ? '' : 's'} and warns about one later junk.`
        : `${item.name} finds no floaty blocks to pop.`;
    }

    if (type === 'anchor_floaters') {
      state.reactiveState.anchorCookiePieces = Math.max(state.reactiveState.anchorCookiePieces, this.numberConfig(effectConfig, 'pieces', 3));
      return `${item.name} anchors the next floaty hazards for ${state.reactiveState.anchorCookiePieces} pieces.`;
    }

    if (type === 'sky_hook') {
      const floating = state.activeHazards.find((hazard) => hazard.kind === 'floating_block');
      if (!floating) {
        return `${item.name} waits, but no floaty block is in reach.`;
      }
      state.activeHazards = state.activeHazards.filter((hazard) => hazard !== floating);
      state.board.holdPieceType = state.board.holdPieceType ?? 'O';
      return `${item.name} hooks a floaty block into Hold as a safe square piece.`;
    }

    if (type === 'delay_incoming_junk') {
      const delayed = this.modifyHazards(state, 'incoming_junk', (hazard) => {
        hazard.remainingPieces += this.numberConfig(effectConfig, 'pieces', 3);
      });
      return delayed > 0 ? `${item.name} delays incoming junk.` : `${item.name} finds no incoming junk to delay.`;
    }

    if (type === 'block_incoming_junk') {
      let blocked = 0;
      const changed = this.modifyHazards(state, 'incoming_junk', (hazard) => {
        const amount = hazard.amount ?? 0;
        const remaining = Math.ceil(amount * this.numberConfig(effectConfig, 'remainingMultiplier', 0.5));
        blocked += Math.max(0, amount - remaining);
        hazard.amount = remaining;
      });
      state.activeHazards = state.activeHazards.filter((hazard) => hazard.kind !== 'incoming_junk' || (hazard.amount ?? 0) > 0);
      return changed > 0 ? `${item.name} blocks ${blocked} incoming junk.` : `${item.name} finds no incoming junk to cover.`;
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

    if (type === 'cleanup_coupon') {
      state.reactiveState.cleanupCouponPieces = Math.max(state.reactiveState.cleanupCouponPieces, this.numberConfig(effectConfig, 'pieces', 2));
      return `${item.name} is ready. Clear a line within ${state.reactiveState.cleanupCouponPieces} pieces to cancel incoming junk.`;
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

    if (type === 'remove_sleep') {
      state.reactiveState.sleepGuardPieces = Math.max(state.reactiveState.sleepGuardPieces, this.numberConfig(effectConfig, 'pieces', 4));
      this.clearHazardsByKind(state, 'sleep');
      if (state.activeEnemy) {
        state.activeEnemy.sleepTurns = 0;
      }
      return `${item.name} rings softly and keeps Sleepy away for a few pieces.`;
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

    if (type === 'delete_bad_piece') {
      const cleared = this.clearHazardsByKind(state, 'bad_piece');
      state.reactiveState.nopeStampPieces = Math.max(state.reactiveState.nopeStampPieces, this.numberConfig(effectConfig, 'pieces', 3));
      return cleared > 0
        ? `${item.name} stamps the weird delivery out of the queue.`
        : `${item.name} is ready to reject the next weird delivery.`;
    }

    if (type === 'reorder_queue') {
      boardSystem.setNextPieceType('I');
      this.clearHazardsByKind(state, 'bad_piece');
      this.clearHazardsByKind(state, 'preview');
      return `${item.name} combs the queue and places a clean line piece next.`;
    }

    if (type === 'royal_erase') {
      const converted = boardSystem.convertBlocksByIds(['block_royal'], TETROMINO_COLORS.O, this.numberConfig(effectConfig, 'count', 2));
      this.clearHazardsByKind(state, 'royal_pattern');
      return `${item.name} downgrades ${converted} royal block${converted === 1 ? '' : 's'} into ordinary runes.`;
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
      spellFilter: typeof effectConfig.spellFilter === 'string' || Array.isArray(effectConfig.spellFilter)
        ? effectConfig.spellFilter as SpellCatalystModifier['spellFilter']
        : this.defaultSpellFilter(item.id),
      effectType: typeof effectConfig.effectType === 'string' ? effectConfig.effectType : 'spell_catalyst',
      value: typeof effectConfig.value === 'number' ? effectConfig.value : undefined,
      consumed: false,
      remainingCasts: 1,
      costMultiplier: typeof effectConfig.costMultiplier === 'number' ? effectConfig.costMultiplier : undefined,
      extraBlockId: typeof effectConfig.extraBlockId === 'string' ? effectConfig.extraBlockId : undefined,
      cleanupTags: Array.isArray(effectConfig.cleanupTags) ? effectConfig.cleanupTags as SpellCatalystModifier['cleanupTags'] : undefined,
      bombRadiusBonus: typeof effectConfig.bombRadiusBonus === 'number' ? effectConfig.bombRadiusBonus : undefined,
      feverMultiplier: typeof effectConfig.feverMultiplier === 'number' ? effectConfig.feverMultiplier : undefined
    };
  }

  private defaultSpellFilter(itemId: string): SpellCatalystModifier['spellFilter'] | undefined {
    switch (itemId) {
      case 'item_firecracker_sugar':
        return 'fireball';
      case 'item_frosting_salt':
        return 'frost-lock';
      case 'item_bomb_fuse':
        return 'bomb-rune';
      case 'item_cleaning_charm':
        return 'void-cut';
      default:
        return undefined;
    }
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

  private queueHazard(state: RunState, kind: ActiveHazardState['kind'], options: {
    amount?: number;
    sourceId?: string;
    blockId?: string;
    remainingPieces?: number;
    name?: string;
    warningText?: string;
  }): void {
    const existing = state.activeHazards.find((hazard) => hazard.kind === kind);
    if (existing) {
      existing.amount = Math.min(12, (existing.amount ?? 0) + (options.amount ?? 0));
      existing.remainingPieces = Math.max(existing.remainingPieces, options.remainingPieces ?? existing.remainingPieces);
      return;
    }
    const templates: Record<ActiveHazardState['kind'], Pick<ActiveHazardState, 'hazardId' | 'name' | 'warningText' | 'counterTags' | 'counterWindowPieces' | 'severity' | 'defaultFailureEffect' | 'itemCounterHints' | 'spellCounterHints' | 'cascadeCounterHint'>> = {
      incoming_junk: {
        hazardId: 'hazard_incoming_junk_queue',
        name: options.name ?? 'Incoming Junk',
        warningText: options.warningText ?? 'Crumb junk is lining up in the snack tray!',
        counterTags: ['counter_incoming_junk', 'counter_junk'],
        counterWindowPieces: options.remainingPieces ?? 3,
        severity: 'moderate',
        defaultFailureEffect: 'Remaining junk drops onto random columns.',
        itemCounterHints: ['Snack Shield', 'Return Stamp', 'Trash Lid'],
        spellCounterHints: ['Bomb Rune', 'Clean Cut'],
        cascadeCounterHint: 'Trigger a cascade to reduce incoming junk.'
      },
      floating_block: {
        hazardId: 'hazard_floaty_rune',
        name: 'Floaty Rune',
        warningText: 'A Floaty Rune is wobbling overhead!',
        counterTags: ['counter_float'],
        counterWindowPieces: options.remainingPieces ?? 3,
        severity: 'minor',
        defaultFailureEffect: 'Drops as cloud junk.',
        itemCounterHints: ['Cloud Pin', 'Balloon Pop'],
        spellCounterHints: ['Bomb Rune']
      },
      freeze: {
        hazardId: 'hazard_freeze_warning',
        name: 'Freeze Warning',
        warningText: 'Frost is gathering around your active block!',
        counterTags: ['counter_freeze'],
        counterWindowPieces: options.remainingPieces ?? 2,
        severity: 'moderate',
        defaultFailureEffect: 'Fall speed nudges upward.',
        itemCounterHints: ['Hot Cocoa'],
        spellCounterHints: ['Frost Lock']
      },
      preview: {
        hazardId: 'hazard_preview_hidden',
        name: 'Preview Glitter',
        warningText: 'A Sugar Bat is blocking your preview!',
        counterTags: ['counter_preview'],
        counterWindowPieces: options.remainingPieces ?? 3,
        severity: 'minor',
        defaultFailureEffect: 'Preview hidden briefly.',
        itemCounterHints: ['Preview Glasses'],
        spellCounterHints: []
      },
      low_ceiling: {
        hazardId: 'hazard_low_ceiling',
        name: 'Low Ceiling',
        warningText: 'The ceiling is getting suspiciously lower!',
        counterTags: ['counter_low_ceiling', 'counter_board_size'],
        counterWindowPieces: options.remainingPieces ?? 6,
        severity: 'major',
        defaultFailureEffect: 'Top row pressure.',
        itemCounterHints: ['Tent Pole', 'Safety Net'],
        spellCounterHints: ['Clean Cut']
      },
      bad_piece: {
        hazardId: 'hazard_bad_piece_delivery',
        name: 'Weird Delivery',
        warningText: 'A goblin put something weird in the queue!',
        counterTags: ['counter_piece_queue'],
        counterWindowPieces: options.remainingPieces ?? 2,
        severity: 'minor',
        defaultFailureEffect: 'Awkward piece enters Next.',
        itemCounterHints: ['Nope Stamp', 'Queue Comb'],
        spellCounterHints: []
      },
      sleep: {
        hazardId: 'hazard_sleep_warning',
        name: 'Sleepy Tune',
        warningText: 'A pillow-soft tune is trying to make the room drowsy!',
        counterTags: ['counter_sleep'],
        counterWindowPieces: options.remainingPieces ?? 3,
        severity: 'moderate',
        defaultFailureEffect: 'The next enemy beat gets sluggish and awkward.',
        itemCounterHints: ['Alarm Cookie'],
        spellCounterHints: []
      },
      speed_wave: {
        hazardId: 'hazard_speed_wave',
        name: 'Speed Wave',
        warningText: 'The floor is wobbling faster!',
        counterTags: ['counter_speed'],
        counterWindowPieces: options.remainingPieces ?? 4,
        severity: 'moderate',
        defaultFailureEffect: 'Fall speed rises slightly.',
        itemCounterHints: ['Speed Brake'],
        spellCounterHints: ['Frost Lock']
      },
      royal_pattern: {
        hazardId: 'hazard_royal_pattern',
        name: 'Royal Pattern',
        warningText: 'Bloxley demands a proper rectangle!',
        counterTags: ['counter_royal', 'counter_pattern'],
        counterWindowPieces: options.remainingPieces ?? 3,
        severity: 'boss',
        defaultFailureEffect: 'Royal blocks appear.',
        itemCounterHints: ['Royal Eraser'],
        spellCounterHints: ['Bomb Rune', 'Clean Cut']
      }
    };
    const template = templates[kind];
    state.activeHazards.push({
      ...template,
      instanceId: `${template.hazardId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      kind,
      remainingPieces: options.remainingPieces ?? template.counterWindowPieces,
      amount: options.amount,
      sourceId: options.sourceId,
      blockId: options.blockId
    });
  }
}
