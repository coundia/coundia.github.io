// Génère src/styles/tokens.css à partir de src/data/tokens.json (source unique des jetons).
import { readFileSync, writeFileSync } from 'node:fs';

const tokens = JSON.parse(readFileSync(new URL('../src/data/tokens.json', import.meta.url), 'utf8'));
const HEX = /^#[0-9A-F]{6}$/i;

const vars = (prefix, palette) =>
  Object.entries(palette)
    .map(([name, value]) => {
      if (!HEX.test(value)) throw new Error(`Couleur invalide (hex 6 chiffres requis) : ${name} = ${value}`);
      return `  --${prefix}-${name}: ${value};`;
    })
    .join('\n');
const colorVars = (theme) => `${vars('color', tokens.color[theme])}\n${vars('scene', tokens.scene[theme])}`;

const shared = [
  ...Object.entries(tokens.space).map(([k, v]) => `  --space-${k}: ${v}px;`),
  ...Object.entries(tokens.radius).map(([k, v]) => `  --radius-${k}: ${v}px;`),
  ...Object.entries(tokens.shadow).map(([k, v]) => `  --shadow-${k}: ${v};`),
  ...Object.entries(tokens.motion.duration).map(([k, v]) => `  --duration-${k}: ${v}s;`),
].join('\n');

const css = `/* Fichier généré par scripts/build-tokens.mjs - ne pas modifier à la main. */
:root {
${shared}
}

:root,
:root[data-theme='dark'] {
  color-scheme: dark;
${colorVars("dark")}
}

:root[data-theme='light'] {
  color-scheme: light;
${colorVars("light")}
}
`;

writeFileSync(new URL('../src/styles/tokens.css', import.meta.url), css);
console.log('✓ tokens.css généré');
