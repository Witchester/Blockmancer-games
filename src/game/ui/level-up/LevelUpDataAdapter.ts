import type { RunState } from '../../types/GameTypes';

export type LevelUpCardRarity = 'common' | 'rare' | 'hero';

export type LevelUpUpgradeCardViewModel = {
  id: string;
  name: string;
  description: string;
  flavorText: string | null;
  iconKey: string;
  rarity: LevelUpCardRarity;
  stackCount: number;
  stackLimit: number;
  cardAssetKey: string;
  cardLevel: number;
  isOwned: boolean;
  isMaxed: boolean;
  readyToEvolve: boolean;
  isLegendary: boolean;
};

export type LevelUpViewModel = {
  title: string;
  currentLevel: number;
  newLevel: number;
  finalLevel: number;
  currentXp: number;
  xpToNextLevel: number;
  pendingLevelUps: number;
  remainingAfterChoice: number;
  rerollCharges: number;
  canReroll: boolean;
  cards: LevelUpUpgradeCardViewModel[];
};

export type LevelUpUpgradeContent = {
  id: string;
  name: string;
  description?: string;
  flavorText?: string;
  iconKey?: string;
  upgradeType?: 'general' | 'hero_specific';
  cardType?: 'general' | 'hero' | 'hero_specific' | 'rare';
  rarity?: string;
  stackLimit?: number;
  effectId?: string;
};

function normalizeRarity(card: LevelUpUpgradeContent): LevelUpCardRarity {
  const source = card.cardType ?? card.rarity ?? card.upgradeType ?? 'general';
  if (source === 'rare') {
    return 'rare';
  }
  if (source === 'hero' || source === 'hero_specific') {
    return 'hero';
  }
  return 'common';
}

function getCardAssetKey(rarity: LevelUpCardRarity): string {
  if (rarity === 'rare') {
    return 'ui_level_up_card_rare';
  }
  if (rarity === 'hero') {
    return 'ui_level_up_card_hero';
  }
  return 'ui_level_up_card_common';
}

export function buildLevelUpViewModel(state: RunState, cards: LevelUpUpgradeContent[]): LevelUpViewModel {
  const levelState = state.playerLevelState;
  const pendingLevelUps = Math.max(0, Math.floor(levelState.pendingLevelUps ?? 0));
  const finalLevel = Math.max(1, Math.floor(levelState.level ?? state.player.level ?? 1));
  const currentLevel = Math.max(1, finalLevel - pendingLevelUps);
  const newLevel = Math.max(currentLevel + 1, Math.min(finalLevel, currentLevel + 1));
  const rerollCharges = Math.max(0, Math.floor(levelState.rerollCharges ?? 0));

  return {
    title: 'Festival Level-Up',
    currentLevel,
    newLevel,
    finalLevel,
    currentXp: Math.max(0, Math.floor(levelState.currentXp ?? state.player.experience ?? 0)),
    xpToNextLevel: Math.max(1, Math.floor(levelState.xpToNextLevel ?? state.player.xpToNextLevel ?? 1)),
    pendingLevelUps,
    remainingAfterChoice: Math.max(0, pendingLevelUps - 1),
    rerollCharges,
    canReroll: rerollCharges > 0,
    cards: cards.slice(0, 3).map((card) => {
      const rarity = normalizeRarity(card);
      const stackCount = Math.max(0, Math.floor(levelState.chosenUpgrades[card.id] ?? 0));
      const stackLimit = Math.max(1, Math.floor(card.stackLimit ?? 1));
      const owned = state.runUpgradeState.ownedCards[card.id];
      const cardLevel = owned?.level ?? 0;
      return {
        id: card.id,
        name: card.name || 'Festival Favor',
        description: card.description || 'A festive boost.',
        flavorText: card.flavorText || null,
        iconKey: card.iconKey || 'placeholder_icon',
        rarity,
        stackCount,
        stackLimit,
        cardAssetKey: getCardAssetKey(rarity),
        cardLevel,
        isOwned: Boolean(owned),
        isMaxed: cardLevel >= 5,
        readyToEvolve: owned?.readyToEvolve === true,
        isLegendary: typeof owned?.legendaryEvolutionId === 'string' && owned.legendaryEvolutionId.length > 0
      };
    })
  };
}
