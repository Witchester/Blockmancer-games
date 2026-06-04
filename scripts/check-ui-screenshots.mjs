import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.UI_CHECK_URL ?? 'http://127.0.0.1:5173';
const outDir = path.resolve('artifacts', 'ui-check');

const viewports = [
  { name: 'desktop-1440x900', width: 1440, height: 900 },
  { name: 'phone-390x844', width: 390, height: 844 },
  { name: 'small-360x740', width: 360, height: 740 },
  { name: 'tablet-720x1280', width: 720, height: 1280 }
];

const scenes = [
  'MainMenuScene',
  'HeroSelectScene',
  'RouteDialogueScene',
  'MapScene',
  'BattleScene',
  'RewardScene',
  'EventScene',
  'ShopScene',
  'RestScene',
  'TreasureScene',
  'CollectionScene',
  'VictoryScene',
  'GameOverScene'
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const failures = [];

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    page.on('pageerror', (error) => {
      if (!error.message.includes('Unable to decode audio data')) {
        failures.push(`${viewport.name}: page error: ${error.message}`);
      }
    });
    page.on('console', (message) => {
      const text = message.text();
      const expectedMissingAssetFallback = text.includes('Failed to process file:');
      const expectedPlaceholderAudio = text.includes('Error decoding audio:') && text.includes('Unable to decode audio data');
      if (message.type() === 'error' && !expectedMissingAssetFallback && !expectedPlaceholderAudio) {
        failures.push(`${viewport.name}: console error: ${text}`);
      }
    });

    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForSelector('canvas', { state: 'visible' });
    await page.waitForFunction(() => Boolean(window.__blockmancerGame));

    for (const scene of scenes) {
      await setScene(page, scene);
      await page.waitForTimeout(250);
      await assertCanvasHealthy(page, `${viewport.name}/${scene}`);
      const screenshotPath = path.join(outDir, `${viewport.name}-${scene}.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      });
      const screenshot = await stat(screenshotPath);
      if (screenshot.size < 5000) {
        failures.push(`${viewport.name}/${scene}: screenshot file is unexpectedly small (${screenshot.size} bytes)`);
      }
      if (scene === 'BattleScene') {
        await assertMonsterStackProgression(page, `${viewport.name}/${scene}`);
      }
    }

    await page.close();
  }
} finally {
  await browser.close();
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`UI screenshots written to ${outDir}`);

async function setScene(page, scene) {
  await page.evaluate((sceneKey) => {
    const game = window.__blockmancerGame;
    if (!game) {
      throw new Error('Missing dev game handle.');
    }

    game.scene.getScenes(true).forEach((activeScene) => game.scene.stop(activeScene.scene.key));
    const state = game.newRun();
    state.eventLog = [
      'Entered Fight.',
      'Sprinkle Scout emerges with 24 HP.',
      'You cleared 2 lines and gained 25 mana.'
    ];
    state.ownedRewards = ['arcane-preview', 'combo-heart', 'gold-sense'];
    state.relics = ['gold-sense'];
    state.upgrades = ['arcane-preview', 'combo-heart'];
    state.player.hp = 24;
    state.player.mana = 45;
    state.player.gold = 85;
    state.gold = 85;

    switch (sceneKey) {
      case 'MainMenuScene':
        state.runStatus = 'menu';
        break;
      case 'HeroSelectScene':
        state.runStatus = 'menu';
        break;
      case 'RouteDialogueScene':
        state.runStatus = 'map';
        state.currentNodeId = 'event-a';
        state.currentRoomType = 'event';
        state.currentRoomProgress = 'entered';
        break;
      case 'MapScene':
        state.runStatus = 'map';
        state.currentNodeId = 'start';
        state.currentRoomType = 'start';
        state.currentRoomProgress = 'idle';
        break;
      case 'BattleScene':
        state.runStatus = 'battle';
        state.currentNodeId = 'fight-a';
        state.currentRoomType = 'fight';
        state.currentRoomProgress = 'entered';
        state.activeEncounterPack = {
          encounterPackId: 'ui_smoke_monster_stack',
          nodeId: state.currentNodeId,
          stageId: 'stage_sprinkle_sewers',
          biomeId: 'ui_smoke_biome',
          nodeType: 'normal',
          enemies: ['mon_cupcake_slime', 'mon_sugar_bat', 'mon_sprinkle_snail'].map((enemyId) => ({
            enemyId,
            role: 'support',
            rank: 'normal',
            hpMultiplier: 1,
            attackMultiplier: 1,
            entryGracePieces: 0,
            tags: ['ui-smoke']
          })),
          currentEnemyIndex: 0,
          totalHpBudgetMultiplier: 1,
          totalAttackBudgetMultiplier: 1,
          maxActiveHazards: 1,
          rewardsGrantedOnlyOnNodeClear: true,
          xpGrantedOnlyOnNodeClear: true,
          defeatedEnemyIds: [],
          defeatedEnemyIndexes: [],
          remainingEnemyCount: 3,
          appliedEntryEffectEnemyIndexes: [],
          entryGiftClaimedEnemyIndexes: [],
          encounterPackCompleted: false,
          nodeRewardsGranted: false,
          routeFallbackTriggeredForEncounterPack: false
        };
        state.activeEnemy = game.encounterPackSystem.spawnEncounterEnemy(
          state.activeEncounterPack.enemies[0],
          state.stage,
          0,
          state
        );
        break;
      case 'RewardScene':
        state.runStatus = 'reward';
        state.currentNodeId = 'fight-a';
        state.currentRoomType = 'fight';
        state.pendingRewards = game.rewardSystem.getRandomRewards(3);
        break;
      case 'EventScene':
        state.runStatus = 'map';
        state.currentNodeId = 'event-a';
        state.currentRoomType = 'event';
        state.currentRoomProgress = 'entered';
        state.currentEventId = null;
        break;
      case 'ShopScene':
        state.runStatus = 'map';
        state.currentNodeId = 'shop';
        state.currentRoomType = 'shop';
        state.currentRoomProgress = 'entered';
        break;
      case 'RestScene':
        state.runStatus = 'map';
        state.currentNodeId = 'rest';
        state.currentRoomType = 'rest';
        state.currentRoomProgress = 'entered';
        break;
      case 'TreasureScene':
        state.runStatus = 'map';
        state.currentNodeId = 'treasure';
        state.currentRoomType = 'treasure';
        state.currentRoomProgress = 'entered';
        state.pendingRewards = game.rewardSystem.getRandomRewards(1);
        break;
      case 'CollectionScene':
        state.runStatus = 'menu';
        game.metaSystem.state.discoveredMonsterIds = ['mon_cupcake_slime', 'mon_sugar_bat', 'mon_boss_cupcake_slime_king'];
        game.metaSystem.state.monsterFriendship.mon_cupcake_slime = 2;
        break;
      case 'VictoryScene':
        state.runStatus = 'victory';
        state.victory = true;
        break;
      case 'GameOverScene':
        state.runStatus = 'game-over';
        state.victory = false;
        break;
      default:
        throw new Error(`Unknown scene ${sceneKey}`);
    }

    const sceneData = sceneKey === 'GameOverScene'
      ? { victory: false }
      : sceneKey === 'VictoryScene'
        ? { endingKind: 'normal', routeEndingId: 'ending_milo_normal', routeVariantEndingId: 'ending_milo_festival_grace_variant' }
        : undefined;
    game.scene.start(sceneKey, sceneData);
  }, scene);
}

async function assertCanvasHealthy(page, label) {
  const result = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!(canvas instanceof HTMLCanvasElement)) {
      return { ok: false, reason: 'missing canvas' };
    }

    const box = canvas.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const fitsViewport = box.left >= -1 && box.top >= -1 && box.right <= viewportWidth + 1 && box.bottom <= viewportHeight + 1;

    return {
      ok: fitsViewport && box.width > 0 && box.height > 0,
      reason: fitsViewport ? 'canvas has no visible size' : `canvas outside viewport: ${JSON.stringify({
        left: box.left,
        top: box.top,
        right: box.right,
        bottom: box.bottom,
        viewportWidth,
        viewportHeight
      })}`
    };
  });

  if (!result.ok) {
    failures.push(`${label}: ${result.reason}`);
  }
}

async function assertMonsterStackProgression(page, label) {
  const result = await page.evaluate(() => {
    const game = window.__blockmancerGame;
    const scene = game?.scene.getScene('BattleScene');
    const preview = scene?.monsterStackPreview;
    const pack = game?.runState.activeEncounterPack;
    if (!preview || !pack) {
      return { ok: false, reason: 'missing monster stack preview or encounter pack' };
    }

    const inspect = (index, completed = false) => {
      pack.currentEnemyIndex = index;
      pack.encounterPackCompleted = completed;
      preview.updateQueue(pack);
      return { visible: preview.root.visible, childCount: preview.root.list.length };
    };

    const threeEnemy = inspect(0);
    const twoEnemy = inspect(1);
    const finalEnemy = inspect(2);
    const malformedRestore = inspect(99);
    const completed = inspect(2, true);
    inspect(0);

    const ok =
      threeEnemy.visible && threeEnemy.childCount === 3 &&
      twoEnemy.visible && twoEnemy.childCount === 2 &&
      !finalEnemy.visible && finalEnemy.childCount === 0 &&
      !malformedRestore.visible && malformedRestore.childCount === 0 &&
      !completed.visible && completed.childCount === 0;

    return {
      ok,
      reason: JSON.stringify({ threeEnemy, twoEnemy, finalEnemy, malformedRestore, completed })
    };
  });

  if (!result.ok) {
    failures.push(`${label}: monster stack progression failed: ${result.reason}`);
  }
}
