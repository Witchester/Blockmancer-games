import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const repoRoot = process.cwd();

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

async function loadCascadeModule() {
  const source = readText('src/game/systems/CascadeGravitySystem.ts');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2020,
      target: ts.ScriptTarget.ES2020
    }
  }).outputText;
  const encoded = Buffer.from(transpiled, 'utf8').toString('base64');
  return import(`data:text/javascript;base64,${encoded}`);
}

function cloneCell(cell) {
  if (typeof cell === 'number') {
    return cell;
  }
  return {
    ...cell,
    clearEffects: cell.clearEffects.map((effect) => ({ ...effect }))
  };
}

function cloneGrid(grid) {
  return grid.map((row) => row.map(cloneCell));
}

function normal(id = 'block_red') {
  return { color: 0xff0000, blockId: id, blockType: 'normal', clearEffects: [] };
}

function junk(id = 'block_crumb_junk') {
  return { color: 0x888888, blockId: id, blockType: 'hazard', clearEffects: [] };
}

function special() {
  return {
    color: 0xffcc00,
    blockId: 'block_sprinkle',
    blockType: 'special',
    clearEffects: [{ type: 'gain_mana', value: 5 }]
  };
}

function emptyGrid(rows = 6, columns = 4) {
  return Array.from({ length: rows }, () => Array.from({ length: columns }, () => 0));
}

function options() {
  const anchoredIds = new Set(['block_crumb_junk', 'block_cloud_junk', 'block_cracked_junk', 'block_royal', 'block_sticky']);
  return {
    cloneCell,
    isAnchoredCell: (cell) => typeof cell !== 'number' && anchoredIds.has(cell.blockId),
    onCellCleared: (_row, _column, cell, triggered) => {
      if (typeof cell === 'number') {
        return;
      }
      triggered.push(cell.blockId);
      for (const effect of cell.clearEffects) {
        const valueSuffix = typeof effect.value === 'number' ? `:${effect.value}` : '';
        triggered.push(`${cell.blockId}:${effect.type}${valueSuffix}`);
      }
    }
  };
}

function assertGridCell(assert, grid, row, column, blockId, message) {
  const cell = grid[row][column];
  assert(typeof cell !== 'number' && cell.blockId === blockId, message);
}

export async function runCascadeGravitySmoke(assert) {
  const { resolveCascadeGravity } = await loadCascadeModule();

  {
    const grid = emptyGrid();
    grid[5][0] = normal();
    grid[5][2] = normal();
    const before = JSON.stringify(grid);
    const result = resolveCascadeGravity(grid, 4, 6, options());
    assert(result.totalLinesCleared === 0, 'Cascade no-clear scenario should not clear lines.');
    assert(result.cascadeCount === 0, 'Cascade no-clear scenario should have zero cascades.');
    assert(result.causedCombo === false, 'Cascade no-clear scenario should not mark combo.');
    assert(JSON.stringify(grid) === before, 'Cascade no-clear scenario mutated the board.');
  }

  {
    const grid = emptyGrid();
    grid[3][0] = normal('block_blue');
    grid[5] = [normal(), normal(), normal(), normal()];
    const result = resolveCascadeGravity(grid, 4, 6, options());
    assert(result.totalLinesCleared === 1, 'Cascade single-line scenario should clear one line.');
    assert(result.cascadeCount === 1, 'Cascade single-line scenario should have one cascade.');
    assert(result.clearedLinesPerCascade[0] === 1, 'Cascade single-line scenario should record one cleared line.');
    assert(result.blocksDropped === 2, 'Cascade single-line scenario should count two dropped rows.');
    assertGridCell(assert, grid, 5, 0, 'block_blue', 'Cascade single-line scenario did not drop by column.');
  }

  {
    const grid = emptyGrid();
    grid[4] = [normal(), normal(), normal(), normal()];
    grid[5] = [normal(), normal(), normal(), normal()];
    const result = resolveCascadeGravity(grid, 4, 6, options());
    assert(result.totalLinesCleared === 2, 'Cascade multi-line scenario should clear two lines.');
    assert(result.cascadeCount === 1, 'Cascade multi-line scenario should resolve in one cascade pass.');
    assert(result.clearedLinesPerCascade[0] === 2, 'Cascade multi-line scenario should record both lines in one pass.');
  }

  {
    const grid = emptyGrid();
    grid[3] = [0, normal('block_blue'), normal('block_green'), normal('block_yellow')];
    grid[4] = [normal('block_red'), 0, 0, 0];
    grid[5] = [normal(), normal(), normal(), normal()];
    const result = resolveCascadeGravity(grid, 4, 6, options());
    assert(result.totalLinesCleared === 2, 'Cascade chained scenario should clear initial and gravity-created lines.');
    assert(result.cascadeCount === 2, 'Cascade chained scenario should have two cascade passes.');
    assert(result.causedCombo === true, 'Cascade chained scenario should mark causedCombo.');
    assert(result.clearedLinesPerCascade.join(',') === '1,1', 'Cascade chained scenario should record one line per pass.');
  }

  {
    const grid = emptyGrid();
    grid[2][0] = normal('block_blue');
    grid[4][0] = junk();
    grid[5] = [normal(), normal(), normal(), normal()];
    const result = resolveCascadeGravity(grid, 4, 6, options());
    assert(result.totalLinesCleared === 1, 'Cascade anchored-junk scenario should clear the completed line.');
    assertGridCell(assert, grid, 4, 0, 'block_crumb_junk', 'Cascade anchored-junk scenario moved anchored junk.');
    assertGridCell(assert, grid, 3, 0, 'block_blue', 'Cascade anchored-junk scenario allowed a block to fall through junk.');
  }

  {
    const grid = emptyGrid();
    grid[5] = [normal(), normal(), special(), normal()];
    const result = resolveCascadeGravity(grid, 4, 6, options());
    assert(result.specialBlocksTriggered.includes('block_sprinkle'), 'Cascade special scenario missed special block trigger.');
    assert(
      result.specialBlocksTriggered.includes('block_sprinkle:gain_mana:5'),
      'Cascade special scenario missed special block clear effect trigger.'
    );
  }

  const boardSystemText = readText('src/game/systems/BoardSystem.ts');
  assert(
    boardSystemText.includes('resolveCascadeGravity(this.grid, this.columns, this.rows'),
    'BoardSystem is not wired to the tested Cascade Gravity resolver.'
  );
}
