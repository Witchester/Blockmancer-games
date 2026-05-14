import type { RewardId, RunState } from '../types/GameTypes';
import { clamp } from '../utils/math';

export class RelicSystem {
  applyRelic(state: RunState, rewardId: RewardId): string {
    switch (rewardId) {
      case 'goblin-coin':
      case 'rel_goblin_coin':
        state.player.gold += 25;
        state.player.totalGoldCollected += 25;
        state.gold = state.player.gold;
        return 'Goblin Coin grants 25 gold and improves future payouts.';
      case 'broken-hourglass':
      case 'rel_broken_hourglass':
        return 'Broken Hourglass will slow the board when your HP drops low.';
      case 'slime-core':
      case 'rel_slime_core':
        return 'Slime Core restores mana whenever you are hit.';
      case 'arcane-preview':
      case 'rel_arcane_lens':
        state.player.extraPreview = true;
        return 'Arcane Lens reveals an extra future piece.';
      case 'stonebreaker':
      case 'rel_stone_heart':
        state.player.stonebreaker = true;
        state.player.maxHp += 4;
        state.player.hp = clamp(state.player.hp + 4, 0, state.player.maxHp);
        return 'Stone Heart raises max HP by 4 and steadies armored fights.';
      case 'emergency-barrier':
      case 'rel_cracked_crown':
        state.player.emergencyBarrier = true;
        state.player.emergencyBarrierUsed = false;
        return 'Emergency Barrier prevents one lethal hit each battle.';
      case 'rel_arcade_token':
        state.rewardRerolls += 1;
        return 'Arcade Token adds 1 reward reroll for the prize counter.';
      case 'rel_bomb_charm':
        state.player.spellBonuses['bomb-rune'] += 8;
        return 'Bomb Charm raises Bomb Rune damage by 8.';
      case 'rel_cupcake_wrapper':
        state.player.maxHp += 3;
        state.player.hp = clamp(state.player.hp + 3, 0, state.player.maxHp);
        return 'Cupcake Wrapper adds 3 max HP.';
      case 'rel_dragon_tooth':
        state.player.spellBonuses.fireball += 10;
        return 'Dragon Tooth raises fire spell damage by 10.';
      case 'rel_frozen_dice':
        state.rewardRerolls += 1;
        return 'Frozen Dice adds 1 reward reroll.';
      case 'rel_royal_napkin':
        state.player.shield += 6;
        return 'Royal Napkin starts you with 6 extra shield right now.';
      case 'rel_sprinkle_spoon':
        state.player.lineDamageBonus += 1;
        return 'Sprinkle Spoon raises line damage by 1.';
      case 'rel_star_sticker':
        state.player.fever = clamp(state.player.fever + 20, 0, 100);
        return 'Star Sticker fills 20 fever.';
      case 'rel_void_eye':
        state.player.voidCutRefund = true;
        return 'Void Eye lets Void Cut refund mana on large clears.';
      default:
        return 'The relic hums, but nothing obvious happens.';
    }
  }

  applyOnDamageTaken(state: RunState): string[] {
    const messages: string[] = [];

    if (state.relics.includes('slime-core') || state.relics.includes('rel_slime_core')) {
      state.player.mana = clamp(state.player.mana + 15, 0, state.player.maxMana);
      messages.push('Slime Core restores 15 mana when you are struck.');
    }

    if ((state.relics.includes('broken-hourglass') || state.relics.includes('rel_broken_hourglass')) && state.player.hp > 0 && state.player.hp <= 10) {
      const previousFallSpeed = state.fallSpeed;
      state.fallSpeed = Math.max(0.7, state.fallSpeed - 0.05);
      if (state.fallSpeed < previousFallSpeed) {
        messages.push('Broken Hourglass slows the board as your life hangs low.');
      }
    }

    return messages;
  }

  applyPostBattleEffects(state: RunState): string[] {
    const messages: string[] = [];

    if (state.relics.includes('goblin-coin') || state.relics.includes('rel_goblin_coin')) {
      state.player.gold += 10;
      state.player.totalGoldCollected += 10;
      state.gold = state.player.gold;
      messages.push('Goblin Coin produces 10 bonus gold after the battle.');
    }

    return messages;
  }
}
