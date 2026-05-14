import { readJsonStorage, removeStorageItem, writeJsonStorage } from '../utils/storage';
import type { RunState } from '../types/GameTypes';
import type { MetaState } from '../types/MetaTypes';

const SAVE_KEY = 'blockmancer-dungeon-save';
const META_SAVE_KEY = 'blockmancer-meta-save';
export const CURRENT_SAVE_VERSION = 1;

export class SaveSystem {
  hasSave(): boolean {
    return Boolean(window.localStorage.getItem(SAVE_KEY));
  }

  saveRun(runState: RunState): void {
    // Ensure version is set on the object being saved
    const dataToSave = {
      ...runState,
      saveVersion: CURRENT_SAVE_VERSION
    };
    writeJsonStorage(SAVE_KEY, dataToSave);
  }

  loadRun(): unknown | null {
    const data = readJsonStorage<any>(SAVE_KEY);
    if (!data) return null;

    // We return the raw data and let the game normalize it
    return data;
  }

  clearRun(): void {
    removeStorageItem(SAVE_KEY);
  }

  saveMeta(meta: MetaState): void {
    writeJsonStorage(META_SAVE_KEY, meta);
  }

  loadMeta(): MetaState | null {
    return readJsonStorage<MetaState>(META_SAVE_KEY);
  }
}
