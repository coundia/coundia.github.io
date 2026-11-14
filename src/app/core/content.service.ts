import { DOCUMENT, Injectable, computed, inject, signal } from '@angular/core';

import profileFr from '../../data/fr/profile.json';
import profileEn from '../../data/en/profile.json';
import statsFr from '../../data/fr/stats.json';
import statsEn from '../../data/en/stats.json';
import expertiseFr from '../../data/fr/expertise.json';
import expertiseEn from '../../data/en/expertise.json';
import experiencesFr from '../../data/fr/experiences.json';
import experiencesEn from '../../data/en/experiences.json';
import educationFr from '../../data/fr/education.json';
import educationEn from '../../data/en/education.json';
import skillsFr from '../../data/fr/skills.json';
import skillsEn from '../../data/en/skills.json';
import caseStudiesFr from '../../data/fr/case-studies.json';
import caseStudiesEn from '../../data/en/case-studies.json';
import openSourceFr from '../../data/fr/open-source.json';
import openSourceEn from '../../data/en/open-source.json';
import testimonialsFr from '../../data/fr/testimonials.json';
import testimonialsEn from '../../data/en/testimonials.json';
import i18nFr from '../../i18n/fr.json';
import i18nEn from '../../i18n/en.json';
import site from '../../data/site.json';

import {
  CaseStudy,
  Education,
  Experience,
  Expertise,
  Lang,
  OpenSourceProject,
  Profile,
  SiteConfig,
  SkillGroup,
  Stat,
  Testimonial,
} from './models';

export type I18n = typeof i18nFr;

interface Content {
  profile: Profile;
  stats: Stat[];
  expertise: Expertise[];
  experiences: Experience[];
  education: Education[];
  skills: SkillGroup[];
  caseStudies: CaseStudy[];
  openSource: OpenSourceProject[];
  testimonials: Testimonial[];
  t: I18n;
}

const CONTENT: Record<Lang, Content> = {
  fr: {
    profile: profileFr as Profile,
    stats: statsFr,
    expertise: expertiseFr as Expertise[],
    experiences: experiencesFr,
    education: educationFr,
    skills: skillsFr,
    caseStudies: caseStudiesFr,
    openSource: openSourceFr,
    testimonials: testimonialsFr as Testimonial[],
    t: i18nFr,
  },
  en: {
    profile: profileEn as Profile,
    stats: statsEn,
    expertise: expertiseEn as Expertise[],
    experiences: experiencesEn,
    education: educationEn,
    skills: skillsEn,
    caseStudies: caseStudiesEn,
    openSource: openSourceEn,
    testimonials: testimonialsEn as Testimonial[],
    t: i18nEn,
  },
};

export const langFromPath = (path: string): Lang => (/^\/en(\/|$|\?|#)/.test(path) ? 'en' : 'fr');

/** Accès typé au contenu (JSON) dans la langue courante. Aucun texte n'est écrit en dur dans les composants. */
@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly document = inject(DOCUMENT);

  readonly lang = signal<Lang>(langFromPath(this.document.location?.pathname ?? '/'));
  readonly site = site as SiteConfig;

  private readonly current = computed(() => CONTENT[this.lang()]);
  readonly t = computed(() => this.current().t);
  readonly profile = computed(() => this.current().profile);
  readonly stats = computed(() => this.current().stats);
  readonly expertise = computed(() => this.current().expertise);
  readonly experiences = computed(() => this.current().experiences);
  readonly education = computed(() => this.current().education);
  readonly skills = computed(() => this.current().skills);
  readonly caseStudies = computed(() => this.current().caseStudies);
  readonly openSource = computed(() => this.current().openSource);
  readonly testimonials = computed(() => this.current().testimonials);

  static caseStudySlugs(lang: Lang): string[] {
    return CONTENT[lang].caseStudies.map((c) => c.slug);
  }

  setLang(lang: Lang): void {
    this.lang.set(lang);
  }

  caseStudy(slug: string): CaseStudy | undefined {
    return this.caseStudies().find((c) => c.slug === slug);
  }

  /** Chemins localisés. */
  homePath(lang: Lang = this.lang()): string {
    return lang === 'en' ? '/en' : '/';
  }

  cvPath(lang: Lang = this.lang()): string {
    return lang === 'en' ? '/en/cv' : '/cv';
  }

  caseStudyPath(slug: string, lang: Lang = this.lang()): string {
    return lang === 'en' ? `/en/projects/${slug}` : `/projets/${slug}`;
  }

  /** Équivalent d'un chemin dans l'autre langue (sélecteur de langue, hreflang). */
  translatePath(path: string, to: Lang): string {
    const clean = path.split(/[?#]/)[0].replace(/\/$/, '') || '/';
    const slug = clean.match(/^\/(?:en\/projects|projets)\/([^/]+)$/)?.[1];
    if (slug) return this.caseStudyPath(slug, to);
    if (/^(\/en)?\/cv$/.test(clean)) return this.cvPath(to);
    return this.homePath(to);
  }

  formatMonth(value: string | null): string {
    if (!value) return this.t().journey.present;
    const [year, month] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, 1));
    return new Intl.DateTimeFormat(this.lang() === 'en' ? 'en-GB' : 'fr-FR', {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  }
}
