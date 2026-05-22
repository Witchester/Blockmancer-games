#!/usr/bin/env node

/**
 * Route Choice Resolution Smoke Tests
 * 
 * Verifies Story 3.2: Trigger Route Scenes
 * - Route scenes trigger correctly for each hero/stage combo
 * - Practical, True, and Risky choices mutate route state correctly
 * - Rewards/risks are real gameplay effects, not flavor-only text
 * - Boss callbacks apply modifiers based on route choices
 * - Route progress persists correctly
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ FAIL: ${name}`);
    console.log(`   Error: ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

console.log('🧪 Running Route Choice Resolution Smoke Tests...\n');

// Test 1: Verify all route scenes have rewardConfig with actual gameplay effects
test('All choices have rewardConfig with gameplay effects', () => {
  const routesDir = join(rootDir, 'src/game/content/story/routes');
  const sceneFiles = readdirSync(routesDir).filter(f => f.startsWith('route-scenes.') && f.endsWith('.json'));
  
  let totalChoices = 0;
  let choicesWithRealEffects = 0;
  
  sceneFiles.forEach(file => {
    const content = JSON.parse(readFileSync(join(routesDir, file), 'utf-8'));
    const scenes = content.scenes || [];
    
    scenes.forEach(scene => {
      scene.choices.forEach(choice => {
        totalChoices++;
        const reward = choice.rewardConfig;
        
        // Verify rewardConfig exists
        assert(reward, `Choice ${choice.id} missing rewardConfig`);
        
        // Verify it has a rewardType (not just text)
        assert(reward.rewardType, `Choice ${choice.id} missing rewardType`);
        
        // Verify rewardType is a valid gameplay effect
        const validTypes = ['gold', 'heal', 'mana', 'shield', 'item', 'relic', 'upgrade', 'battle_modifier', 'stage_modifier', 'boss_modifier', 'hazard_modifier'];
        assert(validTypes.includes(reward.rewardType), 
          `Choice ${choice.id} has invalid rewardType: ${reward.rewardType}`);
        
        // Verify amount or itemId is specified for quantitative rewards
        if (['gold', 'heal', 'mana', 'shield'].includes(reward.rewardType)) {
          assert(typeof reward.amount === 'number' && reward.amount > 0,
            `Choice ${choice.id} has ${reward.rewardType} reward but no amount`);
          choicesWithRealEffects++;
        } else if (reward.rewardType === 'item') {
          assert(reward.itemId, `Choice ${choice.id} has item reward but no itemId`);
          choicesWithRealEffects++;
        } else if (['relic', 'upgrade'].includes(reward.rewardType)) {
          assert(reward.relicId || reward.upgradeId, 
            `Choice ${choice.id} has ${reward.rewardType} reward but no ID`);
          choicesWithRealEffects++;
        } else if (reward.rewardType.includes('modifier')) {
          assert(reward.modifierId, `Choice ${choice.id} has modifier reward but no modifierId`);
          choicesWithRealEffects++;
        } else {
          choicesWithRealEffects++;
        }
      });
    });
  });
  
  assert(totalChoices === 108, `Expected 108 total choices (36 scenes × 3 choices), found ${totalChoices}`);
  assert(choicesWithRealEffects === 108, `Only ${choicesWithRealEffects}/${totalChoices} choices have real gameplay effects`);
  console.log(`   Verified ${choicesWithRealEffects}/${totalChoices} choices with real gameplay effects`);
});

// Test 2: Verify Risky choices have riskConfig with actual hazards
test('Risky choices have riskConfig with hazards', () => {
  const routesDir = join(rootDir, 'src/game/content/story/routes');
  const sceneFiles = readdirSync(routesDir).filter(f => f.startsWith('route-scenes.') && f.endsWith('.json'));
  
  let totalRiskyChoices = 0;
  let riskyWithRealHazards = 0;
  
  sceneFiles.forEach(file => {
    const content = JSON.parse(readFileSync(join(routesDir, file), 'utf-8'));
    const scenes = content.scenes || [];
    
    scenes.forEach(scene => {
      scene.choices.forEach(choice => {
        if (choice.lane === 'risky') {
          totalRiskyChoices++;
          
          if (choice.riskConfig) {
            const risk = choice.riskConfig;
            
            // Verify oopsieChance is specified
            assert(typeof risk.oopsieChance === 'number', 
              `Risky choice ${choice.id} missing oopsieChance`);
            
            // Verify hazardIncrease is specified
            assert(risk.hazardIncrease, 
              `Risky choice ${choice.id} missing hazardIncrease`);
            
            riskyWithRealHazards++;
          }
        }
      });
    });
  });
  
  assert(totalRiskyChoices === 36, `Expected 36 risky choices, found ${totalRiskyChoices}`);
  const percentage = (riskyWithRealHazards / totalRiskyChoices) * 100;
  assert(percentage >= 50, `Only ${percentage}% of risky choices have riskConfig (expected >= 50%)`);
  console.log(`   Found ${riskyWithRealHazards}/${totalRiskyChoices} risky choices with riskConfig (${percentage.toFixed(0)}%)`);
});

// Test 3: Verify True choices grant flags for ending conditions
test('True choices grant flags for true ending', () => {
  const routesDir = join(rootDir, 'src/game/content/story/routes');
  const sceneFiles = readdirSync(routesDir).filter(f => f.startsWith('route-scenes.') && f.endsWith('.json'));
  
  let totalTrueChoices = 0;
  let trueChoicesWithFlags = 0;
  
  sceneFiles.forEach(file => {
    const content = JSON.parse(readFileSync(join(routesDir, file), 'utf-8'));
    const scenes = content.scenes || [];
    
    scenes.forEach(scene => {
      scene.choices.forEach(choice => {
        if (choice.lane === 'true') {
          totalTrueChoices++;
          
          if (choice.grantFlag) {
            // Verify flag name follows convention
            assert(choice.grantFlag.includes('_flag_') || choice.grantFlag.startsWith('hero_'),
              `True choice ${choice.id} has non-standard flag name: ${choice.grantFlag}`);
            trueChoicesWithFlags++;
          }
        }
      });
    });
  });
  
  assert(totalTrueChoices === 36, `Expected 36 true choices, found ${totalTrueChoices}`);
  const percentage = (trueChoicesWithFlags / totalTrueChoices) * 100;
  assert(percentage >= 50, `Only ${percentage}% of true choices grant flags (expected >= 50%)`);
  console.log(`   Found ${trueChoicesWithFlags}/${totalTrueChoices} true choices with grantFlag (${percentage.toFixed(0)}%)`);
});

// Test 4: Verify bossCallback or bossCallbackByLane exists in all scenes
test('All route scenes have boss callbacks', () => {
  const routesDir = join(rootDir, 'src/game/content/story/routes');
  const sceneFiles = readdirSync(routesDir).filter(f => f.startsWith('route-scenes.') && f.endsWith('.json'));
  
  let scenesWithBossCallback = 0;
  let totalScenes = 0;
  
  sceneFiles.forEach(file => {
    const content = JSON.parse(readFileSync(join(routesDir, file), 'utf-8'));
    const scenes = content.scenes || [];
    
    scenes.forEach(scene => {
      totalScenes++;
      
      // Check for either global bossCallback or lane-specific bossCallbackByLane
      const hasCallback = !!(scene.bossCallback || scene.bossCallbackByLane);
      if (hasCallback) {
        scenesWithBossCallback++;
        
        // If bossCallbackByLane exists, verify it has entries for all 3 lanes
        if (scene.bossCallbackByLane) {
          const lanes = Object.keys(scene.bossCallbackByLane);
          assert(lanes.includes('practical'), `Scene ${scene.id} bossCallbackByLane missing practical lane`);
          assert(lanes.includes('true'), `Scene ${scene.id} bossCallbackByLane missing true lane`);
          assert(lanes.includes('risky'), `Scene ${scene.id} bossCallbackByLane missing risky lane`);
        }
      }
    });
  });
  
  assert(totalScenes === 36, `Expected 36 scenes, found ${totalScenes}`);
  assert(scenesWithBossCallback === 36, `Only ${scenesWithBossCallback}/${totalScenes} scenes have boss callbacks`);
  console.log(`   All ${scenesWithBossCallback} scenes have boss callbacks`);
});

// Test 5: Verify RouteStorySystem applies route rewards correctly
test('RouteStorySystem applies route rewards', () => {
  const routeSystemPath = join(rootDir, 'src/game/systems/RouteStorySystem.ts');
  const routeSystemContent = readFileSync(routeSystemPath, 'utf-8');
  
  // Verify applyRouteReward method exists and handles all reward types
  assert(routeSystemContent.includes('applyRouteReward'), 'Missing applyRouteReward method');
  
  // Verify it handles quantitative rewards
  const rewardTypes = ['gold', 'heal', 'mana', 'shield', 'item', 'relic', 'upgrade'];
  rewardTypes.forEach(type => {
    assert(routeSystemContent.includes(`'${type}'`) || routeSystemContent.includes(`"${type}"`),
      `applyRouteReward does not handle ${type} rewards`);
  });
  
  // Verify it modifies runState correctly
  assert(routeSystemContent.includes('runState.player.gold') || routeSystemContent.includes('runState.player.gold +='),
    'applyRouteReward does not modify gold in runState');
  assert(routeSystemContent.includes('runState.player.hp') || routeSystemContent.includes('runState.player.mana') || 
         routeSystemContent.includes('runState.player.shield'),
    'applyRouteReward does not modify player stats in runState');
  
  console.log('   RouteStorySystem.applyRouteReward handles all reward types');
});

// Test 6: Verify RouteStorySystem applies route risks correctly
test('RouteStorySystem applies route risks', () => {
  const routeSystemPath = join(rootDir, 'src/game/systems/RouteStorySystem.ts');
  const routeSystemContent = readFileSync(routeSystemPath, 'utf-8');
  
  // Verify applyRouteRisk method exists
  assert(routeSystemContent.includes('applyRouteRisk'), 'Missing applyRouteRisk method');
  
  // Verify it references OopsieSystem for hazard application
  assert(routeSystemContent.includes('oopsieSystem') || routeSystemContent.includes('OopsieSystem'),
    'applyRouteRisk does not integrate with OopsieSystem');
  
  // Verify it modifies reactiveState for hazards
  assert(routeSystemContent.includes('reactiveState') || routeSystemContent.includes('hazard'),
    'applyRouteRisk does not modify hazard state');
  
  console.log('   RouteStorySystem.applyRouteRisk integrates with hazard systems');
});

// Test 7: Verify RouteStorySystem applies boss callbacks correctly
test('RouteStorySystem applies boss callbacks', () => {
  const routeSystemPath = join(rootDir, 'src/game/systems/RouteStorySystem.ts');
  const routeSystemContent = readFileSync(routeSystemPath, 'utf-8');
  
  // Verify getBossCallback method exists
  assert(routeSystemContent.includes('getBossCallback'), 'Missing getBossCallback method');
  
  // Verify applyBossRouteModifier or similar exists
  assert(routeSystemContent.includes('applyBossRouteModifier') || routeSystemContent.includes('applyBossCallbackModifier'),
    'Missing boss callback modifier application');
  
  // Verify it checks lane choice
  assert(routeSystemContent.includes("lane === 'true'") || routeSystemContent.includes('lane === "true"'),
    'Boss callback does not differentiate true lane');
  assert(routeSystemContent.includes("lane === 'risky'") || routeSystemContent.includes('lane === "risky"'),
    'Boss callback does not differentiate risky lane');
  assert(routeSystemContent.includes("lane === 'practical'") || routeSystemContent.includes('lane === "practical"'),
    'Boss callback does not differentiate practical lane');
  
  console.log('   RouteStorySystem boss callbacks differentiate by lane');
});

// Test 8: Verify route progress state structure
test('Route progress state tracks all required fields', () => {
  const routeSystemPath = join(rootDir, 'src/game/systems/RouteStorySystem.ts');
  const routeSystemContent = readFileSync(routeSystemPath, 'utf-8');
  
  // Verify state tracks scores for all 3 lanes
  assert(routeSystemContent.includes('practicalScore'), 'Missing practicalScore tracking');
  assert(routeSystemContent.includes('trueScore'), 'Missing trueScore tracking');
  assert(routeSystemContent.includes('riskyScore'), 'Missing riskyScore tracking');
  
  // Verify state tracks trueFlags for ending conditions
  assert(routeSystemContent.includes('trueFlags'), 'Missing trueFlags tracking');
  
  // Verify state tracks chosenScenes
  assert(routeSystemContent.includes('chosenScenes'), 'Missing chosenScenes tracking');
  
  // Verify state tracks triggeredScenes to prevent duplicates
  assert(routeSystemContent.includes('triggeredScenes'), 'Missing triggeredScenes tracking');
  
  console.log('   Route progress state tracks all required fields');
});

// Test 9: Verify ending resolution logic
test('Ending resolution uses correct thresholds', () => {
  const routeSystemPath = join(rootDir, 'src/game/systems/RouteStorySystem.ts');
  const routeSystemContent = readFileSync(routeSystemPath, 'utf-8');
  
  // Verify TRUE_ENDING_MIN_SCORE constant exists
  assert(routeSystemContent.includes('TRUE_ENDING_MIN_SCORE'), 'Missing TRUE_ENDING_MIN_SCORE constant');
  
  // Verify TRUE_ENDING_MIN_FLAGS constant exists
  assert(routeSystemContent.includes('TRUE_ENDING_MIN_FLAGS'), 'Missing TRUE_ENDING_MIN_FLAGS constant');
  
  // Verify VARIANT_MIN_RISK_SCORE constant exists
  assert(routeSystemContent.includes('VARIANT_MIN_RISK_SCORE'), 'Missing VARIANT_MIN_RISK_SCORE constant');
  
  // Extract the threshold values
  const trueScoreMatch = routeSystemContent.match(/TRUE_ENDING_MIN_SCORE\s*=\s*(\d+)/);
  const trueFlagsMatch = routeSystemContent.match(/TRUE_ENDING_MIN_FLAGS\s*=\s*(\d+)/);
  
  assert(trueScoreMatch, 'Could not parse TRUE_ENDING_MIN_SCORE value');
  assert(trueFlagsMatch, 'Could not parse TRUE_ENDING_MIN_FLAGS value');
  
  const trueScoreThreshold = parseInt(trueScoreMatch[1]);
  const trueFlagsThreshold = parseInt(trueFlagsMatch[1]);
  
  assert(trueScoreThreshold >= 3 && trueScoreThreshold <= 6, 
    `TRUE_ENDING_MIN_SCORE (${trueScoreThreshold}) should be between 3-6`);
  assert(trueFlagsThreshold >= 3 && trueFlagsThreshold <= 6, 
    `TRUE_ENDING_MIN_FLAGS (${trueFlagsThreshold}) should be between 3-6`);
  
  console.log(`   True ending requires score >= ${trueScoreThreshold} and flags >= ${trueFlagsThreshold}`);
});

// Test 10: Verify fallback safety for missing route content
test('Fallback route scene prevents crashes', () => {
  const routeSystemPath = join(rootDir, 'src/game/systems/RouteStorySystem.ts');
  const routeSystemContent = readFileSync(routeSystemPath, 'utf-8');
  
  // Verify FALLBACK_SCENE constant exists
  assert(routeSystemContent.includes('FALLBACK_SCENE'), 'Missing FALLBACK_SCENE constant');
  
  // Verify fallback has all 3 choice lanes
  assert(routeSystemContent.includes("'fallback_practical'") || routeSystemContent.includes('"fallback_practical"'),
    'Fallback missing practical choice');
  assert(routeSystemContent.includes("'fallback_true'") || routeSystemContent.includes('"fallback_true"'),
    'Fallback missing true choice');
  assert(routeSystemContent.includes("'fallback_risky'") || routeSystemContent.includes('"fallback_risky"'),
    'Fallback missing risky choice');
  
  // Verify fallback provides safe rewards
  assert(routeSystemContent.includes('fallback_reward') || routeSystemContent.includes('Fallback'),
    'Fallback does not provide safe rewards');
  
  console.log('   Fallback route scene prevents crashes on missing content');
});

// Test 11: Verify route scene trigger conditions
test('Route scenes have proper trigger conditions', () => {
  const routesDir = join(rootDir, 'src/game/content/story/routes');
  const sceneFiles = readdirSync(routesDir).filter(f => f.startsWith('route-scenes.') && f.endsWith('.json'));
  
  let totalScenes = 0;
  let scenesWithValidTriggers = 0;
  
  sceneFiles.forEach(file => {
    const content = JSON.parse(readFileSync(join(routesDir, file), 'utf-8'));
    const scenes = content.scenes || [];
    
    scenes.forEach(scene => {
      totalScenes++;
      
      assert(scene.triggerCondition, `Scene ${scene.id} missing triggerCondition`);
      assert(scene.triggerCondition.type, `Scene ${scene.id} missing triggerCondition.type`);
      
      const validTriggerTypes = ['first_eligible_event_node', 'after_first_combat_victory', 'before_boss'];
      assert(validTriggerTypes.includes(scene.triggerCondition.type),
        `Scene ${scene.id} has invalid trigger type: ${scene.triggerCondition.type}`);
      
      if (scene.triggerCondition.oncePerRun !== undefined) {
        assert(typeof scene.triggerCondition.oncePerRun === 'boolean',
          `Scene ${scene.id} oncePerRun should be boolean`);
      }
      
      scenesWithValidTriggers++;
    });
  });
  
  assert(totalScenes === 36, `Expected 36 scenes, found ${totalScenes}`);
  assert(scenesWithValidTriggers === 36, `Only ${scenesWithValidTriggers}/${totalScenes} scenes have valid triggers`);
  console.log(`   All ${scenesWithValidTriggers} scenes have valid trigger conditions`);
});

// Test 12: Verify route choice statDelta tracking
test('Route choices track statDelta for scoring', () => {
  const routesDir = join(rootDir, 'src/game/content/story/routes');
  const sceneFiles = readdirSync(routesDir).filter(f => f.startsWith('route-scenes.') && f.endsWith('.json'));
  
  let totalChoices = 0;
  let choicesWithStatDelta = 0;
  
  sceneFiles.forEach(file => {
    const content = JSON.parse(readFileSync(join(routesDir, file), 'utf-8'));
    const scenes = content.scenes || [];
    
    scenes.forEach(scene => {
      scene.choices.forEach(choice => {
        totalChoices++;
        
        if (choice.statDelta) {
          // Verify statDelta matches the choice lane
          if (choice.lane === 'practical') {
            assert(choice.statDelta.practicalScore !== undefined,
              `Practical choice ${choice.id} missing practicalScore in statDelta`);
          } else if (choice.lane === 'true') {
            assert(choice.statDelta.trueScore !== undefined,
              `True choice ${choice.id} missing trueScore in statDelta`);
          } else if (choice.lane === 'risky') {
            assert(choice.statDelta.riskyScore !== undefined,
              `Risky choice ${choice.id} missing riskyScore in statDelta`);
          }
          
          choicesWithStatDelta++;
        }
      });
    });
  });
  
  assert(totalChoices === 108, `Expected 108 total choices, found ${totalChoices}`);
  const percentage = (choicesWithStatDelta / totalChoices) * 100;
  assert(percentage >= 90, `Only ${percentage}% of choices have statDelta (expected >= 90%)`);
  console.log(`   Found ${choicesWithStatDelta}/${totalChoices} choices with statDelta (${percentage.toFixed(0)}%)`);
});

console.log('\n' + '='.repeat(50));
console.log(`Test Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed > 0) {
  process.exit(1);
}
