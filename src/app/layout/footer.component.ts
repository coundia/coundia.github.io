import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ContentService } from '../core/content.service';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container footer">
      <p class="muted">{{ t().footer.built }}</p>
      <ul class="links">
        @for (link of profile().links; track link.url) {
          <li><a class="link" [href]="link.url" rel="noopener" target="_blank">{{ link.label }}</a></li>
        }
        <li>
          <a class="link" href="https://github.com/coundia/coundia.github.io" rel="noopener" target="_blank">{{
            t().footer.source
          }}</a>
        </li>
      </ul>
      <p class="mono muted">© {{ year }} {{ profile().firstName }} {{ profile().lastName }}</p>
    </div>
  `,
  styles: `
    :host {
      position: relative;
      z-index: 20;
      display: block;
      background: var(--color-bg);
      border-top: 1px solid var(--color-border);
      padding-block: var(--space-7) calc(var(--space-7) + 64px);
    }
    .footer {
      display: grid;
      gap: var(--space-4);
    }
    .links {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-5);
    }
    @media (min-width: 1024px) {
      .footer {
        grid-template-columns: 1fr auto auto;
        align-items: center;
        gap: var(--space-7);
      }
    }
  `,
})
export class FooterComponent {
  private readonly content = inject(ContentService);
  protected readonly t = this.content.t;
  protected readonly profile = this.content.profile;
  protected readonly year = new Date().getFullYear();
}
