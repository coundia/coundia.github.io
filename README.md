# Portfolio — Papa Coundia

Refonte du portfolio : Angular (pré-rendu statique), GSAP et Three.js, publié sur **https://coundia.github.io/**.

- Produit : [prd/prd.md](prd/prd.md)
- Design system : [prd/design.md](prd/design.md) — **aucun dégradé, aucune transparence**

## Commandes

```bash
npm install
npm start          # développement : http://localhost:4200
npm run build      # jetons + validation du contenu + règles de design, puis pré-rendu dans dist/
```

`npm run build` exécute automatiquement :

| Étape | Script | Rôle |
|---|---|---|
| prebuild | `scripts/build-tokens.mjs` | génère `src/styles/tokens.css` depuis `src/data/tokens.json` |
| prebuild | `scripts/validate-content.mjs` | valide les JSON (schémas, parité FR / EN, références villes / études de cas) |
| prebuild | `scripts/check-design-rules.mjs` | refuse tout dégradé, couleur avec alpha, opacité, flou, blending additif… |
| postbuild | `scripts/postbuild.mjs` | crée `404.html` et `.nojekyll` pour GitHub Pages |

## Modifier le contenu

Tout le contenu vit dans des fichiers JSON, séparés de l'interface :

```
src/data/
├── fr/ et en/          profil, chiffres, expertise, parcours, formation, stack,
│                       études de cas, open source, témoignages (même structure, mêmes id)
├── scene.json          architecture 3D : composants, liens, couches (= ids d'expertise), vues de caméra
├── site.json           URL du site, endpoint du formulaire, lien de prise de rendez-vous
├── tokens.json         couleurs (pleines uniquement), espacements, motion
└── schemas/            JSON Schema de chaque fichier
src/i18n/fr.json, en.json   libellés d'interface
```

- Ajouter une étude de cas : une entrée dans `fr/case-studies.json` **et** `en/case-studies.json` (même `slug`) ; la page est pré-rendue automatiquement.
- Témoignages : la section apparaît dès que `testimonials.json` contient une entrée.
- Formulaire de contact : renseigner `formEndpoint` dans `site.json` (ex. Formspree, ou la future API Spring Boot). Sans endpoint, le formulaire ouvre un e-mail si `profile.email` est renseigné.

## Architecture

```
src/app/
├── core/       ContentService (JSON → signaux), thème, SEO, chargement différé de GSAP
├── system/     schéma d'architecture isométrique : scène Three.js (chunk différé) + repli SVG pré-rendu
├── layout/     en-tête, pied de page
├── sections/   hero, chiffres, expertise, parcours, études de cas, open source, stack, contact
├── shared/     directives de révélation (sans opacité) et boutons magnétiques
└── pages/      accueil, étude de cas, CV imprimable, 404
```

- Une seule scène WebGL, déplacée entre le hero et l'expertise ; rendu en pause hors écran et onglet masqué.
- Les couches du schéma (`frontend`, `backend`, `payment`, `quality`) sont les ids de `expertise.json` : le hero et l'expertise pilotent la caméra.
- Repli SVG si WebGL indisponible, mouvement réduit, mode économie de données ou appareil faible.
- Animations : révélations par masque (`clip-path`), translations, tracés, ScrambleText, Flip — jamais d'opacité.

## Déploiement

`.github/workflows/deploy.yml` construit et publie sur GitHub Pages à chaque push sur `main`
(réglage du dépôt : *Settings → Pages → Source : GitHub Actions*).
