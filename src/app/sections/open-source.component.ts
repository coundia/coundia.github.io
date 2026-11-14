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

const REPO_CLUSTERS: Record<string, string[]> = {
  buntu: ['rxjs', 'web', 'mobile', 'backoffice'],
  'spring-microservices-starter': ['transfer', 'topup', 'bus', 'postgres', 'eventstore'],
  'cnd-api-maker': ['gateway', 'import', 'postgres'],
  'ddd-maker-bundle': ['import', 'topup', 'eventstore'],
  'selenium-java': ['topup', 'ci', 'registry', 'qa'],
};

/** 04 · Open Source : un dépôt focalisé à la fois, couplé à son empreinte 3D. */
@Component({
  selector: 'app-open-source',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TechIconComponent],
  template: `
    <section id="open-source" class="chapter-section" aria-labelledby="oss-title">
      <div class="container">
        <div class="chapter-sticky">
          <div class="chapter-card">
            <p id="oss-title" class="mono chapter-eyebrow">
              <span>04 - {{ t().sections.openSource }}</span>
              <span>0{{ activeIndex() + 1 }} / 0{{ repos().length }}</span>
            </p>

            <div class="step-tabs" role="tablist" [attr.aria-label]="t().sections.openSource">
              @for (repo of repos(); track repo.id; let i = $index) {
                <button
                  type="button"
                  role="tab"
                  class="step-tab"
                  [attr.aria-selected]="activeIndex() === i"
                  (click)="selectIndex(i)"
                >
                  0{{ i + 1 }}
                </button>
              }
            </div>

            @if (current(); as repo) {
              <p class="mono oss__name">{{ repo.name }}</p>
              <h2 class="chapter-title">{{ repo.highlight }}</h2>
              <p class="chapter-summary">{{ repo.description }}</p>

              <ul class="tag-list">
                @for (tag of repo.stack.slice(0, 5); track tag) {
                  <li>
                    <button
                      type="button"
                      class="tag tag--interactive"
                      [class.is-highlighted]="system.isTechSelected(tag)"
                      [attr.aria-pressed]="system.isTechSelected(tag)"
                      (click)="system.selectTech(tag)"
                    >
                      <app-tech-icon [name]="tag" [size]="14" />
                      <span>{{ tag }}</span>
                    </button>
                  </li>
                }
              </ul>

              <p class="mono chapter-sync">
                <span>{{ t().expertise.inScene }} :</span>
                <strong>{{ nodesLabel(repo.id) }}</strong>
              </p>

              <div class="oss__actions">
                <a class="link oss__link" [href]="repo.url" target="_blank" rel="noopener">
                  {{ t().openSource.view }} <span aria-hidden="true">↗</span>
                </a>
                <a class="mono muted link" href="https://github.com/coundia" target="_blank" rel="noopener">
                  {{ t().openSource.all }} ↗
                </a>
              </div>
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

    .oss__name {
      font-size: var(--fs-mono);
      color: var(--color-accent);
      letter-spacing: 0.04em;
    }

    .oss__actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-3);
      margin-top: var(--space-1);
    }

    .oss__link {
      color: var(--color-accent);
      font-weight: 500;
    }

    @media (min-width: 1024px) {
      :host {
        display: block;
      }

      .chapter-section {
        min-height: 160svh;
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
export class OpenSourceComponent {
  private readonly content = inject(ContentService);
  protected readonly system = inject(SystemService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected readonly t = this.content.t;
  protected readonly repos = this.content.openSource;
  protected readonly activeIndex = signal(0);
  protected readonly current = computed(() => this.repos()[this.activeIndex()] ?? this.repos()[0]);
  private userLocked = false;

  protected nodesLabel(id: string): string {
    return this.system.nodeLabelsFor(REPO_CLUSTERS[id] ?? []).join(' · ');
  }

  protected selectIndex(index: number): void {
    this.userLocked = true;
    this.activate(index);
  }

  private activate(index: number): void {
    const repo = this.repos()[index];
    if (!repo) return;
    this.activeIndex.set(index);
    const nodes = REPO_CLUSTERS[repo.id] ?? null;
    void this.system.focusCluster(nodes, repo.name, true);
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
            const total = this.repos().length;
            const idx = Math.min(total - 1, Math.max(0, Math.floor(self.progress * total)));
            if (idx !== this.activeIndex()) this.activate(idx);
          },
        });
      });

      refreshScrollSoon();
    });
  }
}
