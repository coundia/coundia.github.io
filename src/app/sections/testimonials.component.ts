import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ContentService } from '../core/content.service';
import { RevealDirective } from '../shared/reveal.directive';

/** Témoignages en cartes HUD opaques laissant respirer la scène 3D. */
@Component({
  selector: 'app-testimonials',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    @if (items().length) {
      <section class="section" aria-labelledby="testimonials-title">
        <div class="container">
          <div class="testimonials__wrap">
            <h2 id="testimonials-title" class="mono muted heading hud-card">{{ t().sections.testimonials }}</h2>
            <ul class="grid" appReveal="stagger">
              @for (item of items(); track item.id) {
                <li>
                  <figure class="quote hud-card">
                    <blockquote class="h4">« {{ item.quote }} »</blockquote>
                    <figcaption class="muted">
                      @if (item.url) {
                        <a class="link" [href]="item.url" target="_blank" rel="noopener">{{ item.name }}</a>
                      } @else {
                        <strong>{{ item.name }}</strong>
                      }
                      - {{ item.position }}, {{ item.company }}
                    </figcaption>
                  </figure>
                </li>
              }
            </ul>
          </div>
        </div>
      </section>
    }
  `,
  styles: `
    .testimonials__wrap {
      display: grid;
      gap: var(--space-5);
      max-width: 820px;
    }
    .heading {
      justify-self: start;
      padding: var(--space-3) var(--space-4);
    }
    .grid {
      display: grid;
      gap: var(--space-5);
    }
    .quote {
      margin: 0;
      display: grid;
      gap: var(--space-4);
      border-left: 4px solid var(--color-accent);
    }
    blockquote {
      margin: 0;
      font-weight: 500;
    }
    @media (min-width: 1024px) {
      .grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `,
})
export class TestimonialsComponent {
  private readonly content = inject(ContentService);
  protected readonly t = this.content.t;
  protected readonly items = this.content.testimonials;
}
