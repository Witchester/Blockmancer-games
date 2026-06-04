import type { RunState } from '../types/GameTypes';

type EffectConfig = Record<string, unknown>;
type EffectResult = { message: string };

export class UpgradeCardEffectHandler {
  applyCardEffect(
    state: RunState,
    cardId: string,
    effectType: string,
    effectConfig: EffectConfig,
    cardLevel: number
  ): string {
    const level = Math.max(1, Math.min(5, cardLevel));
    const handler = this.getHandler(effectType);
    if (handler) {
      return handler(state, effectConfig, level);
    }
    const p = state.player;
    console.warn(`[UpgradeCardEffectHandler] Unsupported effectType "${effectType}" for card "${cardId}". Safe fallback applied.`);
    return `"${effectType}" applied at Lv${level}: Festival magic shimmers but nothing obvious changes.`;
  }

private getHandler(effectType: string): ((state: RunState, cfg: EffectConfig, level: number) => string) | null {
        // Effect ID aliases for legacy upgrade JSON compatibility
        const aliasMap: Record<string, string> = {
            'increase_fever_gain': 'fever_gain_bonus',
            'increase_fever_duration': 'fever_duration_bonus',
            'increase_fever_capacity': 'fever_capacity_bonus',
            'manual_release_shield': 'fever_release_shield',
            'fever_safety_clear': 'fever_release_safety',
            'increase_fever_overflow': 'fever_overflow_utility',
            'star_encore': 'fever_star_encore',
            'increase_line_damage': 'board_line_damage',
            'reduce_spell_cost': 'hero_mana_gain',
            'increase_specific_spell_damage': 'hero_spell_damage',
            'heal_player': 'hero_heal_after_node',
            'increase_combo_bonus': 'board_cascade_bonus',
            'clear_extra_blocks': 'board_line_damage'
        };
        const normalizedType = aliasMap[effectType] ?? effectType;
    
    const handlers: Record<string, (state: RunState, cfg: EffectConfig, level: number) => string> = {
      hero_max_hp_boost: this.heroMaxHp,
      hero_shield_start: this.heroShieldStart,
      hero_heal_after_node: this.heroHealAfterNode,
      hero_mana_gain: this.heroManaGain,
      hero_spell_damage: this.heroSpellDamage,
      hero_warning_timing: this.heroWarningTiming,
      hero_milo_mana_bonus: this.heroMiloMana,
      hero_pippa_fire_mastery: this.heroPippaFire,
      hero_zuzu_bomb_safety: this.heroZuzuBomb,
      hero_nixie_slow_timing: this.heroNixieSlow,
      hero_bruk_guard_bonus: this.heroBrukGuard,
      hero_lumi_star_bonus: this.heroLumiStar,
      board_line_damage: this.boardLineDamage,
      board_cascade_bonus: this.boardCascadeBonus,
      board_hold_bonus: this.boardHoldBonus,
      board_next_queue_reveal: this.boardNextQueue,
      board_soft_junk_reduction: this.boardSoftJunk,
      board_hazard_warning: this.boardHazardWarning,
      board_low_ceiling_safety: this.boardLowCeiling,
      board_stack_rhythm: this.boardStackRhythm,
      fever_gain_bonus: this.feverGainBonus,
      fever_duration_bonus: this.feverDurationBonus,
      fever_capacity_bonus: this.feverCapacityBonus,
      fever_release_shield: this.feverReleaseShield,
      fever_release_safety: this.feverReleaseSafety,
      fever_overflow_utility: this.feverOverflow,
      fever_star_encore: this.feverStarEncore,
      fever_stagecraft: this.feverStagecraft
    };
    return handlers[normalizedType] ?? null;
  }

  private n(cfg: EffectConfig, key: string, fallback = 0): number {
    const v = cfg[key];
    return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
  }
  private b(cfg: EffectConfig, key: string): boolean {
    return cfg[key] === true;
  }

  // --- Hero handlers ---

  private heroMaxHp = (state: RunState, cfg: EffectConfig, level: number): string => {
    const bonus = this.n(cfg, 'maxHpBonus', 6);
    const multi = this.n(cfg, 'statMultiplier', 1);
    const hp = Math.round(bonus * (cfg['statMultiplier'] !== undefined ? multi : (1 + level * 0.1)));
    state.player.maxHp += hp;
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + hp);
    return `Max HP +${hp}.`;
  };

  private heroShieldStart = (state: RunState, cfg: EffectConfig, level: number): string => {
    const shield = this.n(cfg, 'startShield', 4);
    state.player.shield += shield;
    if (this.b(cfg, 'shieldBlockPercent')) {
      return `Start each battle with +${shield} shield. Damage reduced 15% while shielded.`;
    }
    return `Start each battle with +${shield} shield.`;
  };

  private heroHealAfterNode = (state: RunState, cfg: EffectConfig, level: number): string => {
    const heal = this.n(cfg, 'healAfterNode', 3);
    if (this.b(cfg, 'bossFullHeal')) {
      return `Heal to full HP after boss encounters.`;
    }
    return `Heal ${heal} HP after each node clear.`;
  };

  private heroManaGain = (state: RunState, cfg: EffectConfig, level: number): string => {
    const mana = this.n(cfg, 'manaPerCascade', 2);
    const tempo = this.n(cfg, 'tempoBonus', 0);
    const msg: string[] = [];
    if (mana) msg.push(`+${mana} mana per cascade`);
    if (tempo) msg.push(`+${tempo} tempo`);
    return msg.length > 0 ? msg.join('. ') + '.' : 'Mana rhythm improves.';
  };

  private heroSpellDamage = (state: RunState, cfg: EffectConfig, level: number): string => {
    const pct = this.n(cfg, 'spellDamageMultiplier', 1.10);
    const reduction = this.n(cfg, 'costReduction', 0);
    const msg: string[] = [];
    if (pct !== 1) msg.push(`Spell damage +${Math.round((pct - 1) * 100)}%`);
    if (reduction) { state.player.spellCostReduction += reduction; msg.push(`Spell costs -${reduction}`); }
    return msg.join('. ') + '.';
  };

  private heroWarningTiming = (state: RunState, cfg: EffectConfig, level: number): string => {
    const bonus = this.n(cfg, 'warningExtension', 0) || this.n(cfg, 'hazardWarningBonus', 0) || this.n(cfg, 'entryGraceBonus', 0);
    if (this.b(cfg, 'clearHazardsOnNodeEnd')) return 'All hazards cleared after each node.';
    return `Warning timing improved by ${bonus} turn(s).`;
  };

  private heroMiloMana = (state: RunState, cfg: EffectConfig, level: number): string => {
    const perLine = this.n(cfg, 'manaPerLine', 0);
    const perCascade = this.n(cfg, 'manaPerCascade', 0);
    const multi = this.n(cfg, 'manaMultiplier', 0);
    if (perLine) return `+${perLine} mana per line clear.`;
    if (perCascade) return `+${perCascade} mana per cascade.`;
    if (multi > 1) return `All mana gains doubled.`;
    return `Milo's mana rhythm improves.`;
  };

  private heroPippaFire = (state: RunState, cfg: EffectConfig, level: number): string => {
    const fb = this.n(cfg, 'fireballBonus', 0);
    const shield = this.n(cfg, 'shieldPerFireSpell', 0);
    const fever = this.n(cfg, 'feverStartBonus', 0);
    const cascade = this.n(cfg, 'cascadeFireMultiplier', 0);
    if (fb) { state.player.spellBonuses.fireball = (state.player.spellBonuses.fireball ?? 0) + fb; }
    if (cascade > 1) return 'Cascades deal +15% fire damage.';
    if (fever > 0) return `Fever starts +${fever}% filled.`;
    return 'Fire mastery improves.';
  };

  private heroZuzuBomb = (state: RunState, cfg: EffectConfig, level: number): string => {
    const dmg = this.n(cfg, 'bombDamageBonus', 0);
    if (this.b(cfg, 'selfDamageImmune')) return 'Bombs no longer damage Zuzu.';
    if (this.b(cfg, 'bombCascadeBonus')) return 'Bombs trigger cascade bonuses.';
    if (dmg) { state.player.spellBonuses['bomb-rune'] = (state.player.spellBonuses['bomb-rune'] ?? 0) + dmg; }
    return 'Bomb safety improved.';
  };

  private heroNixieSlow = (state: RunState, cfg: EffectConfig, level: number): string => {
    const delay = this.n(cfg, 'enemyDelayLocks', 0);
    const mult = this.n(cfg, 'enemyDelayMultiplier', 0);
    if (mult > 1) return 'All enemy delays doubled.';
    if (this.b(cfg, 'holdPreserveEffects')) return 'Hold piece preserves block effects.';
    return 'Slow timing improved.';
  };

  private heroBrukGuard = (state: RunState, cfg: EffectConfig, level: number): string => {
    const hp = this.n(cfg, 'maxHpBonus', 0);
    const shield = this.n(cfg, 'startShield', 0);
    const heal = this.n(cfg, 'healAfterNode', 0);
    const multi = this.n(cfg, 'healMultiplier', 0);
    if (hp) { state.player.maxHp += hp; state.player.hp = Math.min(state.player.maxHp, state.player.hp + hp); return `Max HP +${hp}.`; }
    if (shield) { state.player.shield += shield; return `Start battles with +${shield} shield.`; }
    if (multi > 1) return 'All healing doubled.';
    return 'Guard bonus improved.';
  };

  private heroLumiStar = (state: RunState, cfg: EffectConfig, level: number): string => {
    const preview = this.n(cfg, 'previewBonus', 0);
    const fever = this.n(cfg, 'cascadeFeverBonus', 0);
    const mult = this.n(cfg, 'previewMultiplier', 0);
    if (mult > 1) return 'All preview bonuses doubled.';
    if (preview) return `See +${preview} piece in Next Queue.`;
    if (fever) return `Cascades grant +${fever} Fever meter.`;
    return 'Star guidance improves.';
  };

  // --- Board handlers ---

  private boardLineDamage = (state: RunState, cfg: EffectConfig, level: number): string => {
    const dmg = this.n(cfg, 'lineDamageBonus', 0);
    if (dmg) { state.player.lineDamageBonus += dmg; return `Line-clear damage +${dmg}.`; }
    if (this.b(cfg, 'columnSweepOnDouble')) return 'Double line clears trigger full column sweep.';
    return 'Board damage improved.';
  };

private boardCascadeBonus = (state: RunState, cfg: EffectConfig, level: number): string => {
     const mult = this.n(cfg, 'cascadeMultiplier', 0);
     const mana = this.n(cfg, 'cascadeManaBonus', 0);
     const fever = this.n(cfg, 'cascadeFeverBonus', 0);
     const damageBonus = this.n(cfg, 'cascadeDamageBonus', 0);
     const deepCascadeDamage = this.b(cfg, 'deepCascadeDamage');

     // Apply cascade multiplier
     if (mult > 1) {
       state.feverShowtime.cascadeMultiplier = Math.min(3, (state.feverShowtime.cascadeMultiplier ?? 1) * mult);
     }

     // Apply mana bonus
     if (mana) {
       state.feverShowtime.cascadeManaBonus = Math.min(10, (state.feverShowtime.cascadeManaBonus ?? 0) + mana);
     }

     // Apply fever bonus
     if (fever) {
       state.feverShowtime.cascadeFeverBonus = Math.min(50, (state.feverShowtime.cascadeFeverBonus ?? 0) + fever);
     }

     // Apply damage bonus
     if (damageBonus > 0) {
       state.player.cascadeDamageBonus = Math.min(0.5, (state.player.cascadeDamageBonus ?? 0) + damageBonus);
     }

     // Apply deep cascade damage flag
     if (deepCascadeDamage) {
       state.feverShowtime.deepCascadeDamageBonus = true;
     }

     if (mult > 1) return 'All cascade bonuses doubled.';
     if (mana) return `Cascade mana gain +${mana}.`;
     if (fever) return `Cascade Fever gain +${fever}.`;
     if (damageBonus > 0) return `Cascade damage +${Math.round(damageBonus * 100)}%.`;
     return 'Cascade rewards improved.';
   };

private boardHoldBonus = (state: RunState, cfg: EffectConfig, level: number): string => {
        const reduceFall = this.n(cfg, 'reduceFallSpeed', 0);
        const noCooldown = this.b(cfg, 'holdNoCooldown');
        const extraSlot = this.b(cfg, 'holdExtraSlot');
        const magicBlock = this.b(cfg, 'holdMagicBlock');
        if (reduceFall > 0) {
            state.fallSpeed = Math.max(0.7, state.fallSpeed - reduceFall);
            return 'Fall speed reduced slightly.';
        }
        if (noCooldown) return 'Hold always available.';
        if (extraSlot) return 'Hold can store 1 extra piece swap.';
        if (magicBlock) return 'Hold piece gains random beneficial block effect.';
        return 'Hold capability improved.';
    };

  private boardNextQueue = (state: RunState, cfg: EffectConfig, level: number): string => {
    const mult = this.n(cfg, 'previewMultiplier', 0);
    if (mult > 1) return 'All preview counts doubled.';
    return 'Next Queue preview improved.';
  };

  private boardSoftJunk = (state: RunState, cfg: EffectConfig, level: number): string => {
    if (this.b(cfg, 'junkToMana')) return 'Soft Junk converts to mana-granting blocks when cleared.';
    if (this.b(cfg, 'junkBlockSpawnZone')) return 'Soft Junk never reaches spawn zone.';
    if (this.b(cfg, 'lineClearAdjacentJunk')) return 'Line clears remove adjacent Soft Junk.';
    return 'Soft Junk handling improved.';
  };

  private boardHazardWarning = (state: RunState, cfg: EffectConfig, level: number): string => {
    const ext = this.n(cfg, 'warningExtension', 0);
    if (this.b(cfg, 'counterMultiplier') && (this.n(cfg, 'counterMultiplier', 1) > 1)) return 'All counter windows doubled.';
    if (ext) return `All warnings extended by +${ext}.`;
    return 'Hazard warning improved.';
  };

  private boardLowCeiling = (state: RunState, cfg: EffectConfig, level: number): string => {
    const ceiling = this.n(cfg, 'ceilingExtension', 0);
    if (this.b(cfg, 'royalBlockSpacing')) return 'Royal blocks cannot appear adjacent to each other.';
    if (ceiling) return `Low-ceiling safety margin extended by ${ceiling} rows.`;
    return 'Low-ceiling safety improved.';
  };

  private boardStackRhythm = (state: RunState, cfg: EffectConfig, level: number): string => {
    const dmg = this.n(cfg, 'highRowDamageBonus', 0);
    const mult = this.n(cfg, 'stackMultiplier', 0);
    const mana = this.n(cfg, 'columnClearMana', 0);
    if (mult > 1) return 'All stack bonuses doubled.';
    if (dmg) return `High-row clear damage +${dmg} (rows above 10).`;
    if (mana) return `Column clear grants +${mana} mana.`;
    return 'Stack rhythm improved.';
  };

// --- Fever handlers ---

   private feverGainBonus = (state: RunState, cfg: EffectConfig, level: number): string => {
     const mult = this.n(cfg, 'gainMultiplier', 0);
     const rate = this.n(cfg, 'gainRateBonus', 0);
     const start = this.n(cfg, 'feverStartBonus', 0);
     const mana = this.n(cfg, 'activationMana', 0);

     // Apply fever gain multiplier bonus (capped at 2.0 total)
     if (mult > 1) {
       state.feverShowtime.feverGainMultiplier = Math.min(2.0, (state.feverShowtime.feverGainMultiplier ?? 1) * mult);
       if (mana > 0) {
         state.feverShowtime.feverActivationMana = Math.min(30, (state.feverShowtime.feverActivationMana ?? 0) + mana);
       }
       return 'Fever gain rate doubled.';
     }

     // Apply fever gain rate bonus (each stack +8% to +40% cap)
     if (rate > 0) {
       const runStacks = Math.min(5, state.upgrades.filter((id) => id === 'upg_fever_gain').length);
       const maxRateBonus = 0.40; // 40% cap from content
       state.feverShowtime.feverGainRateBonus = Math.min(maxRateBonus, runStacks * 0.08 + rate);
       return `Fever gain rate +${Math.round(rate * 100)}%.`;
     }

     // Apply fever start bonus
     if (start > 0) {
       const runStacks = Math.min(5, state.upgrades.filter((id) => id === 'upg_fever_gain').length);
       const maxStartBonus = 40;
       state.feverShowtime.feverStartBonus = Math.min(maxStartBonus, runStacks * 8 + start);
       return `Fever starts +${start}% filled each battle.`;
     }

     // Apply activation mana bonus
     if (mana > 0) {
       state.feverShowtime.feverActivationMana = Math.min(30, (state.feverShowtime.feverActivationMana ?? 0) + mana);
       return `Fever activation grants +${mana} mana.`;
     }
     return 'Fever gain improved.';
   };

   private feverDurationBonus = (state: RunState, cfg: EffectConfig, level: number): string => {
     const bonus = this.n(cfg, 'durationBonus', 0);
     const drainReduction = this.n(cfg, 'drainReduction', 0);
     const earlyRelease = this.b(cfg, 'earlyRelease');

     // Apply duration bonus (capped at +3 from upgrades, encounter caps apply in FeverSystem)
     if (bonus > 0) {
       state.feverShowtime.durationBonus = Math.min(3, (state.feverShowtime.durationBonus ?? 0) + bonus);
     }

     // Apply drain reduction (reduces heat per lock tick)
     if (drainReduction > 0) {
       state.feverShowtime.heatDrainReduction = Math.min(0.5, (state.feverShowtime.heatDrainReduction ?? 0) + drainReduction);
     }

     // Apply early release bonus
     if (earlyRelease) {
       state.feverShowtime.earlyReleaseAvailable = true;
     }

     if (bonus) return `Showtime duration +${bonus} lock(s).`;
     return 'Showtime duration improved.';
   };

   private feverCapacityBonus = (state: RunState, cfg: EffectConfig, level: number): string => {
     const bonus = this.n(cfg, 'capacityBonus', 0);

     // Apply capacity bonus safely (encounter caps apply in FeverSystem)
     if (bonus > 0) {
       const currentBonus = state.feverShowtime.capacityBonus ?? 0;
       state.feverShowtime.capacityBonus = Math.min(2, currentBonus + bonus);
     }

     if (this.b(cfg, 'protectChargedRows')) state.feverShowtime.protectChargedRows = true;
     if (this.b(cfg, 'chargedGlow')) state.feverShowtime.chargedLineGlow = true;
     if (bonus) return `Max Charged Lines +${bonus}.`;
     return 'Charged Line capacity improved.';
   };

   private feverReleaseShield = (state: RunState, cfg: EffectConfig, level: number): string => {
     const multi = this.n(cfg, 'releaseMultiplier', 0);
     const shield = this.n(cfg, 'releaseShield', 0);
     const heal = this.n(cfg, 'releaseHeal', 0);
     const mana = this.n(cfg, 'releaseMana', 0);
     const earlyReleaseBonus = this.b(cfg, 'earlyReleaseBonus');

     // Apply release multiplier (doubles/triples shield bonuses)
     if (multi > 1) {
       state.feverShowtime.releaseShieldMultiplier = Math.min(3, (state.feverShowtime.releaseShieldMultiplier ?? 1) * multi);
     }

     // Apply shield bonus
     if (shield > 0) {
       const current = state.feverShowtime.baseReleaseShield ?? 0;
       state.feverShowtime.baseReleaseShield = Math.min(15, current + shield);
     }

     // Apply heal bonus
     if (heal > 0) {
       state.feverShowtime.releaseHealBonus = Math.min(20, (state.feverShowtime.releaseHealBonus ?? 0) + heal);
     }

     // Apply mana bonus
     if (mana > 0) {
       state.feverShowtime.releaseManaBonus = Math.min(30, (state.feverShowtime.releaseManaBonus ?? 0) + mana);
     }

     // Apply early release bonus
     if (earlyReleaseBonus) {
       state.feverShowtime.releaseShieldForEarly = true;
     }

     if (multi > 1) return 'All release bonuses doubled.';
     if (shield) return `Manual release grants +${shield} shield.`;
     if (heal) return `Fever release also heals ${heal} HP.`;
     if (mana) return `Fever release grants +${mana} mana.`;
     return 'Fever release improved.';
   };

   private feverReleaseSafety = (state: RunState, cfg: EffectConfig, level: number): string => {
     const clearHazards = this.n(cfg, 'clearHazards', 0);
     const heatShield = this.n(cfg, 'heatShield', 0);
     const heatMana = this.n(cfg, 'heatMana', 0);

     // All releases clear hazards
     if (this.b(cfg, 'allReleasesClearHazards')) {
       state.feverShowtime.allReleasesClearHazards = true;
     }

     // Max heat clears all hazards
     if (this.b(cfg, 'maxHeatClearAll')) {
       state.feverShowtime.maxHeatClearAllHazards = true;
     }

     // Clear Soft Junk
     if (this.b(cfg, 'clearSoftJunk')) {
       state.feverShowtime.clearSoftJunkOnRelease = true;
     }

     // Clear specific hazard count
     if (clearHazards > 0) {
       const current = state.feverShowtime.safetyHazardClearCount ?? 0;
       state.feverShowtime.safetyHazardClearCount = Math.min(5, current + clearHazards);
     }

     // Heat shield bonus
     if (heatShield > 0) {
       state.feverShowtime.heatShieldBonus = Math.min(10, heatShield);
     }

     // Heat mana bonus
     if (heatMana > 0) {
       state.feverShowtime.heatManaBonus = Math.min(15, heatMana);
     }

     if (this.b(cfg, 'allReleasesClearHazards')) return 'All releases clear hazards from the board.';
     if (this.b(cfg, 'maxHeatClearAll')) return 'Release at max heat clears ALL hazards.';
     if (this.b(cfg, 'clearSoftJunk')) return 'Release clears all Soft Junk.';
     if (clearHazards > 0) return `High-pressure release clears ${clearHazards} hazard block${clearHazards > 1 ? 's' : ''}.`;
     if (heatShield > 0) return `Release at high heat grants +${heatShield} shield.`;
     return 'Fever safety improved.';
   };

private feverOverflow = (state: RunState, cfg: EffectConfig, level: number): string => {
    const mult = this.n(cfg, 'conversionMultiplier', 0);
    const shieldConversion = this.n(cfg, 'shieldConversion', 0);
    const manaConversion = this.n(cfg, 'manaConversion', 0);
    const bossDelay = this.n(cfg, 'bossDelay', 0);

    // Apply overflow efficiency multiplier (capped at 1.6 total)
    if (mult > 1) {
      const current = state.feverShowtime.overflowEfficiencyMultiplier ?? 1.0;
      state.feverShowtime.overflowEfficiencyMultiplier = Math.min(1.6, current * (1 + mult));
    }

    // Apply shield conversion rate
    if (shieldConversion > 0) {
      state.feverShowtime.overflowShieldConversion = shieldConversion;
    }

    // Apply mana conversion rate
    if (manaConversion > 0) {
      state.feverShowtime.overflowManaConversion = manaConversion;
    }

    // Apply boss delay (locks)
    if (bossDelay > 0) {
      state.feverShowtime.overflowBossDelay = bossDelay;
    }

    if (mult > 1) return 'All overflow conversions doubled.';
    if (shieldConversion > 0) return `Overflow converts to shield at ${Math.round(shieldConversion * 100)}% rate.`;
    if (manaConversion > 0) return `Overflow converts to mana at ${Math.round(manaConversion * 100)}% rate.`;
    if (bossDelay > 0) return `Overflow delays boss by ${bossDelay} lock${bossDelay > 1 ? 's' : ''}.`;
    return 'Showtime overflow utility improved.';
  };

  private feverStarEncore = (state: RunState, cfg: EffectConfig, level: number): string => {
    const chance = this.n(cfg, 'starChance', 0);
    const max = this.n(cfg, 'maxStars', 1);

    // Enable star encore if not already active
    if (max > 0) {
      state.feverShowtime.starEncoreActive = true;
      state.feverShowtime.starEncoreChance = chance > 0 ? chance : 1.0; // Default 100% if not specified
      state.feverShowtime.starEncoreMax = max;
    }

    if (chance && max) return `Up to ${max} star(s) at ${Math.round(chance * 100)}% chance each.`;
    return 'Star Encore improved.';
  };

  private feverStagecraft = (state: RunState, cfg: EffectConfig, level: number): string => {
    const decay = this.n(cfg, 'heatDecayBonus', 0);
    const floor = this.n(cfg, 'refillFloor', 0);
    const threshold = this.n(cfg, 'thresholdBonus', 0);
    const enemyDelay = this.n(cfg, 'enemyDelay', 0);
    const mediumThresholdBonus = this.n(cfg, 'mediumThresholdBonus', 0);

    // Heat decays faster after release
    if (decay > 0) {
      state.feverShowtime.heatDecayBonus = Math.min(0.5, decay);
    }

    // Refill meter after release (up to floor percentage)
    if (floor > 0) {
      state.feverShowtime.postReleaseRefillFloor = Math.min(50, floor);
    }

    // Raise heat thresholds (reduces heat gain)
    if (threshold > 0) {
      state.feverShowtime.heatThresholdBonus = Math.min(30, threshold);
    }

    // Enemy delay on fever activation
    if (enemyDelay > 0) {
      state.feverShowtime.feverEnemyDelay = enemyDelay;
    }

    // Medium threshold bonus
    if (mediumThresholdBonus > 0) {
      state.feverShowtime.mediumHeatThresholdBonus = mediumThresholdBonus;
    }

    if (threshold) return `All heat thresholds raised by +${threshold}.`;
    if (floor) return `Fever meter refills to ${floor} after release.`;
    if (decay) return `Heat decays ${Math.round(decay * 100)}% faster.`;
    if (enemyDelay > 0) return `Fever delays enemy by ${enemyDelay} lock${enemyDelay > 1 ? 's' : ''}.`;
    return 'Stagecraft improved.';
  };
}

export const upgradeCardEffectHandler = new UpgradeCardEffectHandler();
