import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RevealDirective } from './reveal.directive';

/** En-tête de section : « 01 - EXPERTISE » + grand titre. */
@Component({
  selector: 'app-section-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <p class="mono index">{{ index() }} - {{ eyebrow() }}</p>
    <h2 class="display-l title" [id]="headingId()" appReveal="lines">{{ title() }}</h2>
  `,
  styles: `
    :host {
      display: grid;
      gap: var(--space-4);
      margin-bottom: var(--space-8);
    }
    .index {
      color: var(--color-text-muted);
      font-size: 0.875rem;
    }
    .title {
      max-width: 18ch;
    }
  `,
})
export class SectionHeaderComponent {
  readonly index = input.required<string>();
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly headingId = input<string>();
}
