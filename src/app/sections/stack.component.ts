import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  signal,
} from '@angular/core';

import { ContentService } from '../core/content.service';
import { MOTION, loadMotion, prefersReducedMotion } from '../core/motion';
import { RevealDirective } from '../shared/reveal.directive';
import { SectionHeaderComponent } from '../shared/section-header.component';

/** Stack filtrable : les étiquettes se réorganisent avec Flip (sans fondu). */
@Component({
  selector: 'app-stack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, RevealDirective],
  template: `
    <section id="stack" class="section section--surface" aria-labelledby="stack-title">
      <div class="container">
        <app-section-header index="05" headingId="stack-title" [eyebrow]="t().sections.stack" [title]="t().headings.stack" />

        <div class="filters" role="group" [attr.aria-label]="t().sections.stack">
          @for (f of filters(); track f.id) {
            <button type="button" class="filter mono" [attr.aria-pressed]="filter() === f.id" (click)="select(f.id)">
              {{ f.label }}
            </button>
          }
        </div>

        <ul class="cloud" appReveal="rise">
          @for (group of skills(); track group.id) {
            @for (item of group.items; track item) {
              <li class="tag item" [attr.data-group]="group.id">{{ item }}</li>
            }
          }
        </ul>
      </div>
    </section>
  `,
  styles: `
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
      margin-bottom: var(--space-6);
    }
    .filter {
      min-height: 44px;
      padding: 0 var(--space-4);
      border: 1px solid var(--color-border-strong);
      border-radius: var(--radius-pill);
      background: var(--color-bg);
      color: var(--color-text);
      cursor: pointer;
    }
    .filter:hover {
      border-color: var(--color-text);
    }
    .filter[aria-pressed='true'] {
      background: var(--color-accent);
      border-color: var(--color-accent);
      color: var(--color-on-accent);
    }
    .cloud {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3);
      min-height: 200px;
      align-content: flex-start;
    }
    .item {
      min-height: 40px;
      padding: 0 var(--space-4);
      font-size: 0.875rem;
    }
    .item[hidden] {
      display: none;
    }
  `,
})
export class StackComponent {
  private readonly content = inject(ContentService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  protected readonly t = this.content.t;
  protected readonly skills = this.content.skills;
  protected readonly filter = signal('all');
  protected readonly filters = computed(() => [
    { id: 'all', label: this.content.lang() === 'en' ? 'All' : 'Tout' },
    ...this.skills().map((s) => ({ id: s.id, label: s.domain })),
  ]);

  protected async select(id: string): Promise<void> {
    if (id === this.filter()) return;
    this.filter.set(id);
    const items = [...this.host.querySelectorAll<HTMLElement>('.item')];
    const apply = () => items.forEach((el) => (el.hidden = id !== 'all' && el.dataset['group'] !== id));

    if (prefersReducedMotion()) {
      apply();
      return;
    }
    const { gsap, Flip } = await loadMotion();
    const state = Flip.getState(items);
    apply();
    Flip.from(state, {
      duration: MOTION.duration.m,
      ease: MOTION.ease.inOut,
      stagger: 0.015,
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { scale: 0 }, { scale: 1, duration: MOTION.duration.m }),
      onLeave: (els) => gsap.to(els, { scale: 0, duration: MOTION.duration.s }),
    });
  }
}
