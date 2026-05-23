export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function choice<T>(items: T[]): T {
  return items[randInt(0, items.length - 1)];
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = randInt(0, index);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function sampleSize<T>(items: T[], count: number): T[] {
  return shuffle(items).slice(0, count);
}

export function weightedChoice<T>(items: T[], getWeight: (item: T) => number): T {
  const totalWeight = items.reduce((total, item) => total + Math.max(0, getWeight(item)), 0);
  if (totalWeight <= 0) {
    return choice(items);
  }

  let roll = Math.random() * totalWeight;
  for (const item of items) {
    roll -= Math.max(0, getWeight(item));
    if (roll <= 0) {
      return item;
    }
  }

  return items[items.length - 1];
}

export function seededRandom(seed: number, min: number = 0, max: number = 1): number {
  const x = Math.sin(seed) * 10000;
  const rand = x - Math.floor(x);
  return min + rand * (max - min);
}
