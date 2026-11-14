# PRD — Refonte du portfolio de Papa Coundia
### Développeur Full Stack Senior Angular / Spring Boot — expérience immersive GSAP + Three.js

| Champ | Valeur |
|---|---|
| Version | 2.0 (refonte) |
| Date | 14 novembre 2026 |
| Propriétaire | Papa Coundia |
| Publication | **https://coundia.github.io/** (GitHub Pages, dépôt `coundia/coundia.github.io`) |
| Site précédent | https://www.pcoundia.com (Astro + Angular + Tailwind) |
| Design system | [design.md](design.md) — **aucun dégradé, aucune transparence** |
| Statut | À valider |

---

## 1. Vision

Remplacer le portfolio actuel par une **expérience web immersive et mémorable** qui prouve, dès la première seconde, le niveau senior de Papa Coundia :

- **Le fond :** un développeur full stack Angular / Spring Boot avec **8+ ans d'expérience** (depuis 2018), spécialisé dans les **plateformes critiques** : paiement et transfert d'argent (FinTech), SaaS B2B multi-tenant, modernisation de systèmes existants.
- **La forme :** une narration au défilement animée avec **GSAP**, et une scène **Three.js** (WebGL) qui montre son métier : **l'architecture des plateformes qu'il construit** (applications Angular, API Gateway, microservices Spring Boot, RabbitMQ, bases de données, partenaires financiers, CI/CD), en isométrie, traversée par des requêtes et des transactions.
- **La règle d'or :** l'effet « waouh » ne doit **jamais** coûter en performance, en accessibilité ou en lisibilité. Un recruteur pressé doit trouver le titre, la stack, le CV et le contact en moins de 10 secondes, même sur un téléphone d'entrée de gamme en 3G.

> *« Un site qui impressionne un directeur artistique, qui rassure un CTO et qu'un recruteur comprend en 10 secondes. »*

---

## 2. Objectifs et indicateurs

| # | Objectif | Indicateur | Cible à 6 mois |
|---|---|---|---|
| O1 | Générer des opportunités qualifiées | Demandes de contact qualifiées / mois | ≥ 4 |
| O2 | Être perçu comme senior | Part des demandes portant sur architecture / lead / missions longues | ≥ 50 % |
| O3 | Se démarquer visuellement | Temps moyen sur la page d'accueil | ≥ 1 min 30 |
| O4 | Conversion | Clics « Me contacter » + « Télécharger le CV » / visites | ≥ 5 % |
| O5 | Visibilité internationale | Part du trafic hors Sénégal | ≥ 60 % |
| O6 | Excellence technique malgré la 3D | Lighthouse mobile (4 axes) | ≥ 90 Performance, 100 Accessibilité / SEO / Bonnes pratiques |

**Hors périmètre (v1) :** espace client, paiement en ligne, CMS headless, application mobile.

---

## 3. Publics cibles

| Persona | Besoin | Ce qui le convainc |
|---|---|---|
| **P1 — Recruteur technique** (Canada, France, remote) | Valider vite : stack, expérience, langue, fuseau, disponibilité | Titre et stack lisibles immédiatement, CV PDF en un clic, l'animation ne le ralentit pas |
| **P2 — CTO / Lead technique** | Évaluer la séniorité réelle | Études de cas avec décisions d'architecture et compromis, code source public et propre, qualité d'exécution de la 3D (fluide, maîtrisée) |
| **P3 — Client direct** (startup, PME, FinTech d'Afrique de l'Ouest, ONG) | Savoir s'il peut confier un projet de bout en bout | Expérience FinTech / paiement, offres claires, processus de collaboration, réactivité |

---

## 4. Positionnement et message

**Titre :**
> **Papa Coundia — Développeur Full Stack Senior, Angular & Spring Boot**
> Je conçois et je fais évoluer des plateformes critiques — paiement, transfert d'argent, SaaS multi-tenant — du front Angular aux microservices Spring.

**Piliers :**
1. **FinTech et paiement** — plateformes de transfert, recharge et encaissement (Upay App, Upay Business, Proximo, marque blanche Money Express), intégration avec les partenaires financiers.
2. **SaaS B2B multi-tenant** — ~3 ans en remote pour un éditeur québécois (DevAlto) : microservices, DDD, Clean Architecture.
3. **Modernisation** — migration SOAP → REST, optimisation des imports de fichiers volumineux, évolution de plateformes en production.
4. **Remote international** — équipes distribuées Canada ↔ Sénégal, revues de code, QA, Agile.

**Spécialités affichées :** Angular, Spring Boot. **Compétences secondaires :** PHP, Symfony, Laravel (visibles dans la stack et les projets open source, pas dans le titre).

**Ton :** factuel, sobre, orienté résultats. Pas de « passionné » ni de barres de compétences en pourcentage.

**Langues :** français (par défaut) et anglais.

**Tarif :** **non affiché**. Il se discute lors de l'appel découverte ; le formulaire propose un champ « budget indicatif » facultatif.

---

## 5. Contenu source

### 5.1 Parcours

| Période | Poste | Entreprise | Points clés | Environnement |
|---|---|---|---|---|
| Mars 2025 → aujourd'hui | Consultant IT | *À compléter* | *À compléter* | *À compléter* |
| Juin 2022 → mars 2025 | Développeur Full Stack (remote) | DevAlto, Québec, Canada | Évolution d'une plateforme SaaS multi-tenant de suivi-évaluation de projets ; optimisation des imports de fichiers volumineux ; revues de code et QA | Microservices, REST, GitHub Actions, Angular, Docker, PHP, Vagrant, Selenium, ExtJS, Agile, DDD, Clean Architecture |
| Mai 2019 → juin 2022 | Ingénieur Intégration | ATPS SA, Dakar | Migration SOAP → REST (transfert, recharge, encaissement) ; conception et intégration d'Upay App, Upay Business et Proximo avec les partenaires financiers | Angular, Spring Boot, REST/SOAP, GitLab CI, Docker, PHP |
| Mars 2018 → mai 2019 | Développeur Web | Money Express (Groupe Chaka), Sénégal | Plateforme de transfert d'argent en marque blanche ; cadrage avec les équipes métier | PHP, AngularJS |

**Formation :** Master en informatique — Université Gaston-Berger, Saint-Louis (2013 – 2017).

### 5.2 Open source à mettre en avant
- `spring-microservices-starter` — Spring Boot, Axon Framework, RabbitMQ, PostgreSQL : DDD + CQRS + event sourcing.
- `cnd-api-maker` (core, Laravel, Symfony) — générateur d'API multi-tenant + RBAC, agnostique du framework.
- `ddd-maker-bundle` — bundle Symfony qui automatise la structure DDD.
- `coundia.github.io` — présentations.

### 5.3 À ne pas afficher
Taux / temps de réponse des plateformes freelance, nombre de posts / followers, TJM.

---

## 6. Principe d'architecture : données séparées de l'interface (JSON)

**Exigence ferme :** aucun contenu du CV n'est écrit en dur dans les composants. Toutes les données vivent dans des **fichiers JSON** ; l'interface ne fait que les afficher. Mettre à jour le CV = modifier un JSON, sans toucher au code.

### 6.1 Organisation des fichiers

```
src/data/
├── fr/
│   ├── profile.json        identité, titre, accroche, localisation, liens, disponibilité
│   ├── experiences.json    parcours professionnel
│   ├── education.json      formations
│   ├── skills.json         stack par domaine + niveau (expert / confirmé / notions)
│   ├── case-studies.json   études de cas (contexte, problème, décisions, résultats, stack)
│   ├── open-source.json    projets GitHub mis en avant
│   ├── services.json       offres et processus de collaboration
│   ├── testimonials.json   recommandations
│   └── stats.json          chiffres clés (8+ ans, plateformes livrées…)
├── en/                     même structure, mêmes identifiants
├── scene.json              architecture 3D : composants, liens, couches, vues de caméra
└── schemas/                JSON Schema de chaque fichier
src/i18n/
├── fr.json                 libellés d'interface (« Me contacter », titres de section…)
└── en.json
```

### 6.2 Exemple — `experiences.json`

```json
[
  {
    "id": "devalto",
    "role": "Développeur Full Stack",
    "company": "DevAlto",
    "location": "Québec, Canada",
    "remote": true,
    "start": "2022-06",
    "end": "2025-03",
    "highlights": [
      "Évolution d'une plateforme SaaS multi-tenant de suivi et d'évaluation de projets",
      "Optimisation des imports de fichiers volumineux",
      "Participation aux revues de code et QA"
    ],
    "stack": ["Angular", "Microservices", "REST", "Docker", "PHP", "GitHub Actions", "DDD", "Clean Architecture"],
    "sector": "SaaS M&E",
    "caseStudyId": "imports-volumineux"
  }
]
```

### 6.3 Règles
- **Validation :** chaque JSON est validé par son JSON Schema en CI (le build échoue si une donnée est invalide ou si `fr/` et `en/` n'ont pas les mêmes identifiants).
- **Typage :** les types TypeScript sont générés depuis les schémas ; les composants consomment des modèles typés.
- **Chargement :** import statique au build (compatible avec le pré-rendu et le SEO), via un service `ContentService` par langue.
- **Source unique :** le **CV PDF** (FR / EN) est généré au build à partir des mêmes JSON (route d'impression + export PDF headless). Le site et le CV ne peuvent plus diverger.
- **La 3D aussi est pilotée par les données :** les composants, les liens, les couches et les vues de caméra viennent de `scene.json` ; les couches portent les mêmes identifiants que `expertise.json` (`frontend`, `backend`, `payment`, `quality`), ce qui relie le texte et la 3D.

---

## 7. Expérience et direction artistique

### 7.1 Style
> Le détail (couleurs, typographie, composants, règles de motion et de 3D) est dans **[design.md](design.md)**. Règle absolue : **aucun dégradé et aucune transparence**, ni en CSS, ni en SVG, ni dans la scène 3D, ni dans les animations. Profondeur par aplats et bordures, révélations par masque (`clip-path`) et translation au lieu de fondus.

- **Ambiance :** sombre, éditoriale, cinématographique, en aplats de couleur. Fond quasi noir et neutres, **une seule couleur : le bleu** (actions, état actif, couche active du schéma 3D). Pas d'autre teinte.
- **Typographie :** une grande sans-serif expressive pour les titres (ex. Clash Display, Satoshi ou Geist), Inter pour le texte, JetBrains Mono pour les détails techniques.
- **Mise en page :** grille éditoriale, beaucoup d'espace, titres très grands, conçue d'abord pour le mobile.
- **Thème clair** disponible (bascule mémorisée), la scène 3D s'adapte via les jetons de couleur.

### 7.2 Concept 3D (Three.js) — « Le système »

La 3D montre **ce que Papa construit** : l'architecture d'une plateforme de paiement / SaaS, en **isométrie**, comme un schéma d'architecte vivant. Chaque composant porte son nom technique.

| Couche (= domaine d'expertise) | Composants dans la scène |
|---|---|
| `frontend` — Frontend Angular | Applications Angular (web), mobile, back-office, API Gateway |
| `backend` — Backend Spring Boot | API Gateway, `transfer-svc`, `topup-svc`, `import-svc`, `payment-svc`, RabbitMQ, PostgreSQL, event store |
| `payment` — Intégration & paiement | `transfer-svc`, `topup-svc`, `payment-svc`, Bank API, Mobile money |
| `quality` — Qualité & DevOps | Git, CI/CD, Docker (registre) qui déploie les services |

- Des **paquets** (requêtes, transactions) circulent sur des liens orthogonaux façon circuit imprimé : clients → gateway → services → bus → bases, services → partenaires financiers.
- **Lien direct avec le contenu :** les couches portent les identifiants de `expertise.json` ; les rôles du hero (`profile.roles`) pointent vers une couche.

**Interactions :**
- **Hero :** fenêtre « plateforme / architecture » (barre de type IDE). Les rôles qui défilent (« Angular », « Spring Boot », « FinTech », « CI/CD ») allument leur couche ; des boutons (*Vue d'ensemble*, *Frontend Angular*, *Backend Spring Boot*, *Intégration & paiement*, *Qualité & DevOps*) permettent d'explorer : la caméra se déplace vers la couche choisie, ses composants passent en bleu et leurs noms s'affichent.
- **Expertise (immersive) :** sur desktop, le schéma reste collé à droite ; à chaque domaine d'expertise lu à gauche, la caméra se déplace vers la couche correspondante. Chaque carte liste ses composants (« Dans le schéma : … »).
- Légère parallaxe au pointeur.

**Rendu :** volumes en aplats (trois tons pleins par volume : dessus, gauche, droite), arêtes fines, grille au sol, `MeshBasicMaterial` uniquement (aucune lumière, donc aucun dégradé d'ombrage), renderer opaque. Intro : les volumes sortent du sol de l'arrière vers l'avant, puis les liens se tracent et les paquets circulent. Détail : design.md § 8.

### 7.3 Motion design (GSAP)

Plugins : **ScrollTrigger**, **SplitText**, **Flip**, **ScrambleText** (tous gratuits depuis GSAP 3.13).

| Moment | Animation |
|---|---|
| Chargement | Pas d'écran de chargement bloquant. Le texte du hero s'affiche immédiatement ; le titre se révèle mot par mot (SplitText) ; l'architecture se construit (volumes qui sortent du sol, liens qui se tracent) une fois Three.js chargé |
| Hero | Rôles qui défilent en ScrambleText avec curseur de terminal ; chaque rôle allume sa couche dans le schéma |
| Chiffres clés | Compteurs animés (0 → 8+ ans…) au passage dans l'écran |
| Expertise | Section immersive : schéma collé à droite, caméra qui se déplace de couche en couche au défilement |
| Parcours | Une ligne de temps se dessine au défilement ; chaque expérience glisse en place et l'étape lue est mise en avant |
| Études de cas | Défilement horizontal épinglé sur desktop, pile verticale sur mobile ; transition Flip de la carte vers la page de l'étude de cas |
| Stack | Étiquettes qui se regroupent par domaine (Flip) quand on change de filtre |
| Contact | Boutons « magnétiques », retour visuel animé à l'envoi du formulaire |
| Navigation | Transitions entre pages (View Transitions API + GSAP), barre de progression de lecture |

**Défilement fluide** (Lenis) : optionnel, désactivé si `prefers-reduced-motion`, et jamais au détriment du défilement natif au clavier.

---

## 8. Structure des pages

```
/                     Accueil (narration au défilement)
/projets/:slug        Étude de cas détaillée
/a-propos             Parcours détaillé, méthode de travail
/services             Offres et processus de collaboration
/contact              Formulaire, prise de rendez-vous, disponibilité
/cv                   CV PDF (FR / EN), généré depuis les JSON
/en/...               Version anglaise
```

**Accueil, dans l'ordre :** Hero (schéma d'architecture 3D) → Chiffres clés → Expertise (immersive, caméra 3D) → Parcours → Études de cas → Open source → Stack → Témoignages → Contact → Pied de page.

**Études de cas (gabarit) :** contexte, problème, décisions et alternatives écartées, réalisation (schéma d'architecture), résultats chiffrés, recul, stack. Cas prévus : Upay / Proximo, migration SOAP → REST, imports de fichiers volumineux (DevAlto), marque blanche Money Express. Anonymiser si nécessaire.

---

## 9. Exigences fonctionnelles

| ID | Exigence | Priorité |
|---|---|---|
| F1 | Contenu entièrement chargé depuis les JSON (§ 6), aucun texte du CV en dur dans les composants | P0 |
| F2 | Validation des JSON par schéma en CI, parité FR / EN | P0 |
| F3 | Hero avec scène Three.js, chargée de façon différée, avec repli statique | P0 |
| F4 | Animations GSAP au défilement (§ 7.3) avec version réduite si `prefers-reduced-motion` | P0 |
| F5 | Pages d'études de cas | P0 |
| F6 | Bilinguisme FR / EN, URL distinctes, `hreflang` | P0 |
| F7 | CV PDF FR / EN généré depuis les JSON | P0 |
| F8 | Formulaire de contact (nom, e-mail, entreprise, type de demande, budget facultatif, message) avec anti-spam (champ piège, limitation de débit, Turnstile) et accusé de réception | P0 |
| F9 | Section open source alimentée par `open-source.json` (étoiles / activité récupérées via l'API GitHub au build) | P1 |
| F10 | Badge de disponibilité configurable dans `profile.json` | P1 |
| F11 | Exploration de l'architecture : boutons de couches dans le hero, caméra pilotée par le défilement dans l'expertise | P1 |
| F12 | Lien de prise de rendez-vous (Cal.com) | P1 |
| F13 | Thème clair / sombre | P1 |
| F14 | Blog technique | P2 |

---

## 10. Exigences non fonctionnelles

### 10.1 Performance — la 3D ne doit rien coûter
- **LCP < 2,0 s** en 4G simulée : l'élément LCP est **le titre texte**, jamais le canvas.
- Three.js et la scène sont dans un **chunk séparé**, chargé **après** le premier affichage (`@defer` / `requestIdleCallback`). JS initial (hors 3D) < 150 ko compressés ; chunk 3D < 200 ko compressés (imports ciblés de Three.js, pas le paquet complet).
- **CLS < 0,05** ; **INP < 200 ms** ; **60 fps** visés sur desktop, 30 fps minimum sur mobile milieu de gamme.
- Rendu 3D **en pause** quand le canvas sort de l'écran (IntersectionObserver) ou que l'onglet est masqué.
- Ratio de pixels plafonné (2 sur desktop, 1,5 sur mobile) ; densité de points et nombre de paquets animés adaptés à l'appareil (`hardwareConcurrency`, `deviceMemory`, mesure de fps au démarrage avec dégradation automatique).
- **Repli** (même schéma en SVG isométrique, pré-rendu dans le HTML, qui suit aussi la couche active) si : WebGL indisponible, `prefers-reduced-motion`, mode économie de données (`Save-Data`), appareil faible.
- Nettoyage complet à la destruction (géométries, matériaux, textures, renderer, ScrollTriggers) : aucune fuite mémoire en navigation.

### 10.2 Accessibilité (WCAG 2.2 AA)
- Le canvas est décoratif (`aria-hidden`) ; toute information qu'il porte (composants, couches) existe aussi en texte (cartes d'expertise, liste « Dans le schéma »).
- `prefers-reduced-motion` : pas d'épinglage, pas de défilement horizontal, pas de mouvement de caméra ; les éléments apparaissent directement dans leur état final.
- Navigation clavier complète, focus visible, lien d'évitement, contrastes vérifiés sur fond sombre et clair.
- Aucun contenu masqué tant qu'une animation n'a pas eu lieu : si JavaScript échoue, tout le texte reste lisible.
- Tests axe automatisés en CI + vérification VoiceOver / NVDA.

### 10.3 SEO
- Pré-rendu statique de toutes les pages (le contenu JSON est dans le HTML servi).
- Métadonnées par page, Open Graph (image de partage du schéma), JSON-LD `Person` / `ProfilePage` / `CreativeWork`, `sitemap.xml`, `robots.txt`, `hreflang`.

### 10.4 Sécurité et vie privée
- HTTPS imposé par GitHub Pages (« Enforce HTTPS »). GitHub Pages ne permet pas d'en-têtes HTTP personnalisés : la CSP est déclarée par une balise `<meta http-equiv="Content-Security-Policy">`.
- API de contact validée, limitée en débit, CORS restreint à `https://coundia.github.io`.
- Analytics sans cookies (Plausible ou Umami).

### 10.5 Qualité du code (le code fait partie du portfolio)
- Dépôt public avec README soigné (architecture, schéma de données, choix techniques).
- Tests unitaires et de composants, tests d'intégration de l'API, tests de bout en bout Playwright (navigation, langue, formulaire, repli sans WebGL), tests visuels de non-régression sur les états clés.
- Lint et formatage stricts, commits conventionnels, CI obligatoire avant fusion.

---

## 11. Architecture technique

| Couche | Choix |
|---|---|
| Front | **Angular** (dernière version stable) : composants standalone, signaux, zoneless, `@defer`, SSR / pré-rendu via `@angular/ssr` |
| 3D | **Three.js** (imports ciblés), shaders GLSL personnalisés, scène encapsulée dans un service dédié, piloté par `scene.json` |
| Animations | **GSAP** + ScrollTrigger, SplitText, Flip, ScrambleText ; Lenis (optionnel) |
| Styles | Tailwind CSS + jetons de design générés depuis `tokens.json` (thèmes clair / sombre partagés avec la 3D) ; Stylelint / ESLint bloquent dégradés et transparence (design.md § 12) |
| Données | JSON (§ 6) + JSON Schema + types TypeScript générés |
| API contact | **Spring Boot** (dernière version stable, Java LTS) : `POST /api/contact`, Bean Validation, Bucket4j, vérification Turnstile, envoi d'e-mail (Resend / Brevo) |
| Hébergement front | **GitHub Pages**, site utilisateur publié à la racine : **https://coundia.github.io/** (dépôt `coundia/coundia.github.io`) |
| Hébergement API | GitHub Pages ne sert que des fichiers statiques : l'API Spring Boot est hébergée à part (Fly.io, Render ou VPS, image Docker). Repli possible pour le MVP : service de formulaire (Formspree / Web3Forms) le temps que l'API soit en ligne |
| CI/CD | GitHub Actions : validation JSON → lint (dont règles sans dégradé ni transparence) → tests → build pré-rendu → génération du CV PDF → Lighthouse CI (budgets bloquants) → axe → déploiement GitHub Pages (`actions/upload-pages-artifact` + `actions/deploy-pages`) sur `main` |

### Contraintes GitHub Pages
- **Sortie 100 % statique :** build Angular en pré-rendu complet (`outputMode: "static"`), une page HTML par route et par langue (`/`, `/en/`, `/projets/:slug`…). Les slugs des études de cas sont lus depuis les JSON pour générer la liste des routes à pré-rendre.
- **Base :** site utilisateur servi à la racine, donc `baseHref: "/"`.
- **Routes inconnues :** `404.html` personnalisé (page 404 du site, aux couleurs du design system).
- **Fichier `.nojekyll`** à la racine de l'artefact, pour que GitHub Pages serve tous les fichiers tels quels.
- **Source de publication :** « GitHub Actions » dans les réglages Pages du dépôt.
- **Contenu actuel du dépôt** (présentations, icônes, `index.html`) : il sera remplacé. Le **sauvegarder avant** la mise en ligne (branche `archive/presentations`) et, si les présentations doivent rester accessibles, les republier sous `/presentations/`.
- **pcoundia.com :** à rediriger vers https://coundia.github.io/ (ou à configurer comme domaine personnalisé du dépôt via un fichier `CNAME`, à décider : Q6).

### Intégration Angular ↔ GSAP / Three.js
- Code 3D et animations exécuté **uniquement côté navigateur** (`afterNextRender`), jamais pendant le pré-rendu.
- Animations regroupées par composant avec `gsap.context()` / `gsap.matchMedia()` et nettoyées dans `DestroyRef`.
- Boucle de rendu Three.js hors détection de changement Angular ; une seule boucle `requestAnimationFrame` partagée avec le ticker GSAP.
- `ScrollTrigger.refresh()` après chargement des polices et changement de langue.
- Configuration responsive via `gsap.matchMedia()` : desktop / mobile / mouvement réduit.

```
Visiteur ─► GitHub Pages (coundia.github.io) ─► HTML pré-rendu (contenu issu des JSON)
                     │
                     ├─► chunk app Angular (GSAP)
                     ├─► chunk 3D différé (Three.js + scene.json)  ── repli statique si besoin
                     │
                     └─► POST /api/contact ─► API Spring Boot ─► e-mail (Papa + accusé)
```

---

## 12. Plan de livraison

| Phase | Contenu | Durée indicative |
|---|---|---|
| 0. Contenu | Remplir les JSON FR / EN, rédiger 3 études de cas, photo, témoignages | 1 – 2 semaines |
| 1. Fondations | Angular + SSR, schémas JSON et types, design system, CI, déploiement d'aperçu | 1 semaine |
| 2. Prototype 3D | Schéma d'architecture, liens, paquets, repli statique, mesure de performance sur appareils réels (dont un Android d'entrée de gamme) | 1 semaine |
| 3. Narration GSAP | Hero, sections, parcours épinglé, caméra liée au défilement, études de cas | 1 – 2 semaines |
| 4. Finitions | API contact, CV PDF, SEO, accessibilité, audit performance | 1 semaine |
| 5. Lancement | Sauvegarde du contenu actuel du dépôt, mise en production sur https://coundia.github.io/, redirection de pcoundia.com, mise à jour de LinkedIn et des profils freelance | 2 – 3 jours |

### Critères de lancement
- [ ] Toutes les exigences P0 livrées et testées ; aucun texte du CV en dur dans les composants.
- [ ] Lighthouse mobile ≥ 90 en Performance et 100 sur les trois autres axes (accueil + une étude de cas).
- [ ] 60 fps sur desktop, ≥ 30 fps sur un Android milieu de gamme ; repli vérifié sans WebGL et en mouvement réduit.
- [ ] Zéro erreur axe ; navigation clavier vérifiée.
- [ ] Formulaire testé en production ; CV PDF FR / EN conformes aux JSON.
- [ ] Site en ligne sur https://coundia.github.io/ : toutes les routes FR / EN accessibles en accès direct (pas seulement par navigation interne), 404 personnalisée, HTTPS forcé.
- [ ] Aucun dégradé ni transparence : lint vert et revue visuelle des deux thèmes.
- [ ] Contenu relu en FR et en EN.

---

## 13. Risques

| Risque | Mitigation |
|---|---|
| La 3D dégrade la performance ou l'autonomie sur mobile | Chunk différé, pause hors écran, dégradation automatique, repli statique, budgets bloquants en CI |
| L'animation nuit à la lisibilité ou à l'accessibilité | Texte toujours lisible sans JS, mode mouvement réduit, P1 testé : CV et contact trouvés en < 10 s |
| Effet « démo technique » au détriment du message | Chaque animation sert la narration du parcours ; relecture par un recruteur avant lancement |
| Contenu générique faute de chiffres publiables | Anonymiser, ordres de grandeur, insister sur les décisions et le raisonnement |
| Projet qui s'éternise | Prototype 3D limité dans le temps (phase 2), livraison des P0 d'abord |

---

## 14. Questions ouvertes

| # | Question |
|---|---|
| Q1 | Client et contenu de la mission de **Consultant IT** (depuis mars 2025) ? |
| Q2 | Quels **chiffres** et quels **noms de clients** peut-on publier ? |
| Q3 | Cible prioritaire : **missions freelance**, **CDI remote**, ou les deux ? |
| Q4 | Qui peut fournir des **témoignages** ? |
| Q5 | **Certifications** à mettre en avant ? |
| Q6 | **pcoundia.com** : simple redirection vers https://coundia.github.io/, ou domaine personnalisé du dépôt (le site serait alors servi sur pcoundia.com) ? |
| Q7 | Les **présentations** actuellement sur coundia.github.io doivent-elles rester en ligne (sous `/presentations/`) ? |
