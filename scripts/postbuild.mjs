// Prépare l'artefact GitHub Pages : 404.html personnalisée et .nojekyll.
import { copyFileSync, existsSync, writeFileSync } from 'node:fs';

const out = new URL('../dist/coundia-portfolio/browser/', import.meta.url);
const notFound = new URL('404/index.html', out);
if (!existsSync(notFound)) {
  console.error('✗ 404/index.html introuvable : la route /404 n’a pas été pré-rendue');
  process.exit(1);
}
copyFileSync(notFound, new URL('404.html', out));
writeFileSync(new URL('.nojekyll', out), '');
console.log('✓ 404.html et .nojekyll prêts pour GitHub Pages');
