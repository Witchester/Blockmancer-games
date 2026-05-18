import type { DialogueLine } from '../types/GameTypes';

export type DialoguePage = {
  title?: string;
  lines: DialogueLine[];
};

export class DialogueSystem {
  paginate(lines: DialogueLine[], linesPerPage = 3): DialoguePage[] {
    const cleanLines = lines.filter((line) => line.text.trim().length > 0);
    const pages: DialoguePage[] = [];
    for (let index = 0; index < cleanLines.length; index += linesPerPage) {
      pages.push({ lines: cleanLines.slice(index, index + linesPerPage) });
    }
    return pages.length ? pages : [{ lines: [{ speakerId: 'narrator', text: 'The festival story waits politely.' }] }];
  }

  formatLine(line: DialogueLine): string {
    const speaker = this.getSpeakerName(line.speakerId);
    return speaker ? `${speaker}: ${line.text}` : line.text;
  }

  getSpeakerName(speakerId: string): string {
    const names: Record<string, string> = {
      narrator: '',
      hero_milo_blockmancer: 'Milo',
      hero_pippa_pyromancer: 'Pippa',
      hero_zuzu_goblin_engineer: 'Zuzu',
      hero_nixie_frostbinder: 'Nixie',
      hero_bruk_snack_knight: 'Bruk',
      hero_lumi_star_witch: 'Lumi',
      npc_bloop: 'Bloop',
      npc_festival_announcer: 'Festival Announcer',
      npc_block_o_matic: 'Block-O-Matic 3000',
      npc_professor_poplin: 'Professor Poplin',
      npc_king_bloxley: 'King Bloxley',
      npc_cupcake_slime_king: 'Cupcake Slime King',
      npc_prototype_no_7: 'Prototype No. 7',
      npc_gelato_golem: 'Gelato Golem',
      npc_sir_snore_a_lot: 'Sir Snore-a-Lot',
      npc_high_score_hydra: 'High Score Hydra',
      npc_cupcake_slime: 'Cupcake Slime',
      npc_wrench_goblin: 'Wrench Goblin',
      npc_snowcone_sprite: 'Snowcone Sprite',
      npc_sleepy_guard: 'Sleepy Guard'
    };
    return names[speakerId] ?? speakerId.replace(/^npc_/, '').replace(/^hero_/, '').replace(/_/g, ' ');
  }
}
