import type { MetaState } from '../types/MetaTypes';
import { contentRegistry } from './ContentRegistry';

export type StoryBeat = {
  id: string;
  title: string;
  speaker?: string;
  lines: string[];
};

const OPENING_BEAT: StoryBeat = {
  id: 'opening',
  title: 'Festival Trouble',
  speaker: 'Festival Guide',
  lines: [
    'The Festival of Falling Stars was almost ready.',
    'Then the Block-O-Matic 3000 tried to sort every snack, banner, and rune block at once.',
    'Now there is a cheerful dungeon under the town square, and King Bloxley has declared himself block champion.',
    'Grab your wand. Creativity fixes chaos better than control.'
  ]
};

const STAGE_BEATS: Record<string, StoryBeat> = {
  stage_sprinkle_sewers: {
    id: 'stage_sprinkle_sewers',
    title: 'Sprinkle Sewers',
    speaker: 'Snack Smith',
    lines: [
      'The first tunnel is dripping with syrup and runaway sprinkles.',
      'Clear a path before the festival cupcakes learn to march in formation.'
    ]
  },
  stage_goblin_workshop: {
    id: 'stage_goblin_workshop',
    title: 'Goblin Workshop',
    speaker: 'Zuzu',
    lines: [
      'Every tool here has been labeled "probably safe."',
      'The workshop blocks may wobble, but a clever cascade can tidy them right up.'
    ]
  },
  stage_frosty_pantry: {
    id: 'stage_frosty_pantry',
    title: 'Frosty Pantry',
    speaker: 'Nixie',
    lines: [
      'The pantry has become a very dramatic freezer maze.',
      'Keep your next block in sight and do not let the gelato negotiate.'
    ]
  },
  stage_pillow_castle: {
    id: 'stage_pillow_castle',
    title: 'Pillow Castle',
    speaker: 'Sleepy Guard',
    lines: [
      'The castle guards insist this is a tactical nap.',
      'Stay awake, keep the board clean, and watch for soft but stubborn shields.'
    ]
  },
  stage_starfall_arcade: {
    id: 'stage_starfall_arcade',
    title: 'Starfall Arcade',
    speaker: 'Arcade Clerk',
    lines: [
      'The arcade cabinet is counting combos like tickets.',
      'Cascades and Fever are the best way to beat the blinking scoreboard.'
    ]
  },
  stage_bloxley_block_palace: {
    id: 'stage_bloxley_block_palace',
    title: "Bloxley's Block Palace",
    speaker: 'King Bloxley',
    lines: [
      'At last, the royal palace of stacked nonsense.',
      'King Bloxley has built a throne from blocks, banners, and one suspicious cupcake tray.'
    ]
  }
};

const BOSS_LINES: Record<string, string[]> = {
  mon_boss_cupcake_slime_king: [
    'Cupcake Slime King wobbles forward, frosting crown tilted at a heroic angle.',
    'Its royal decree is mostly sprinkles.'
  ],
  mon_boss_prototype_no_7: [
    'Prototype No. 7 clanks proudly into place.',
    'A sticker on its side reads: "Festival approved, mostly."'
  ],
  mon_boss_gelato_golem: [
    'Gelato Golem rolls in with chilly confidence.',
    'Each scoop seems personally offended by warm weather.'
  ],
  mon_boss_sir_snore_a_lot: [
    'Sir Snore-a-Lot shuffles in under a quilted banner.',
    'He may be asleep, but his shield is wide awake.'
  ],
  mon_boss_high_score_hydra: [
    'High Score Hydra lights up the cabinet and points at your combo meter.',
    'The bonus round begins whether anyone asked or not.'
  ],
  mon_boss_king_bloxley: [
    'King Bloxley stacks one last royal block and adjusts his paper crown.',
    '"Behold my perfectly square kingdom!"'
  ]
};

const NORMAL_ENDING: StoryBeat = {
  id: 'ending_normal',
  title: 'Festival Saved',
  speaker: 'Block-O-Matic 3000',
  lines: [
    'The final royal block clicks into place, then politely unstacks itself.',
    'King Bloxley admits that festivals are more fun when everyone gets a turn.',
    'The town square pops back up with extra confetti and only a little syrup on the banners.',
    'The Festival of Falling Stars is saved.'
  ]
};

const TRUE_ENDING: StoryBeat = {
  id: 'ending_true',
  title: 'True Festival Finale',
  speaker: 'Professor Poplin',
  lines: [
    'This time, every hero adds their own idea to the Block-O-Matic.',
    'The machine stops trying to control the chaos and starts composing with it.',
    'A new festival game appears: part puzzle, part parade, and entirely too proud of its snacks.',
    'Creativity fixes chaos, and the whole town cheers.'
  ]
};

export class StorySystem {
  getOpening(): StoryBeat {
    return OPENING_BEAT;
  }

  getStageIntro(stageId: string): StoryBeat | null {
    return STAGE_BEATS[stageId] ?? null;
  }

  getBossIntro(enemyId: string, fallback: string): StoryBeat {
    const monster = contentRegistry.getMonster(enemyId) as { name?: string } | null;
    return {
      id: `boss_${enemyId}`,
      title: monster?.name ?? 'Festival Boss',
      speaker: 'Boss Intro',
      lines: BOSS_LINES[enemyId] ?? [fallback]
    };
  }

  getEnding(kind: 'normal' | 'true'): StoryBeat {
    return kind === 'true' ? TRUE_ENDING : NORMAL_ENDING;
  }

  getHeroUnlockMessages(before: string[], after: string[]): string[] {
    const previous = new Set(before);
    return after
      .filter((id) => !previous.has(id))
      .map((id) => {
        const hero = contentRegistry.getHero(id) as { name?: string; className?: string } | null;
        return `${hero?.name ?? id} is ready for the next run${hero?.className ? ` as ${hero.className}` : ''}.`;
      });
  }

  hasSeen(id: string, storage = globalThis.localStorage): boolean {
    return storage?.getItem(this.key(id)) === 'true';
  }

  markSeen(id: string, storage = globalThis.localStorage): void {
    storage?.setItem(this.key(id), 'true');
  }

  getEndingKind(meta: MetaState): 'normal' | 'true' {
    return meta.normalEndingFinished ? 'true' : 'normal';
  }

  private key(id: string): string {
    return `blockmancer:story:${id}`;
  }
}
