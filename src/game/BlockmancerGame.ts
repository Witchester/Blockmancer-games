import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { StoryScene } from './scenes/StoryScene';
import { TutorialScene } from './scenes/TutorialScene';
import { HelpScene } from './scenes/HelpScene';
import { HeroSelectScene } from './scenes/HeroSelectScene';
import { HubScene } from './scenes/HubScene';
import { CollectionScene } from './scenes/CollectionScene';
import { MapScene } from './scenes/MapScene';
import { BattleScene } from './scenes/BattleScene';
import { RewardScene } from './scenes/RewardScene';
import { NodeResultScene } from './scenes/NodeResultScene';
import { LevelUpRewardScene } from './scenes/LevelUpRewardScene';
import { RouteDialogueScene } from './scenes/RouteDialogueScene';
import { EventScene } from './scenes/EventScene';
import { ShopScene } from './scenes/ShopScene';
import { RestScene } from './scenes/RestScene';
import { TreasureScene } from './scenes/TreasureScene';
import { SettingsScene } from './scenes/SettingsScene';
import { GameOverScene } from './scenes/GameOverScene';
import { VictoryScene } from './scenes/VictoryScene';
import { DebugScene } from './scenes/DebugScene';
import { MapSystem } from './systems/MapSystem';
import { SaveSystem } from './systems/SaveSystem';
import { RewardSystem } from './systems/RewardSystem';
import { EnemySystem } from './systems/EnemySystem';
import { DifficultySystem } from './systems/DifficultySystem';
import { EventSystem } from './systems/EventSystem';
import { ShopSystem } from './systems/ShopSystem';
import { AssetSystem } from './systems/AssetSystem';
import { AudioSystem } from './systems/AudioSystem';
import { BossSystem } from './systems/BossSystem';
import { BossRuleSystem } from './systems/BossRuleSystem';
import { BoardSizeModifierSystem } from './systems/BoardSizeModifierSystem';
import { BattleObjectiveSystem } from './systems/BattleObjectiveSystem';
import { ChaosRuleSystem } from './systems/ChaosRuleSystem';
import { FriendshipSystem } from './systems/FriendshipSystem';
import { HeroSystem } from './systems/HeroSystem';
import { HubProgressionSystem } from './systems/HubProgressionSystem';
import { InventorySystem } from './systems/InventorySystem';
import { ItemSystem } from './systems/ItemSystem';
import { MetaSystem } from './systems/MetaSystem';
import { OopsieSystem } from './systems/OopsieSystem';
import { RandomGameplayEventSystem } from './systems/RandomGameplayEventSystem';
import { DialogueSystem } from './systems/DialogueSystem';
import { RouteStorySystem } from './systems/RouteStorySystem';
import { SettingsSystem } from './systems/SettingsSystem';
import { StageSystem } from './systems/StageSystem';
import { StageGoalSystem } from './systems/StageGoalSystem';
import { StorySystem } from './systems/StorySystem';
import { TutorialSystem } from './systems/TutorialSystem';
import { WeaponSystem } from './systems/WeaponSystem';
import { EncounterPackSystem } from './systems/EncounterPackSystem';
import { LevelUpSystem } from './systems/LevelUpSystem';
import { UpgradeSystem } from './systems/UpgradeSystem';
import type { RunState } from './types/GameTypes';
import type { GameSettings } from './types/SettingsTypes';
import { createDefaultRunState, normalizeRunState } from './data/defaultRunState';

export class BlockmancerGame extends Phaser.Game {
  readonly saveSystem = new SaveSystem();
  readonly mapSystem = new MapSystem();
  readonly metaSystem = new MetaSystem(this.saveSystem);
  readonly rewardSystem = new RewardSystem();
  readonly difficultySystem = new DifficultySystem();
  readonly stageSystem = new StageSystem();
  readonly enemySystem = new EnemySystem(this.difficultySystem, this.stageSystem);
  readonly assetSystem = new AssetSystem();
  readonly audioSystem = new AudioSystem();
  readonly bossSystem = new BossSystem();
  readonly bossRuleSystem = new BossRuleSystem();
  readonly boardSizeModifierSystem = new BoardSizeModifierSystem();
  readonly battleObjectiveSystem = new BattleObjectiveSystem(this.rewardSystem);
  readonly chaosRuleSystem = new ChaosRuleSystem();
  readonly friendshipSystem = new FriendshipSystem();
  readonly hubProgressionSystem = new HubProgressionSystem();
  readonly heroSystem = new HeroSystem();
  readonly weaponSystem = new WeaponSystem();
  readonly inventorySystem = new InventorySystem();
  readonly itemSystem = new ItemSystem();
  readonly oopsieSystem = new OopsieSystem();
  readonly randomGameplayEventSystem = new RandomGameplayEventSystem();
  readonly eventSystem = new EventSystem(this.rewardSystem, this.enemySystem, this.inventorySystem, this.oopsieSystem);
  readonly shopSystem = new ShopSystem(this.rewardSystem, this.oopsieSystem);
  readonly dialogueSystem = new DialogueSystem();
  readonly routeStorySystem = new RouteStorySystem(this.rewardSystem, this.inventorySystem, this.oopsieSystem);
  readonly storySystem = new StorySystem();
  readonly tutorialSystem = new TutorialSystem();
  readonly settingsSystem = new SettingsSystem();
  readonly stageGoalSystem = new StageGoalSystem();
  readonly encounterPackSystem: EncounterPackSystem = new EncounterPackSystem(this.difficultySystem, this.stageSystem);
  readonly levelUpSystem: LevelUpSystem = new LevelUpSystem();
  readonly upgradeSystem: UpgradeSystem = new UpgradeSystem();
  runState: RunState;

  constructor(parent: HTMLElement) {
    super({
      type: Phaser.AUTO,
      parent,
      width: 720,
      height: 1280,
      backgroundColor: '#090b13',
      antialias: false,
      pixelArt: true,
      roundPixels: true,
      scale: {
        mode: Phaser.Scale.FIT
      },
      scene: [
        BootScene,
        MainMenuScene,
        StoryScene,
        TutorialScene,
        HelpScene,
        HeroSelectScene,
        HubScene,
        CollectionScene,
        MapScene,
        BattleScene,
        RewardScene,
        NodeResultScene,
        LevelUpRewardScene,
        RouteDialogueScene,
        EventScene,
        ShopScene,
        RestScene,
        TreasureScene,
        SettingsScene,
        GameOverScene,
        VictoryScene,
        DebugScene
      ]
    });

    this.runState = createDefaultRunState();
  }

  newRun(heroId: string = 'hero_milo_blockmancer'): RunState {
    this.runState = createDefaultRunState();
    this.heroSystem.applyHeroToRun(this.runState, heroId);
    this.upgradeSystem.recalculateLevelUpDerivedStats(this.runState);
    this.runState.map = this.mapSystem.createMap(this.runState.stage);
    this.stageGoalSystem.ensureGoal(this.runState);
    this.boardSizeModifierSystem.applyEncounterBoardSize(this.runState);
    this.encounterPackSystem.clearRuntimeState();
    this.saveRun();
    return this.runState;
  }

  loadRun(): boolean {
    const save = this.saveSystem.loadRun();
    if (!save) {
      return false;
    }

    try {
      this.runState = normalizeRunState(save);
      this.upgradeSystem.recalculateLevelUpDerivedStats(this.runState);
    } catch {
      this.saveSystem.clearRun();
      this.runState = createDefaultRunState();
      return false;
    }
    return true;
  }

  saveRun(): void {
    const normalized = normalizeRunState(this.runState);
    Object.assign(this.runState, normalized);
    this.saveSystem.saveRun(normalized);
  }

  clearSave(): void {
    this.saveSystem.clearRun();
  }

  getSettings(): GameSettings {
    return {
      ...this.settingsSystem.defaults,
      ...this.settingsSystem.load(),
      ...this.metaSystem.state.settings
    };
  }

  saveSettings(settings: GameSettings): void {
    const normalized = {
      ...this.settingsSystem.defaults,
      ...settings
    };
    this.metaSystem.state.settings = normalized;
    this.metaSystem.save();
    this.settingsSystem.save(normalized);
  }
}
