import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { resolveTechLogo } from '../system/tech-logos';

/** Icône vectorielle officielle d'une technologie (aplats stricts, sans opacité ni dégradé). */
@Component({
  selector: 'app-tech-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      class="tech-svg"
      viewBox="0 0 24 24"
      [attr.width]="size()"
      [attr.height]="size()"
      aria-hidden="true"
    >
      @for (s of logo().shapes; track $index) {
        <path
          [attr.d]="s.d"
          [attr.fill]="s.strokeWidth ? 'none' : (s.color ?? logo().color)"
          [attr.stroke]="s.strokeWidth ? (s.color ?? logo().color) : 'none'"
          [attr.stroke-width]="s.strokeWidth ?? null"
          [attr.stroke-linecap]="s.strokeWidth ? 'round' : null"
          [attr.stroke-linejoin]="s.strokeWidth ? 'round' : null"
          [attr.fill-rule]="s.fillRule ?? null"
        />
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .tech-svg {
      display: block;
    }
  `,
})
export class TechIconComponent {
  readonly name = input.required<string>();
  readonly size = input(15);

  protected readonly logo = computed(() => resolveTechLogo(this.name()));
}
