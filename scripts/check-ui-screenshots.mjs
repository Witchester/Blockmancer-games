import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.UI_CHECK_URL ?? 'http://127.0.0.1:5173';
const outDir = path.resolve('artifacts', 'ui-check');

const viewports = [
  { name: 'phone-390x844', width: 390, height: 844 },
  { name: 'small-360x740', width: 360, height: 740 },
  { name: 'tablet-720x1280', width: 720, height: 1280 }
];

const scenes = [
  'MainMenuScene',
  'HeroSelectScene',
  'MapScene',
  'BattleScene',
  'RewardScene',
  'EventScene',
  'ShopScene',
  'RestScene',
  'TreasureScene',
  'GameOverScene'
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const failures = [];

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    page.on('pageerror', (error) => failures.push(`${viewport.name}: page error: ${error.message}`));
    page.on('console', (message) => {
      if (message.type() === 'error') {
        failures.push(`${viewport.name}: console error: ${message.text()}`);
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
        state.activeEnemy = game.enemySystem.spawnEnemy('fight', state.stage);
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
      case 'GameOverScene':
        state.runStatus = 'game-over';
        state.victory = false;
        break;
      default:
        throw new Error(`Unknown scene ${sceneKey}`);
    }

    game.scene.start(sceneKey, sceneKey === 'GameOverScene' ? { victory: false } : undefined);
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
