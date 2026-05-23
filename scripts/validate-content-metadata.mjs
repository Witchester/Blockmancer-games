import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const contentRoot = path.join(root, 'src', 'game', 'content');
const errors = [];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.isFile() && entry.name.endsWith('.json') ? [full] : [];
  });
}

for (const file of walk(contentRoot)) {
  const base = path.basename(file);
  const data = readJson(file);
  if (base === 'metadata.json' || base.endsWith('-metadata.json')) {
    for (const field of ['contentType', 'version', 'requiredFields']) {
      if (!(field in data)) errors.push(`${path.relative(root, file)}: missing ${field}`);
    }
    continue;
  }
  if (!file.includes(`${path.sep}story${path.sep}routes${path.sep}`)) {
    const entries = Array.isArray(data) ? data : [data];
    for (const entry of entries) {
      if (typeof entry.id !== 'string') {
        errors.push(`${path.relative(root, file)}: content entry missing string id`);
      }
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Content metadata validation passed.');
