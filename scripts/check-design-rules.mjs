// Garde-fou du design system (prd/design.md § 0) : aucun dégradé, aucune transparence.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const targets = ['src', 'public'];

const RULES = {
  common: [
    [/(repeating-)?(linear|radial|conic)-gradient\s*\(/i, 'dégradé CSS'],
    [/\brgba\s*\(|\bhsla\s*\(/i, 'couleur avec canal alpha'],
    [/#(?:[0-9a-f]{4}|[0-9a-f]{8})\b(?![0-9a-z-])/i, 'hexadécimal avec alpha'],
    [/\b(?:rgb|hsl|oklch|lab|lch)\([^)]*\/[^)]*\)/i, 'couleur avec alpha (syntaxe /)'],
  ],
  css: [
    [/(^|[;{\s])opacity\s*:/i, 'propriété opacity'],
    [/backdrop-filter\s*:/i, 'backdrop-filter'],
    [/mix-blend-mode\s*:/i, 'mix-blend-mode'],
    [/(^|[;{\s])filter\s*:/i, 'filter (flou / ombre portée)'],
    [/:\s*[^;]*\btransparent\b/i, 'mot-clé transparent'],
    [/(box|text)-shadow\s*:[^;]*\d+px\s+\d+px\s+[1-9]\d*px/i, 'ombre floue (utiliser une ombre dure)'],
    [/color-mix\s*\(/i, 'color-mix'],
  ],
  ts: [
    [/\b(opacity|autoAlpha)\s*:/, 'opacité dans une animation'],
    [/transparent\s*:\s*true/, 'matériau Three.js transparent'],
    [/AdditiveBlending/, 'blending additif'],
    [/alpha\s*:\s*true/, 'renderer avec alpha'],
    [/\.fog\b|new\s+(THREE\.)?Fog/, 'brouillard 3D'],
    [/UnrealBloomPass|BloomPass/, 'bloom'],
  ],
  svg: [
    [/<(linear|radial)Gradient/i, 'dégradé SVG'],
    [/(fill-|stroke-)?opacity\s*=/i, 'opacité SVG'],
  ],
};

const kind = (file) => {
  const ext = extname(file);
  if (ext === '.css') return 'css';
  if (ext === '.ts') return 'ts';
  if (ext === '.svg') return 'svg';
  if (ext === '.html') return 'html';
  return null;
};

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const violations = [];
for (const target of targets) {
  for (const file of walk(join(projectRoot, target))) {
    const type = kind(file);
    if (!type) continue;
    const rules = [
      ...RULES.common,
      ...(type === 'css' || type === 'html' ? RULES.css : []),
      ...(type === 'ts' ? RULES.ts : []),
      ...(type === 'svg' || type === 'html' ? RULES.svg : []),
    ];
    readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        if (/^\s*(\/\/|\/?\*)/.test(line)) return; // commentaires
        for (const [pattern, label] of rules) {
          if (pattern.test(line)) violations.push(`${relative(projectRoot, file)}:${i + 1} - ${label}\n    ${line.trim()}`);
        }
      });
  }
}

if (violations.length) {
  console.error(`✗ Règles du design system enfreintes (${violations.length}) :\n${violations.join('\n')}`);
  process.exit(1);
}
console.log('✓ Design system : aucun dégradé, aucune transparence');
