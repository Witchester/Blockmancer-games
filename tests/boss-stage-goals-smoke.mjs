/**
 * Boss Mechanics and Stage Goals Smoke Test
 * 
 * Deterministic smoke tests for Epic 2 Story 2.5 (Boss Mechanics)
 * and Epic 2 Story 2.2 (Stage Goals)
 * 
 * Run with: npm test -- tests/boss-stage-goals-smoke.mjs
 * Or: node tests/boss-stage-goals-smoke.mjs
 */

import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();

// Read source files as text for validation
function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function test(name, fn) {
  try {
    fn();
    results.passed++;
    results.tests.push({ name, status: 'PASS' });
    console.log(`✅ ${name}`);
  } catch (error) {
    results.failed++;
    results.tests.push({ name, status: 'FAIL', error: error.message });
    console.error(`❌ ${name}: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

console.log('🎮 Boss Mechanics & Stage Goals Smoke Test\n');
console.log('=' .repeat(60));

// ============================================
// BOSS MECHANICS TESTS (Story 2.5)
// ============================================

console.log('\n📋 Boss Mechanics Tests (Epic 2 Story 2.5)\n');

// Test 1: BossSystem.ts exists and has all 6 boss configs
test('BossSystem.ts contains all 6 boss configurations', () => {
  const bossSystemText = readText('src/game/systems/BossSystem.ts');
  
  const requiredBossIds = [
    'mon_boss_cupcake_slime_king',
    'mon_boss_prototype_no_7',
    'mon_boss_gelato_golem',
    'mon_boss_sir_snore_a_lot',
    'mon_boss_high_score_hydra',
    'mon_boss_king_bloxley'
  ];
  
  for (const bossId of requiredBossIds) {
    assert(
      bossSystemText.includes(bossId),
      `BossSystem.ts missing configuration for ${bossId}`
    );
  }
});

// Test 2: All bosses have unique intro text
test('All 6 bosses have unique intro text in BossSystem', () => {
  const bossSystemText = readText('src/game/systems/BossSystem.ts');
  
  const introPattern = /intro:\s*'([^']+)'/g;
  const intros = [];
  let match;
  
  while ((match = introPattern.exec(bossSystemText)) !== null) {
    intros.push(match[1]);
  }
  
  const uniqueIntros = new Set(intros);
  assert(uniqueIntros.size >= 6, `Expected at least 6 unique intros, got ${uniqueIntros.size}`);
});

// Test 3: Phase 2 logic exists
test('BossSystem implements phase 2 trigger at 50% HP', () => {
  const bossSystemText = readText('src/game/systems/BossSystem.ts');
  
  assert(
    bossSystemText.includes('shouldEnterPhaseTwo'),
    'BossSystem missing shouldEnterPhaseTwo method'
  );
  assert(
    bossSystemText.includes('enemy.currentHp > 0 && enemy.currentHp <= enemy.maxHp * 0.5'),
    'BossSystem should trigger phase 2 at 50% HP threshold'
  );
});

// Test 4: Phase 2 behaviors are configured
test('All bosses have distinct phase 2 behavior arrays', () => {
  const bossSystemText = readText('src/game/systems/BossSystem.ts');
  
  const phase2Pattern = /phase2Behaviors:\s*\[([^\]]+)\]/g;
  const behaviorArrays = [];
  let match;
  
  while ((match = phase2Pattern.exec(bossSystemText)) !== null) {
    behaviorArrays.push(match[1]);
  }
  
  assert(behaviorArrays.length >= 6, `Expected at least 6 phase2Behaviors arrays, got ${behaviorArrays.length}`);
  
  // Verify they're distinct
  const uniqueBehaviors = new Set(behaviorArrays);
  assert(uniqueBehaviors.size === behaviorArrays.length, 'Phase 2 behavior arrays should be distinct per boss');
});

// Test 5: Boss start mechanics exist
test('BossSystem.applyBossStartMechanic handles all 6 bosses', () => {
  const bossSystemText = readText('src/game/systems/BossSystem.ts');
  
  assert(
    bossSystemText.includes('applyBossStartMechanic'),
    'BossSystem missing applyBossStartMechanic method'
  );
  
  // Check for boss-specific mechanics
  const mechanicChecks = [
    ['addStickyBlocks', 'Cupcake Slime King sticky blocks'],
    ['addSpecialBlocksForSpell', 'Special blocks for multiple bosses'],
    ['addJunkRows', 'Prototype No. 7 junk rows'],
    ['state.fallSpeed', 'Gelato Golem speed manipulation'],
    ['enemy.shield +=', 'Sir Snore-a-Lot shield'],
    ['state.player.fever', 'High Score Hydra fever'],
    ['addRoyalBlocks', 'King Bloxley royal blocks']
  ];
  
  for (const [pattern, description] of mechanicChecks) {
    assert(
      bossSystemText.includes(pattern),
      `BossSystem missing ${description} mechanic (${pattern})`
    );
  }
});

// Test 6: Phase 2 board mechanics exist
test('BossSystem.applyPhaseTwoBoardMechanic handles all 6 bosses', () => {
  const bossSystemText = readText('src/game/systems/BossSystem.ts');
  
  assert(
    bossSystemText.includes('applyPhaseTwoBoardMechanic'),
    'BossSystem missing applyPhaseTwoBoardMechanic method'
  );
  
  // Verify switch cases for all bosses in phase 2
  const bossIds = [
    'mon_boss_cupcake_slime_king',
    'mon_boss_prototype_no_7',
    'mon_boss_gelato_golem',
    'mon_boss_sir_snore_a_lot',
    'mon_boss_high_score_hydra',
    'mon_boss_king_bloxley'
  ];
  
  const phase2Section = bossSystemText.substring(
    bossSystemText.indexOf('applyPhaseTwoBoardMechanic')
  );
  
  for (const bossId of bossIds) {
    assert(
      phase2Section.includes(bossId),
      `Phase 2 mechanic missing case for ${bossId}`
    );
  }
});

// Test 7: Boss rewards scale appropriately
test('Boss reward gold scales from 55 to 120', () => {
  const bossSystemText = readText('src/game/systems/BossSystem.ts');
  
  const goldPattern = /rewardGold:\s*(\d+)/g;
  const goldValues = [];
  let match;
  
  while ((match = goldPattern.exec(bossSystemText)) !== null) {
    goldValues.push(parseInt(match[1], 10));
  }
  
  assert(goldValues.length >= 6, `Expected at least 6 rewardGold values, got ${goldValues.length}`);
  
  const minGold = Math.min(...goldValues);
  const maxGold = Math.max(...goldValues);
  
  assert(minGold >= 55, `Minimum gold should be >= 55, got ${minGold}`);
  assert(maxGold <= 120, `Maximum gold should be <= 120, got ${maxGold}`);
  assert(maxGold > minGold, 'Gold values should vary across bosses');
});

test('Boss reward choices scale from 4 to 5', () => {
  const bossSystemText = readText('src/game/systems/BossSystem.ts');
  
  const choicesPattern = /rewardChoices:\s*(\d+)/g;
  const choiceValues = [];
  let match;
  
  while ((match = choicesPattern.exec(bossSystemText)) !== null) {
    choiceValues.push(parseInt(match[1], 10));
  }
  
  assert(choiceValues.length >= 6, `Expected at least 6 rewardChoices values, got ${choiceValues.length}`);
  
  for (const value of choiceValues) {
    assert(value >= 4 && value <= 5, `Reward choices should be 4 or 5, got ${value}`);
  }
});

// ============================================
// STAGE GOALS TESTS (Story 2.2)
// ============================================

console.log('\n📋 Stage Goals Tests (Epic 2 Story 2.2)\n');

// Test 8: StageGoalSystem.ts exists and is complete
test('StageGoalSystem.ts contains all required methods', () => {
  const stageGoalText = readText('src/game/systems/StageGoalSystem.ts');
  
  const requiredMethods = [
    'getGoalForStage',
    'ensureGoal',
    'addProgress',
    'recordCascadeProgress',
    'recordBattleVictoryProgress',
    'getProgress',
    'applyBossStartEffect'
  ];
  
  for (const method of requiredMethods) {
    assert(
      stageGoalText.includes(method),
      `StageGoalSystem missing ${method} method`
    );
  }
});

// Test 9: All 6 stage goals are defined in content
test('All 6 stage goal JSON files exist', () => {
  const stageGoalFiles = [
    'src/game/content/stage-goals/stage1-lost-cupcakes.json',
    'src/game/content/stage-goals/stage2-machines.json',
    'src/game/content/stage-goals/stage3-crates.json',
    'src/game/content/stage-goals/stage4-guards.json',
    'src/game/content/stage-goals/stage5-combo.json',
    'src/game/content/stage-goals/stage6-royal-seals.json'
  ];
  
  for (const file of stageGoalFiles) {
    assert(
      fs.existsSync(path.join(repoRoot, file)),
      `Missing stage goal file: ${file}`
    );
  }
});

// Test 10: Stage goals have distinct IDs and stages
test('Stage goals have unique IDs mapped to stages 1-6', () => {
  const stageGoalText = readText('src/game/systems/StageGoalSystem.ts');
  
  const goalIds = [
    'goal_stage1_lost_cupcakes',
    'goal_stage2_goblin_machines',
    'goal_stage3_ice_cream_crates',
    'goal_stage4_sleeping_guards',
    'goal_stage5_combo_score',
    'goal_stage6_royal_seals'
  ];
  
  for (const goalId of goalIds) {
    assert(
      stageGoalText.includes(goalId),
      `StageGoalSystem missing reference to ${goalId}`
    );
  }
});

// Test 11: Cascade progress tracking implemented
test('StageGoalSystem.recordCascadeProgress tracks special blocks', () => {
  const stageGoalText = readText('src/game/systems/StageGoalSystem.ts');
  
  assert(
    stageGoalText.includes('cascade.specialBlocksTriggered'),
    'StageGoalSystem should check cascade.specialBlocksTriggered'
  );
  assert(
    stageGoalText.includes('block_cupcake'),
    'Stage 1 goal should track cupcake blocks'
  );
  assert(
    stageGoalText.includes('block_royal'),
    'Stage 6 goal should track royal blocks'
  );
  assert(
    stageGoalText.includes('cascade.cascadeCount'),
    'Stage 5 goal should track cascade count'
  );
});

// Test 12: Battle victory progress tracking implemented
test('StageGoalSystem.recordBattleVictoryProgress tracks objectives', () => {
  const stageGoalText = readText('src/game/systems/StageGoalSystem.ts');
  
  assert(
    stageGoalText.includes('objectiveSucceeded'),
    'StageGoalSystem should check objectiveSucceeded context'
  );
  assert(
    stageGoalText.includes('enemySleepTurns'),
    'Stage 4 goal should check enemy sleep turns'
  );
});

// Test 13: Boss consequences implemented
test('StageGoalSystem.applyBossStartEffect applies success/fail effects', () => {
  const stageGoalText = readText('src/game/systems/StageGoalSystem.ts');
  
  // Check success effects (bossDebuff)
  const successEffects = [
    'fewer_sticky_blocks',
    'less_junk',
    'start_shield',
    'start_fever',
    'rare_treasure',
    'weaken_boss'
  ];
  
  for (const effect of successEffects) {
    assert(
      stageGoalText.includes(effect),
      `StageGoalSystem missing success effect: ${effect}`
    );
  }
  
  // Check failure effects (bossBuffOnFail)
  const failureEffects = [
    'extra_sticky',
    'overclocked',
    'speed_spike',
    'extra_royal_blocks',
    'hydra_combo_punishment',
    'sleepier_boss'
  ];
  
  for (const effect of failureEffects) {
    assert(
      stageGoalText.includes(effect),
      `StageGoalSystem missing failure effect: ${effect}`
    );
  }
});

// Test 14: Failure effects add hazards when appropriate
test('Stage goal failures can add active hazards', () => {
  const stageGoalText = readText('src/game/systems/StageGoalSystem.ts');
  
  assert(
    stageGoalText.includes('state.activeHazards.push'),
    'StageGoalSystem should push hazards on goal failure'
  );
  assert(
    stageGoalText.includes('hazard_incoming_junk_queue'),
    'Stage 1 failure should add incoming junk hazard'
  );
  assert(
    stageGoalText.includes('hazard_royal_pattern'),
    'Stage 4 failure should add royal pattern hazard'
  );
});

// Test 15: Goal state prevents double progress
test('StageGoalSystem prevents progress after completion/failure', () => {
  const stageGoalText = readText('src/game/systems/StageGoalSystem.ts');
  
  assert(
    stageGoalText.includes('progress.completed || progress.failed'),
    'StageGoalSystem should check completed/failed status before adding progress'
  );
});

// ============================================
// INTEGRATION TESTS
// ============================================

console.log('\n📋 Integration Tests\n');

test('BossSystem and StageGoalSystem integrate via applyBossStartEffect', () => {
  const bossSystemText = readText('src/game/systems/BossSystem.ts');
  const stageGoalText = readText('src/game/systems/StageGoalSystem.ts');
  
  // StageGoalSystem should be called during boss setup
  assert(
    stageGoalText.includes('applyBossStartEffect'),
    'StageGoalSystem should have applyBossStartEffect method'
  );
  
  // The effect should modify enemy state
  assert(
    stageGoalText.includes('enemy.attackIntervalLocks') ||
    stageGoalText.includes('enemy.currentHp') ||
    stageGoalText.includes('enemy.shield'),
    'Boss debuffs/buffs should modify enemy state'
  );
});

test('Content registry loads stage goals', () => {
  const contentRegistryText = readText('src/game/systems/ContentRegistry.ts');
  
  assert(
    contentRegistryText.includes('stageGoal'),
    'ContentRegistry should register stageGoal category'
  );
});

// ============================================
// SUMMARY
// ============================================

console.log('\n' + '='.repeat(60));
console.log('\n📊 Test Summary\n');
console.log(`Total Tests: ${results.passed + results.failed}`);
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

if (results.failed > 0) {
  console.log('\n❌ Failed Tests:');
  results.tests
    .filter(t => t.status === 'FAIL')
    .forEach(t => console.log(`  - ${t.name}: ${t.error}`));
  console.log('\n⚠️  Note: These are static code analysis tests. Manual playthrough still required.');
  process.exit(1);
} else {
  console.log('\n🎉 All static analysis tests passed!');
  console.log('⚠️  Manual playthrough still required for visual verification.\n');
  process.exit(0);
}
