import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ContentService } from '../core/content.service';
import { RevealDirective } from '../shared/reveal.directive';
import { SectionHeaderComponent } from '../shared/section-header.component';

@Component({
  selector: 'app-open-source',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, RevealDirective],
  template: `
    <section id="open-source" class="section" aria-labelledby="oss-title">
      <div class="container">
        <app-section-header
          index="04"
          headingId="oss-title"
          [eyebrow]="t().sections.openSource"
          [title]="t().headings.openSource"
        />
        <ul class="list" appReveal="stagger">
          @for (repo of repos(); track repo.id) {
            <li>
              <a class="row" [href]="repo.url" target="_blank" rel="noopener">
                <span class="row__name mono">{{ repo.name }}</span>
                <span class="row__body">
                  <span class="row__highlight">{{ repo.highlight }}</span>
                  <span class="muted">{{ repo.description }}</span>
                  <span class="tag-list">
                    @for (tag of repo.stack; track tag) {
                      <span class="tag">{{ tag }}</span>
                    }
                  </span>
                </span>
                <span class="row__arrow" aria-hidden="true">↗</span>
                <span class="visually-hidden">{{ t().openSource.view }}</span>
              </a>
            </li>
          }
        </ul>
        <p class="more">
          <a class="link" href="https://github.com/coundia" target="_blank" rel="noopener">{{ t().openSource.all }} ↗</a>
        </p>
      </div>
    </section>
  `,
  styles: `
    .list {
      border-top: 1px solid var(--color-border);
    }
    .row {
      display: grid;
      gap: var(--space-3);
      padding-block: var(--space-6);
      border-bottom: 1px solid var(--color-border);
      text-decoration: none;
      transition: background-color var(--duration-xs) ease;
    }
    .row:hover {
      background: var(--color-surface-1);
    }
    .row__name {
      color: var(--color-accent);
      text-transform: none;
      font-size: 1rem;
    }
    .row__body {
      display: grid;
      gap: var(--space-3);
      max-width: 64ch;
    }
    .row__highlight {
      font-weight: 600;
      font-size: var(--fs-h4);
    }
    .row__arrow {
      font-size: 1.5rem;
      transition: transform var(--duration-s) ease;
    }
    .row:hover .row__arrow {
      transform: translate(4px, -4px);
      color: var(--color-accent);
    }
    .more {
      margin-top: var(--space-6);
    }
    @media (min-width: 1024px) {
      .row {
        grid-template-columns: 4fr 7fr 1fr;
        align-items: start;
        padding-inline: var(--space-4);
      }
      .row__arrow {
        justify-self: end;
      }
    }
  `,
})
export class OpenSourceComponent {
  private readonly content = inject(ContentService);
  protected readonly t = this.content.t;
  protected readonly repos = this.content.openSource;
}
