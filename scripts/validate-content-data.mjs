import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const rootDir = path.resolve('src/game/content');

// Map of content types to their ID prefixes
const idPrefixes = {
  heroes: 'hero_',
  weapons: 'wpn_',
  monsters: 'mon_',
  spells: 'spl_',
  relics: 'rel_',
  upgrades: 'upg_',
  'status-effects': 'status_',
  'board-blocks': 'block_',
  'room-events': 'evt_',
  curses: 'curse_',
  'loot-tables': 'loot_',
  'difficulty-scaling': 'scale_',
  'map-nodes': 'node_',
  items: 'item_',
  stages: 'stage_',
  currencies: 'currency_',
  collectibles: 'collectible_',
  npcs: 'npc_'
};

async function findContentFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findContentFiles(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith('.json') && entry.name !== 'metadata.json') {
      files.push(fullPath);
    }
  }

  return files;
}

async function validateFile(filePath, folderName) {
  const raw = await readFile(filePath, 'utf8');
  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Invalid JSON in ${filePath}: ${error.message}`);
  }

  // Check required fields
  if (!parsed.id || typeof parsed.id !== 'string') {
    throw new Error(`Missing or invalid 'id' field in ${filePath}`);
  }

  if (!parsed.name || typeof parsed.name !== 'string') {
    throw new Error(`Missing or invalid 'name' field in ${filePath}`);
  }

  if (!('enabled' in parsed)) {
    throw new Error(`Missing 'enabled' field in ${filePath}`);
  }

  // Check ID prefix matches folder
  const expectedPrefix = idPrefixes[folderName];
  if (expectedPrefix && !parsed.id.startsWith(expectedPrefix)) {
    throw new Error(`ID '${parsed.id}' in ${filePath} does not start with expected prefix '${expectedPrefix}'`);
  }

  return parsed;
}

async function main() {
  console.log('Validating content data files...\n');

  const files = await findContentFiles(rootDir);
  const allIds = new Map();
  const errors = [];

  for (const filePath of files) {
    const relativePath = path.relative(rootDir, filePath);
    const folderName = path.basename(path.dirname(filePath));

    try {
      const content = await validateFile(filePath, folderName);

      // Check for duplicate IDs
      if (allIds.has(content.id)) {
        const prevFile = allIds.get(content.id);
        errors.push(`Duplicate ID '${content.id}' found in ${filePath} and ${prevFile}`);
      } else {
        allIds.set(content.id, filePath);
      }

      console.log(`✓ ${relativePath}`);
    } catch (error) {
      errors.push(error.message);
    }
  }

  console.log(`\nValidated ${files.length} content files.`);

  if (errors.length > 0) {
    console.error(`\n❌ Found ${errors.length} error(s):\n`);
    errors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
  } else {
    console.log('\n✅ All content files are valid!');
    process.exit(0);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
