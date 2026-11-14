import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ContentService } from '../core/content.service';
import { Lang } from '../core/models';
import { SeoService } from '../core/seo.service';
import { ContactComponent } from '../sections/contact.component';
import { ExpertiseComponent } from '../sections/expertise.component';
import { HeroComponent } from '../sections/hero.component';
import { JourneyComponent } from '../sections/journey.component';
import { OpenSourceComponent } from '../sections/open-source.component';
import { StackComponent } from '../sections/stack.component';
import { StatsComponent } from '../sections/stats.component';
import { TestimonialsComponent } from '../sections/testimonials.component';
import { WorkComponent } from '../sections/work.component';

@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeroComponent,
    StatsComponent,
    ExpertiseComponent,
    JourneyComponent,
    WorkComponent,
    OpenSourceComponent,
    StackComponent,
    TestimonialsComponent,
    ContactComponent,
  ],
  template: `
    <app-hero />
    <app-stats />
    <app-expertise />
    <app-journey />
    <app-work />
    <app-open-source />
    <app-stack />
    <app-testimonials />
    <app-contact />
  `,
})
export class HomePage {
  constructor() {
    const content = inject(ContentService);
    content.setLang(inject(ActivatedRoute).snapshot.data['lang'] as Lang);
    const t = content.t();
    const seo = inject(SeoService);
    seo.update({
      title: t.meta.homeTitle,
      description: t.meta.homeDescription,
      path: content.homePath(),
      type: 'profile',
      jsonLd: seo.personJsonLd(),
    });
  }
}
