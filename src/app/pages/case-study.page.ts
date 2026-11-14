import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ContentService } from '../core/content.service';
import { Lang } from '../core/models';
import { SeoService } from '../core/seo.service';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'app-case-study-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RevealDirective],
  styleUrl: './case-study.page.css',
  templateUrl: './case-study.page.html',
})
export class CaseStudyPage {
  protected readonly content = inject(ContentService);
  protected readonly t = this.content.t;
  private readonly slug: string;

  protected readonly study = computed(() => this.content.caseStudy(this.slug));
  protected readonly next = computed(() => {
    const list = this.content.caseStudies();
    const i = list.findIndex((c) => c.slug === this.slug);
    return list[(i + 1) % list.length];
  });

  constructor() {
    const route = inject(ActivatedRoute);
    this.content.setLang(route.snapshot.data['lang'] as Lang);
    this.slug = route.snapshot.paramMap.get('slug') ?? '';
    const study = this.study();
    if (!study) {
      void inject(Router).navigateByUrl('/404', { skipLocationChange: true });
      return;
    }
    inject(SeoService).update({
      title: `${study.title} - ${this.content.profile().firstName} ${this.content.profile().lastName}`,
      description: study.summary,
      path: this.content.caseStudyPath(study.slug),
      type: 'article',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: study.title,
        abstract: study.summary,
        author: { '@type': 'Person', name: `${this.content.profile().firstName} ${this.content.profile().lastName}` },
        keywords: study.stack.join(', '),
        inLanguage: this.content.lang(),
      },
    });
  }
}
