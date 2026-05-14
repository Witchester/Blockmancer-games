import type { MetaState } from '../types/MetaTypes';

export class TutorialSystem {
  isComplete(meta?: MetaState, storage = globalThis.localStorage): boolean {
    return Boolean(meta?.tutorialCompleted) || storage?.getItem('blockmancer:tutorialComplete') === 'true';
  }

  getLessonIndex(meta?: MetaState, storage = globalThis.localStorage): number {
    const savedIndex = Number(storage?.getItem('blockmancer:tutorialLessonIndex') ?? 0);
    return Math.max(0, meta?.tutorialLessonIndex ?? savedIndex);
  }

  setLessonIndex(index: number, meta?: MetaState, storage = globalThis.localStorage): void {
    const safeIndex = Math.max(0, index);
    if (meta) {
      meta.tutorialLessonIndex = safeIndex;
    }
    storage?.setItem('blockmancer:tutorialLessonIndex', String(safeIndex));
  }

  setComplete(complete: boolean, meta?: MetaState, storage = globalThis.localStorage): void {
    if (meta) {
      meta.tutorialCompleted = complete;
      if (complete) {
        meta.tutorialLessonIndex = 0;
      }
    }
    storage?.setItem('blockmancer:tutorialComplete', String(complete));
    if (complete) {
      storage?.setItem('blockmancer:tutorialLessonIndex', '0');
    }
  }
}
