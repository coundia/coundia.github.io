import { RenderMode, ServerRoute } from '@angular/ssr';

import { ContentService } from './core/content.service';

// Site 100 % statique (GitHub Pages) : chaque route et chaque langue est pré-rendue.
export const serverRoutes: ServerRoute[] = [
  {
    path: 'projets/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => ContentService.caseStudySlugs('fr').map((slug) => ({ slug })),
  },
  {
    path: 'en/projects/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => ContentService.caseStudySlugs('en').map((slug) => ({ slug })),
  },
  { path: '**', renderMode: RenderMode.Prerender },
];
