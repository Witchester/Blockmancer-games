import type { EnemyInstance, RunState } from '../types/GameTypes';
import { MAX_EVENT_LOG } from '../utils/constants';
import { RewardSystem } from './RewardSystem';
import type { BoardSystem } from './BoardSystem';

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
    enemy.shield += 6;
    enemy.attackCounter = Math.max(1, Math.min(enemy.attackCounter, enemy.attackIntervalLocks - 1));
    return config.phase2;
  }

  applyBossStartMechanic(state: RunState, board: BoardSystem): string[] {
    const enemy = state.activeEnemy;
    if (!this.isBoss(enemy)) {
      return [];
    }

    switch (enemy.id) {
      case 'mon_boss_cupcake_slime_king': {
        const sticky = board.addStickyBlocks(3);
        const sprinkles = board.addSpecialBlocksForSpell('block_sprinkle', 2);
        return [`Cupcake Slime King splats ${sticky} sticky blocks and ${sprinkles} sprinkle blocks onto the board.`];
      }
      case 'mon_boss_prototype_no_7': {
        board.addJunkRows(1);
        const bombs = board.addSpecialBlocksForSpell('block_bomb', 2);
        return [`Prototype No. 7 drops a warning junk row and ${bombs} toy bomb blocks.`];
      }
      case 'mon_boss_gelato_golem': {
        const ice = board.addSpecialBlocksForSpell('block_ice', 4);
        state.fallSpeed = Math.max(0.7, state.fallSpeed - 0.06);
        return [`Gelato Golem chills ${ice} blocks and slows the opening wave.`];
      }
      case 'mon_boss_sir_snore_a_lot': {
        enemy.shield += 8;
        const soft = board.addSpecialBlocksForSpell('block_jelly', 2);
        return [`Sir Snore-a-Lot starts behind 8 shield and ${soft} soft pillow blocks.`];
      }
      case 'mon_boss_high_score_hydra':
        state.player.fever = Math.max(state.player.fever, 20);
        return ['High Score Hydra starts a combo challenge with 20 Fever already lit.'];
      case 'mon_boss_king_bloxley': {
        const royal = board.addRoyalBlocks(4);
        return [`King Bloxley opens with ${royal} royal blocks and a symmetry inspection.`];
      }
      default:
        return ['This boss has a safe placeholder mechanic for Release 1.'];
    }
  }

  applyPhaseTwoBoardMechanic(state: RunState, board: BoardSystem): string | null {
    const enemy = state.activeEnemy;
    if (!this.isBoss(enemy)) {
      return null;
    }
    switch (enemy.id) {
      case 'mon_boss_cupcake_slime_king':
        board.addStickyBlocks(3);
        return 'Phase 2: sticky frosting pressure increases.';
      case 'mon_boss_prototype_no_7':
        board.addSpecialBlocksForSpell('block_bomb', 3);
        return 'Phase 2: extra toy bombs roll out of the machine.';
      case 'mon_boss_gelato_golem':
        board.addSpecialBlocksForSpell('block_ice', 3);
        state.fallSpeed = Math.min(1.85, state.fallSpeed + 0.1);
        return 'Phase 2: a freeze wave snaps into a faster thaw.';
      case 'mon_boss_sir_snore_a_lot':
        enemy.shield += 10;
        enemy.sleepTurns += 1;
        return 'Phase 2: Sleepy shield waltz begins.';
      case 'mon_boss_high_score_hydra':
        state.player.fever = Math.max(state.player.fever, 50);
        return 'Phase 2: bonus round starts with Fever halfway charged.';
      case 'mon_boss_king_bloxley':
        board.addRoyalBlocks(5);
        return 'Phase 2: Bloxley demands square royal blocks.';
      default:
        return null;
    }
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
