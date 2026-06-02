import { readJsonStorage, removeStorageItem, writeJsonStorage } from '../utils/storage';
import type { RunState } from '../types/GameTypes';
import type { MetaState } from '../types/MetaTypes';
import { DEFAULT_SETTINGS, type GameSettings } from '../types/SettingsTypes';
import { SAVE_VERSION } from '../data/constants';
import { FeverSystem } from './FeverSystem';

const SAVE_KEY = 'blockmancer-dungeon-save';
const META_SAVE_KEY = 'blockmancer-meta-save';
const LEGACY_SETTINGS_KEY = 'blockmancer:settings';
const MIN_SUPPORTED_SAVE_VERSION = 0;
export const CURRENT_SAVE_VERSION = SAVE_VERSION;

type StorageObject = Record<string, unknown>;

function isObject(value: unknown): value is StorageObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function numberVersion(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : MIN_SUPPORTED_SAVE_VERSION;
}

function uniqueStrings(value: unknown, fallback: string[] = []): string[] {
  if (!Array.isArray(value)) {
    return [...fallback];
  }

  return [...new Set(value.filter((item): item is string => typeof item === 'string'))];
}

function migrateSettings(value: unknown): GameSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...(isObject(value) ? value : {})
  };
}

function readLegacySettings(): GameSettings {
  const legacy = readJsonStorage<unknown>(LEGACY_SETTINGS_KEY);
  return migrateSettings(legacy);
}

export class SaveSystem {
  private readonly feverSystem = new FeverSystem();

  hasSave(): boolean {
    return this.loadRun() !== null;
  }

  saveRun(runState: RunState): void {
    const cleanedBoard = this.feverSystem.clearSoftJunkForNodeEnd(
      this.feverSystem.clearFeverBoardMarkers(runState.board)
    );
    const dataToSave: RunState = {
      ...runState,
      board: cleanedBoard,
      feverShowtime: this.feverSystem.prepareFeverStateForSave(runState.feverShowtime, 'run_save'),
      saveVersion: CURRENT_SAVE_VERSION
    };
    writeJsonStorage(SAVE_KEY, dataToSave);
  }

  loadRun(): unknown | null {
    const data = readJsonStorage<unknown>(SAVE_KEY);
    if (!isObject(data)) {
      this.clearRun();
      return null;
    }

    try {
      return this.migrateRun(data);
    } catch {
      this.clearRun();
      return null;
    }
  }

  clearRun(): void {
    removeStorageItem(SAVE_KEY);
  }

  saveMeta(meta: MetaState): void {
    writeJsonStorage(META_SAVE_KEY, {
      ...meta,
      saveVersion: CURRENT_SAVE_VERSION,
      settings: migrateSettings(meta.settings)
    });
  }

  loadMeta(): MetaState | null {
    const data = readJsonStorage<unknown>(META_SAVE_KEY);
    if (!data) {
      return null;
    }
    if (!isObject(data)) {
      removeStorageItem(META_SAVE_KEY);
      return null;
    }

    try {
      return this.migrateMeta(data);
    } catch {
      removeStorageItem(META_SAVE_KEY);
      return null;
    }
  }

  private migrateRun(raw: StorageObject): StorageObject {
    const version = numberVersion(raw.saveVersion);
    const migrated: StorageObject = {
      ...raw,
      saveVersion: CURRENT_SAVE_VERSION
    };

    if (version < 1) {
      if (!migrated.currentNodeId && isObject(migrated.currentRoom)) {
        migrated.currentNodeId = migrated.currentRoom.nodeId;
        migrated.currentRoomType = migrated.currentRoom.roomType;
        migrated.currentRoomProgress = migrated.currentRoom.state;
      }
      if (!migrated.activeEnemy && migrated.currentEnemy) {
        migrated.activeEnemy = migrated.currentEnemy;
      }
    }

    if (version < 2) {
      migrated.runStats = {
        piecesLocked: 0,
        linesCleared: 0,
        cascadesTriggered: 0,
        maxCascade: 0,
        damageDealt: 0,
        damageTaken: 0,
        spellsCast: 0,
        itemsUsed: 0,
        roomsCleared: typeof migrated.enemiesDefeated === 'number' ? migrated.enemiesDefeated : 0,
        bossesDefeated: []
      };
    }

    if (version < 3) {
      migrated.stageGoals = {};
      migrated.activeRandomGameplayEvents = [];
      migrated.completedBattleObjectives = [];
      migrated.activeOopsies = isObject(migrated.player) && Array.isArray(migrated.player.oopsies)
        ? migrated.player.oopsies
        : [];
    }

    if (version < 4) {
      migrated.activeHazards = [];
      migrated.reactiveState = {
        nextSpellModifiers: [],
        previewRevealPieces: 0,
        speedBrakePieces: 0,
        freezeGuardPieces: 0,
        anchorCookiePieces: 0,
        cleanupCouponPieces: 0,
        nopeStampPieces: 0,
        sleepGuardPieces: 0,
        nixieMitigationUsed: false,
        lowCeilingCanceled: false,
        safetyNetArmed: false,
        activeRouteModifiers: []
      };
    }

    if (version < 5 || !isObject(migrated.routeProgress)) {
      const heroId = isObject(migrated.hero) && typeof migrated.hero.id === 'string'
        ? migrated.hero.id
        : 'hero_milo_blockmancer';
      migrated.routeProgress = {
        activeHeroId: heroId,
        routeVersion: 1,
        heroes: {
          [heroId]: {
            heroId,
            practicalScore: 0,
            trueScore: 0,
            riskyScore: 0,
            trueFlags: [],
            chosenScenes: {},
            triggeredScenes: [],
            unlockedEndingIds: [],
            variantEndingIds: []
          }
        }
      };
    }

    if (version < 6) {
      const reactive = isObject(migrated.reactiveState) ? migrated.reactiveState : {};
      migrated.reactiveState = {
        nextSpellModifiers: Array.isArray(reactive.nextSpellModifiers) ? reactive.nextSpellModifiers : [],
        previewRevealPieces: typeof reactive.previewRevealPieces === 'number' ? reactive.previewRevealPieces : 0,
        speedBrakePieces: typeof reactive.speedBrakePieces === 'number' ? reactive.speedBrakePieces : 0,
        freezeGuardPieces: typeof reactive.freezeGuardPieces === 'number' ? reactive.freezeGuardPieces : 0,
        anchorCookiePieces: typeof reactive.anchorCookiePieces === 'number' ? reactive.anchorCookiePieces : 0,
        cleanupCouponPieces: typeof reactive.cleanupCouponPieces === 'number' ? reactive.cleanupCouponPieces : 0,
        nopeStampPieces: typeof reactive.nopeStampPieces === 'number' ? reactive.nopeStampPieces : 0,
        sleepGuardPieces: typeof reactive.sleepGuardPieces === 'number' ? reactive.sleepGuardPieces : 0,
        nixieMitigationUsed: Boolean(reactive.nixieMitigationUsed),
        lowCeilingCanceled: Boolean(reactive.lowCeilingCanceled),
        safetyNetArmed: Boolean(reactive.safetyNetArmed),
        activeRouteModifiers: Array.isArray(reactive.activeRouteModifiers) ? reactive.activeRouteModifiers : []
      };
    }

    if (version < 7 || !isObject(migrated.playerLevelState)) {
      const player = isObject(migrated.player) ? migrated.player : {};
      migrated.playerLevelState = {
        level: typeof player.level === 'number' ? Math.max(1, Math.floor(player.level)) : 1,
        currentXp: typeof player.experience === 'number' ? Math.max(0, Math.floor(player.experience)) : 0,
        xpToNextLevel: typeof player.xpToNextLevel === 'number' ? Math.max(1, Math.floor(player.xpToNextLevel)) : 25,
        pendingLevelUps: 0,
        chosenUpgrades: {},
        rerollCharges: 0
      };
    }

    if (version < 8) {
      if (!isObject(migrated.levelUpScreenState)) {
        migrated.levelUpScreenState = {
          pendingLevelUpChoices: [],
          offeredUpgradeIds: [],
          chosenUpgradeIds: [],
          rerollCharges: 0,
          levelUpSelectionSeed: '',
          levelUpScreenResolved: true,
          selectedCategory: null
        };
      }
      if (isObject(migrated.activeEncounterPack)) {
        const pack = migrated.activeEncounterPack as StorageObject;
        const enemies = Array.isArray(pack.enemies) ? pack.enemies : [];
        const currentEnemyIndex = typeof pack.currentEnemyIndex === 'number' ? Math.floor(pack.currentEnemyIndex) : 0;
        pack.currentEnemyIndex = Math.max(0, Math.min(Math.max(0, enemies.length - 1), currentEnemyIndex));
        if (!Array.isArray(pack.defeatedEnemyIndexes)) {
          pack.defeatedEnemyIndexes = [];
        }
        if (!Array.isArray(pack.appliedEntryEffectEnemyIndexes)) {
          pack.appliedEntryEffectEnemyIndexes = [];
        }
        if (!Array.isArray(pack.entryGiftClaimedEnemyIndexes)) {
          pack.entryGiftClaimedEnemyIndexes = [];
        }
        if (typeof pack.remainingEnemyCount !== 'number') {
          const defeated = Array.isArray(pack.defeatedEnemyIndexes) ? pack.defeatedEnemyIndexes.length : 0;
          pack.remainingEnemyCount = Math.max(0, enemies.length - defeated);
        }
        if (typeof pack.encounterPackCompleted !== 'boolean') {
          pack.encounterPackCompleted = false;
        }
        if (typeof pack.nodeRewardsGranted !== 'boolean') {
          pack.nodeRewardsGranted = false;
        }
        if (typeof pack.routeFallbackTriggeredForEncounterPack !== 'boolean') {
          pack.routeFallbackTriggeredForEncounterPack = false;
        }
      }
    }

        if (version < 10 || !isObject(migrated.runUpgradeState)) {
      const legacyUpgrades = Array.isArray(migrated.upgrades)
        ? migrated.upgrades.filter((id: unknown): id is string => typeof id === 'string')
        : [];
      migrated.runUpgradeState = {
        version: 1,
        slots: [
          { index: 0 },
          { index: 1 },
          { index: 2 }
        ],
        ownedCards: {},
        legacyUpgradeIds: legacyUpgrades
      };
      if (Array.isArray(migrated.ownedRewards)) {
        (migrated.runUpgradeState as Record<string, unknown>).legacyOwnedRewards = [...(migrated.ownedRewards as unknown[])];
      }
    }

    if (version < 9 || !isObject(migrated.feverShowtime)) {
      migrated.feverShowtime = this.feverSystem.migrateLegacyFeverState(migrated);
    } else {
      migrated.feverShowtime = this.feverSystem.normalizeFeverSaveState(migrated.feverShowtime);
    }

    const loadedFever = migrated.feverShowtime as RunState['feverShowtime'];
    const hadBoardLocalFever = loadedFever.active || loadedFever.locksRemaining > 0 || loadedFever.chargedLineRows.length > 0 || loadedFever.heat > 0 || loadedFever.releaseRequested;
    const repaired = this.feverSystem.repairInvalidFeverState(
      this.feverSystem.prepareFeverStateForSave(loadedFever, 'run_save'),
      isObject(migrated.board) ? migrated.board as unknown as RunState['board'] : undefined,
      migrated as unknown as RunState
    );
    migrated.feverShowtime = repaired.fever;
    if (repaired.board) {
      migrated.board = this.feverSystem.clearSoftJunkForNodeEnd(
        this.feverSystem.clearFeverBoardMarkers(repaired.board)
      );
    }
    if ((repaired.repaired || hadBoardLocalFever) && import.meta.env.DEV) {
      console.warn('[SaveSystem] Save migration repaired invalid Fever state. Showtime state repaired safely.', repaired.warnings);
    }

    return migrated;
  }

  private migrateMeta(raw: StorageObject): MetaState {
    const version = numberVersion(raw.saveVersion);
    const stage1BossDefeated = Boolean(raw.stage1BossDefeated);
    const stage2BossDefeated = Boolean(raw.stage2BossDefeated);
    const normalEndingFinished = Boolean(raw.normalEndingFinished);
    const bossesDefeated = uniqueStrings(raw.bossesDefeated, [
      ...(stage1BossDefeated ? ['stage_1_boss'] : []),
      ...(stage2BossDefeated ? ['stage_2_boss'] : [])
    ]);
    const endingsUnlocked = uniqueStrings(raw.endingsUnlocked, normalEndingFinished ? ['normal'] : []);
    const routeEndingsUnlocked = uniqueStrings(raw.routeEndingsUnlocked);
    const routeVariantEndingsUnlocked = uniqueStrings(raw.routeVariantEndingsUnlocked);

    return {
      saveVersion: CURRENT_SAVE_VERSION,
      unlockedHeroes: uniqueStrings(raw.unlockedHeroes, ['hero_milo_blockmancer']),
      totalGoldCollected: typeof raw.totalGoldCollected === 'number' ? raw.totalGoldCollected : 0,
      totalCascades: typeof raw.totalCascades === 'number'
        ? raw.totalCascades
        : typeof raw.totalCascadeCombos === 'number'
          ? raw.totalCascadeCombos
          : 0,
      bossesDefeated,
      endingsUnlocked,
      routeEndingsUnlocked,
      routeVariantEndingsUnlocked,
      hubBuildings: isObject(raw.hubBuildings) ? raw.hubBuildings as Record<string, number> : {},
      monsterFriendship: isObject(raw.monsterFriendship) ? raw.monsterFriendship as Record<string, number> : {},
      completedStageGoals: uniqueStrings(raw.completedStageGoals),
      discoveredChaosRules: uniqueStrings(raw.discoveredChaosRules),
      discoveredBossRules: uniqueStrings(raw.discoveredBossRules),
      stage1BossDefeated,
      stage2BossDefeated,
      normalEndingFinished,
      totalCascadeCombos: typeof raw.totalCascadeCombos === 'number' ? raw.totalCascadeCombos : 0,
      slimesBefriended: typeof raw.slimesBefriended === 'number' ? raw.slimesBefriended : 0,
      roomsClearedWithoutDamage: typeof raw.roomsClearedWithoutDamage === 'number' ? raw.roomsClearedWithoutDamage : 0,
      tutorialCompleted: Boolean(raw.tutorialCompleted),
      tutorialLessonIndex: typeof raw.tutorialLessonIndex === 'number' ? raw.tutorialLessonIndex : 0,
      settings: migrateSettings(version < 2 && !raw.settings ? readLegacySettings() : raw.settings)
    };
  }
}
