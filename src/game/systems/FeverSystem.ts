import type { CascadeResult, RunState, FeverShowtimeState, FeverReleaseReason, FeverReleaseSummary, FeverHeatLevel, BoardState, BoardCell, BoardBlockCell } from '../types/GameTypes';
import type { FeverPressureBand, FeverPressureSnapshot, FeverPressureBudgetResult, SoftJunkCell, DelayedJunkEntry, FeverPressureConversionType } from '../types/FeverPressureTypes';
import { FEVER_HEAT_LOW, FEVER_HEAT_MEDIUM, FEVER_HEAT_HIGH, FEVER_HEAT_MAX } from '../types/FeverPressureTypes';
import { clamp } from '../utils/math';
import { BoardSystem } from './BoardSystem';
import { resolveCascadeGravity } from './CascadeGravitySystem';
import { LINE_CLEAR_BONUS, MANA_GAIN, CASCADE_MANA_BONUS_MULTIPLIER } from '../utils/constants';

const FEVER_MAX = 100;
const BASE_ACTIVE_LOCKS = 5;
const BASE_DAMAGE_MULTIPLIER = 1.35;
const FEVER_FIZZ_DAMAGE_MULTIPLIER = 1.45;

export const FEVER_METER_MAX = 100;
export const FEVER_BASE_DURATION_LOCKS = 4;
export const FEVER_BASE_MAX_CHARGED_LINES = 4;
export const FEVER_RELEASE_METER_REFILL_CAP = 30;

export type FeverGainResult = {
    gained: number;
    triggered: boolean;
    activeLocks: number;
};

export type FeverEncounterType = "normal" | "elite" | "boss" | "final_boss";

export type ShowtimeOverflowUtility =
  | { type: "shield"; amount: number }
  | { type: "mana"; amount: number }
  | { type: "boss_intent_delay"; amount: number }
  | { type: "clear_hazard_blocks"; amount: number }
  | { type: "reduce_next_boss_hazard"; amount: number }
  | { type: "score_bonus"; amount: number }
  | { type: "gold_bonus"; amount: number };

export type FeverSaveCleanupContext = "node_end" | "battle_end" | "run_save" | "invalid_repair";

export type ChargedLineValidationResult = {
    validRows: number[];
    invalidRows: number[];
    duplicateRows: number[];
    desyncedRows: number[];
};

export type FeverDebugSnapshot = {
    meter: number;
    ready: boolean;
    active: boolean;
    locksRemaining: number;
    chargedLineCount: number;
    chargedLineRows: number[];
    maxChargedLines: number;
    heat: number;
    heatLevel: FeverHeatLevel;
    softJunkCount: number;
    releaseRequested: boolean;
    lastReleaseReason?: FeverReleaseReason;
    lastReleaseSummary?: FeverReleaseSummary;
    encounterType?: FeverEncounterType;
    pressureBand?: FeverPressureBand;
    warnings: string[];
};

export class FeverSystem {
    private static readonly devWarningKeys = new Set<string>();

    private finiteNumber(value: unknown, fallback: number): number {
        const numeric = Number(value);
        return Number.isFinite(numeric) ? numeric : fallback;
    }

    private clampInteger(value: unknown, fallback: number, min: number, max: number): number {
        return clamp(Math.floor(this.finiteNumber(value, fallback)), min, max);
    }

    private warnDevOnce(key: string, message: string): void {
        if (!import.meta.env.DEV || FeverSystem.devWarningKeys.has(key)) {
            return;
        }
        FeverSystem.devWarningKeys.add(key);
        console.warn(message);
    }

    getDefaultFeverShowtimeState(): FeverShowtimeState {
        return {
            meter: 0,
            ready: false,
            active: false,
            locksRemaining: 0,
            baseDurationLocks: FEVER_BASE_DURATION_LOCKS,
            maxChargedLines: FEVER_BASE_MAX_CHARGED_LINES,
            chargedLineRows: [],
            heat: 0,
            heatLevel: "none",
            manualReleaseAvailable: false,
            releaseRequested: false,
            lastReleaseSummary: undefined
        };
    }

    normalizeFeverSaveState(raw: unknown): FeverShowtimeState {
        const defaults = this.getDefaultFeverShowtimeState();
        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
            return defaults;
        }

        const state = raw as Partial<FeverShowtimeState>;
        const allowedHeatLevels = new Set<FeverHeatLevel>(['none', 'low', 'medium', 'high', 'max']);
        const meter = this.clampInteger(state.meter, defaults.meter, 0, FEVER_METER_MAX);
        const heat = this.clampInteger(state.heat, defaults.heat, 0, FEVER_HEAT_MAX);
        const calculatedHeatLevel = this.getFeverHeatLevel(heat);
        const providedHeatLevel = typeof state.heatLevel === 'string' && allowedHeatLevels.has(state.heatLevel as FeverHeatLevel)
            ? state.heatLevel as FeverHeatLevel
            : calculatedHeatLevel;
        const heatLevel = providedHeatLevel === calculatedHeatLevel ? providedHeatLevel : calculatedHeatLevel;
        const chargedLineRows = Array.isArray(state.chargedLineRows)
            ? state.chargedLineRows
                .map((row) => Math.floor(this.finiteNumber(row, -1)))
                .filter((row) => row >= 0)
            : [];

        const normalized = this.normalizeFeverState({
            ...state,
            meter,
            ready: Boolean(state.ready) || meter >= FEVER_METER_MAX,
            active: Boolean(state.active),
            locksRemaining: this.clampInteger(state.locksRemaining, defaults.locksRemaining, 0, 100),
            baseDurationLocks: this.clampInteger(state.baseDurationLocks, defaults.baseDurationLocks, 1, 100),
            maxChargedLines: this.clampInteger(state.maxChargedLines, defaults.maxChargedLines, 1, 100),
            chargedLineRows,
            heat,
            heatLevel,
            manualReleaseAvailable: Boolean(state.manualReleaseAvailable),
            releaseRequested: Boolean(state.releaseRequested)
        });

        if (state.heatLevel !== undefined && state.heatLevel !== heatLevel) {
            this.warnDevOnce(
                'fever-heat-level-repaired',
                '[Fever] Fever Heat level did not match saved heat value. Recalculated safely.'
            );
        }

        return normalized;
    }

    migrateLegacyFeverState(rawSave: unknown): FeverShowtimeState {
        const defaults = this.getDefaultFeverShowtimeState();
        if (!rawSave || typeof rawSave !== 'object' || Array.isArray(rawSave)) {
            return defaults;
        }
        const raw = rawSave as Record<string, unknown>;
        if (raw.feverShowtime && typeof raw.feverShowtime === 'object' && !Array.isArray(raw.feverShowtime)) {
            return this.normalizeFeverSaveState(raw.feverShowtime);
        }
        const player = raw.player && typeof raw.player === 'object' && !Array.isArray(raw.player)
            ? raw.player as Record<string, unknown>
            : {};
        const meterSource = raw.feverMeter ?? player.fever ?? defaults.meter;
        const meter = this.clampInteger(meterSource, defaults.meter, 0, FEVER_METER_MAX);
        return {
            ...defaults,
            meter,
            ready: meter >= FEVER_METER_MAX
        };
    }

    clearBoardLocalFeverState(fever: FeverShowtimeState): FeverShowtimeState {
        const normalized = this.normalizeFeverSaveState(fever);
        return {
            ...normalized,
            active: false,
            locksRemaining: 0,
            chargedLineRows: [],
            heat: 0,
            heatLevel: 'none',
            manualReleaseAvailable: false,
            releaseRequested: false,
            lastReleaseSummary: normalized.lastReleaseSummary && !normalized.releaseRequested
                ? normalized.lastReleaseSummary
                : undefined
        };
    }

    clearFeverHeatForNodeEnd(fever: FeverShowtimeState): FeverShowtimeState {
        return {
            ...fever,
            heat: 0,
            heatLevel: 'none'
        };
    }

    prepareFeverStateForSave(fever: FeverShowtimeState, context: FeverSaveCleanupContext): FeverShowtimeState {
        const prepared = this.clearBoardLocalFeverState(fever);
        if (import.meta.env.DEV) {
            if (fever.releaseRequested) {
                this.warnDevOnce(`fever-release-request-persisted-${context}`, `[Fever] releaseRequested was present during ${context}. Cleared before save.`);
            }
            if (fever.heat > 0) {
                this.warnDevOnce(`fever-heat-persisted-${context}`, `[Fever] Fever Heat was present during ${context}. Cleared before save.`);
            }
            if (fever.active || fever.chargedLineRows.length > 0 || fever.locksRemaining > 0) {
                this.warnDevOnce(`fever-board-local-persisted-${context}`, `[Fever] Board-local Showtime state was cleared during ${context}.`);
            }
        }
        return prepared;
    }

    validateChargedLineState(fever: FeverShowtimeState, board: BoardState): ChargedLineValidationResult {
        const validRows: number[] = [];
        const invalidRows: number[] = [];
        const duplicateRows: number[] = [];
        const desyncedRows: number[] = [];
        const seenRows = new Set<number>();

        for (const rawRow of fever.chargedLineRows) {
            const row = Math.floor(this.finiteNumber(rawRow, -1));
            if (seenRows.has(row)) {
                duplicateRows.push(row);
                continue;
            }
            seenRows.add(row);
            if (row < 0 || row >= board.rows) {
                invalidRows.push(row);
                continue;
            }
            if (!this.isRowCharged(board, row)) {
                desyncedRows.push(row);
                continue;
            }
            validRows.push(row);
        }

        return { validRows, invalidRows, duplicateRows, desyncedRows };
    }

    clearFeverBoardMarkers(board: BoardState): BoardState {
        return {
            ...board,
            grid: board.grid.map((row) =>
                row.map((cell) => {
                    if (cell !== 0 && typeof cell === 'object') {
                        const nextCell = { ...cell };
                        delete (nextCell as BoardBlockCell).feverCharged;
                        delete (nextCell as BoardBlockCell & { feverGenerated?: boolean }).feverGenerated;
                        return nextCell;
                    }
                    return cell;
                })
            )
        };
    }

    clearSoftJunkForNodeEnd(board: BoardState): BoardState {
        return {
            ...board,
            grid: board.grid.map((row) =>
                row.map((cell) => {
                    if (cell !== 0 && typeof cell === 'object' && (cell as BoardBlockCell & { softJunk?: boolean }).softJunk) {
                        return 0;
                    }
                    return cell;
                })
            )
        };
    }

    repairInvalidFeverState(
        fever: FeverShowtimeState,
        board?: BoardState,
        battleState?: RunState
    ): {
        fever: FeverShowtimeState;
        board?: BoardState;
        repaired: boolean;
        warnings: string[];
    } {
        let repaired = false;
        const warnings: string[] = [];
        let nextFever = this.normalizeFeverSaveState(fever);
        let nextBoard = board;

        const addWarning = (key: string, message: string) => {
            warnings.push(message);
            this.warnDevOnce(key, `[Fever] ${message}`);
        };

        const boardValid = Boolean(nextBoard && Array.isArray(nextBoard.grid) && nextBoard.rows > 0 && nextBoard.columns > 0);
        if (nextFever.active && !battleState?.activeEnemy) {
            addWarning('fever-active-without-battle', 'Fever active without battle state. Cleared board-local Showtime state.');
            nextFever = this.clearBoardLocalFeverState(nextFever);
            repaired = true;
        }
        if (nextFever.active && !boardValid) {
            addWarning('fever-active-without-board', 'Fever active without a valid board. Cleared board-local Showtime state.');
            nextFever = this.clearBoardLocalFeverState(nextFever);
            repaired = true;
        }

        if (nextBoard) {
            const chargedValidation = this.validateChargedLineState(nextFever, nextBoard);
            if (chargedValidation.invalidRows.length > 0) {
                addWarning('fever-charged-row-out-of-bounds', `Charged Line rows out of bounds: ${chargedValidation.invalidRows.join(', ')}.`);
                repaired = true;
            }
            if (chargedValidation.duplicateRows.length > 0) {
                addWarning('fever-charged-row-duplicates', `Duplicate Charged Line rows removed: ${chargedValidation.duplicateRows.join(', ')}.`);
                repaired = true;
            }
            if (chargedValidation.desyncedRows.length > 0) {
                addWarning('fever-charged-row-desync', `Charged Line board marker desync repaired on rows: ${chargedValidation.desyncedRows.join(', ')}.`);
                nextFever = this.clearBoardLocalFeverState(nextFever);
                nextBoard = this.clearFeverBoardMarkers(nextBoard);
                repaired = true;
            } else if (chargedValidation.invalidRows.length > 0 || chargedValidation.duplicateRows.length > 0) {
                nextFever = {
                    ...nextFever,
                    chargedLineRows: chargedValidation.validRows
                };
            }

            let softJunkRemoved = 0;
            const spawnZoneRows = 2;
            nextBoard = {
                ...nextBoard,
                grid: nextBoard.grid.map((rowCells, row) =>
                    rowCells.map((cell) => {
                        if (cell !== 0 && typeof cell === 'object' && (cell as BoardBlockCell & { softJunk?: boolean }).softJunk) {
                            if (!nextFever.active || row < spawnZoneRows) {
                                softJunkRemoved++;
                                return 0;
                            }
                        }
                        return cell;
                    })
                )
            };
            if (softJunkRemoved > 0) {
                addWarning('fever-soft-junk-repaired', `Removed ${softJunkRemoved} unsafe Soft Junk cell${softJunkRemoved === 1 ? '' : 's'}.`);
                repaired = true;
            }
        } else if (nextFever.chargedLineRows.length > 0) {
            addWarning('fever-charged-without-board', 'Charged Lines existed without a valid board. Cleared board-local Showtime state.');
            nextFever = this.clearBoardLocalFeverState(nextFever);
            repaired = true;
        }

        if (!nextFever.active && (nextFever.heat > 0 || nextFever.heatLevel !== 'none')) {
            addWarning('fever-heat-outside-active', 'Fever Heat existed outside active Showtime. Cleared Heat.');
            nextFever = this.clearFeverHeatForNodeEnd(nextFever);
            repaired = true;
        }

        if (nextFever.releaseRequested && !nextFever.active) {
            addWarning('fever-release-without-active', 'Release request existed outside active Showtime. Cleared release request.');
            nextFever = {
                ...nextFever,
                releaseRequested: false,
                manualReleaseAvailable: false
            };
            repaired = true;
        }

        if (repaired) {
            nextFever = this.prepareFeverStateForSave(nextFever, 'invalid_repair');
        }

        return {
            fever: nextFever,
            board: nextBoard,
            repaired,
            warnings
        };
    }

    getDebugSnapshot(fever: FeverShowtimeState, board?: BoardState, state?: RunState): FeverDebugSnapshot {
        const warnings: string[] = [];
        const softJunkCount = board
            ? board.grid.reduce((count, row) => count + row.filter((cell) => cell !== 0 && typeof cell === 'object' && (cell as BoardBlockCell & { softJunk?: boolean }).softJunk).length, 0)
            : 0;
        if (fever.active && !state?.activeEnemy) {
            warnings.push('Fever active without battle state.');
        }
        if (fever.releaseRequested && !fever.active) {
            warnings.push('Release request is pending outside active Showtime.');
        }
        if (!fever.active && fever.heat > 0) {
            warnings.push('Fever Heat is present outside active Showtime.');
        }
        if (board) {
            const charged = this.validateChargedLineState(fever, board);
            if (charged.invalidRows.length || charged.duplicateRows.length || charged.desyncedRows.length) {
                warnings.push('Charged Lines need repair.');
            }
        }
        return {
            meter: fever.meter,
            ready: fever.ready,
            active: fever.active,
            locksRemaining: fever.locksRemaining,
            chargedLineCount: fever.chargedLineRows.length,
            chargedLineRows: [...fever.chargedLineRows],
            maxChargedLines: fever.maxChargedLines,
            heat: fever.heat,
            heatLevel: fever.heatLevel,
            softJunkCount,
            releaseRequested: fever.releaseRequested,
            lastReleaseReason: fever.lastReleaseSummary?.releaseReason,
            lastReleaseSummary: fever.lastReleaseSummary,
            encounterType: state ? this.getFeverEncounterType(state) : undefined,
            pressureBand: board && state ? this.computeFeverPressureSnapshot(board, fever, 0, state).band : undefined,
            warnings
        };
    }

    normalizeFeverState(state?: Partial<FeverShowtimeState>): FeverShowtimeState {
        const defaults = this.getDefaultFeverShowtimeState();
        if (!state || typeof state !== 'object' || Array.isArray(state)) {
            return defaults;
        }
        const allowedHeatLevels = new Set<FeverHeatLevel>(['none', 'low', 'medium', 'high', 'max']);
        const heatLevel = typeof state.heatLevel === 'string' && allowedHeatLevels.has(state.heatLevel as FeverHeatLevel)
            ? state.heatLevel as FeverHeatLevel
            : defaults.heatLevel;

        const chargedLineRows = Array.isArray(state.chargedLineRows)
            ? state.chargedLineRows.filter((row): row is number => typeof row === 'number' && Number.isInteger(row))
            : defaults.chargedLineRows;

        let meter = Math.max(0, Number(state.meter ?? defaults.meter));
        let ready = Boolean(state.ready ?? defaults.ready);
        let active = Boolean(state.active ?? defaults.active);
        let locksRemaining = Math.max(0, Math.floor(Number(state.locksRemaining ?? defaults.locksRemaining)));
        let baseDurationLocks = Math.max(1, Math.floor(Number(state.baseDurationLocks ?? defaults.baseDurationLocks)));
        let maxChargedLines = Math.max(1, Math.floor(Number(state.maxChargedLines ?? defaults.maxChargedLines)));
        let heat = Math.max(0, Number(state.heat ?? defaults.heat));
        let manualReleaseAvailable = Boolean(state.manualReleaseAvailable ?? defaults.manualReleaseAvailable);
        let releaseRequested = Boolean(state.releaseRequested ?? defaults.releaseRequested);

        if (active) {
            let isInvalid = false;
            if (locksRemaining <= 0 || locksRemaining > 100) {
                isInvalid = true;
            }
            if (baseDurationLocks <= 0 || baseDurationLocks > 100) {
                isInvalid = true;
            }
            if (heat < 0 || heat > 100) {
                isInvalid = true;
            }

            if (isInvalid) {
                console.warn("FeverShowtimeState repair: active Fever has invalid fields. Clearing active state while preserving meter and ready status.");
                active = false;
                locksRemaining = 0;
                chargedLineRows.length = 0;
                heat = 0;
                manualReleaseAvailable = false;
                releaseRequested = false;
            }
        }

        let lastReleaseSummary: FeverReleaseSummary | undefined = undefined;
        if (state.lastReleaseSummary && typeof state.lastReleaseSummary === 'object' && !Array.isArray(state.lastReleaseSummary)) {
            const summaryRaw = state.lastReleaseSummary as Partial<FeverReleaseSummary>;
            const allowedReleaseReasons = new Set<FeverReleaseReason>([
                'manual',
                'duration_expired',
                'max_charged_lines',
                'node_end',
                'battle_end',
                'invalid_state_repair'
            ]);
            const summaryHeatLevel = typeof summaryRaw.heatLevel === 'string' && allowedHeatLevels.has(summaryRaw.heatLevel as FeverHeatLevel)
                ? summaryRaw.heatLevel as FeverHeatLevel
                : 'none';
            const releaseReason = typeof summaryRaw.releaseReason === 'string' && allowedReleaseReasons.has(summaryRaw.releaseReason as FeverReleaseReason)
                ? summaryRaw.releaseReason as FeverReleaseReason
                : 'invalid_state_repair';

            lastReleaseSummary = {
                chargedLinesCleared: Math.max(0, Number(summaryRaw.chargedLinesCleared ?? 0)),
                rawDamage: Math.max(0, Number(summaryRaw.rawDamage ?? 0)),
                cappedDamage: Math.max(0, Number(summaryRaw.cappedDamage ?? 0)),
                overflowDamage: Math.max(0, Number(summaryRaw.overflowDamage ?? 0)),
                manaGained: Math.max(0, Number(summaryRaw.manaGained ?? 0)),
                heatLevel: summaryHeatLevel,
                releaseReason
            };
        }

        return {
            meter,
            ready,
            active,
            locksRemaining,
            baseDurationLocks,
            maxChargedLines,
            chargedLineRows,
            heat,
            heatLevel,
            manualReleaseAvailable,
            releaseRequested,
            lastReleaseSummary
        };
    }

    gainFever(state: FeverShowtimeState, amount: number, source: string): FeverShowtimeState {
        if (state.active) {
            return state;
        }
        const newMeter = clamp(state.meter + amount, 0, FEVER_METER_MAX);
        return {
            ...state,
            meter: newMeter,
            ready: newMeter >= FEVER_METER_MAX
        };
    }

    canActivateFever(state: FeverShowtimeState): boolean {
        return state.ready && !state.active;
    }

    activateFever(state: FeverShowtimeState): FeverShowtimeState {
        if (!state.ready) {
            return state;
        }
        return {
            ...state,
            active: true,
            ready: false,
            locksRemaining: state.baseDurationLocks,
            manualReleaseAvailable: true,
            releaseRequested: false,
            meter: 0
        };
    }

    tickFeverOnPieceLock(state: FeverShowtimeState): FeverShowtimeState {
        if (!state.active) {
            return state;
        }
        const nextLocks = state.locksRemaining - 1;
        if (nextLocks <= 0) {
            return this.requestFeverRelease(
                {
                    ...state,
                    locksRemaining: 0
                },
                'duration_expired'
            );
        }
        return {
            ...state,
            locksRemaining: nextLocks
        };
    }

    requestFeverRelease(state: FeverShowtimeState, reason: FeverReleaseReason): FeverShowtimeState {
        return {
            ...state,
            releaseRequested: true,
            lastReleaseSummary: {
                chargedLinesCleared: 0,
                rawDamage: 0,
                cappedDamage: 0,
                overflowDamage: 0,
                manaGained: 0,
                heatLevel: state.heatLevel,
                releaseReason: reason,
                cascadeResult: undefined,
                encounterType: undefined,
                capApplied: undefined,
                overflowUtility: undefined
            }
        };
    }

    clearFeverStateForNodeEnd(state: FeverShowtimeState): FeverShowtimeState {
        return {
            ...state,
            active: false,
            locksRemaining: 0,
            chargedLineRows: [],
            heat: 0,
            heatLevel: 'none',
            manualReleaseAvailable: false,
            releaseRequested: false,
            lastReleaseSummary: undefined
        };
    }

    // --- Original FeverSystem Methods Kept for Backwards/Existing Gameplay Support ---

    calculateCascadeGain(state: RunState, cascade: CascadeResult): number {
        if (cascade.totalLinesCleared <= 0) {
            return 0;
        }

        const cascadeBonus = cascade.cascadeCount * 8;
        const lineBonus = cascade.totalLinesCleared * 4;
        const dropBonus = Math.min(10, Math.floor(cascade.blocksDropped / 6));
        const comboBonus = state.combo >= 4 ? 10 : state.combo >= 3 ? 6 : state.combo >= 2 ? 3 : 0;
        const choirBonus = state.ownedRewards.includes('upg_cascade_choir') && cascade.cascadeCount > 1 ? 6 : 0;

        const baseGain = cascadeBonus + lineBonus + dropBonus + comboBonus + choirBonus;
        const multiplier = this.getFeverGainMultiplier(state);
        return Math.round(baseGain * multiplier);
    }

    gainFromCascade(state: RunState, cascade: CascadeResult): FeverGainResult {
        if (state.player.feverActiveLocks > 0) {
            return { gained: 0, triggered: false, activeLocks: state.player.feverActiveLocks };
        }

        const gained = this.calculateCascadeGain(state, cascade);
        state.player.fever = clamp(state.player.fever + gained, 0, FEVER_MAX);

        // Keep state.feverShowtime in sync
        state.feverShowtime = this.gainFever(state.feverShowtime, gained, 'cascade');

        if (state.player.fever < FEVER_MAX) {
            return { gained, triggered: false, activeLocks: 0 };
        }

        // Handled via manual release / showtime foundation now, but keep legacy fields in sync
        state.player.fever = 0;
        state.player.feverActiveLocks = this.getActiveLocks(state);

        const encounterType = this.getFeverEncounterType(state);
        const effectiveDuration = this.getEffectiveFeverDurationLocks(FEVER_BASE_DURATION_LOCKS, state, encounterType);
        const effectiveCapacity = this.getEffectiveFeverMaxChargedLines(FEVER_BASE_MAX_CHARGED_LINES, state, encounterType);

        state.feverShowtime = this.activateFever(state.feverShowtime);
        state.feverShowtime.locksRemaining = effectiveDuration;
        state.feverShowtime.baseDurationLocks = effectiveDuration;
        state.feverShowtime.maxChargedLines = effectiveCapacity;
        state.player.feverActiveLocks = effectiveDuration;

        return { gained, triggered: true, activeLocks: state.player.feverActiveLocks };
    }

    getDamageMultiplier(state: RunState): number {
        if (state.player.feverActiveLocks <= 0) {
            return 1;
        }

        return state.ownedRewards.includes('upg_fever_fizz')
            ? FEVER_FIZZ_DAMAGE_MULTIPLIER
            : BASE_DAMAGE_MULTIPLIER;
    }

    getManaBonus(state: RunState, manaGain: number): number {
        if (state.player.feverActiveLocks <= 0 || manaGain <= 0) {
            return 0;
        }

        return Math.max(1, Math.floor(manaGain * 0.25));
    }

    tickActiveLock(state: RunState): boolean {
        if (state.player.feverActiveLocks <= 0) {
            return false;
        }

        state.player.feverActiveLocks -= 1;
        if (state.feverShowtime) {
            state.feverShowtime = this.tickFeverOnPieceLock(state.feverShowtime);
        }
        return state.player.feverActiveLocks === 0;
    }

    isHydraComboWeaknessActive(state: RunState): boolean {
        return state.activeEnemy?.id === 'mon_boss_high_score_hydra' && (state.combo >= 3 || state.player.feverActiveLocks > 0);
    }

    private getActiveLocks(state: RunState): number {
        const baseLocks = state.ownedRewards.includes('upg_fever_fizz') ? BASE_ACTIVE_LOCKS + 1 : BASE_ACTIVE_LOCKS;
        // Phase 5: apply upgraded effective duration with encounter caps
        const encounterType = this.getFeverEncounterType(state);
        return this.getEffectiveFeverDurationLocks(baseLocks, state, encounterType);
    }

    // --- Phase 2 Methods ---

    /**
     * Detect completed lines in the board.
     * @param board The board state.
     * @returns Array of row indices that are completed.
     */
    detectCompletedLinesForFever(board: BoardState): number[] {
        const completedRows: number[] = [];
        for (let row = 0; row < board.rows; row++) {
            let isCompleted = true;
            for (let col = 0; col < board.columns; col++) {
                const cell = board.grid[row][col];
                if (cell === 0) {
                    isCompleted = false;
                    break;
                }
            }
            if (isCompleted) {
                completedRows.push(row);
            }
        }
        return completedRows;
    }

    /**
     * Charge completed lines during Fever.
     * @param board The board state.
     * @param fever The fever showtime state.
     * @returns Updated board and fever state, and the charged rows added.
     */
    chargeCompletedLinesDuringFever(board: BoardState, fever: FeverShowtimeState): {
        board: BoardState;
        fever: FeverShowtimeState;
        chargedRowsAdded: number[];
    } {
        const completedRows = this.detectCompletedLinesForFever(board);
        const newChargedRows: number[] = [];
        const newChargedLineRows = [...fever.chargedLineRows];

        for (const row of completedRows) {
            // Skip if already charged
            if (newChargedLineRows.includes(row)) {
                continue;
            }
            // Skip if we've reached max charged lines
            if (newChargedLineRows.length >= fever.maxChargedLines) {
                break;
            }
            // Mark the row as charged in the board
            for (let col = 0; col < board.columns; col++) {
                const cell = board.grid[row][col];
                if (cell !== 0 && typeof cell === 'object') {
                    // We need to create a new cell with feverCharged set to true
                    // Since BoardBlockCell is mutable, we can just set the property
                    // But to be safe, we'll create a new object (though the board system might rely on reference)
                    // We'll just set the property directly as it's allowed.
                    (cell as BoardBlockCell).feverCharged = true;
                }
            }
            newChargedLineRows.push(row);
            newChargedRows.push(row);
        }

        const updatedFever: FeverShowtimeState = {
            ...fever,
            chargedLineRows: newChargedLineRows
        };

        return {
            board, // board is mutated in place
            fever: updatedFever,
            chargedRowsAdded: newChargedRows
        };
    }

    /**
     * Check if a row is charged.
     * @param board The board state.
     * @param rowIndex The row index to check.
     * @returns True if the row is charged.
     */
    isRowCharged(board: BoardState, rowIndex: number): boolean {
        // Check if the row index is in the chargedLineRows of the fever state?
        // But we don't have fever state here. Instead, we can check the board cells for feverCharged.
        // However, the fever state is the source of truth for charged rows.
        // We'll rely on the fever state passed elsewhere. For this function, we assume we have the fever state available in the caller.
        // Since we don't have fever state, we'll check the board for any cell with feverCharged true in that row.
        for (let col = 0; col < board.columns; col++) {
            const cell = board.grid[rowIndex][col];
            if (cell !== 0 && typeof cell === 'object' && (cell as BoardBlockCell).feverCharged) {
                return true;
            }
        }
        return false;
    }

    /**
     * Mark a row as charged.
     * @param board The board state.
     * @param rowIndex The row index to mark.
     * @returns Updated board state.
     */
    markRowAsCharged(board: BoardState, rowIndex: number): BoardState {
        for (let col = 0; col < board.columns; col++) {
            const cell = board.grid[rowIndex][col];
            if (cell !== 0 && typeof cell === 'object') {
                (cell as BoardBlockCell).feverCharged = true;
            }
        }
        return board;
    }

    /**
     * Clear charged line markers from the board.
     * @param board The board state.
     * @returns Updated board state.
     */
    clearChargedLineMarkers(board: BoardState): BoardState {
        for (let row = 0; row < board.rows; row++) {
            for (let col = 0; col < board.columns; col++) {
                const cell = board.grid[row][col];
                if (cell !== 0 && typeof cell === 'object') {
                    (cell as BoardBlockCell).feverCharged = false;
                }
            }
        }
        return board;
    }

    /**
     * Release Fever Showtime.
     * @param board The board state.
     * @param fever The fever showtime state.
     * @param reason The reason for release.
     * @param state The current run state.
     * @returns Updated board and fever state, and the cascade result from clearing charged lines.
     */
    releaseFeverShowtime(board: BoardState, fever: FeverShowtimeState, reason: FeverReleaseReason, state: RunState): {
        board: BoardState;
        fever: FeverShowtimeState;
        cascadeResult?: CascadeResult;
    } {
        const chargedLineRows = [...fever.chargedLineRows];
        if (chargedLineRows.length === 0) {
            // No charged lines, just clear the fever state
            const updatedFever: FeverShowtimeState = {
                ...fever,
                active: false,
                locksRemaining: 0,
                chargedLineRows: [],
                heat: 0,
                heatLevel: 'none',
                manualReleaseAvailable: false,
                releaseRequested: false,
                lastReleaseSummary: {
                    chargedLinesCleared: 0,
                    rawDamage: 0,
                    cappedDamage: 0,
                    overflowDamage: 0,
                    manaGained: 0,
                    heatLevel: fever.heatLevel,
                    releaseReason: reason,
                    cascadeResult: undefined,
                    encounterType: undefined,
                    capApplied: undefined,
                    overflowUtility: undefined
                }
            };
            return {
                board,
                fever: updatedFever
            };
        }

        // Clear the cells in the charged rows
        for (const row of chargedLineRows) {
            for (let col = 0; col < board.columns; col++) {
                board.grid[row][col] = 0; // set to empty
            }
        }

        // Clear charged line markers
        this.clearChargedLineMarkers(board);

        // Now apply Cascade Gravity to the board after clearing the charged lines
        // We'll use the resolveCascadeGravity function with the same parameters as BoardSystem.clearLinesCascade.
        const cloneCell = (cell: BoardCell): BoardCell => {
            if (typeof cell === 'number') {
                return cell;
            }
            return {
                ...cell,
                clearEffects: cell.clearEffects.map(effect => ({ ...effect }))
            };
        };

        const isAnchoredCell = (cell: BoardCell): boolean => {
            const junkBlockIds = new Set(['block_crumb_junk', 'block_cloud_junk', 'block_cracked_junk', 'block_royal', 'block_sticky']);
            return typeof cell !== 'number' && junkBlockIds.has(cell.blockId);
        };

        const triggered: string[] = [];
        const onCellCleared = (row: number, column: number, cell: BoardCell, triggeredLocal: string[]) => {
            if (typeof cell !== 'number') {
                triggeredLocal.push(cell.blockId);
                for (const effect of cell.clearEffects) {
                    const valueSuffix = typeof effect.value === 'number' ? `:${effect.value}` : '';
                    triggeredLocal.push(`${cell.blockId}:${effect.type}${valueSuffix}`);
                }
            }
        };

        const cascadeResult = resolveCascadeGravity(board.grid, board.columns, board.rows, {
            cloneCell,
            isAnchoredCell,
            onCellCleared: (row, column, cell, triggeredLocal) => {
                onCellCleared(row, column, cell, triggeredLocal);
                triggered.push(...triggeredLocal);
            }
        });

        // For now, we return a placeholder release summary with the basic info.
        // The actual damage calculation and capping will be done in the BattleScene or CombatSystem.
        // We will update the lastReleaseSummary with the basic cascade result and charged lines count.
        const updatedFever: FeverShowtimeState = {
            ...fever,
            active: false,
            locksRemaining: 0,
            chargedLineRows: [],
            heat: 0,
            heatLevel: 'none',
            manualReleaseAvailable: false,
            releaseRequested: false,
            lastReleaseSummary: {
                chargedLinesCleared: chargedLineRows.length,
                rawDamage: 0, // To be calculated by the caller
                cappedDamage: 0,
                overflowDamage: 0,
                manaGained: 0,
                heatLevel: fever.heatLevel,
                releaseReason: reason,
                cascadeResult,
                encounterType: undefined,
                capApplied: undefined,
                overflowUtility: undefined
            }
        };

        const combatResult = this.applyFeverReleaseCombatResult(updatedFever.lastReleaseSummary!, state);
        updatedFever.lastReleaseSummary = combatResult.releaseSummary;

        return {
            board,
            fever: updatedFever,
            cascadeResult
        };
    }

    // --- Phase 3 Stubs ---

    /**
     * Determine the encounter type for Fever damage capping.
     * @param state The current run state.
     * @returns The encounter type.
     */
    getFeverEncounterType(state: RunState): FeverEncounterType {
        const enemy = state.activeEnemy;
        if (!enemy) {
            return 'normal';
        }

        if (enemy.roomType === 'boss') {
            // Stage 6 is the final stage (starfall arcade)
            if (state.stage >= 6) {
                return 'final_boss';
            }
            return 'boss';
        }

        if (enemy.roomType === 'elite') {
            return 'elite';
        }

        return 'normal';
    }

    /**
     * Get the Fever damage cap ratio for the given encounter type.
     * @param encounterType The encounter type.
     * @returns The cap ratio (as a decimal) or null if no cap.
     */
    getFeverDamageCapRatio(encounterType: FeverEncounterType): number | null {
        switch (encounterType) {
            case 'elite':
                return 0.4;
            case 'boss':
                return 0.3;
            case 'final_boss':
                return 0.25;
            case 'normal':
            default:
                return null;
        }
    }

    /**
     * Calculate the raw Fever release damage from the charged lines and cascade.
     * @param releaseSummary The Fever release summary (must include chargedLinesCleared and cascadeResult).
     * @param state The current run state.
     * @returns The raw damage before caps and overflow.
     */
    calculateRawFeverReleaseDamage(releaseSummary: FeverReleaseSummary, state: RunState): number {
        const chargedLines = Math.max(0, Math.floor(releaseSummary.chargedLinesCleared));
        if (chargedLines <= 0 || !state.activeEnemy) {
            return 0;
        }

        const cascade = releaseSummary.cascadeResult;
        const lineBonus = chargedLines <= 4
            ? LINE_CLEAR_BONUS[chargedLines] ?? 0
            : LINE_CLEAR_BONUS[4] + (chargedLines - 4) * 10;
        const comboBonus = state.combo >= 4 ? 12 : state.combo === 3 ? 7 : state.combo === 2 ? 3 : 0;
        const rawBase = state.player.baseLineDamage + state.player.lineDamageBonus + lineBonus + comboBonus;
        const cascadeCount = Math.max(1, cascade?.cascadeCount ?? 1);
        const cascadeMultiplier = cascadeCount >= 4
            ? 2
            : cascadeCount === 3
                ? 1.5
                : cascadeCount === 2
                    ? 1.25
                    : 1;
        const chargedLineBurst = chargedLines * 4;
        const cascadeDropBonus = Math.min(10, Math.floor((cascade?.blocksDropped ?? 0) / 6));
        const mitigated = Math.round(rawBase * cascadeMultiplier + chargedLineBurst + cascadeDropBonus - state.activeEnemy.armor);
        return Math.max(1, mitigated);
    }

    /**
     * Apply Fever damage caps and calculate overflow.
     * @param rawDamage The raw damage before caps.
     * @param state The current run state.
     * @param encounterType The encounter type.
     * @returns An object containing capped damage, overflow damage, and flags.
     */
    applyFeverDamageCaps(
        rawDamage: number,
        state: RunState,
        encounterType: FeverEncounterType
    ): {
        cappedDamage: number;
        overflowDamage: number;
        capApplied: boolean;
        phaseGateApplied: boolean;
    } {
        const safeRawDamage = Math.max(0, Math.floor(rawDamage));
        const enemy = state.activeEnemy;
        if (!enemy || safeRawDamage <= 0) {
            return {
                cappedDamage: 0,
                overflowDamage: 0,
                capApplied: false,
                phaseGateApplied: false
            };
        }

        const ratio = this.getFeverDamageCapRatio(encounterType);
        let cap = ratio === null ? safeRawDamage : Math.max(1, Math.floor(enemy.maxHp * ratio));
        let phaseGateApplied = false;

        if ((encounterType === 'boss' || encounterType === 'final_boss') && !enemy.phase2Triggered) {
            const phaseThresholdHp = Math.floor(enemy.maxHp * 0.5);
            if (enemy.currentHp > phaseThresholdHp && enemy.currentHp - Math.min(safeRawDamage, cap) < phaseThresholdHp) {
                cap = Math.max(1, Math.min(cap, enemy.currentHp - phaseThresholdHp));
                phaseGateApplied = true;
            }
        }

        const cappedDamage = Math.min(safeRawDamage, cap);
        const overflowDamage = Math.max(0, safeRawDamage - cappedDamage);
        if (overflowDamage > 0 && (encounterType === 'boss' || encounterType === 'final_boss')) {
            this.warnDevOnce(
                'fever-boss-cap-bypass-blocked',
                '[Fever] Boss cap bypass attempt was converted into Showtime Overflow.'
            );
        }
        return {
            cappedDamage,
            overflowDamage,
            capApplied: cappedDamage < safeRawDamage,
            phaseGateApplied
        };
    }

    /**
     * Convert Showtime Overflow into utility.
     * @param overflowDamage The overflow damage to convert.
     * @param state The current run state.
     * @returns The updated state and the overflow utility granted.
     */
    convertShowtimeOverflow(
        overflowDamage: number,
        state: RunState
    ): {
        state: RunState;
        overflowUtility: ShowtimeOverflowUtility[];
    } {
        const points = Math.max(
            0,
            Math.floor((Math.max(0, overflowDamage) / 25) * this.getShowtimeOverflowEfficiencyMultiplier(state))
        );
        const overflowUtility: ShowtimeOverflowUtility[] = [];
        if (points <= 0) {
            return { state, overflowUtility };
        }

        let remaining = points;
        const clearableHazards = Math.min(remaining, state.activeHazards.length);
        if (clearableHazards > 0) {
            state.activeHazards = state.activeHazards.slice(clearableHazards);
            overflowUtility.push({ type: 'clear_hazard_blocks', amount: clearableHazards });
            remaining -= clearableHazards;
        }

        if (remaining > 0 && state.activeEnemy?.roomType === 'boss') {
            state.activeEnemy.attackCounter += 1;
            overflowUtility.push({ type: 'boss_intent_delay', amount: 1 });
            remaining -= 1;
        }

        if (remaining > 0 && state.player.shield < 99) {
            const shieldAmount = Math.min(99 - state.player.shield, remaining * 2);
            state.player.shield += shieldAmount;
            overflowUtility.push({ type: 'shield', amount: shieldAmount });
            remaining -= Math.ceil(shieldAmount / 2);
        }

        if (remaining > 0 && state.player.mana < state.player.maxMana) {
            const manaAmount = Math.min(state.player.maxMana - state.player.mana, remaining * 2);
            state.player.mana += manaAmount;
            overflowUtility.push({ type: 'mana', amount: manaAmount });
            remaining -= Math.ceil(manaAmount / 2);
        }

        if (remaining > 0) {
            const goldAmount = remaining * 3;
            state.player.gold += goldAmount;
            state.gold = state.player.gold;
            overflowUtility.push({ type: 'gold_bonus', amount: goldAmount });
        }

        return { state, overflowUtility };
    }

    /**
     * Apply the Fever release combat result: apply capped damage and update state.
     * @param releaseSummary The Fever release summary.
     * @param state The current run state.
     * @returns The updated state and release summary.
     */
    applyFeverReleaseCombatResult(
        releaseSummary: FeverReleaseSummary,
        state: RunState
    ): {
        state: RunState;
        releaseSummary: FeverReleaseSummary;
    } {
        const enemy = state.activeEnemy;
        if (!enemy) {
            return { state, releaseSummary };
        }

        const encounterType = this.getFeverEncounterType(state);
        const rawDamage = this.calculateRawFeverReleaseDamage(releaseSummary, state);
        const capResult = this.applyFeverDamageCaps(rawDamage, state, encounterType);
        const overflowResult = this.convertShowtimeOverflow(capResult.overflowDamage, state);
        const cappedDamage = capResult.cappedDamage;
        const blocked = Math.min(enemy.shield, cappedDamage);
        enemy.shield -= blocked;
        const hpDamage = Math.max(0, cappedDamage - blocked);
        enemy.currentHp = Math.max(0, enemy.currentHp - hpDamage);
        state.runStats.damageDealt += hpDamage;

        const chargedLines = Math.max(0, releaseSummary.chargedLinesCleared);
        const baseMana = chargedLines <= 4
            ? MANA_GAIN[chargedLines] ?? 0
            : MANA_GAIN[4] + (chargedLines - 4) * 25;
        const cascadeMana = releaseSummary.cascadeResult && releaseSummary.cascadeResult.cascadeCount > 1
            ? Math.floor(baseMana * CASCADE_MANA_BONUS_MULTIPLIER)
            : 0;
        const manaGained = Math.max(0, baseMana + cascadeMana);
        if (manaGained > 0) {
            state.player.mana = clamp(state.player.mana + manaGained, 0, state.player.maxMana);
        }

        state.eventLog.unshift('Showtime released!');
        if (cappedDamage > 0) {
            state.eventLog.unshift(`Fever burst dealt ${cappedDamage} damage!`);
        }
        if (blocked > 0) {
            state.eventLog.unshift(`${enemy.name}'s shield blocks ${blocked} Showtime damage.`);
        }
        if (capResult.capApplied) {
            state.eventLog.unshift('Boss Drama Guard softened the burst!');
        }
        if (capResult.phaseGateApplied) {
            state.eventLog.unshift('The boss holds the stage for the next act!');
        }
        for (const utility of overflowResult.overflowUtility) {
            switch (utility.type) {
                case 'clear_hazard_blocks':
                    state.eventLog.unshift('Showtime Overflow cleared a hazard!');
                    break;
                case 'boss_intent_delay':
                    state.eventLog.unshift('Showtime Overflow delayed the boss!');
                    break;
                case 'shield':
                    state.eventLog.unshift('Showtime Overflow became shield!');
                    break;
                case 'mana':
                    state.eventLog.unshift('Showtime Overflow became mana!');
                    break;
                case 'gold_bonus':
                    state.eventLog.unshift(`Showtime Overflow dropped ${utility.amount} gold!`);
                    break;
                default:
                    break;
            }
        }
        state.eventLog = state.eventLog.slice(0, 50);

        return {
            state: overflowResult.state,
            releaseSummary: {
                ...releaseSummary,
                rawDamage,
                cappedDamage,
                overflowDamage: capResult.overflowDamage,
                manaGained,
                encounterType,
                capApplied: capResult.capApplied,
                overflowUtility: overflowResult.overflowUtility
            }
        };
    }

    // ==================== Phase 4: Fever Pressure Budget, Soft Junk, and Fever Heat ====================

    /**
     * Compute a snapshot of current board pressure during Fever.
     * @param board The board state.
     * @param fever The fever showtime state.
     * @param requestedPressureCells The number of pressure cells being requested.
     * @param battleState The battle state for additional context.
     * @returns A pressure snapshot with band classification.
     */
    computeFeverPressureSnapshot(
        board: BoardState,
        fever: FeverShowtimeState,
        requestedPressureCells: number,
        battleState: RunState
    ): FeverPressureSnapshot {
        const totalCells = board.rows * board.columns;
        let occupiedCells = 0;
        let highestRow: number | null = null;
        let softJunkCount = 0;
        let activeHazardCount = 0;

        // Scan the board
        for (let row = 0; row < board.rows; row++) {
            for (let col = 0; col < board.columns; col++) {
                const cell = board.grid[row][col];
                if (cell !== 0) {
                    occupiedCells++;
                    if (highestRow === null || row < highestRow) {
                        highestRow = row;
                    }
                    // Count soft junk cells
                    if (typeof cell === 'object' && (cell as any).softJunk) {
                        softJunkCount++;
                    }
                }
            }
        }

        const occupiedCellRatio = totalCells > 0 ? occupiedCells / totalCells : 0;

        // Determine danger height (top 5 rows is the danger zone)
        const dangerHeightRow = 5;
        const spawnZoneRows = 2;
        const spawnZoneBlocked = highestRow !== null && highestRow < spawnZoneRows;

        // Count incoming junk
        const incomingJunkCount = battleState.incomingJunkQueue?.reduce(
            (sum, entry) => sum + (entry.remainingAmount ?? entry.amount ?? 0),
            0
        ) ?? 0;

        // Count active hazards
        activeHazardCount = battleState.activeHazards?.length ?? 0;

        // Calculate pressure score
        let pressureScore = 0;

        // Occupied cell ratio contribution
        if (occupiedCellRatio <= 0.45) {
            pressureScore += 10;
        } else if (occupiedCellRatio <= 0.65) {
            pressureScore += 30;
        } else if (occupiedCellRatio <= 0.80) {
            pressureScore += 60;
        } else {
            pressureScore += 90;
        }

        // Danger height contribution
        const freeRows = highestRow !== null ? highestRow : board.rows;
        if (freeRows >= 5) {
            pressureScore += 0;
        } else if (freeRows >= 4) {
            pressureScore += 20;
        } else if (freeRows >= 3) {
            pressureScore += 40;
        } else {
            pressureScore += 70;
        }

        // Spawn zone contribution
        if (spawnZoneBlocked) {
            pressureScore += 50;
        }

        // Charged lines contribution
        pressureScore += fever.chargedLineRows.length * 5;

        // Soft junk contribution
        pressureScore += softJunkCount * 3;

        // Incoming junk contribution
        pressureScore += Math.min(30, incomingJunkCount * 2);

        // Active hazards contribution
        pressureScore += activeHazardCount * 10;

        // Requested pressure contribution
        pressureScore += requestedPressureCells * 2;

        // Determine band
        let band: FeverPressureBand;
        if (pressureScore < 40) {
            band = "low";
        } else if (pressureScore < 70) {
            band = "medium";
        } else if (pressureScore < 100) {
            band = "high";
        } else {
            band = "critical";
        }

        // Calculate safe pressure capacity
        const safeCapacity = Math.max(0, Math.floor(freeRows * board.columns * 0.6) - occupiedCells);

        return {
            occupiedCellRatio,
            highestOccupiedRow: highestRow,
            dangerHeightRow,
            spawnZoneBlocked,
            chargedLineCount: fever.chargedLineRows.length,
            softJunkCount,
            activeHazardCount,
            incomingJunkCount,
            requestedPressureCells,
            safePressureCapacity: safeCapacity,
            pressureScore,
            band
        };
    }

    /**
     * Get the Fever pressure band from a snapshot.
     * @param snapshot The pressure snapshot.
     * @returns The pressure band.
     */
    getFeverPressureBand(snapshot: FeverPressureSnapshot): FeverPressureBand {
        return snapshot.band;
    }

    /**
     * Apply the Fever Pressure Budget to convert excess pressure safely.
     * @param board The board state.
     * @param fever The fever showtime state.
     * @param battleState The battle state.
     * @param requestedPressureCells The number of pressure cells requested.
     * @param sourceId The source of the pressure (boss/enemy ID).
     * @returns Updated states and the budget result.
     */
    applyFeverPressureBudget(
        board: BoardState,
        fever: FeverShowtimeState,
        battleState: RunState,
        requestedPressureCells: number,
        sourceId: string
    ): {
        board: BoardState;
        fever: FeverShowtimeState;
        battleState: RunState;
        result: FeverPressureBudgetResult;
    } {
        const snapshot = this.computeFeverPressureSnapshot(board, fever, requestedPressureCells, battleState);
        const band = snapshot.band;

        let appliedHardCells = 0;
        let softJunkCells = 0;
        let delayedJunkCells = 0;
        let heatAdded = 0;
        let shieldDamage = 0;
        let bossAdvantagePoints = 0;
        let skippedUnsafeCells = 0;
        const conversions: FeverPressureConversionType[] = [];

        // Define conversion ratios based on pressure band
        let hardPressurePercent = 100;
        let conversionPercent = 0;
        let baseHeatAdd = 0;

        switch (band) {
            case "low":
                hardPressurePercent = 100;
                conversionPercent = 0;
                baseHeatAdd = 0;
                break;
            case "medium":
                hardPressurePercent = 70;
                conversionPercent = 30;
                baseHeatAdd = 5;
                break;
            case "high":
                hardPressurePercent = 40;
                conversionPercent = 60;
                baseHeatAdd = 10;
                break;
            case "critical":
                hardPressurePercent = snapshot.spawnZoneBlocked ? 0 : 20;
                conversionPercent = snapshot.spawnZoneBlocked ? 100 : 80;
                baseHeatAdd = 15;
                break;
        }

        // Calculate conversions
        appliedHardCells = Math.floor(requestedPressureCells * (hardPressurePercent / 100));
        const excessCells = requestedPressureCells - appliedHardCells;

        if (excessCells > 0) {
            // Distribute excess: 50% soft junk, 30% heat, 20% delayed junk (or boss advantage)
            softJunkCells = Math.floor(excessCells * 0.5);
            heatAdded = baseHeatAdd + Math.floor(excessCells * 0.3);
            delayedJunkCells = Math.floor(excessCells * 0.2);

            // In high/critical pressure, more goes to delayed/boss advantage
            if (band === "high" || band === "critical") {
                bossAdvantagePoints = Math.floor(excessCells * 0.15);
                shieldDamage = band === "critical" ? Math.floor(excessCells * 0.1) : 0;
            }

            conversions.push("soft_junk");
            conversions.push("fever_heat");
            if (delayedJunkCells > 0) conversions.push("delayed_junk");
            if (bossAdvantagePoints > 0) conversions.push("boss_advantage");
            if (shieldDamage > 0) conversions.push("shield_damage");
        }

        // Apply hard pressure safely
        const hardResult = this.applyHardPressureCellsSafely(board, appliedHardCells, sourceId);
        appliedHardCells = hardResult.applied;
        skippedUnsafeCells = hardResult.skipped;

        if (skippedUnsafeCells > 0) {
            conversions.push("skipped_unsafe_pressure");
            // Convert skipped cells to heat
            heatAdded += skippedUnsafeCells * 2;
        }

        // Apply soft junk
        const softResult = this.addSoftJunkCells(hardResult.board, softJunkCells, sourceId);
        softJunkCells = softResult.added;

        // Add fever heat
        const updatedFever = this.addFeverHeat(fever, heatAdded, sourceId);

        // Add delayed junk to battle state
        let updatedBattleState = { ...battleState };
        if (delayedJunkCells > 0) {
            const delayedEntry: DelayedJunkEntry = {
                id: `delayed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                sourceId,
                cellCount: delayedJunkCells,
                delayPieces: 3, // Delay by 3 piece locks
                junkBlockId: 'block_crumb_junk',
                reason: 'fever_pressure_conversion'
            };
            updatedBattleState.delayedJunkQueue = [
                ...(battleState.delayedJunkQueue || []),
                delayedEntry
            ];
        }

        // Apply boss advantage
        if (bossAdvantagePoints > 0 && updatedBattleState.activeEnemy) {
            updatedBattleState.activeEnemy = {
                ...updatedBattleState.activeEnemy,
                shield: (updatedBattleState.activeEnemy.shield || 0) + bossAdvantagePoints
            };
        }

        // Apply shield damage
        if (shieldDamage > 0) {
            updatedBattleState.player = {
                ...updatedBattleState.player,
                shield: Math.max(0, (updatedBattleState.player.shield || 0) - shieldDamage)
            };
        }

        const result: FeverPressureBudgetResult = {
            requestedCells: requestedPressureCells,
            appliedHardCells,
            softJunkCells,
            delayedJunkCells,
            heatAdded,
            shieldDamage,
            bossAdvantagePoints,
            skippedUnsafeCells,
            pressureBand: band,
            snapshot,
            conversions
        };

        return {
            board: softResult.board,
            fever: updatedFever,
            battleState: updatedBattleState,
            result
        };
    }

    /**
     * Apply hard pressure cells safely, avoiding spawn zone.
     * @param board The board state.
     * @param count The number of cells to apply.
     * @param sourceId The source of the pressure.
     * @returns Updated board and counts of applied/skipped cells.
     */
    applyHardPressureCellsSafely(
        board: BoardState,
        count: number,
        sourceId: string
    ): {
        board: BoardState;
        applied: number;
        skipped: number;
    } {
        let applied = 0;
        let skipped = 0;
        const spawnZoneRows = 2;

        // Find safe positions (not in spawn zone)
        const safePositions: Array<{ row: number; col: number }> = [];
        for (let row = spawnZoneRows; row < board.rows; row++) {
            for (let col = 0; col < board.columns; col++) {
                if (board.grid[row][col] === 0) {
                    safePositions.push({ row, col });
                }
            }
        }

        // Shuffle positions for randomness
        for (let i = safePositions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [safePositions[i], safePositions[j]] = [safePositions[j], safePositions[i]];
        }

        // Apply pressure cells
        const newGrid = board.grid.map(row => [...row]);
        for (let i = 0; i < count && i < safePositions.length; i++) {
            const pos = safePositions[i];
            newGrid[pos.row][pos.col] = {
                color: 0x888888,
                blockId: 'block_crumb_junk',
                blockType: 'hazard',
                clearEffects: []
            };
            applied++;
        }

        skipped = count - applied;

        return {
            board: { ...board, grid: newGrid },
            applied,
            skipped
        };
    }

    /**
     * Add Soft Junk cells to the board.
     * @param board The board state.
     * @param count The number of soft junk cells to add.
     * @param sourceId The source of the pressure.
     * @returns Updated board and count of added cells.
     */
    addSoftJunkCells(
        board: BoardState,
        count: number,
        sourceId: string
    ): {
        board: BoardState;
        added: number;
        skipped: number;
    } {
        let added = 0;
        const spawnZoneRows = 2;

        // Find safe positions (prefer lower/mid board, not in spawn zone)
        const safePositions: Array<{ row: number; col: number }> = [];
        for (let row = spawnZoneRows; row < board.rows; row++) {
            for (let col = 0; col < board.columns; col++) {
                if (board.grid[row][col] === 0) {
                    safePositions.push({ row, col });
                }
            }
        }

        // Sort by row descending (prefer lower rows)
        safePositions.sort((a, b) => b.row - a.row);

        // Take random subset for variety
        for (let i = safePositions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [safePositions[i], safePositions[j]] = [safePositions[j], safePositions[i]];
        }

        // Apply soft junk cells
        const newGrid = board.grid.map(row => [...row]);
        for (let i = 0; i < count && i < safePositions.length; i++) {
            const pos = safePositions[i];
            newGrid[pos.row][pos.col] = {
                color: 0xAAAADD,
                blockId: 'block_soft_junk',
                blockType: 'hazard',
                clearEffects: [{ type: 'soft_junk_clear' }],
                softJunk: true,
                feverGenerated: true,
                sourceId
            } as SoftJunkCell;
            added++;
        }

        const skipped = count - added;

        return {
            board: { ...board, grid: newGrid },
            added,
            skipped
        };
    }

    /**
     * Add Fever Heat to the fever state.
     * @param fever The fever showtime state.
     * @param amount The amount of heat to add.
     * @param sourceId The source of the heat.
     * @returns Updated fever state.
     */
    addFeverHeat(
        fever: FeverShowtimeState,
        amount: number,
        sourceId: string
    ): FeverShowtimeState {
        const newHeat = Math.min(FEVER_HEAT_MAX, fever.heat + amount);
        const heatLevel = this.getFeverHeatLevel(newHeat);

        return {
            ...fever,
            heat: newHeat,
            heatLevel
        };
    }

    /**
     * Get the Fever Heat level from heat amount.
     * @param heat The heat amount.
     * @returns The heat level.
     */
    getFeverHeatLevel(heat: number): FeverHeatLevel {
        if (heat >= FEVER_HEAT_MAX) return "max";
        if (heat >= FEVER_HEAT_HIGH) return "high";
        if (heat >= FEVER_HEAT_MEDIUM) return "medium";
        if (heat >= FEVER_HEAT_LOW) return "low";
        return "none";
    }

    /**
     * Resolve Soft Junk after Fever ends - convert to normal junk or delayed junk.
     * @param board The board state.
     * @param fever The fever showtime state.
     * @param battleState The battle state.
     * @returns Updated states and conversion counts.
     */
    resolveSoftJunkAfterFever(
        board: BoardState,
        fever: FeverShowtimeState,
        battleState: RunState
    ): {
        board: BoardState;
        battleState: RunState;
        convertedToNormalJunk: number;
        convertedToDelayedJunk: number;
        cleared: number;
    } {
        let convertedToNormalJunk = 0;
        let convertedToDelayedJunk = 0;
        let cleared = 0;
        const spawnZoneRows = 2;

        const newGrid = board.grid.map(row => [...row]);

        for (let row = 0; row < board.rows; row++) {
            for (let col = 0; col < board.columns; col++) {
                const cell = newGrid[row][col];
                if (typeof cell === 'object' && (cell as any).softJunk) {
                    // Check if conversion is safe (not in spawn zone)
                    if (row >= spawnZoneRows) {
                        // Convert to normal junk
                        newGrid[row][col] = {
                            color: 0x888888,
                            blockId: 'block_crumb_junk',
                            blockType: 'hazard',
                            clearEffects: []
                        };
                        convertedToNormalJunk++;
                    } else {
                        // Unsafe - convert to delayed junk
                        newGrid[row][col] = 0; // Clear from board
                        convertedToDelayedJunk++;
                    }
                }
            }
        }

        // Add delayed junk entries
        let updatedBattleState = battleState;
        if (convertedToDelayedJunk > 0) {
            const delayedEntry: DelayedJunkEntry = {
                id: `delayed_post_fever_${Date.now()}`,
                sourceId: 'fever_soft_junk_resolution',
                cellCount: convertedToDelayedJunk,
                delayPieces: 2,
                junkBlockId: 'block_crumb_junk',
                reason: 'soft_junk_unsafe_conversion'
            };
            updatedBattleState = {
                ...battleState,
                delayedJunkQueue: [
                    ...(battleState.delayedJunkQueue || []),
                    delayedEntry
                ]
            };
        }

        return {
            board: { ...board, grid: newGrid },
            battleState: updatedBattleState,
            convertedToNormalJunk,
            convertedToDelayedJunk,
            cleared
        };
    }

    /**
     * Apply Fever Heat release modifier to the release summary.
     * @param releaseSummary The fever release summary.
     * @param fever The fever showtime state.
     * @param battleState The battle state.
     * @returns Updated release summary and states.
     */
    applyFeverHeatReleaseModifier(
        releaseSummary: FeverReleaseSummary,
        fever: FeverShowtimeState,
        battleState: RunState
    ): {
        releaseSummary: FeverReleaseSummary;
        fever: FeverShowtimeState;
        battleState: RunState;
    } {
        const heatLevel = fever.heatLevel;
        let updatedBattleState = battleState;
        let manaPenaltyPercent = 0;

        switch (heatLevel) {
            case "none":
            case "low":
                // No penalty
                break;
            case "medium":
                manaPenaltyPercent = 0.15;
                break;
            case "high":
                manaPenaltyPercent = 0.25;
                break;
            case "max":
                manaPenaltyPercent = 0.40;
                break;
        }

        // Apply mana penalty
        if (manaPenaltyPercent > 0 && releaseSummary.manaGained > 0) {
            const reducedMana = Math.floor(releaseSummary.manaGained * (1 - manaPenaltyPercent));
            releaseSummary = {
                ...releaseSummary,
                manaGained: reducedMana
            };
        }

        // High/Max heat: boss may gain small shield
        if ((heatLevel === "high" || heatLevel === "max") && updatedBattleState.activeEnemy) {
            const shieldGain = heatLevel === "max" ? 3 : 1;
            updatedBattleState = {
                ...updatedBattleState,
                activeEnemy: {
                    ...updatedBattleState.activeEnemy,
                    shield: (updatedBattleState.activeEnemy.shield || 0) + shieldGain
                }
            };
        }

        // Clear heat after release
        const updatedFever: FeverShowtimeState = {
            ...fever,
            heat: 0,
            heatLevel: "none"
        };

        return {
            releaseSummary,
            fever: updatedFever,
            battleState: updatedBattleState
        };
    }

    /**
     * Last-resort failsafe for invalid Fever pressure states.
     * @param board The board state.
     * @param fever The fever showtime state.
     * @param battleState The battle state.
     * @returns Updated states and whether a repair was performed.
     */
    repairInvalidFeverPressureState(
        board: BoardState,
        fever: FeverShowtimeState,
        battleState: RunState
    ): {
        board: BoardState;
        fever: FeverShowtimeState;
        battleState: RunState;
        repaired: boolean;
        repairs: string[];
    } {
        let repaired = false;
        const repairs: string[] = [];
        let newBoard = board;
        let newFever = fever;
        let newBattleState = battleState;

        // 1. Remove invalid Soft Junk from spawn zone
        const spawnZoneRows = 2;
        let softJunkRemovedFromSpawn = 0;
        const newGrid = newBoard.grid.map(row => [...row]);

        for (let row = 0; row < spawnZoneRows; row++) {
            for (let col = 0; col < newBoard.columns; col++) {
                const cell = newGrid[row][col];
                if (typeof cell === 'object' && (cell as any).softJunk) {
                    newGrid[row][col] = 0;
                    softJunkRemovedFromSpawn++;
                }
            }
        }

        if (softJunkRemovedFromSpawn > 0) {
            newBoard = { ...newBoard, grid: newGrid };
            repaired = true;
            repairs.push(`Removed ${softJunkRemovedFromSpawn} Soft Junk from spawn zone`);
        }

        // 2. Check for impossible active Fever state
        if (newFever.active) {
            const hasInvalidLocks = newFever.locksRemaining <= 0 || newFever.locksRemaining > 100;
            const hasInvalidHeat = newFever.heat < 0 || newFever.heat > 100;

            if (hasInvalidLocks || hasInvalidHeat) {
                newFever = this.requestFeverRelease(newFever, 'invalid_state_repair');
                repaired = true;
                repairs.push('Requested Fever release due to invalid state');
            }
        }

        // 3. Check for blocked spawn
        let spawnBlocked = false;
        for (let row = 0; row < spawnZoneRows; row++) {
            for (let col = 0; col < newBoard.columns; col++) {
                if (newBoard.grid[row][col] !== 0) {
                    spawnBlocked = true;
                    break;
                }
            }
            if (spawnBlocked) break;
        }

        if (spawnBlocked && newFever.active) {
            // Convert blocking cells to delayed junk
            let convertedCount = 0;
            const repairGrid = newBoard.grid.map(row => [...row]);
            for (let row = 0; row < spawnZoneRows; row++) {
                for (let col = 0; col < newBoard.columns; col++) {
                    const cell = repairGrid[row][col];
                    if (typeof cell === 'object' && (cell as any).feverGenerated) {
                        repairGrid[row][col] = 0;
                        convertedCount++;
                    }
                }
            }

            if (convertedCount > 0) {
                newBoard = { ...newBoard, grid: repairGrid };
                const delayedEntry: DelayedJunkEntry = {
                    id: `delayed_repair_${Date.now()}`,
                    sourceId: 'fever_failsafe',
                    cellCount: convertedCount,
                    delayPieces: 1,
                    junkBlockId: 'block_crumb_junk',
                    reason: 'spawn_unblock_repair'
                };
                newBattleState = {
                    ...newBattleState,
                    delayedJunkQueue: [
                        ...(newBattleState.delayedJunkQueue || []),
                        delayedEntry
                    ]
                };
                repaired = true;
                repairs.push(`Converted ${convertedCount} blocking cells to delayed junk`);
            }
        }

        if (repaired) {
            console.warn('Fever Pressure Budget: Repaired invalid state:', repairs);
        }

        return {
            board: newBoard,
            fever: newFever,
            battleState: newBattleState,
            repaired,
            repairs
        };
    }

    // ==================== Phase 5: Fever Upgrades ====================

    /**
     * Count stacks of a run upgrade from ownedRewards.
     * Run upgrades are tracked in state.upgrades (array, duplicates = levels).
     */
    getFeverRunUpgradeStacks(state: RunState, upgradeId: string): number {
        return state.upgrades.filter((id) => id === upgradeId).length;
    }

    /**
     * Get the Fever gain multiplier from run upgrades.
     * upg_fever_gain: +10% per stack (max 5 stacks = +50%)
     * Combined with level-up fever gain which is handled separately.
     */
    getFeverGainMultiplier(state: RunState): number {
        const runStacks = Math.min(5, this.getFeverRunUpgradeStacks(state, 'upg_fever_gain'));
        const runBonus = runStacks * 0.10;
        const levelStacks = Math.min(5, state.playerLevelState?.chosenUpgrades?.['upg_lvl_fever_gain'] ?? 0);
        const levelBonus = Math.min(0.40, levelStacks * 0.08);
        return 1.0 + runBonus + levelBonus;
    }

    /**
     * Get bonus Fever lock duration from run upgrades.
     * upg_fever_duration: +1 per stack (max 3 stacks)
     */
    getFeverDurationLockBonus(state: RunState): number {
        return Math.min(3, this.getFeverRunUpgradeStacks(state, 'upg_fever_duration'));
    }

    /**
     * Get bonus max Charged Lines from run upgrades.
     * upg_fever_capacity: +1 per stack (max 2 stacks)
     */
    getFeverCapacityBonus(state: RunState): number {
        return Math.min(2, this.getFeverRunUpgradeStacks(state, 'upg_fever_capacity'));
    }

    /**
     * Get the effective Fever duration locks considering upgrades and encounter caps.
     */
    getEffectiveFeverDurationLocks(
        baseDuration: number,
        state: RunState,
        encounterType: FeverEncounterType
    ): number {
        const upgradeBonus = this.getFeverDurationLockBonus(state);
        const rawLocks = baseDuration + upgradeBonus;

        const caps: Record<FeverEncounterType, number> = {
            normal: 7,
            elite: 6,
            boss: 5,
            final_boss: 5
        };

        return Math.min(rawLocks, caps[encounterType] ?? 7);
    }

    /**
     * Get the effective max Charged Lines considering upgrades and encounter caps.
     */
    getEffectiveFeverMaxChargedLines(
        baseMaxLines: number,
        state: RunState,
        encounterType: FeverEncounterType
    ): number {
        const upgradeBonus = this.getFeverCapacityBonus(state);
        const rawLines = baseMaxLines + upgradeBonus;

        const caps: Record<FeverEncounterType, number> = {
            normal: 6,
            elite: 5,
            boss: 4,
            final_boss: 4
        };

        return Math.min(rawLines, caps[encounterType] ?? 6);
    }

    /**
     * Get the manual release shield bonus from upg_fever_manual_release.
     * +3 shield per stack, max 3 stacks.
     * Only applies on manual release.
     */
    getManualReleaseShieldBonus(state: RunState): number {
        const stacks = Math.min(3, this.getFeverRunUpgradeStacks(state, 'upg_fever_manual_release'));
        return stacks * 3;
    }

    /**
     * Get the safety release hazard clear count from upg_fever_safety_release.
     * Clears 1 hazard per stack, max 2 stacks.
     * Only triggers when Fever release happens at high/critical pressure.
     */
    getSafetyReleaseClearCount(state: RunState): number {
        return Math.min(2, this.getFeverRunUpgradeStacks(state, 'upg_fever_safety_release'));
    }

    /**
     * Get the Showtime Overflow efficiency multiplier from upg_fever_overflow.
     * Base 1.0, +0.20 per stack (max 3 stacks = 1.60).
     * Does not increase boss direct damage.
     */
    getShowtimeOverflowEfficiencyMultiplier(state: RunState): number {
        const stacks = Math.min(3, this.getFeverRunUpgradeStacks(state, 'upg_fever_overflow'));
        return 1.0 + stacks * 0.20;
    }

    /**
     * Check if Star Encore upgrade is active.
     * upg_fever_star_encore: max 1 stack.
     */
    hasStarEncoreUpgrade(state: RunState): boolean {
        return this.getFeverRunUpgradeStacks(state, 'upg_fever_star_encore') >= 1;
    }

    /**
     * Apply Graceful Release shield bonus on manual Fever release.
     * Returns the shield amount granted.
     */
    applyManualReleaseShieldBonus(state: RunState): number {
        const shieldAmount = this.getManualReleaseShieldBonus(state);
        if (shieldAmount > 0) {
            state.player.shield += shieldAmount;
            state.eventLog.unshift(`Graceful Release grants ${shieldAmount} shield!`);
            if (state.eventLog.length > 50) {
                state.eventLog = state.eventLog.slice(0, 50);
            }
        }
        return shieldAmount;
    }

    /**
     * Apply Safety Confetti hazard clear on Fever release at high/critical pressure.
     * Clears up to clearCount hazard blocks with priority: junk > sticky > ice > royal.
     * Returns the number of hazards cleared.
     */
    applySafetyReleaseHazardClear(
        state: RunState,
        boardState: BoardState,
        clearCount: number
    ): { board: BoardState; cleared: number; hazardTypes: string[] } {
        if (clearCount <= 0) {
            return { board: boardState, cleared: 0, hazardTypes: [] };
        }

        let board = { ...boardState };
        let cleared = 0;
        const hazardTypes: string[] = [];

        const priorityOrder = ['junk', 'sticky', 'ice', 'royal'];

        for (const hazardType of priorityOrder) {
            if (cleared >= clearCount) break;

            for (let row = 0; row < board.rows && cleared < clearCount; row++) {
                for (let col = 0; col < board.columns && cleared < clearCount; col++) {
                    const cell = board.grid[row][col];
                    if (cell !== 0 && typeof cell !== 'number' && cell.blockType === hazardType) {
                        board = {
                            ...board,
                            grid: board.grid.map((r, ri) =>
                                ri === row ? r.map((c, ci) => (ci === col ? 0 : c)) : [...r]
                            )
                        };
                        cleared++;
                        hazardTypes.push(hazardType);
                    }
                }
            }
        }

        if (cleared > 0) {
            state.eventLog.unshift(`Safety Confetti cleared ${cleared} hazard block${cleared > 1 ? 's' : ''}!`);
            if (state.eventLog.length > 50) {
                state.eventLog = state.eventLog.slice(0, 50);
            }
        }

        return { board, cleared, hazardTypes };
    }

    /**
     * Apply Star Encore after Fever release resolves.
     * Creates 1 star block if safe space exists.
     * Disabled during boss phase transition.
     * Returns whether a star was created.
     */
    applyStarEncore(
        state: RunState,
        boardState: BoardState,
        bossJustChangedPhase: boolean
    ): { board: BoardState; starCreated: boolean } {
        if (!this.hasStarEncoreUpgrade(state)) {
            return { board: boardState, starCreated: false };
        }

        if (bossJustChangedPhase) {
            return { board: boardState, starCreated: false };
        }

        // Find a safe cell: avoid spawn zone, avoid existing blocks
        const spawnZoneTop = 3; // rows 0-2 are spawn zone
        let bestRow = -1;
        let bestCol = -1;

        // Search from top-middle, preferring empty spaces
        for (let row = boardState.rows - 1; row >= spawnZoneTop; row--) {
            const midCol = Math.floor(boardState.columns / 2);
            // Check center first, then expand outward
            for (let offset = 0; offset < Math.max(midCol, boardState.columns - midCol); offset++) {
                const leftCol = midCol - offset;
                const rightCol = midCol + offset;

                if (leftCol >= 0 && boardState.grid[row][leftCol] === 0) {
                    bestRow = row;
                    bestCol = leftCol;
                    break;
                }
                if (rightCol < boardState.columns && boardState.grid[row][rightCol] === 0) {
                    bestRow = row;
                    bestCol = rightCol;
                    break;
                }
            }
            if (bestRow >= 0) break;
        }

        if (bestRow < 0 || bestCol < 0) {
            return { board: boardState, starCreated: false };
        }

        const starBlock: BoardBlockCell = {
            color: 0xFFFF00,
            blockId: 'block_star',
            blockType: 'special',
            clearEffects: []
        };

        const board = {
            ...boardState,
            grid: boardState.grid.map((r, ri) =>
                ri === bestRow
                    ? r.map((c, ci) => (ci === bestCol ? starBlock : c))
                    : [...r]
            )
        };

        state.eventLog.unshift('Star Encore placed a star block!');
        if (state.eventLog.length > 50) {
            state.eventLog = state.eventLog.slice(0, 50);
        }

        return { board, starCreated: true };
    }
  }
