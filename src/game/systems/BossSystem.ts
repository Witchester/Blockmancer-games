import type { EnemyInstance, RunState } from '../types/GameTypes';
import { MAX_EVENT_LOG } from '../utils/constants';
import { RewardSystem } from './RewardSystem';

type BossConfig = {
  intro: string;
  phase2: string;
  phase2Behaviors: string[];
  rewardGold: number;
  rewardChoices: number;
};

const DEFAULT_BOSS_CONFIG: BossConfig = {
  intro: 'A festival boss stomps onto the board with extra sparkle.',
  phase2: 'Phase 2 begins! The boss changes its routine.',
  phase2Behaviors: ['basic_attack', 'spawn_junk'],
  rewardGold: 60,
  rewardChoices: 4
};

const BOSS_CONFIGS: Record<string, BossConfig> = {
  mon_boss_cupcake_slime_king: {
    intro: 'Cupcake Slime King jiggles in wearing a frosting crown.',
    phase2: 'Cupcake Slime King spreads sticky frosting across the hold box.',
    phase2Behaviors: ['spawn_junk', 'hide_hold_block', 'basic_attack'],
    rewardGold: 55,
    rewardChoices: 4
  },
  mon_boss_prototype_no_7: {
    intro: 'Prototype No. 7 clanks in, proudly held together by festival tape.',
    phase2: 'Prototype No. 7 overclocks and starts stamping patterned junk.',
    phase2Behaviors: ['shake_board', 'pattern_junk', 'spawn_junk'],
    rewardGold: 65,
    rewardChoices: 4
  },
  mon_boss_gelato_golem: {
    intro: 'Gelato Golem rolls in, chilly and very proud of its scoops.',
    phase2: 'Gelato Golem opens the freezer door wider.',
    phase2Behaviors: ['freeze_piece', 'hide_next_block', 'mana_zap'],
    rewardGold: 70,
    rewardChoices: 4
  },
  mon_boss_sir_snore_a_lot: {
    intro: 'Sir Snore-a-Lot arrives half asleep but fully armored in pillows.',
    phase2: 'Sir Snore-a-Lot curls up behind a sleepy shield.',
    phase2Behaviors: ['armor_up', 'sleep_player', 'shield_self'],
    rewardGold: 75,
    rewardChoices: 4
  },
  mon_boss_high_score_hydra: {
    intro: 'High Score Hydra lights up the arcade cabinet and counts your combos.',
    phase2: 'High Score Hydra starts a bonus round and dares you to keep Fever running.',
    phase2Behaviors: ['hydra_combo_check', 'increase_fall_speed', 'reverse_controls', 'mana_zap'],
    rewardGold: 85,
    rewardChoices: 5
  },
  mon_boss_king_bloxley: {
    intro: 'King Bloxley stacks a royal throne and declares himself block champion.',
    phase2: 'King Bloxley calls for royal blocks and a very silly finale.',
    phase2Behaviors: ['royal_block_spawn', 'swap_next_hold', 'pattern_junk', 'shield_self'],
    rewardGold: 120,
    rewardChoices: 5
  }
};

export class BossSystem {
  isBoss(enemy: EnemyInstance | null): enemy is EnemyInstance {
    return enemy?.roomType === 'boss';
  }

  getIntro(enemy: EnemyInstance): string {
    return this.getConfig(enemy.id).intro;
  }

  shouldEnterPhaseTwo(enemy: EnemyInstance): boolean {
    return this.isBoss(enemy) && !enemy.phase2Triggered && enemy.currentHp > 0 && enemy.currentHp <= enemy.maxHp * 0.5;
  }

  enterPhaseTwo(enemy: EnemyInstance): string {
    const config = this.getConfig(enemy.id);
    enemy.phase = 2;
    enemy.phase2Triggered = true;
    enemy.behaviors = [...config.phase2Behaviors];
    enemy.behavior = enemy.behaviors[0] ?? enemy.behavior;
    enemy.behaviorIndex = 0;
    enemy.shield += 8;
    enemy.attackCounter = Math.max(1, Math.min(enemy.attackCounter, enemy.attackIntervalLocks - 1));
    return config.phase2;
  }

  grantBossRewards(state: RunState, rewardSystem: RewardSystem): string[] {
    const enemy = state.activeEnemy;
    const config = enemy ? this.getConfig(enemy.id) : DEFAULT_BOSS_CONFIG;
    state.player.gold += config.rewardGold;
    state.player.totalGoldCollected += config.rewardGold;
    state.gold = state.player.gold;
    state.pendingRewardSource = 'boss';
    state.pendingRewards = rewardSystem.getRandomRewards(config.rewardChoices, state, 'boss');

    const messages = [
      `Boss bonus: ${config.rewardGold} gold spills from the Block-O-Matic.`,
      `Choose from ${state.pendingRewards.length} boss rewards.`
    ];
    for (const message of messages) {
      state.eventLog.unshift(message);
    }
    state.eventLog = state.eventLog.slice(0, MAX_EVENT_LOG);
    return messages;
  }

  private getConfig(enemyId: string): BossConfig {
    return BOSS_CONFIGS[enemyId] ?? DEFAULT_BOSS_CONFIG;
  }
}
