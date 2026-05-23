import type { RewardId, RunState, SpellId } from '../types/GameTypes';

export const SUPPORTED_UPGRADE_EFFECT_IDS = [
  'upg_line_sharp_edges',
  'upg_mana_echo',
  'upg_board_stable_hands',
  'upg_spell_fire_mastery',
  'upg_bomb_expert',
  'upg_combo_heart',
  'upg_arcane_preview',
  'upg_stonebreaker',
  'upg_emergency_barrier',
  'upg_cascade_choir',
  'upg_fever_fizz',
  'upg_gold_sense',
  'upg_heavy_drop',
  'upg_snack_pockets',
  'upg_spell_focus'
];

const SUPPORTED_LEVEL_UP_EFFECT_IDS = [
  'upg_lvl_clear_line_damage',
  'upg_lvl_max_hp_percent',
  'upg_lvl_flat_hp',
  'upg_lvl_mana_gain',
  'upg_lvl_spell_damage',
  'upg_lvl_cascade_damage',
  'upg_lvl_starting_shield',
  'upg_lvl_heal_after_node',
  'upg_lvl_fever_gain',
  'upg_lvl_hazard_resist',
  'upg_lvl_entry_grace',
  'upg_lvl_reward_reroll',
  'upg_lvl_milo_plink_mana',
  'upg_lvl_milo_calm_board',
  'upg_lvl_milo_listener',
  'upg_lvl_milo_gentle_finish',
  'upg_lvl_pippa_preheat',
  'upg_lvl_pippa_burn_sticky',
  'upg_lvl_pippa_oven_guard',
  'upg_lvl_pippa_hot_combo',
  'upg_lvl_zuzu_bomb_friend',
  'upg_lvl_zuzu_safety_clamp',
  'upg_lvl_zuzu_extra_fuse',
  'upg_lvl_zuzu_gadget_retry',
  'upg_lvl_nixie_chill_timing',
  'upg_lvl_nixie_soft_thaw',
  'upg_lvl_nixie_slow_entry',
  'upg_lvl_nixie_preserve',
  'upg_lvl_bruk_snack_armor',
  'upg_lvl_bruk_table_shield',
  'upg_lvl_bruk_no_snack_lost',
  'upg_lvl_bruk_victory_plate',
  'upg_lvl_lumi_star_guidance',
  'upg_lvl_lumi_cascade_wish',
  'upg_lvl_lumi_preview_light',
  'upg_lvl_lumi_wishkeeper'
];

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
        player.spellBonuses['clean-cut'] = (player.spellBonuses['clean-cut'] ?? 0) + 5;
        return `Spell Focus reaches level ${level}: spell damage +5.`;
      default:
        console.warn(`[Blockmancer] Unsupported upgrade effect "${rewardId}" safely used as placeholder.`);
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
      case 'clean-cut':
        state.player.voidCutRefund = true;
        return 'Clean Cut can now refund mana on large clears.';
      default:
        return 'Arcane sparks fade without effect.';
    }
  }

  applyLevelUpUpgrade(state: RunState, upgradeId: RewardId): string {
    const stack = Math.max(1, state.playerLevelState.chosenUpgrades[upgradeId] ?? 1);
    const p = state.player;
    switch (upgradeId) {
      case 'upg_lvl_clear_line_damage':
        p.lineDamageBonus += 2;
        return `Line-clear damage rises (+2).`;
      case 'upg_lvl_max_hp_percent': {
        const bonusPct = Math.min(0.5, stack * 0.1);
        const baseHp = 30;
        const targetMaxHp = Math.round(baseHp * (1 + bonusPct));
        if (targetMaxHp > p.maxHp) {
          const diff = targetMaxHp - p.maxHp;
          p.maxHp = targetMaxHp;
          p.hp = Math.min(p.maxHp, p.hp + diff);
        }
        return `Max HP scales with festival spirit.`;
      }
      case 'upg_lvl_flat_hp':
        p.maxHp += 6;
        p.hp = Math.min(p.maxHp, p.hp + 6);
        return `Max HP +6.`;
      case 'upg_lvl_bruk_snack_armor':
        p.maxHp += 8;
        p.hp = Math.min(p.maxHp, p.hp + 8);
        return `Snack Armor adds +8 max HP.`;
      case 'upg_lvl_reward_reroll':
        state.playerLevelState.rerollCharges += 1;
        return `Level-up reroll charge gained.`;
      case 'upg_lvl_bruk_no_snack_lost':
      case 'upg_lvl_milo_plink_mana':
      case 'upg_lvl_milo_calm_board':
      case 'upg_lvl_milo_listener':
      case 'upg_lvl_milo_gentle_finish':
      case 'upg_lvl_mana_gain':
      case 'upg_lvl_spell_damage':
      case 'upg_lvl_cascade_damage':
      case 'upg_lvl_starting_shield':
      case 'upg_lvl_heal_after_node':
      case 'upg_lvl_fever_gain':
      case 'upg_lvl_hazard_resist':
      case 'upg_lvl_entry_grace':
      case 'upg_lvl_pippa_preheat':
      case 'upg_lvl_pippa_burn_sticky':
      case 'upg_lvl_pippa_oven_guard':
      case 'upg_lvl_pippa_hot_combo':
      case 'upg_lvl_zuzu_bomb_friend':
      case 'upg_lvl_zuzu_safety_clamp':
      case 'upg_lvl_zuzu_extra_fuse':
      case 'upg_lvl_zuzu_gadget_retry':
      case 'upg_lvl_nixie_chill_timing':
      case 'upg_lvl_nixie_soft_thaw':
      case 'upg_lvl_nixie_slow_entry':
      case 'upg_lvl_nixie_preserve':
      case 'upg_lvl_bruk_table_shield':
      case 'upg_lvl_bruk_victory_plate':
      case 'upg_lvl_lumi_star_guidance':
      case 'upg_lvl_lumi_cascade_wish':
      case 'upg_lvl_lumi_preview_light':
      case 'upg_lvl_lumi_wishkeeper':
        return `Festival upgrade applied.`;
      default:
        if (SUPPORTED_LEVEL_UP_EFFECT_IDS.includes(upgradeId)) {
          return 'Festival upgrade applied.';
        }
        console.warn(`[Blockmancer] Unsupported level-up upgrade effect "${upgradeId}".`);
        return 'That card sparkles, but no handler is wired yet.';
    }
  }

  recalculateLevelUpDerivedStats(state: RunState): void {
    const p = state.player;
    const stacks = (id: string): number => Math.max(0, state.playerLevelState.chosenUpgrades[id] ?? 0);
    const maxHpBase = 30;
    const flatHp = stacks('upg_lvl_flat_hp') * 6;
    const brukHp = stacks('upg_lvl_bruk_snack_armor') * 8;
    const hpPct = Math.min(0.5, stacks('upg_lvl_max_hp_percent') * 0.1);
    p.maxHp = Math.round((maxHpBase + flatHp + brukHp) * (1 + hpPct));
    p.hp = Math.min(p.hp, p.maxHp);
    p.lineDamageBonus = stacks('upg_lvl_clear_line_damage') * 2;
    state.playerLevelState.rerollCharges = Math.min(2, stacks('upg_lvl_reward_reroll'));
  }
}
