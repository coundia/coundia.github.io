// Valide les données du site (src/data) : schémas JSON, parité FR / EN, références croisées.
import { readFileSync } from 'node:fs';
import Ajv from 'ajv';

const root = new URL('../src/', import.meta.url);
const read = (path) => JSON.parse(readFileSync(new URL(path, root), 'utf8'));
const ajv = new Ajv({ allErrors: true });
const LANGS = ['fr', 'en'];
const FILES = [
  'profile',
  'stats',
  'expertise',
  'experiences',
  'education',
  'skills',
  'case-studies',
  'open-source',
  'testimonials',
];
const errors = [];

const validate = (schemaName, data, label) => {
  const check = ajv.compile(read(`data/schemas/${schemaName}.schema.json`));
  if (!check(data)) {
    for (const e of check.errors) errors.push(`${label}${e.instancePath} ${e.message}`);
  }
};

const ids = (list) => list.map((item) => item.id ?? item.slug).join('|');
const keyPaths = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v) ? keyPaths(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );

const scene = read('data/scene.json');
validate('scene', scene, 'scene.json');
validate('tokens', read('data/tokens.json'), 'tokens.json');
const nodeIds = new Set();
for (const node of scene.nodes) {
  if (nodeIds.has(node.id)) errors.push(`scene.json : nœud en double « ${node.id} »`);
  nodeIds.add(node.id);
}
for (const link of scene.links) {
  for (const end of [link.from, link.to]) {
    if (!nodeIds.has(end)) errors.push(`scene.json : lien vers un nœud inconnu « ${end} »`);
  }
}

const data = {};
for (const lang of LANGS) {
  data[lang] = {};
  for (const file of FILES) {
    data[lang][file] = read(`data/${lang}/${file}.json`);
    validate(file, data[lang][file], `${lang}/${file}.json`);
  }
  const slugs = new Set(data[lang]['case-studies'].map((c) => c.slug));
  for (const exp of data[lang].experiences) {
    if (exp.caseStudySlug && !slugs.has(exp.caseStudySlug)) {
      errors.push(`${lang}/experiences.json : étude de cas inconnue « ${exp.caseStudySlug} »`);
    }
  }
  // Chaque couche d'expertise doit exister dans la scène 3D (lien direct contenu ↔ 3D).
  for (const item of data[lang].expertise) {
    if (!scene.nodes.some((n) => n.layers.includes(item.id))) {
      errors.push(`${lang}/expertise.json : la couche « ${item.id} » n'a aucun nœud dans scene.json`);
    }
  }
}

for (const file of FILES) {
  const [fr, en] = LANGS.map((l) => data[l][file]);
  if (Array.isArray(fr) && ids(fr) !== ids(en)) {
    errors.push(`${file}.json : les identifiants FR et EN ne correspondent pas (même ordre requis)`);
  }
}

const [i18nFr, i18nEn] = LANGS.map((l) => keyPaths(read(`i18n/${l}.json`)).sort().join('|'));
if (i18nFr !== i18nEn) errors.push('i18n : fr.json et en.json n’ont pas les mêmes clés');

if (errors.length) {
  console.error(`✗ Contenu invalide (${errors.length}) :\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log('✓ Contenu valide (schémas, parité FR / EN, références)');
