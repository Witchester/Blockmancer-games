import type { BattleScreenShell } from './BattleScreenShell';

export type BattleScreenShellDebugReport = {
  shellCreated: boolean;
  sectionBounds: Record<string, string>;
  sectionSplitExact: boolean;
  sectionContainersCreated: string[];
  backgroundSlotsResolved: string[];
  fallbackAssetsUsed: string[];
  missingAssets: string[];
  viewportScale: number;
  frameOffset: { x: number; y: number };
  rootDepth: number;
  overlapRisks: string[];
  pixelPerfectWarnings: string[];
};

export function createBattleScreenShellDebugReport(shell: BattleScreenShell | null | undefined): BattleScreenShellDebugReport {
  if (!shell) {
    return {
      shellCreated: false,
      sectionBounds: {},
      sectionSplitExact: false,
      sectionContainersCreated: [],
      backgroundSlotsResolved: [],
      fallbackAssetsUsed: [],
      missingAssets: [],
      viewportScale: 0,
      frameOffset: { x: 0, y: 0 },
      rootDepth: 0,
      overlapRisks: ['Battle shell has not been created.'],
      pixelPerfectWarnings: []
    };
  }

  const combat = shell.getSectionBounds('combat');
  const puzzle = shell.getSectionBounds('puzzle');
  const controls = shell.getSectionBounds('controls');
  const validation = shell.validateShell();
  const frame = shell.getFrame();
  const statuses = shell.getBackgroundStatuses();
  const sectionSplitExact =
    combat.x === 0 &&
    combat.y === 0 &&
    combat.w === 1080 &&
    combat.h === 480 &&
    puzzle.x === 0 &&
    puzzle.y === 480 &&
    puzzle.w === 1080 &&
    puzzle.h === 1056 &&
    controls.x === 0 &&
    controls.y === 1536 &&
    controls.w === 1080 &&
    controls.h === 384;

  return {
    shellCreated: true,
    sectionBounds: {
      combat: `${combat.x},${combat.y},${combat.w},${combat.h}`,
      puzzle: `${puzzle.x},${puzzle.y},${puzzle.w},${puzzle.h}`,
      controls: `${controls.x},${controls.y},${controls.w},${controls.h}`
    },
    sectionSplitExact,
    sectionContainersCreated: [
      shell.root.name,
      shell.combatSection.name,
      shell.combatBackgroundLayer.name,
      shell.combatUiLayer.name,
      shell.combatVfxLayer.name,
      shell.eventLogLayer.name,
      shell.puzzleSection.name,
      shell.puzzleBackgroundLayer.name,
      shell.boardLayer.name,
      shell.leftRailLayer.name,
      shell.rightRailLayer.name,
      shell.controlsSection.name,
      shell.controlsBackgroundLayer.name,
      shell.controlsButtonLayer.name,
      shell.modalLayer.name,
      shell.debugLayer.name
    ],
    backgroundSlotsResolved: statuses.filter((status) => status.resolved.textureKey).map((status) => `${status.componentId}:${status.resolved.status}:${status.resolved.textureKey}`),
    fallbackAssetsUsed: statuses.filter((status) => status.resolved.status === 'usingFallback' || status.resolved.status === 'usingPlaceholder').map((status) => `${status.componentId}:${status.resolved.textureKey ?? 'none'}`),
    missingAssets: statuses.filter((status) => status.resolved.status === 'unresolved' || status.resolved.status === 'invalidSpec').map((status) => status.componentId),
    viewportScale: frame.scale,
    frameOffset: { x: frame.frameX, y: frame.frameY },
    rootDepth: shell.root.depth,
    overlapRisks: validation.errors,
    pixelPerfectWarnings: validation.warnings
  };
}

export function formatBattleScreenShellDebugReport(report: BattleScreenShellDebugReport): string {
  return [
    'Battle screen shell debug report',
    `shellCreated: ${report.shellCreated ? 'yes' : 'no'}`,
    `sectionSplitExact: ${report.sectionSplitExact ? 'yes' : 'no'}`,
    `sectionBounds: combat=${report.sectionBounds.combat ?? 'n/a'} puzzle=${report.sectionBounds.puzzle ?? 'n/a'} controls=${report.sectionBounds.controls ?? 'n/a'}`,
    `containers: ${report.sectionContainersCreated.length}`,
    `backgroundSlotsResolved: ${report.backgroundSlotsResolved.length ? report.backgroundSlotsResolved.join(', ') : 'none'}`,
    `fallbackAssetsUsed: ${report.fallbackAssetsUsed.length ? report.fallbackAssetsUsed.join(', ') : 'none'}`,
    `missingAssets: ${report.missingAssets.length ? report.missingAssets.join(', ') : 'none'}`,
    `viewportScale: ${report.viewportScale}`,
    `frameOffset: ${report.frameOffset.x},${report.frameOffset.y}`,
    `rootDepth: ${report.rootDepth}`,
    `overlapRisks: ${report.overlapRisks.length ? report.overlapRisks.join('; ') : 'none'}`,
    `pixelPerfectWarnings: ${report.pixelPerfectWarnings.length ? report.pixelPerfectWarnings.join('; ') : 'none'}`
  ].join('\n');
}
