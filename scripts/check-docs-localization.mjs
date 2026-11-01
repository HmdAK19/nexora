import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const docsDirectory = join(root, 'docs');
const englishDocuments = [
  join(root, 'README.md'),
  ...readdirSync(docsDirectory)
    .filter((name) => name.endsWith('.md') && !name.endsWith('.fa.md'))
    .map((name) => join(docsDirectory, name)),
];

const failures = [];

for (const englishPath of englishDocuments) {
  const persianPath = englishPath.replace(/\.md$/, '.fa.md');
  const englishName = relative(root, englishPath).replaceAll('\\', '/');
  const persianName = relative(root, persianPath).replaceAll('\\', '/');

  if (!existsSync(persianPath)) {
    failures.push(`${englishName}: missing ${persianName}`);
    continue;
  }

  const english = readFileSync(englishPath, 'utf8');
  const persian = readFileSync(persianPath, 'utf8');
  const digest = createHash('sha256').update(english).digest('hex');
  const sourceFile = englishPath.slice(dirname(englishPath).length + 1);
  const marker = `<!-- source: ${sourceFile}; source-sha256: ${digest} -->`;

  if (!persian.includes(marker)) {
    failures.push(`${persianName}: translation is stale; review it and set source-sha256 to ${digest}`);
  }

  const englishFile = englishPath.slice(dirname(englishPath).length + 1);
  const persianFile = persianPath.slice(dirname(persianPath).length + 1);
  const switcher = `[English](${englishFile}) | [فارسی](${persianFile})`;

  if (!english.includes(switcher)) {
    failures.push(`${englishName}: missing language switcher`);
  }

  if (!persian.includes(switcher)) {
    failures.push(`${persianName}: missing language switcher`);
  }
}

if (failures.length > 0) {
  console.error('Documentation localization check failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Documentation localization is synchronized (${englishDocuments.length} pairs).`);
}
