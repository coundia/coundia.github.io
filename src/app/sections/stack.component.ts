import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';

import { ContentService } from '../core/content.service';
import { loadMotion, refreshScrollSoon } from '../core/motion';
import { TechIconComponent } from '../shared/tech-icon.component';
import { SystemService } from '../system/system.service';

const STACK_CLUSTERS: Record<string, string[]> = {
  frontend: ['rxjs', 'web', 'mobile', 'backoffice'],
  backend: ['gateway', 'transfer', 'topup', 'import', 'payment'],
  architecture: ['gateway', 'transfer', 'topup', 'eventstore'],
  data: ['bus', 'postgres', 'eventstore'],
  devops: ['git', 'ci', 'registry', 'qa'],
};

/** 05 · Stack : un domaine actif à la fois, relié directement aux briques 3D. */
@Component({
  selector: 'app-stack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TechIconComponent],
  template: `
    <section id="stack" class="chapter-section section--surface" aria-labelledby="stack-title">
      <div class="container">
        <div class="chapter-sticky">
          <div class="chapter-card">
            <p id="stack-title" class="mono chapter-eyebrow">
              <span>05 - {{ t().sections.stack }}</span>
              <span>0{{ activeIndex() + 1 }} / 0{{ skills().length }}</span>
            </p>

            <div class="step-tabs" role="tablist" [attr.aria-label]="t().sections.stack">
              @for (group of skills(); track group.id; let i = $index) {
                <button
                  type="button"
                  role="tab"
                  class="step-tab"
                  [attr.aria-selected]="activeIndex() === i"
                  (click)="selectIndex(i)"
                >
                  {{ group.domain }}
                </button>
              }
            </div>

            @if (current(); as group) {
              <h2 class="chapter-title">{{ group.domain }}</h2>

              <ul class="tag-list">
                @for (item of group.items; track item) {
                  <li>
                    <button
                      type="button"
                      class="tag tag--interactive stack__pill"
                      [class.is-highlighted]="system.isTechSelected(item) || system.highlightedTech() === item"
                      [attr.aria-pressed]="system.isTechSelected(item)"
                      (mouseenter)="previewTech(item)"
                      (mouseleave)="previewTech(null)"
                      (click)="toggleTech(item)"
                    >
                      <app-tech-icon [name]="item" [size]="15" />
                      <span>{{ item }}</span>
                    </button>
                  </li>
                }
              </ul>

              <p class="mono chapter-sync">
                <span>{{ t().expertise.inScene }} :</span>
                <strong>{{ nodesLabel(group.id) }}</strong>
              </p>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .chapter-sticky {
      pointer-events: none;
    }

    .stack__pill {
      min-height: 36px;
      padding: 4px 12px;
      cursor: pointer;
      transition:
        border-color var(--duration-xs) ease,
        background-color var(--duration-xs) ease,
        color var(--duration-xs) ease;
    }

    .stack__pill:hover {
      border-color: var(--color-accent);
      color: var(--color-text);
    }

    .stack__pill.is-highlighted {
      background: var(--color-accent);
      border-color: var(--color-accent);
      color: var(--color-on-accent);
    }

    @media (min-width: 1024px) {
      :host {
        display: block;
      }

      .chapter-section {
        min-height: 150svh;
        align-items: stretch;
      }

      .chapter-section > .container {
        display: flex;
        flex-direction: column;
      }

      .chapter-sticky {
        position: sticky;
        top: calc(var(--header-h) + var(--space-8));
      }
    }
  `,
})
export class StackComponent {
  private readonly content = inject(ContentService);
  protected readonly system = inject(SystemService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected readonly t = this.content.t;
  protected readonly skills = this.content.skills;
  protected readonly activeIndex = signal(0);
  protected readonly current = computed(() => this.skills()[this.activeIndex()] ?? this.skills()[0]);
  private userLocked = false;

  protected nodesLabel(domainId: string): string {
    return this.system.nodeLabelsFor(STACK_CLUSTERS[domainId] ?? []).join(' · ');
  }

  protected selectIndex(index: number): void {
    this.userLocked = true;
    this.activate(index);
  }

  private activate(index: number): void {
    const group = this.skills()[index];
    if (!group) return;
    this.activeIndex.set(index);
    void this.system.focusCluster(STACK_CLUSTERS[group.id] ?? null, group.domain, true);
  }

  protected previewTech(tech: string | null): void {
    if (this.system.selectedTech()) return;
    void this.system.highlightTech(tech);
  }

  protected toggleTech(tech: string): void {
    void this.system.selectTech(tech);
  }

  constructor() {
    const destroyRef = inject(DestroyRef);
    let revert: (() => void) | undefined;
    destroyRef.onDestroy(() => revert?.());

    afterNextRender(async () => {
      const { gsap, ScrollTrigger } = await loadMotion();
      const mm = gsap.matchMedia();
      revert = () => mm.revert();

      mm.add('all', () => {
        ScrollTrigger.create({
          trigger: this.host,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => {
            this.userLocked = false;
            this.activate(this.activeIndex());
          },
          onEnterBack: () => {
            this.userLocked = false;
            this.activate(this.activeIndex());
          },
          onUpdate: (self) => {
            if (this.userLocked || !self.isActive) return;
            const total = this.skills().length;
            const idx = Math.min(total - 1, Math.max(0, Math.floor(self.progress * total)));
            if (idx !== this.activeIndex()) this.activate(idx);
          },
        });
      });

      refreshScrollSoon();
    });
  }
}
