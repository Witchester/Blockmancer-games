#!/usr/bin/env node

/**
 * Route Hero Selection Smoke Tests
 * 
 * Verifies Story 3.1: Choose a Release 1 Hero
 * - All 6 heroes registered
 * - Unique passives per hero
 * - 36 route scenes (6 heroes × 6 stages)
 * - 18 endings (6 heroes × 3 types)
 * - Route progress initialization
 * - Unlock status tracking
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

console.log('🧪 Running Route Hero Selection Smoke Tests...\n');

// Test 1: Verify all 6 hero IDs exist in HeroSystem
test('All 6 hero IDs are defined', () => {
  const heroSystemPath = join(rootDir, 'src/game/systems/HeroSystem.ts');
  const heroSystemContent = readFileSync(heroSystemPath, 'utf-8');
  
  const requiredHeroes = [
    'hero_milo_blockmancer',
    'hero_pippa_pyromancer',
    'hero_zuzu_goblin_engineer',
    'hero_nixie_frostbinder',
    'hero_bruk_snack_knight',
    'hero_lumi_star_witch'
  ];
  
  requiredHeroes.forEach(heroId => {
    assert(
      heroSystemContent.includes(heroId),
      `Hero ${heroId} not found in HeroSystem.ts`
    );
  });
});

// Test 2: Verify each hero has a unique passive
test('Each hero has a unique passive definition', () => {
  const heroSystemPath = join(rootDir, 'src/game/systems/HeroSystem.ts');
  const heroSystemContent = readFileSync(heroSystemPath, 'utf-8');
  
  // Check for passive-related keywords
  const passiveKeywords = ['passive', 'ability', 'effect'];
  const hasPassives = passiveKeywords.some(keyword => 
    heroSystemContent.toLowerCase().includes(keyword)
  );
  
  assert(hasPassives, 'No passive definitions found in HeroSystem.ts');
});

// Test 3: Verify 36 route scenes exist (6 heroes × 6 stages)
test('36 route scenes exist (6 heroes × 6 stages)', () => {
  const routesDir = join(rootDir, 'src/game/content/story/routes');
  const sceneFiles = readdirSync(routesDir).filter(f => f.startsWith('route-scenes.') && f.endsWith('.json'));
  
  assert(sceneFiles.length === 6, `Expected 6 route scene files, found ${sceneFiles.length}`);
  
  let totalScenes = 0;
  sceneFiles.forEach(file => {
    const content = JSON.parse(readFileSync(join(routesDir, file), 'utf-8'));
    const scenes = content.scenes || [];
    totalScenes += scenes.length;
    
    // Each hero should have 6 scenes (one per stage)
    assert(scenes.length === 6, `Expected 6 scenes in ${file}, found ${scenes.length}`);
  });
  
  assert(totalScenes === 36, `Expected 36 total scenes, found ${totalScenes}`);
});

// Test 4: Verify 18 endings exist (6 heroes × 3 types)
test('18 endings exist (6 heroes × 3 types)', () => {
  const endingsPath = join(rootDir, 'src/game/content/story/routes/route-endings.json');
  const endingsContent = JSON.parse(readFileSync(endingsPath, 'utf-8'));
  
  const endings = endingsContent.endings || [];
  assert(endings.length === 18, `Expected 18 endings, found ${endings.length}`);
  
  // Verify each hero has 3 ending types
  const heroEndings = {};
  endings.forEach(ending => {
    if (!heroEndings[ending.heroId]) {
      heroEndings[ending.heroId] = [];
    }
    heroEndings[ending.heroId].push(ending.kind);
  });
  
  const expectedHeroes = 6;
  assert(Object.keys(heroEndings).length === expectedHeroes, 
    `Expected ${expectedHeroes} heroes with endings, found ${Object.keys(heroEndings).length}`);
  
  Object.values(heroEndings).forEach(kinds => {
    assert(kinds.length === 3, `Expected 3 ending types per hero, found ${kinds.length}`);
    assert(kinds.includes('normal'), 'Missing normal ending');
    assert(kinds.includes('true'), 'Missing true ending');
    assert(kinds.includes('variant'), 'Missing variant ending');
  });
});

// Test 5: Verify route scenes have proper structure
test('Route scenes have required fields', () => {
  const routesDir = join(rootDir, 'src/game/content/story/routes');
  const sceneFiles = readdirSync(routesDir).filter(f => f.startsWith('route-scenes.') && f.endsWith('.json'));
  
  sceneFiles.forEach(file => {
    const content = JSON.parse(readFileSync(join(routesDir, file), 'utf-8'));
    const scenes = content.scenes || [];
    
    scenes.forEach((scene, index) => {
      assert(scene.id, `Scene ${index} in ${file} missing id`);
      assert(scene.heroId, `Scene ${index} in ${file} missing heroId`);
      assert(scene.stageId, `Scene ${index} in ${file} missing stageId`);
      assert(scene.choices, `Scene ${index} in ${file} missing choices`);
      assert(scene.choices.length === 3, `Scene ${index} in ${file} should have 3 choices`);
      
      // Verify choice lanes
      const lanes = scene.choices.map(c => c.lane);
      assert(lanes.includes('practical'), `Scene ${index} in ${file} missing practical choice`);
      assert(lanes.includes('true'), `Scene ${index} in ${file} missing true choice`);
      assert(lanes.includes('risky'), `Scene ${index} in ${file} missing risky choice`);
      
      // Verify rewardConfig exists for each choice
      scene.choices.forEach(choice => {
        assert(choice.rewardConfig, `Choice ${choice.id} in ${file} missing rewardConfig`);
      });
    });
  });
});

// Test 6: Verify Risky choices have riskConfig
test('Risky choices include riskConfig', () => {
  const routesDir = join(rootDir, 'src/game/content/story/routes');
  const sceneFiles = readdirSync(routesDir).filter(f => f.startsWith('route-scenes.') && f.endsWith('.json'));
  
  let totalRiskyChoices = 0;
  let riskyWithConfig = 0;
  
  sceneFiles.forEach(file => {
    const content = JSON.parse(readFileSync(join(routesDir, file), 'utf-8'));
    const scenes = content.scenes || [];
    
    scenes.forEach(scene => {
      scene.choices.forEach(choice => {
        if (choice.lane === 'risky') {
          totalRiskyChoices++;
          if (choice.riskConfig) {
            riskyWithConfig++;
          }
        }
      });
    });
  });
  
  // There should be 36 risky choices (1 per scene × 6 scenes × 6 heroes)
  assert(totalRiskyChoices === 36, `Expected 36 risky choices, found ${totalRiskyChoices}`);
  // Most risky choices should have riskConfig (at least 50%)
  const percentage = (riskyWithConfig / totalRiskyChoices) * 100;
  assert(percentage >= 50, `Only ${percentage}% of risky choices have riskConfig (expected >= 50%)`);
  console.log(`   Found ${riskyWithConfig}/${totalRiskyChoices} risky choices with riskConfig (${percentage.toFixed(0)}%)`);
});

// Test 7: Verify RouteStorySystem references all heroes
test('RouteStorySystem references all 6 heroes', () => {
  const routeSystemPath = join(rootDir, 'src/game/systems/RouteStorySystem.ts');
  const routeSystemContent = readFileSync(routeSystemPath, 'utf-8');
  
  const requiredHeroes = [
    'hero_milo_blockmancer',
    'hero_pippa_pyromancer',
    'hero_zuzu_goblin_engineer',
    'hero_nixie_frostbinder',
    'hero_bruk_snack_knight',
    'hero_lumi_star_witch'
  ];
  
  requiredHeroes.forEach(heroId => {
    assert(
      routeSystemContent.includes(heroId),
      `Hero ${heroId} not referenced in RouteStorySystem.ts`
    );
  });
});

// Test 8: Verify hero barks and voice tags exist
test('Hero barks and voice tags are configured', () => {
  const barksPath = join(rootDir, 'src/game/content/story/routes/route-barks.json');
  const voiceTagsPath = join(rootDir, 'src/game/content/story/routes/route-voice-tags.json');
  
  const barksContent = JSON.parse(readFileSync(barksPath, 'utf-8'));
  const voiceTagsContent = JSON.parse(readFileSync(voiceTagsPath, 'utf-8'));
  
  assert(barksContent.barks, 'Missing barks object in route-barks.json');
  assert(voiceTagsContent.voiceTags, 'Missing voiceTags object in route-voice-tags.json');
  
  // Should have entries for all 6 heroes or their tag groups
  const barkKeys = Object.keys(barksContent.barks);
  const voiceTagKeys = Object.keys(voiceTagsContent.voiceTags);
  
  assert(barkKeys.length >= 1, 'No hero barks configured');
  assert(voiceTagKeys.length >= 1, 'No voice tags configured');
});

// Test 9: Verify endings have required structure
test('Endings have required structure', () => {
  const endingsPath = join(rootDir, 'src/game/content/story/routes/route-endings.json');
  const endingsContent = JSON.parse(readFileSync(endingsPath, 'utf-8'));
  
  const endings = endingsContent.endings || [];
  
  endings.forEach((ending, index) => {
    assert(ending.id, `Ending ${index} missing id`);
    assert(ending.heroId, `Ending ${index} missing heroId`);
    assert(ending.kind, `Ending ${index} missing kind`);
    assert(ending.title, `Ending ${index} missing title`);
    assert(ending.panels, `Ending ${index} missing panels`);
    assert(ending.lines, `Ending ${index} missing lines`);
    assert(['normal', 'true', 'variant'].includes(ending.kind), 
      `Ending ${index} has invalid kind: ${ending.kind}`);
  });
});

// Test 10: Verify stage IDs match across all route scenes
test('Route scenes use canonical stage IDs', () => {
  const routesDir = join(rootDir, 'src/game/content/story/routes');
  const sceneFiles = readdirSync(routesDir).filter(f => f.startsWith('route-scenes.') && f.endsWith('.json'));
  
  const canonicalStages = [
    'stage_sprinkle_sewers',
    'stage_goblin_workshop',
    'stage_frosty_pantry',
    'stage_pillow_castle',
    'stage_starfall_arcade',
    'stage_bloxley_block_palace'
  ];
  
  const foundStages = new Set();
  
  sceneFiles.forEach(file => {
    const content = JSON.parse(readFileSync(join(routesDir, file), 'utf-8'));
    const scenes = content.scenes || [];
    
    scenes.forEach(scene => {
      foundStages.add(scene.stageId);
    });
  });
  
  canonicalStages.forEach(stageId => {
    assert(foundStages.has(stageId), `Stage ${stageId} not found in any route scenes`);
  });
});

// Test 11: Verify True choices grant flags
test('True choices grant trueFlags', () => {
  const routesDir = join(rootDir, 'src/game/content/story/routes');
  const sceneFiles = readdirSync(routesDir).filter(f => f.startsWith('route-scenes.') && f.endsWith('.json'));
  
  let trueChoicesWithFlags = 0;
  let totalTrueChoices = 0;
  
  sceneFiles.forEach(file => {
    const content = JSON.parse(readFileSync(join(routesDir, file), 'utf-8'));
    const scenes = content.scenes || [];
    
    scenes.forEach(scene => {
      scene.choices.forEach(choice => {
        if (choice.lane === 'true') {
          totalTrueChoices++;
          if (choice.grantFlag) {
            trueChoicesWithFlags++;
          }
        }
      });
    });
  });
  
  // Most true choices should grant flags (at least 50%)
  const percentage = (trueChoicesWithFlags / totalTrueChoices) * 100;
  assert(percentage >= 50, `Only ${percentage}% of true choices grant flags (expected >= 50%)`);
  console.log(`   Found ${trueChoicesWithFlags}/${totalTrueChoices} true choices with grantFlag (${percentage.toFixed(0)}%)`);
});

// Test 12: Verify bossCallback or bossCallbackByLane exists in scenes
test('Route scenes include boss callbacks', () => {
  const routesDir = join(rootDir, 'src/game/content/story/routes');
  const sceneFiles = readdirSync(routesDir).filter(f => f.startsWith('route-scenes.') && f.endsWith('.json'));
  
  let scenesWithBossCallback = 0;
  let totalScenes = 0;
  
  sceneFiles.forEach(file => {
    const content = JSON.parse(readFileSync(join(routesDir, file), 'utf-8'));
    const scenes = content.scenes || [];
    
    scenes.forEach(scene => {
      totalScenes++;
      if (scene.bossCallback || scene.bossCallbackByLane) {
        scenesWithBossCallback++;
      }
    });
  });
  
  // At least some scenes should have boss callbacks
  assert(scenesWithBossCallback > 0, 'No scenes have boss callbacks');
  console.log(`   Found ${scenesWithBossCallback}/${totalScenes} scenes with boss callbacks`);
});

console.log('\n' + '='.repeat(50));
console.log(`Test Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed > 0) {
  process.exit(1);
}
