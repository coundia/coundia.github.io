import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentService } from '../core/content.service';
import { SeoService } from '../core/seo.service';

@Component({
  selector: 'app-not-found-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="container nf">
      <p class="code" aria-hidden="true">404</p>
      <h1 class="display-m">{{ t().notFound.title }}</h1>
      <p class="body-l muted">{{ t().notFound.text }}</p>
      <a class="btn btn--primary" [routerLink]="content.homePath()">{{ t().notFound.home }}</a>
    </section>
  `,
  styles: `
    .nf {
      display: grid;
      justify-items: start;
      align-content: center;
      gap: var(--space-5);
      min-height: 80svh;
      padding-top: calc(var(--header-h) + var(--space-8));
      padding-bottom: var(--space-9);
    }
    .code {
      font-family: var(--font-display);
      font-size: clamp(6rem, 4rem + 12vw, 16rem);
      line-height: 0.9;
      color: var(--color-accent);
    }
  `,
})
export class NotFoundPage {
  protected readonly content = inject(ContentService);
  protected readonly t = this.content.t;

  constructor() {
    inject(SeoService).update({
      title: this.t().meta.notFoundTitle,
      description: this.t().notFound.text,
      path: '/404',
    });
  }
}
