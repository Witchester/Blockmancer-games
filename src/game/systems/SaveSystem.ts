import { readJsonStorage, removeStorageItem, writeJsonStorage } from '../utils/storage';
import type { RunState } from '../types/GameTypes';
import type { MetaState } from '../types/MetaTypes';
import { DEFAULT_SETTINGS, type GameSettings } from '../types/SettingsTypes';
import { SAVE_VERSION } from '../data/constants';

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
  hasSave(): boolean {
    return this.loadRun() !== null;
  }

  saveRun(runState: RunState): void {
    const dataToSave: RunState = {
      ...runState,
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
        lowCeilingCanceled: false,
        safetyNetArmed: false
      };
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
