import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const rootDir = path.resolve('src/game/content');
const requiredKeys = [
  'contentType',
  'version',
  'idPrefix',
  'displayName',
  'description',
  'idFormat',
  'exampleIds',
  'requiredFields',
  'fields',
  'dataList',
  'defaults'
];

async function findMetadataFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findMetadataFiles(fullPath)));
    } else if (entry.isFile() && entry.name === 'metadata.json') {
      files.push(fullPath);
    }
  }

  return files;
}

async function validateFile(filePath) {
  const raw = await readFile(filePath, 'utf8');
  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Invalid JSON in ${filePath}: ${error.message}`);
  }

  const missing = requiredKeys.filter((key) => !(key in parsed));
  if (missing.length > 0) {
    throw new Error(`Missing required keys in ${filePath}: ${missing.join(', ')}`);
  }
}

async function main() {
  let files;

  try {
    files = await findMetadataFiles(rootDir);
  } catch (error) {
    console.error(`Failed to scan ${rootDir}: ${error.message}`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.error(`No metadata.json files found under ${rootDir}`);
    process.exit(1);
  }

  let hasErrors = false;

  for (const file of files) {
    try {
      await validateFile(file);
      console.log(`OK ${path.relative(process.cwd(), file)}`);
    } catch (error) {
      hasErrors = true;
      console.error(`ERROR ${error.message}`);
    }
  }

  if (hasErrors) {
    process.exit(1);
  }

  console.log(`Validated ${files.length} metadata file(s) successfully.`);
}

main();
