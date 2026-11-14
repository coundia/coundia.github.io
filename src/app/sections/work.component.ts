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
import { RouterLink } from '@angular/router';

import { ContentService } from '../core/content.service';
import { loadMotion, refreshScrollSoon } from '../core/motion';
import { TechIconComponent } from '../shared/tech-icon.component';
import { SystemService } from '../system/system.service';

const WORK_CLUSTERS: Record<string, string[]> = {
  'plateformes-paiement-upay': ['web', 'mobile', 'gateway', 'transfer', 'payment', 'bank', 'momo'],
  'migration-soap-rest': ['gateway', 'transfer', 'topup', 'bank', 'ci', 'registry'],
  'imports-fichiers-volumineux': ['web', 'gateway', 'import', 'bus', 'postgres', 'registry', 'qa'],
  'transfert-marque-blanche': ['web', 'gateway', 'import', 'payment', 'momo'],
};

/** 02 · Projets : une étude de cas active à la fois, couplée aux modules 3D correspondants. */
@Component({
  selector: 'app-work',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TechIconComponent],
  styleUrl: './work.component.css',
  template: `
    <section id="work" class="chapter-section section--surface" aria-labelledby="work-title">
      <div class="container">
        <div class="chapter-sticky">
          <div class="chapter-card">
            <p id="work-title" class="mono chapter-eyebrow">
              <span>02 - {{ t().sections.work }}</span>
              <span>0{{ activeIndex() + 1 }} / 0{{ caseStudies().length }}</span>
            </p>

            <div class="step-tabs" role="tablist" [attr.aria-label]="t().sections.work">
              @for (cs of caseStudies(); track cs.slug; let i = $index) {
                <button
                  type="button"
                  role="tab"
                  class="step-tab"
                  [attr.aria-selected]="activeIndex() === i"
                  (click)="selectIndex(i)"
                >
                  {{ cs.number }}
                </button>
              }
            </div>

            @if (current(); as cs) {
              <p class="mono muted work__meta">{{ cs.client }} · {{ cs.sector }} · {{ cs.period }}</p>
              <h2 class="chapter-title">{{ cs.title }}</h2>
              <p class="chapter-summary">{{ cs.summary }}</p>

              <ul class="tag-list">
                @for (tag of cs.stack.slice(0, 4); track tag) {
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
                <strong>{{ nodesLabel(cs.slug) }}</strong>
              </p>

              <a class="link work__cta" [routerLink]="content.caseStudyPath(cs.slug)">
                {{ t().work.read }} <span aria-hidden="true">→</span>
              </a>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class WorkComponent {
  protected readonly content = inject(ContentService);
  protected readonly system = inject(SystemService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected readonly t = this.content.t;
  protected readonly caseStudies = this.content.caseStudies;
  protected readonly activeIndex = signal(0);
  protected readonly current = computed(() => this.caseStudies()[this.activeIndex()] ?? this.caseStudies()[0]);
  private userLocked = false;

  protected nodesLabel(slug: string): string {
    return this.system.nodeLabelsFor(WORK_CLUSTERS[slug] ?? []).join(' · ');
  }

  protected selectIndex(index: number): void {
    this.userLocked = true;
    this.activate(index);
  }

  private activate(index: number): void {
    const cs = this.caseStudies()[index];
    if (!cs) return;
    this.activeIndex.set(index);
    const nodes = WORK_CLUSTERS[cs.slug] ?? null;
    void this.system.focusCluster(nodes, cs.title, true);
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
            const total = this.caseStudies().length;
            const idx = Math.min(total - 1, Math.max(0, Math.floor(self.progress * total)));
            if (idx !== this.activeIndex()) this.activate(idx);
          },
        });
      });

      refreshScrollSoon();
    });
  }
}
