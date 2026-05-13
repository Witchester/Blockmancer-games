import monsterMetadata from '../content/monsters/metadata.json';
import slime from '../content/monsters/slime.json';
import goblin from '../content/monsters/goblin.json';
import stoneGolem from '../content/monsters/stone-golem.json';
import bat from '../content/monsters/bat.json';
import witch from '../content/monsters/witch.json';
import eliteKnight from '../content/monsters/elite-knight.json';
import fallingKing from '../content/monsters/falling-king.json';

import heroMetadata from '../content/heroes/metadata.json';
import blockmancer from '../content/heroes/blockmancer.json';
import pyromancer from '../content/heroes/pyromancer.json';
import frostbinder from '../content/heroes/frostbinder.json';
import gravityKnight from '../content/heroes/gravity-knight.json';
import voidScholar from '../content/heroes/void-scholar.json';

import weaponMetadata from '../content/weapons/metadata.json';
import basicWand from '../content/weapons/basic-wand.json';
import apprenticeStaff from '../content/weapons/apprentice-staff.json';
import runeBlade from '../content/weapons/rune-blade.json';
import stoneHammer from '../content/weapons/stone-hammer.json';
import fireTome from '../content/weapons/fire-tome.json';
import frostStaff from '../content/weapons/frost-staff.json';
import gravityOrb from '../content/weapons/gravity-orb.json';
import voidGrimoire from '../content/weapons/void-grimoire.json';

import spellMetadata from '../content/spells/metadata.json';
import fireball from '../content/spells/fireball.json';
import frostLock from '../content/spells/frost-lock.json';
import bombRune from '../content/spells/bomb-rune.json';
import voidCut from '../content/spells/void-cut.json';
import lightningChain from '../content/spells/lightning-chain.json';
import gravityFlip from '../content/spells/gravity-flip.json';
import healGlyph from '../content/spells/heal-glyph.json';
import manaBurst from '../content/spells/mana-burst.json';
import burnLine from '../content/spells/burn-line.json';
import iceWall from '../content/spells/ice-wall.json';

import relicMetadata from '../content/relics/metadata.json';
import goblinCoin from '../content/relics/goblin-coin.json';
import brokenHourglass from '../content/relics/broken-hourglass.json';
import slimeCore from '../content/relics/slime-core.json';
import dragonTooth from '../content/relics/dragon-tooth.json';
import frozenDice from '../content/relics/frozen-dice.json';
import crackedCrown from '../content/relics/cracked-crown.json';
import arcaneLens from '../content/relics/arcane-lens.json';
import stoneHeart from '../content/relics/stone-heart.json';
import voidEye from '../content/relics/void-eye.json';
import bombCharm from '../content/relics/bomb-charm.json';

import upgradeMetadata from '../content/upgrades/metadata.json';
import sharpEdges from '../content/upgrades/sharp-edges.json';
import manaEcho from '../content/upgrades/mana-echo.json';
import stableHands from '../content/upgrades/stable-hands.json';
import fireMastery from '../content/upgrades/fire-mastery.json';
import bombExpert from '../content/upgrades/bomb-expert.json';
import comboHeart from '../content/upgrades/combo-heart.json';
import arcanePreview from '../content/upgrades/arcane-preview.json';
import stonebreaker from '../content/upgrades/stonebreaker.json';
import emergencyBarrier from '../content/upgrades/emergency-barrier.json';
import goldSense from '../content/upgrades/gold-sense.json';
import spellFocus from '../content/upgrades/spell-focus.json';
import heavyDrop from '../content/upgrades/heavy-drop.json';

import statusMetadata from '../content/status-effects/metadata.json';
import burn from '../content/status-effects/burn.json';
import freeze from '../content/status-effects/freeze.json';
import shield from '../content/status-effects/shield.json';
import manaHex from '../content/status-effects/mana-hex.json';
import stun from '../content/status-effects/stun.json';
import slow from '../content/status-effects/slow.json';
import vulnerable from '../content/status-effects/vulnerable.json';

import roomEventMetadata from '../content/room-events/metadata.json';
import shrineOfGravity from '../content/room-events/shrine-of-gravity.json';
import brokenAnvil from '../content/room-events/broken-anvil.json';
import strangeMirror from '../content/room-events/strange-mirror.json';
import lostKnight from '../content/room-events/lost-knight.json';
import cursedFountain from '../content/room-events/cursed-fountain.json';
import manaWell from '../content/room-events/mana-well.json';

import lootMetadata from '../content/loot-tables/metadata.json';
import battleDefault from '../content/loot-tables/battle-default.json';
import eliteDefault from '../content/loot-tables/elite-default.json';
import bossDefault from '../content/loot-tables/boss-default.json';
import shopDefault from '../content/loot-tables/shop-default.json';
import treasureDefault from '../content/loot-tables/treasure-default.json';
import eventDefault from '../content/loot-tables/event-default.json';
import startingLoadout from '../content/loot-tables/starting-loadout.json';

import difficultyMetadata from '../content/difficulty-scaling/metadata.json';
import defaultRun from '../content/difficulty-scaling/default-run.json';
import easy from '../content/difficulty-scaling/easy.json';
import hard from '../content/difficulty-scaling/hard.json';

import boardBlockMetadata from '../content/board-blocks/metadata.json';
import redBlock from '../content/board-blocks/red-rune-block.json';
import blueBlock from '../content/board-blocks/blue-rune-block.json';
import greenBlock from '../content/board-blocks/green-rune-block.json';
import yellowBlock from '../content/board-blocks/yellow-rune-block.json';
import magicBlock from '../content/board-blocks/magic-block.json';
import bombBlock from '../content/board-blocks/bomb-block.json';
import stoneBlock from '../content/board-blocks/stone-block.json';
import iceBlock from '../content/board-blocks/ice-block.json';
import junkBlock from '../content/board-blocks/junk-block.json';
import voidBlock from '../content/board-blocks/void-block.json';

import curseMetadata from '../content/curses/metadata.json';
import heavyBlocks from '../content/curses/heavy-blocks.json';
import blindPreview from '../content/curses/blind-preview.json';
import greedyGoblin from '../content/curses/greedy-goblin.json';
import fragileMana from '../content/curses/fragile-mana.json';
import crackedBoard from '../content/curses/cracked-board.json';
import bloodMagic from '../content/curses/blood-magic.json';

import mapNodeMetadata from '../content/map-nodes/metadata.json';
import nodeStart from '../content/map-nodes/start.json';
import nodeFight from '../content/map-nodes/fight.json';
import nodeEvent from '../content/map-nodes/event.json';
import nodeShop from '../content/map-nodes/shop.json';
import nodeElite from '../content/map-nodes/elite.json';
import nodeRest from '../content/map-nodes/rest.json';
import nodeTreasure from '../content/map-nodes/treasure.json';
import nodeBoss from '../content/map-nodes/boss.json';

import type { ContentCategory, ContentMetadataDescriptor } from '../types/ContentTypes';

type RegistryEntry = {
  id: string;
  enabled?: boolean;
  [key: string]: unknown;
};

type RegistryCollection = {
  metadata: ContentMetadataDescriptor;
  entries: RegistryEntry[];
  fallbackId: string | null;
};

function createCollection(
  metadata: ContentMetadataDescriptor,
  entries: RegistryEntry[],
  fallbackId?: string
): RegistryCollection {
  return {
    metadata,
    entries,
    fallbackId: fallbackId ?? entries[0]?.id ?? null
  };
}

export class ContentRegistry {
  private readonly collections: Record<ContentCategory, RegistryCollection>;

  constructor() {
    this.collections = {
      monster: createCollection(monsterMetadata as ContentMetadataDescriptor, [
        slime,
        goblin,
        stoneGolem,
        bat,
        witch,
        eliteKnight,
        fallingKing
      ], 'mon_dungeon_slime'),
      hero: createCollection(heroMetadata as ContentMetadataDescriptor, [
        blockmancer,
        pyromancer,
        frostbinder,
        gravityKnight,
        voidScholar
      ], 'hero_blockmancer'),
      weapon: createCollection(weaponMetadata as ContentMetadataDescriptor, [
        basicWand,
        apprenticeStaff,
        runeBlade,
        stoneHammer,
        fireTome,
        frostStaff,
        gravityOrb,
        voidGrimoire
      ], 'wpn_basic_wand'),
      spell: createCollection(spellMetadata as ContentMetadataDescriptor, [
        fireball,
        frostLock,
        bombRune,
        voidCut,
        lightningChain,
        gravityFlip,
        healGlyph,
        manaBurst,
        burnLine,
        iceWall
      ], 'spl_fireball'),
      relic: createCollection(relicMetadata as ContentMetadataDescriptor, [
        goblinCoin,
        brokenHourglass,
        slimeCore,
        dragonTooth,
        frozenDice,
        crackedCrown,
        arcaneLens,
        stoneHeart,
        voidEye,
        bombCharm
      ], 'rel_goblin_coin'),
      upgrade: createCollection(upgradeMetadata as ContentMetadataDescriptor, [
        sharpEdges,
        manaEcho,
        stableHands,
        fireMastery,
        bombExpert,
        comboHeart,
        arcanePreview,
        stonebreaker,
        emergencyBarrier,
        goldSense,
        spellFocus,
        heavyDrop
      ], 'upg_line_sharp_edges'),
      statusEffect: createCollection(statusMetadata as ContentMetadataDescriptor, [
        burn,
        freeze,
        shield,
        manaHex,
        stun,
        slow,
        vulnerable
      ], 'status_burn'),
      roomEvent: createCollection(roomEventMetadata as ContentMetadataDescriptor, [
        shrineOfGravity,
        brokenAnvil,
        strangeMirror,
        lostKnight,
        cursedFountain,
        manaWell
      ], 'evt_shrine_of_gravity'),
      lootTable: createCollection(lootMetadata as ContentMetadataDescriptor, [
        battleDefault,
        eliteDefault,
        bossDefault,
        shopDefault,
        treasureDefault,
        eventDefault,
        startingLoadout
      ], 'loot_battle_default'),
      difficultyScaling: createCollection(difficultyMetadata as ContentMetadataDescriptor, [
        defaultRun,
        easy,
        hard
      ], 'scale_default_run'),
      boardBlock: createCollection(boardBlockMetadata as ContentMetadataDescriptor, [
        redBlock,
        blueBlock,
        greenBlock,
        yellowBlock,
        magicBlock,
        bombBlock,
        stoneBlock,
        iceBlock,
        junkBlock,
        voidBlock
      ], 'block_red'),
      curse: createCollection(curseMetadata as ContentMetadataDescriptor, [
        heavyBlocks,
        blindPreview,
        greedyGoblin,
        fragileMana,
        crackedBoard,
        bloodMagic
      ], 'curse_heavy_blocks'),
      mapNode: createCollection(mapNodeMetadata as ContentMetadataDescriptor, [
        nodeStart,
        nodeFight,
        nodeEvent,
        nodeShop,
        nodeElite,
        nodeRest,
        nodeTreasure,
        nodeBoss
      ], 'node_fight')
    };
  }

  getMetadata(contentType: ContentCategory): ContentMetadataDescriptor {
    return this.collections[contentType].metadata;
  }

  list<TEntry extends RegistryEntry = RegistryEntry>(contentType: ContentCategory): TEntry[] {
    return this.collections[contentType].entries as TEntry[];
  }

  listEnabled<TEntry extends RegistryEntry = RegistryEntry>(contentType: ContentCategory): TEntry[] {
    return this.list<TEntry>(contentType).filter((entry) => entry.enabled !== false);
  }

  getOptionalById<TEntry extends RegistryEntry = RegistryEntry>(
    contentType: ContentCategory,
    id: string
  ): TEntry | null {
    return (this.collections[contentType].entries.find((entry) => entry.id === id) as TEntry | undefined) ?? null;
  }

  getById<TEntry extends RegistryEntry = RegistryEntry>(contentType: ContentCategory, id: string): TEntry | null {
    const exact = this.getOptionalById<TEntry>(contentType, id);
    if (exact && exact.enabled !== false) {
      return exact;
    }

    const fallbackId = this.collections[contentType].fallbackId;
    if (!fallbackId) {
      return null;
    }

    const fallback = this.getOptionalById<TEntry>(contentType, fallbackId);
    return fallback && fallback.enabled !== false ? fallback : null;
  }

  has(contentType: ContentCategory, id: string): boolean {
    return this.getOptionalById(contentType, id) !== null;
  }

  getMonster(id: string) {
    return this.getById('monster', id);
  }

  getHero(id: string) {
    return this.getById('hero', id);
  }

  getWeapon(id: string) {
    return this.getById('weapon', id);
  }

  getSpell(id: string) {
    return this.getById('spell', id);
  }

  getRelic(id: string) {
    return this.getById('relic', id);
  }

  getUpgrade(id: string) {
    return this.getById('upgrade', id);
  }

  getStatusEffect(id: string) {
    return this.getById('statusEffect', id);
  }

  getRoomEvent(id: string) {
    return this.getById('roomEvent', id);
  }

  getLootTable(id: string) {
    return this.getById('lootTable', id);
  }

  getDifficultyScaling(id: string) {
    return this.getById('difficultyScaling', id);
  }

  getBoardBlock(id: string) {
    return this.getById('boardBlock', id);
  }

  getCurse(id: string) {
    return this.getById('curse', id);
  }

  getMapNode(id: string) {
    return this.getById('mapNode', id);
  }
}

export const contentRegistry = new ContentRegistry();
