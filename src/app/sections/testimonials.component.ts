import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ContentService } from '../core/content.service';
import { RevealDirective } from '../shared/reveal.directive';

/** Témoignages : la section n'apparaît que si testimonials.json contient des entrées. */
@Component({
  selector: 'app-testimonials',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    @if (items().length) {
      <section class="section" aria-labelledby="testimonials-title">
        <div class="container">
          <h2 id="testimonials-title" class="mono muted heading">{{ t().sections.testimonials }}</h2>
          <ul class="grid" appReveal="stagger">
            @for (item of items(); track item.id) {
              <li>
                <figure class="quote">
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
      </section>
    }
  `,
  styles: `
    .heading {
      margin-bottom: var(--space-6);
    }
    .grid {
      display: grid;
      gap: var(--space-6);
    }
    .quote {
      margin: 0;
      display: grid;
      gap: var(--space-4);
      padding-left: var(--space-5);
      border-left: 2px solid var(--color-accent);
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
