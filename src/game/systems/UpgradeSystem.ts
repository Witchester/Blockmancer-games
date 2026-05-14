import type { RewardId, RunState, SpellId } from '../types/GameTypes';

export class UpgradeSystem {
  applyUpgrade(state: RunState, rewardId: RewardId): string {
    const player = state.player;

    switch (rewardId) {
      case 'sharp-edges':
      case 'upg_line_sharp_edges':
        player.lineDamageBonus += 2;
        return 'Sharp Edges raises line damage by 2.';
      case 'mana-echo':
      case 'upg_mana_echo':
        player.spellCostReduction += 5;
        return 'Mana Echo reduces spell costs by 5.';
      case 'stable-hands':
      case 'upg_board_stable_hands':
        state.fallSpeed = Math.max(0.7, state.fallSpeed - 0.05);
        return 'Stable Hands reduces fall speed by 0.05.';
      case 'fire-mastery':
      case 'upg_spell_fire_mastery':
        player.spellBonuses.fireball += 10;
        return 'Fire Mastery empowers Fireball by 10 damage.';
      case 'bomb-expert':
      case 'upg_bomb_expert':
        player.spellBonuses['bomb-rune'] += 10;
        return 'Bomb Expert empowers Bomb Rune by 10 damage.';
      case 'combo-heart':
      case 'upg_combo_heart':
        player.comboHeart = true;
        return 'Combo Heart heals on strong combos.';
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
