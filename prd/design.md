# Design system du portfolio de Papa Coundia

| Champ | Valeur |
|---|---|
| Version | 1.2 (schéma d'architecture 3D) |
| Date | 14 novembre 2026 |
| Document lié | [prd.md](prd.md) |
| Statut | À valider |

---

## 0. Règles absolues

Ces deux règles s'appliquent **partout** : CSS, SVG, images, scène Three.js et animations GSAP.

### Aucun dégradé
- Pas de `linear-gradient`, `radial-gradient`, `conic-gradient`, ni leurs variantes `repeating-*`.
- Pas de dégradé dans les SVG (`<linearGradient>`, `<radialGradient>`).
- Pas d'ombre floue (`box-shadow` ou `text-shadow` avec flou, `filter: drop-shadow`) : un flou produit un dégradé.
- Pas de `filter: blur()`.
- En 3D : pas de bloom, pas de halo, pas de brouillard (`fog`), pas de lumière (donc pas d'ombrage dégradé), pas d'interpolation de couleur le long des liens.

### Aucune transparence
- Pas de couleur avec canal alpha : `rgba()`, `hsla()`, `#RRGGBBAA`, `#RGBA`, `color-mix(… transparent)`, mot-clé `transparent`.
- Pas de `opacity` inférieure à 1, ni dans le CSS ni dans les animations (`opacity`, `autoAlpha` interdits dans GSAP).
- Pas de `backdrop-filter`, pas d'effet verre (« glassmorphism »), pas de voile semi-transparent sur les images ou derrière les modales.
- Pas de `mix-blend-mode`.
- En 3D : `renderer` opaque (`alpha: false`), matériaux opaques (`transparent: false`), pas de `AdditiveBlending`.

### Ce qu'on utilise à la place

| Besoin habituel | Solution sans dégradé ni transparence |
|---|---|
| Profondeur, élévation | Paliers de surfaces pleines (`surface-1`, `surface-2`) + bordures 1 px |
| Ombre de carte ou de bouton | Ombre **dure** décalée, pleine, sans flou : `4px 4px 0 var(--color-accent)` |
| Apparition en fondu | Révélation par **masque** (`clip-path`), translation dans un conteneur `overflow: hidden`, mise à l'échelle |
| Élément désactivé | Couleurs pleines dédiées (`text-disabled`, `surface-2`), jamais d'opacité |
| Fond de modale / menu mobile | Panneau **plein écran opaque** (`bg`), pas de voile |
| Texte lisible sur une image | Le texte ne se pose **jamais** sur une image : image et texte sont dans des blocs séparés |
| Bordure invisible (réserver la place) | Bordure de la même couleur que le fond |
| Effet de survol | Changement franc de couleur pleine, ombre dure, translation |

---

## 1. Principes

1. **Éditorial et franc.** Aplats de couleur, typographie forte, filets fins, grille visible. L'esthétique d'un magazine technique, pas d'un template « développeur ».
2. **Le contenu d'abord.** Titre, stack, CV et contact lisibles avant toute animation, même sans JavaScript.
3. **Chaque mouvement raconte quelque chose.** Les animations servent le propos : montrer comment Papa construit une plateforme, couche par couche (frontend, backend, paiement, DevOps).
4. **Précision d'ingénieur.** Alignements exacts, espacements issus d'une échelle unique, numérotation des sections en monospace (`01 - Expertise`).
5. **Sobriété chromatique.** Des neutres (noir, gris, blanc) et **une seule couleur : le bleu**. Aucune autre teinte, sauf le vert et le rouge réservés aux états (disponible, erreur).

---

## 2. Couleurs

Toutes les couleurs sont **pleines** (hexadécimal à 6 chiffres). Les contrastes ont été calculés selon la formule WCAG 2.2. Sauf mention contraire, ils respectent le niveau AA : 4,5 : 1 pour le texte, 3 : 1 pour les bordures de contrôles.

### 2.1 Thème sombre (par défaut)

| Jeton | Valeur | Usage | Contraste sur `bg` |
|---|---|---|---|
| `bg` | `#0B0D12` | Fond de page | - |
| `surface-1` | `#12151C` | Cartes, sections alternées | - |
| `surface-2` | `#1A1E27` | Survol de carte, champs, éléments imbriqués | - |
| `border` | `#272C37` | Filets, séparateurs (décoratifs) | - |
| `border-strong` | `#5D6676` | Bordures de champs et contrôles | 3,36 : 1 (≥ 3 : 1) |
| `text` | `#F4F6FA` | Texte principal | 17,96 : 1 |
| `text-muted` | `#A7AFBD` | Texte secondaire, métadonnées, étiquettes | 8,80 : 1 |
| `text-subtle` | `#808999` | Texte discret | 5,51 : 1 |
| `text-disabled` | `#4A5160` | Texte désactivé | exempté |
| `accent` | `#3B82F6` | Bleu : bouton principal, liens, éléments actifs | 5,28 : 1 |
| `accent-hover` | `#60A5FA` | Survol de l'accent | 7,64 : 1 |
| `on-accent` | `#0B0D12` | Texte sur fond `accent` | 5,28 : 1 |
| `secondary` | `#93C5FD` | Bleu clair (réservé) | 10,78 : 1 |
| `success` | `#4ADE80` | Disponibilité, envoi réussi | 11,15 : 1 |
| `error` | `#F87171` | Erreurs de formulaire | 7,03 : 1 |
| `warning` | `#FBBF24` | Avertissements (non utilisé) | 11,64 : 1 |

### 2.2 Thème clair

| Jeton | Valeur | Contraste sur `bg` |
|---|---|---|
| `bg` | `#F6F8FB` | - |
| `surface-1` | `#FFFFFF` | - |
| `surface-2` | `#EBEFF5` | - |
| `border` | `#D9DFE8` | - |
| `border-strong` | `#7C8596` | 3,49 : 1 |
| `text` | `#0B0D12` | 18,27 : 1 |
| `text-muted` | `#4A5363` | 7,29 : 1 |
| `text-subtle` | `#6B7385` | 4,47 : 1, grand texte seulement |
| `text-disabled` | `#A3ABB8` | exempté |
| `accent` | `#1D4ED8` | 6,30 : 1 |
| `accent-hover` | `#1E40AF` | 8,20 : 1 |
| `on-accent` | `#FFFFFF` | 6,70 : 1 |
| `secondary` | `#1E3A8A` | 9,74 : 1 |
| `success` | `#15803D` | 4,71 : 1 |
| `error` | `#B91C1C` | 6,08 : 1 |
| `warning` | `#92400E` | 6,66 : 1 |

### 2.3 Règles d'usage
- **Une seule teinte : le bleu.** Tout le reste est neutre (fond, surfaces, textes, étiquettes, bordures). Le vert et le rouge ne servent qu'aux états.
- **60 / 30 / 10 :** ~60 % `bg`, ~30 % surfaces et texte, ≤ 10 % de bleu.
- Le bleu (`accent`) sert aux **actions**, à l'**état actif** et aux repères (numéros, couche active du schéma). Jamais pour de longs textes.
- Pas d'effet « délavé » : pas de texte gris géant en filigrane, pas de numéro fantôme. Un élément décoratif est soit plein (bleu ou texte), soit absent.
- Pas de couleur intermédiaire inventée : si une nuance manque, on ajoute un jeton.
- La sélection de texte utilise `accent` / `on-accent` (`::selection`).

---

## 3. Typographie

| Rôle | Police | Graisses | Usage |
|---|---|---|---|
| Display | **Clash Display** (Fontshare, licence libre) | 500, 600 | Titres H1 – H2, grands chiffres |
| Texte | **Inter** | 400, 500, 600 | Paragraphes, interface, H3 – H4 |
| Mono | **JetBrains Mono** | 400, 500 | Numéros de section, dates, étiquettes de stack, extraits de code |

Polices auto-hébergées, sous-ensemble latin + latin étendu, `font-display: swap`, préchargement de Clash Display 600 et Inter 400.

### 3.1 Échelle (fluide, `clamp()`)

| Jeton | Mobile → Desktop | Interlignage | Usage |
|---|---|---|---|
| `display-xl` | 48 → 120 px | 0,95 | Nom dans le hero |
| `display-l` | 40 → 80 px | 1,0 | Titres de section |
| `display-m` | 32 → 56 px | 1,05 | Titre d'étude de cas |
| `h3` | 24 → 32 px | 1,2 | Titres de carte |
| `h4` | 20 → 24 px | 1,3 | Sous-titres |
| `body-l` | 18 → 20 px | 1,6 | Accroche, introduction |
| `body` | 16 → 17 px | 1,65 | Texte courant |
| `small` | 14 px | 1,5 | Métadonnées |
| `mono` | 13 → 14 px | 1,5 | Étiquettes, dates (casse : majuscules, interlettrage 0,04 em) |

### 3.2 Règles
- Longueur de ligne : 60 à 72 caractères pour le texte courant (`max-width: 68ch`).
- Titres en Clash Display, interlettrage légèrement négatif (−0,02 em) au-delà de 48 px.
- Les numéros de section suivent le format `01 - EXPERTISE` en mono, couleur `text-muted`, au-dessus du titre.
- Pas d'italique décoratif ; le gras sert à l'emphase, pas à la décoration.

---

## 4. Espacement et grille

### 4.1 Échelle d'espacement (base 4 px)
`space-1` 4 · `space-2` 8 · `space-3` 12 · `space-4` 16 · `space-5` 24 · `space-6` 32 · `space-7` 48 · `space-8` 64 · `space-9` 96 · `space-10` 128 · `space-11` 192

- Espacement entre sections : `space-9` (mobile) → `space-11` (desktop).
- Marge latérale de page : 16 px (mobile), 32 px (tablette), 64 px (desktop).

### 4.2 Grille

| Point de rupture | Largeur | Colonnes | Gouttière |
|---|---|---|---|
| `sm` | ≥ 0 | 4 | 16 px |
| `md` | ≥ 768 px | 8 | 24 px |
| `lg` | ≥ 1024 px | 12 | 24 px |
| `xl` | ≥ 1440 px | 12 | 32 px (conteneur max. 1360 px) |

Aucun défilement horizontal de la page à aucune largeur (sauf la section études de cas épinglée sur desktop, pilotée par le défilement vertical).

---

## 5. Formes, bordures et élévation

| Jeton | Valeur | Usage |
|---|---|---|
| `radius-0` | 0 | Sections, images, grands blocs (esthétique éditoriale) |
| `radius-sm` | 4 px | Champs, cartes, boutons |
| `radius-pill` | 999 px | Étiquettes de stack, badge de disponibilité |
| `border-width` | 1 px | Filets, cartes |
| `border-width-strong` | 2 px | Focus, élément actif |
| `shadow-hard` | `4px 4px 0 var(--color-accent)` | Survol du bouton principal et des cartes d'étude de cas |
| `shadow-hard-neutral` | `4px 4px 0 var(--color-border-strong)` | Survol des cartes secondaires |

**Élévation sans ombre floue :**
- Niveau 0 : `bg`
- Niveau 1 : `surface-1` + bordure `border`
- Niveau 2 : `surface-2` + bordure `border-strong`
- Interaction : ombre dure + translation `(-4px, -4px)` pour donner l'impression que l'élément se soulève.

---

## 6. Iconographie et images

- **Icônes :** Lucide, trait 1,5 px, `currentColor`, tailles 16 / 20 / 24 px. Aucune icône de couleur.
- **Portrait :** photographie professionnelle traitée en **bichromie pleine** (deux tons posterisés `bg` / `text`, sans dégradé) ou en noir et blanc net, exportée en AVIF / WebP. Préparée hors ligne, aucun filtre CSS.
- **Captures de projets :** dans un cadre `surface-1` avec bordure `border`, sans ombre ni reflet.
- **Schémas d'architecture :** SVG en aplats, traits 1,5 px, couleurs `text`, `border-strong`, `accent` ; texte réel (pas vectorisé) pour l'accessibilité.
- **Aucun texte posé sur une image**, aucun voile, aucune image de fond décorative.

---

## 7. Motion design (GSAP)

### 7.1 Jetons

| Jeton | Valeur | Usage |
|---|---|---|
| `duration-xs` | 0,15 s | Survol, changement de couleur |
| `duration-s` | 0,3 s | Boutons, petits éléments |
| `duration-m` | 0,6 s | Révélations de texte et de cartes |
| `duration-l` | 1,0 s | Hero, transitions de page |
| `duration-xl` | 1,6 s | Grandes transitions |
| `ease-out` | `power3.out` | Entrées |
| `ease-in-out` | `power2.inOut` | Transitions, caméra 3D |
| `ease-expo` | `expo.out` | Hero, grands titres |
| `stagger` | 0,06 s (mots), 0,08 s (cartes) | Décalages |

### 7.2 Techniques autorisées (sans opacité)

| Technique | Mise en œuvre | Exemple |
|---|---|---|
| **Révélation de ligne** | Chaque ligne / mot dans un conteneur `overflow: hidden`, le texte entre par `yPercent: 100 → 0` | Titres (SplitText, `mask: "lines"`) |
| **Volet (clip-path)** | `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)` | Images, cartes, schémas |
| **Volet plein écran** | Panneau `accent` qui traverse l'écran, puis panneau `bg` | Transitions de page |
| **Translation / échelle** | `y`, `x`, `scale` | Cartes, boutons magnétiques |
| **Brouillage de texte** | ScrambleText | Rôles du hero |
| **Compteur** | Tween d'un nombre (`snap: 1`) | Chiffres clés |
| **Tracé SVG** | `stroke-dashoffset` (DrawSVG) | Ligne de temps du parcours |
| **Changement de couleur franc** | Couleur pleine A → couleur pleine B | État actif, survol |
| **Réorganisation** | Flip | Filtres de la stack |

**Interdit dans GSAP :** `opacity`, `autoAlpha`, `filter`, toute couleur avec alpha. Le passage d'une couleur pleine à une autre est autorisé (les états intermédiaires restent des couleurs pleines).

### 7.3 Chorégraphie de la page d'accueil

| Section | Déclencheur | Animation |
|---|---|---|
| Hero | Chargement | Nom révélé ligne par ligne (`expo.out`, 1 s) ; rôles en ScrambleText avec curseur de terminal ; fenêtre « architecture » dévoilée par volet ; volumes 3D qui sortent du sol, liens tracés, paquets en circulation |
| Chiffres clés | Entrée dans l'écran (75 %) | Compteurs 0 → valeur, filets qui se tracent |
| Expertise | Entrée dans l'écran | Cartes révélées par volet, décalées |
| Expertise | Schéma collé (sticky) sur desktop | Chaque carte active déplace la caméra vers sa couche (1,2 s, `power2.inOut`) ; composants de la couche en bleu |
| Parcours | Défilement, `scrub` | Ligne de temps tracée au défilement ; chaque expérience révélée par volet ; l'étape lue est mise en avant |
| Études de cas | Épinglée sur desktop | Défilement horizontal ; numéro de cas en grand, en bleu ; transition Flip vers la page détail |
| Open source / Stack | Entrée dans l'écran | Étiquettes qui se placent (Flip) |
| Contact | Entrée dans l'écran | Grand titre révélé ; bouton magnétique ; validation du formulaire par volet `success` |

### 7.4 Mouvement réduit
Avec `prefers-reduced-motion: reduce` (via `gsap.matchMedia()`) :
- Aucun épinglage, aucun défilement horizontal, aucun mouvement de caméra, pas de défilement fluide (Lenis désactivé).
- Les éléments apparaissent **directement dans leur état final**, sans animation (pas de fondu de remplacement).
- La scène 3D est remplacée par l'image statique.

---

## 8. Scène 3D (Three.js) : « Le système »

### 8.1 Rendu
- **Caméra orthographique en isométrie vraie** (direction (1, 1, 1)) : un schéma d'architecte, pas une perspective de jeu vidéo. Le zoom et le point visé changent selon la couche.
- `WebGLRenderer({ alpha: false, antialias: true })`, fond = jeton `bg`.
- **Uniquement `MeshBasicMaterial` et `LineBasicMaterial`** : aucune lumière, donc aucun ombrage dégradé. Le volume est donné par **trois tons pleins** (dessus, face gauche, face droite) et des arêtes fines.
- Aucun post-traitement, aucun brouillard, aucun matériau transparent.

### 8.2 Éléments

| Élément | Forme | Couleur sombre | Couleur clair |
|---|---|---|---|
| Grille au sol | Lignes pleines, pas de 1 | `#171B23` | `#E3E8EF` |
| Volume (dessus / gauche / droite) | Boîte ou cylindre (bases de données) | `#2B313D` / `#1C2029` / `#141820` | `#FFFFFF` / `#E6EAF1` / `#CBD2DD` |
| Arêtes | Lignes 1 px | `#5D6676` | `#7C8596` |
| Écran (applications) | Face avant des écrans | `#3B82F6` | `#1D4ED8` |
| Volume de la couche active | Trois tons de bleu | `#60A5FA` / `#3B82F6` / `#1D4ED8` | `#93C5FD` / `#3B82F6` / `#1D4ED8` |
| Lien | Tube fin, tracé orthogonal (circuit imprimé) | `#3A414E` | `#B8C0CC` |
| Lien de la couche active | Même tube, bleu | `#3B82F6` | `#1D4ED8` |
| Paquet (requête, transaction) | Petit cube plein qui parcourt les liens | `#F4F6FA` | `#0B0D12` |
| Étiquette | HTML, mono 11 px, pastille pleine | `text-muted` sur `bg` | idem ; active : `on-accent` sur `accent` |

- Toutes ces couleurs sont des jetons (`tokens.json` → `scene`) ; le changement de thème recolore la scène sans la recréer.
- **Intro :** volumes qui sortent du sol (échelle verticale) de l'arrière vers l'avant, liens qui se **tracent** (`setDrawRange`), puis paquets en circulation.
- **Étiquettes :** toutes visibles en vue d'ensemble (desktop) ; seules celles de la couche active quand une couche est sélectionnée ; masquées sur mobile, où la liste des composants s'affiche sous le schéma.

### 8.3 Repli SVG
Le même schéma, calculé avec **la même projection isométrique et les mêmes données** (`scene.json`), est pré-rendu en SVG (aplats, arêtes, étiquettes sur pastilles). Il s'affiche sans JavaScript, sans WebGL, en mouvement réduit, en mode économie de données et pendant le chargement de Three.js, et suit lui aussi la couche active.

## 9. Composants

### 9.1 Boutons

| Variante | Repos | Survol | Focus | Désactivé |
|---|---|---|---|---|
| **Principal** | fond `accent`, texte `on-accent`, `radius-sm` | fond `accent-hover`, `shadow-hard-neutral`, translation (−4, −4) | contour 2 px `text`, décalage 3 px | fond `surface-2`, texte `text-disabled` |
| **Secondaire** | fond `bg`, bordure 1 px `border-strong`, texte `text` | bordure `text`, `shadow-hard`, translation (−4, −4) | idem | bordure `border`, texte `text-disabled` |
| **Lien** | texte `accent`, soulignement 1 px décalé 4 px | soulignement 2 px | idem | texte `text-disabled` |

Hauteur 48 px (cible tactile ≥ 44 px), padding horizontal 24 px, texte Inter 500 16 px. Icône facultative à droite (flèche), qui glisse de 4 px au survol.

### 9.2 Étiquette de stack
Mono 13 px, majuscules, `radius-pill`, bordure 1 px `border-strong`, texte `text-muted`, fond `bg` (neutre). Variante active : fond `accent`, texte `on-accent`.

### 9.3 Badge de disponibilité
Pastille pleine `success` de 8 px + texte `small`. Animation : l'anneau autour de la pastille grandit par **échelle** (pas de fondu), toutes les 2 s. Statique en mouvement réduit.

### 9.4 Carte d'étude de cas
- `surface-1`, bordure `border`, `radius-sm`, padding `space-6`.
- Haut : numéro (`display-m`, `accent`) + secteur en mono.
- Image dans un cadre `radius-0`, révélée par volet.
- Titre `h3`, résumé `body` `text-muted`, 3 à 5 étiquettes de stack, lien « Lire l'étude de cas ».
- Survol : bordure `accent`, `shadow-hard`, translation (−4, −4) ; l'image glisse légèrement (`scale: 1.03` dans son cadre `overflow: hidden`).

### 9.5 Chiffre clé
Valeur en `display-l` (Clash Display) couleur `text`, suffixe (« + », « ans ») en `accent`, libellé `small` `text-muted`, filet supérieur 1 px `border`.

### 9.6 Élément de parcours (ligne de temps)
Ligne verticale 1 px `border-strong`, tracée progressivement en `accent`. Point plein de 12 px (bord `accent`, centre `bg` ; plein `accent` quand actif). Période en mono `text-muted`, poste en `h4`, entreprise + lieu en `body` ; puces `text-muted` ; étiquettes de stack.

### 9.7 Navigation
- Barre supérieure **opaque** `bg`, filet inférieur `border`, hauteur 64 px.
- Gauche : monogramme « PC » ; droite : liens, sélecteur FR / EN (mono), bascule de thème, bouton « Me contacter » (secondaire).
- Se masque au défilement vers le bas par translation (`yPercent: -100`), réapparaît vers le haut.
- **Menu mobile :** panneau plein écran opaque `bg`, liens en `display-m`, entrée par volet `clip-path`.

### 9.8 Champs de formulaire
- Fond `surface-1`, bordure 1 px `border-strong`, `radius-sm`, hauteur 48 px, libellé toujours visible au-dessus (pas de libellé flottant).
- Focus : bordure 2 px `accent`. Erreur : bordure 2 px `error` + message `small` `error` avec icône. Désactivé : fond `surface-2`, texte `text-disabled`.
- Succès d'envoi : bloc `surface-1` bordé `success`, révélé par volet.

### 9.9 Notification (toast)
Bloc opaque `surface-2`, bordure gauche 4 px (`success` / `error`), entrée par translation depuis le bas, sans fondu.

### 9.10 En-tête de section
`01 - EXPERTISE` (mono, `text-muted`) au-dessus d'un titre `display-l`, filet 1 px `border` pleine largeur au-dessus du bloc.

---

## 10. Mise en page des sections

### 10.1 Hero (desktop)

```
┌──────────────────────────────────────────────────────────────────────┐
│ PC                      Parcours  Projets  Open source  EN ◐ [Contact]│
├──────────────────────────────────────────────────────────────────────┤
│  ● Disponible…          ┌ ● ● ●  plateforme / architecture  couche : Backend ┐
│                         │        [GIT]   ▢▢▢▢ services   ◯ PostgreSQL       │
│  PAPA                   │      [CI/CD]  ═══ RabbitMQ ═══ ◯ Event store       │
│  COUNDIA                │  ▭ Angular ══ API Gateway ══   ▢ Bank API          │
│                         │   ▭ Mobile ▭ Back-office       ▢ Mobile money      │
│  Développeur Full Stack │   (isométrie, paquets en circulation)              │
│  Angular & Spring Boot  ├──────────────────────────────────────────────────┤
│  > SPRING BOOT █        │ EXPLORER L'ARCHITECTURE                            │
│                         │ Dans le schéma : API Gateway · transfer-svc · …    │
│  Je conçois…            │ [Vue d'ensemble] [Frontend] [Backend] [Paiement]   │
│  [Me contacter →] [CV]  │ [Qualité & DevOps]                                 │
│                         └────────────────────────────────────────────────────┘
│  8+ ANS · FINTECH · SAAS · REMOTE CANADA ↔ SÉNÉGAL              DÉFILER ↓  │
└──────────────────────────────────────────────────────────────────────┘
```
Texte sur 5 colonnes, fenêtre « architecture » sur 7 colonnes. Sur mobile : texte d'abord, fenêtre en dessous (ratio 4:3), jamais derrière le texte.

### 10.2 Expertise (immersive)

```
┌──────────────────────────────────────────────────────────────────────┐
│ 01 - EXPERTISE                                                       │
│ Du front Angular aux microservices Spring.                           │
│ ┌──────────────────────┐   ┌ ● ● ●  plateforme / architecture ──────┐ │
│ │ 02 / 04              │   │                                        │ │
│ │ Backend Spring Boot  │   │  caméra centrée sur la couche backend, │ │
│ │ API REST, DDD…       │──►│  composants en bleu, noms affichés     │ │
│ │ Dans le schéma :     │   │  (schéma collé pendant le défilement)  │ │
│ │ transfer-svc · …     │   │                                        │ │
│ └──────────────────────┘   └────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

### 10.3 Ordre et fond des sections
Les sections alternent `bg` et `surface-1` (aplats, séparés par un filet `border`) :
Hero (`bg`) → Chiffres clés (`bg`) → Expertise immersive (`surface-1`) → Parcours (`bg`) → Études de cas (`surface-1`) → Open source (`bg`) → Stack (`surface-1`) → Témoignages (`bg`) → Contact (fond `accent`, texte `on-accent`, seul grand aplat d'accent du site) → Pied de page (`bg`).

---

## 11. Accessibilité

- Contrastes : voir § 2 (AA atteint pour tous les textes ; `text-subtle` réservé au grand texte en thème clair ; contrôles ≥ 3 : 1).
- Focus toujours visible : contour 2 px `text` + décalage 3 px (sur fond `accent`, contour `on-accent`).
- Cibles tactiles ≥ 44 × 44 px.
- L'état n'est jamais transmis par la couleur seule (icône ou texte en plus).
- Canvas 3D `aria-hidden="true"` ; le SVG de repli porte un `aria-label` qui décrit l'architecture ; les composants de chaque couche sont listés en texte.
- Sans JavaScript, tout le contenu est visible dans son état final (les états initiaux des animations sont posés par JS, pas par le CSS).

---

## 12. Implémentation

### 12.1 Jetons en JSON (source unique)
Conformément au principe du PRD (données séparées de l'interface), les jetons vivent dans `src/data/tokens.json` et génèrent au build :
- les variables CSS (`--color-bg`, `--space-4`…) pour les deux thèmes ;
- la configuration du thème Tailwind ;
- les constantes de couleur de la scène Three.js et les jetons de motion GSAP.

```json
{
  "color": {
    "dark":  { "bg": "#0B0D12", "surface-1": "#12151C", "surface-2": "#1A1E27", "border": "#272C37", "border-strong": "#5D6676", "text": "#F4F6FA", "text-muted": "#A7AFBD", "text-subtle": "#808999", "text-disabled": "#4A5160", "accent": "#3B82F6", "accent-hover": "#60A5FA", "on-accent": "#0B0D12", "secondary": "#93C5FD", "success": "#4ADE80", "error": "#F87171", "warning": "#FBBF24" },
    "light": { "bg": "#F6F8FB", "surface-1": "#FFFFFF", "surface-2": "#EBEFF5", "border": "#D9DFE8", "border-strong": "#7C8596", "text": "#0B0D12", "text-muted": "#4A5363", "text-subtle": "#6B7385", "text-disabled": "#A3ABB8", "accent": "#1D4ED8", "accent-hover": "#1E40AF", "on-accent": "#FFFFFF", "secondary": "#1E3A8A", "success": "#15803D", "error": "#B91C1C", "warning": "#92400E" }
  },
  "space": { "1": 4, "2": 8, "3": 12, "4": 16, "5": 24, "6": 32, "7": 48, "8": 64, "9": 96, "10": 128, "11": 192 },
  "radius": { "0": 0, "sm": 4, "pill": 999 },
  "shadow": { "hard": "4px 4px 0 {color.accent}", "hard-neutral": "4px 4px 0 {color.border-strong}" },
  "motion": {
    "duration": { "xs": 0.15, "s": 0.3, "m": 0.6, "l": 1.0, "xl": 1.6 },
    "ease": { "out": "power3.out", "inOut": "power2.inOut", "expo": "expo.out" },
    "stagger": { "words": 0.06, "cards": 0.08 }
  }
}
```

Le JSON Schema de `tokens.json` n'accepte que des couleurs `^#[0-9A-F]{6}$` : une couleur avec alpha fait échouer le build.

### 12.2 Garde-fous automatiques (CI)
Les règles du § 0 sont documentées ici et **vérifiées automatiquement** :

- **Stylelint**
  - `function-disallowed-list` : `linear-gradient`, `radial-gradient`, `conic-gradient`, `repeating-linear-gradient`, `repeating-radial-gradient`, `repeating-conic-gradient`, `rgba`, `hsla`, `color-mix`, `blur`, `drop-shadow`.
  - `property-disallowed-list` : `opacity`, `backdrop-filter`, `mix-blend-mode`, `filter`.
  - `declaration-property-value-disallowed-list` : toute valeur contenant `transparent`, un hexadécimal à 4 ou 8 chiffres (`/#([0-9a-f]{4}|[0-9a-f]{8})\b/i`), ou une couleur avec `/` alpha (`rgb(… / 0.5)`).
- **Tailwind** : classes interdites par lint (`bg-gradient-*`, `from-*`, `via-*`, `to-*`, `opacity-*`, `backdrop-*`, `shadow-*` autres que les jetons, modificateurs d'opacité `/50`).
- **Code TypeScript** : règle ESLint `no-restricted-syntax` qui interdit les propriétés `opacity`, `autoAlpha`, `filter` dans les appels GSAP, et `transparent: true`, `AdditiveBlending`, `alpha: true` dans le code Three.js.
- **SVG** : vérification qu'aucun fichier ne contient `<linearGradient`, `<radialGradient`, `opacity=`, `fill-opacity`, `stroke-opacity`.
- **Revue visuelle** : captures de référence (Playwright) des deux thèmes pour détecter toute régression.
