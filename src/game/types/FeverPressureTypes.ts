// === Phase 4: Fever Pressure Budget, Soft Junk, and Fever Heat Types ===
// These types extend the Fever Showtime system with pressure budget mechanics.

import type { BoardBlockCell } from './GameTypes';

export type FeverPressureBand = "low" | "medium" | "high" | "critical";

export type FeverPressureConversionType =
  | "hard_blocks"
  | "soft_junk"
  | "fever_heat"
  | "delayed_junk"
  | "shield_damage"
  | "boss_advantage"
  | "skipped_unsafe_pressure";

export type FeverPressureSnapshot = {
  occupiedCellRatio: number;
  highestOccupiedRow: number | null;
  dangerHeightRow: number;
  spawnZoneBlocked: boolean;
  chargedLineCount: number;
  softJunkCount: number;
  activeHazardCount: number;
  incomingJunkCount: number;
  requestedPressureCells: number;
  safePressureCapacity: number;
  pressureScore: number;
  band: FeverPressureBand;
};

export type FeverPressureBudgetResult = {
  requestedCells: number;
  appliedHardCells: number;
  softJunkCells: number;
  delayedJunkCells: number;
  heatAdded: number;
  shieldDamage: number;
  bossAdvantagePoints: number;
  skippedUnsafeCells: number;
  pressureBand: FeverPressureBand;
  snapshot: FeverPressureSnapshot;
  conversions: FeverPressureConversionType[];
};

export type SoftJunkCell = BoardBlockCell & {
  softJunk: true;
  feverGenerated: true;
  sourceId: string;
};

export type DelayedJunkEntry = {
  id: string;
  sourceId: string;
  cellCount: number;
  delayPieces: number;
  junkBlockId: string;
  reason: string;
};

// Heat thresholds for Fever Heat system
export const FEVER_HEAT_LOW = 20;
export const FEVER_HEAT_MEDIUM = 40;
export const FEVER_HEAT_HIGH = 70;
export const FEVER_HEAT_MAX = 100;
