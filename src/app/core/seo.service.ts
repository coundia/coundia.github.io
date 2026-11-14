import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { ContentService } from './content.service';
import { Lang } from './models';

interface SeoInput {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article' | 'profile';
  jsonLd?: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly content = inject(ContentService);

  update({ title, description, path, type = 'website', jsonLd }: SeoInput): void {
    const lang = this.content.lang();
    const base = this.content.site.url;
    const url = `${base}${path === '/' ? '/' : path}`;

    this.document.documentElement.lang = lang;
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:locale', content: lang === 'en' ? 'en_GB' : 'fr_FR' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    this.setLink('canonical', url);
    for (const alt of ['fr', 'en'] as Lang[]) {
      this.setLink('alternate', `${base}${this.content.translatePath(path, alt)}`, alt);
    }
    this.setLink('alternate', `${base}${this.content.translatePath(path, 'fr')}`, 'x-default');
    this.setJsonLd(jsonLd);
  }

  /** Données structurées schema.org de la personne (page d'accueil). */
  personJsonLd(): Record<string, unknown> {
    const p = this.content.profile();
    return {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      mainEntity: {
        '@type': 'Person',
        name: `${p.firstName} ${p.lastName}`,
        jobTitle: `${p.title} - ${p.headline}`,
        description: p.tagline,
        address: { '@type': 'PostalAddress', addressLocality: 'Thiès', addressCountry: 'SN' },
        alumniOf: this.content.education().map((e) => ({ '@type': 'CollegeOrUniversity', name: e.school })),
        knowsAbout: this.content.skills().flatMap((s) => s.items),
        sameAs: p.links.map((l) => l.url),
        url: this.content.site.url,
      },
    };
  }

  private setLink(rel: string, href: string, hreflang?: string): void {
    const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
    let link = this.document.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = this.document.createElement('link');
      link.rel = rel;
      if (hreflang) link.hreflang = hreflang;
      this.document.head.appendChild(link);
    }
    link.href = href;
  }

  private setJsonLd(data?: Record<string, unknown>): void {
    const id = 'structured-data';
    this.document.getElementById(id)?.remove();
    if (!data) return;
    const script = this.document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    this.document.head.appendChild(script);
  }
}
