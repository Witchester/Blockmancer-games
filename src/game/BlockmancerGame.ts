import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { HeroSelectScene } from './scenes/HeroSelectScene';
import { MapScene } from './scenes/MapScene';
import { BattleScene } from './scenes/BattleScene';
import { RewardScene } from './scenes/RewardScene';
import { EventScene } from './scenes/EventScene';
import { ShopScene } from './scenes/ShopScene';
import { RestScene } from './scenes/RestScene';
import { TreasureScene } from './scenes/TreasureScene';
import { GameOverScene } from './scenes/GameOverScene';
import { MapSystem } from './systems/MapSystem';
import { SaveSystem } from './systems/SaveSystem';
import { RewardSystem } from './systems/RewardSystem';
import { EnemySystem } from './systems/EnemySystem';
import { DifficultySystem } from './systems/DifficultySystem';
import { EventSystem } from './systems/EventSystem';
import { ShopSystem } from './systems/ShopSystem';
import { AssetSystem } from './systems/AssetSystem';
import { AudioSystem } from './systems/AudioSystem';
import { HeroSystem } from './systems/HeroSystem';
import { InventorySystem } from './systems/InventorySystem';
import { ItemSystem } from './systems/ItemSystem';
import { MetaSystem } from './systems/MetaSystem';
import { SettingsSystem } from './systems/SettingsSystem';
import { StageSystem } from './systems/StageSystem';
import { TutorialSystem } from './systems/TutorialSystem';
import { WeaponSystem } from './systems/WeaponSystem';
import type { RunState } from './types/GameTypes';
import { createDefaultRunState, normalizeRunState } from './data/defaultRunState';

export class BlockmancerGame extends Phaser.Game {
  readonly saveSystem = new SaveSystem();
  readonly mapSystem = new MapSystem();
  readonly metaSystem = new MetaSystem(this.saveSystem);
  readonly rewardSystem = new RewardSystem();
  readonly difficultySystem = new DifficultySystem();
  readonly stageSystem = new StageSystem();
  readonly enemySystem = new EnemySystem(this.difficultySystem, this.stageSystem);
  readonly eventSystem = new EventSystem(this.rewardSystem, this.enemySystem);
  readonly shopSystem = new ShopSystem(this.rewardSystem);
  readonly assetSystem = new AssetSystem();
  readonly audioSystem = new AudioSystem();
  readonly heroSystem = new HeroSystem();
  readonly weaponSystem = new WeaponSystem();
  readonly inventorySystem = new InventorySystem();
  readonly itemSystem = new ItemSystem();
  readonly tutorialSystem = new TutorialSystem();
  readonly settingsSystem = new SettingsSystem();
  runState: RunState;

  constructor(parent: HTMLElement) {
    super({
      type: Phaser.AUTO,
      parent,
      width: 720,
      height: 1280,
      backgroundColor: '#090b13',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: [
        BootScene,
        MainMenuScene,
        HeroSelectScene,
        MapScene,
        BattleScene,
        RewardScene,
        EventScene,
        ShopScene,
        RestScene,
        TreasureScene,
        GameOverScene
      ]
    });

    this.runState = createDefaultRunState();
  }

  newRun(heroId: string = 'hero_milo_blockmancer'): RunState {
    this.runState = createDefaultRunState();
    this.heroSystem.applyHeroToRun(this.runState, heroId);
    this.saveRun();
    return this.runState;
  }

  loadRun(): boolean {
    const save = this.saveSystem.loadRun();
    if (!save) {
      return false;
    }

    this.runState = normalizeRunState(save);
    return true;
  }

  saveRun(): void {
    this.runState = normalizeRunState(this.runState);
    this.saveSystem.saveRun(this.runState);
  }

  clearSave(): void {
    this.saveSystem.clearRun();
  }
}
