---
name: publish
description: Commit les changements du portfolio, lance le build Angular puis publie le site sur GitHub Pages (branche gh-pages). À utiliser quand l'utilisateur demande de commit + build + publier le portfolio.
disable-model-invocation: true
---

Publie le portfolio : commit, push de `master`, build, puis déploiement sur `gh-pages`.
Arguments optionnels : un message de commit (`$ARGUMENTS`).

## Étapes

1. **État du dépôt** : `git status -sb`. Ne jamais ajouter `.github/` ni des fichiers sans rapport avec la demande ; ajouter les fichiers modifiés par nom. S'il n'y a rien à commiter, passer à l'étape 3.
2. **Commit + push** : message en français, court, à l'impératif/passé comme dans `git log`. Utiliser `$ARGUMENTS` s'il est fourni, sinon le déduire du diff. Terminer par la ligne `Co-Authored-By` donnée dans le contexte de la session. Puis `git push origin master`.
3. **Build** : `npm run build` (le `postbuild` génère `404.html` et `.nojekyll`). En cas d'erreur, s'arrêter et montrer la sortie : ne rien publier.
4. **Publication** (push forcé : remplace la branche `gh-pages`, c'est le fonctionnement normal du site) :

```bash
PAGES=$(mktemp -d)
cp -R dist/coundia-portfolio/browser/. "$PAGES"/ && rm -f "$PAGES"/index.csr.html
cd "$PAGES" && git init -q -b gh-pages && git add -A && git commit -q -m "Publication du site"
git push --force https://github.com/coundia/coundia.github.io.git gh-pages
```

5. **Compte rendu** : indiquer le hash du commit poussé sur `master`, le hash de `gh-pages`, et rappeler que GitHub Pages met 1-2 min à se mettre à jour (https://coundia.github.io/). Ne pas affirmer avoir vérifié le site en ligne si ce n'est pas le cas.
