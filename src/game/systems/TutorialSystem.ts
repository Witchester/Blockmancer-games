export class TutorialSystem {
  isComplete(storage = globalThis.localStorage): boolean {
    return storage?.getItem('blockmancer:tutorialComplete') === 'true';
  }

  setComplete(complete: boolean, storage = globalThis.localStorage): void {
    storage?.setItem('blockmancer:tutorialComplete', String(complete));
  }
}
