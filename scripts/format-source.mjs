import fs from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';
import generateModule from '@babel/generator';

const generate = generateModule.default;
const roots = ['src', 'server/src'];

function collectFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectFiles(target);
    return /\.(ts|tsx)$/.test(entry.name) ? [target] : [];
  });
}

function importGroup(line) {
  const source =
    line.match(/from\s+["']([^"']+)["']/)?.[1] ?? line.match(/import\s+["']([^"']+)["']/)?.[1] ?? '';
  if (source.startsWith('.')) return 2;
  if (
    source.startsWith('@app/') ||
    source.startsWith('@features/') ||
    source.startsWith('@shared/') ||
    source === '@'
  )
    return 1;
  return 0;
}

function groupImports(code) {
  const lines = code.split('\n');
  const result = [];
  let previousImportGroup = null;
  let insideImports = true;

  for (const line of lines) {
    const isImport = line.startsWith('import ');
    if (insideImports && isImport) {
      const group = importGroup(line);
      if (previousImportGroup !== null && group !== previousImportGroup) result.push('');
      result.push(line);
      previousImportGroup = group;
      continue;
    }

    if (insideImports && previousImportGroup !== null) {
      if (line.trim()) result.push('');
      insideImports = false;
    }

    result.push(line);
  }

  return result.join('\n').replace(/\n{3,}/g, '\n\n');
}

for (const file of roots.flatMap(collectFiles)) {
  const source = fs.readFileSync(file, 'utf8');
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['typescript', ...(file.endsWith('.tsx') ? ['jsx'] : [])],
  });
  const formatted = generate(ast, {
    comments: true,
    compact: false,
    concise: false,
    decoratorsBeforeExport: true,
    jsescOption: { minimal: true },
    retainLines: false,
  }).code;

  fs.writeFileSync(file, `${groupImports(formatted).trim()}\n`);
}
