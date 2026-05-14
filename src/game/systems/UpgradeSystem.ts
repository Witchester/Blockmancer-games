import type { RewardId, RunState, SpellId } from '../types/GameTypes';

export class UpgradeSystem {
  applyUpgrade(state: RunState, rewardId: RewardId, level = 1): string {
    const player = state.player;

    switch (rewardId) {
      case 'upg_line_sharp_edges':
        player.lineDamageBonus += 2;
        return `Sharp Edges reaches level ${level}: line damage +2.`;
      case 'upg_mana_echo':
        player.spellCostReduction += 5;
        return `Mana Echo reaches level ${level}: spell costs -5.`;
      case 'upg_board_stable_hands':
        state.fallSpeed = Math.max(0.7, state.fallSpeed - 0.05);
        return `Stable Hands reaches level ${level}: fall speed -0.05.`;
      case 'upg_spell_fire_mastery':
        player.spellBonuses.fireball += 10;
        return `Fire Mastery reaches level ${level}: Fireball damage +10.`;
      case 'upg_bomb_expert':
        player.spellBonuses['bomb-rune'] += 10;
        return `Bomb Expert reaches level ${level}: Bomb Rune damage +10.`;
      case 'upg_combo_heart':
        player.comboHeart = true;
        return 'Combo Heart heals on strong combos.';
      case 'upg_arcane_preview':
        player.extraPreview = true;
        return 'Arcane Preview reveals an extra future piece.';
      case 'upg_stonebreaker':
        player.stonebreaker = true;
        return 'Stonebreaker helps crack armored and stone-like foes.';
      case 'upg_emergency_barrier':
        player.emergencyBarrier = true;
        player.emergencyBarrierUsed = false;
        return 'Emergency Barrier prevents one lethal hit each battle.';
      case 'upg_cascade_choir':
        player.lineDamageBonus += 1;
        player.fever = Math.min(100, player.fever + 10);
        return `Cascade Choir reaches level ${level}: cascades start singing louder.`;
      case 'upg_fever_fizz':
        player.fever = Math.min(100, player.fever + 15);
        return `Fever Fizz reaches level ${level}: fever meter +15.`;
      case 'upg_gold_sense':
        state.rewardRerolls += 1;
        return `Gold Sense reaches level ${level}: gain 1 reward reroll.`;
      case 'upg_heavy_drop':
        player.lineDamageBonus += 1;
        return `Heavy Drop reaches level ${level}: line damage +1.`;
      case 'upg_snack_pockets':
        player.inventoryCapacity += 1;
        return `Snack Pockets reaches level ${level}: inventory capacity +1.`;
      case 'upg_spell_focus':
        player.spellBonuses.fireball += 5;
        player.spellBonuses['bomb-rune'] += 5;
        player.spellBonuses['void-cut'] += 5;
        return `Spell Focus reaches level ${level}: spell damage +5.`;
      default:
        return 'The upgrade settles in, but nothing obvious changes.';
    }
  }

  applySpellUpgrade(state: RunState, spellId: SpellId): string {
    switch (spellId) {
      case 'fireball':
        state.player.spellBonuses.fireball += 10;
        return 'The anvil empowers Fireball by 10 damage.';
      case 'frost-lock':
        state.player.frostLockDelayBonus = true;
        return 'Frost Lock will now delay the enemy attack counter.';
      case 'bomb-rune':
        state.player.spellBonuses['bomb-rune'] += 10;
        return 'Bomb Rune damage increases by 10.';
      case 'void-cut':
        state.player.voidCutRefund = true;
        return 'Void Cut can now refund mana on large clears.';
      default:
        return 'Arcane sparks fade without effect.';
    }
  }
}
