import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';

import { ContentService } from '../core/content.service';
import { MEDIA, MOTION, loadMotion, refreshScrollSoon } from '../core/motion';
import { SystemService } from '../system/system.service';

/** Chiffres clés en cartes HUD compactes, laissant la scène 3D respirer à gauche. */
@Component({
  selector: 'app-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="stats" class="section" aria-labelledby="stats-title">
      <div class="container">
        <h2 id="stats-title" class="visually-hidden">{{ t().sections.stats }}</h2>
        <ul class="grid">
          @for (stat of stats(); track stat.id) {
            <li class="stat hud-card">
              <span class="stat__rule" aria-hidden="true"></span>
              <p class="stat__value">
                <span class="stat__number" [attr.data-value]="stat.value">{{ stat.value }}</span
                ><span class="stat__suffix">{{ stat.suffix }}</span>
              </p>
              <p class="stat__label muted">{{ stat.label }}</p>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styles: `
    .grid {
      display: grid;
      gap: var(--space-4);
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .stat {
      position: relative;
      display: grid;
      gap: var(--space-2);
      padding: var(--space-5);
    }
    .stat__rule {
      position: absolute;
      inset: 0 0 auto;
      height: 2px;
      background: var(--color-accent);
      transform-origin: left;
    }
    .stat__value {
      font-family: var(--font-display);
      font-size: clamp(2rem, 1.4rem + 2.4vw, 3.25rem);
      font-weight: 600;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .stat__suffix {
      color: var(--color-accent);
    }
    .stat__label {
      font-size: var(--fs-small);
      max-width: 24ch;
    }
    @media (min-width: 1024px) {
      .grid {
        max-width: 720px;
        margin-left: auto;
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }
  `,
})
export class StatsComponent {
  private readonly content = inject(ContentService);
  private readonly system = inject(SystemService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  protected readonly t = this.content.t;
  protected readonly stats = this.content.stats;

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
          start: 'top 65%',
          end: 'bottom 35%',
          onToggle: (self) => {
            if (self.isActive) void this.system.focusCluster(null, '', true);
          },
        });
      });

      mm.add(MEDIA.motion, () => {
        const q = gsap.utils.selector(this.host);
        const trigger = { trigger: this.host, start: 'top 80%', once: true };
        gsap.from(q('.stat__rule'), {
          scaleX: 0,
          duration: MOTION.duration.l,
          ease: MOTION.ease.inOut,
          stagger: MOTION.stagger.cards,
          scrollTrigger: trigger,
        });
        for (const el of q('.stat__number') as HTMLElement[]) {
          const target = Number(el.dataset['value']);
          const counter = { v: 0 };
          gsap.to(counter, {
            v: target,
            duration: MOTION.duration.xl,
            ease: MOTION.ease.out,
            snap: { v: 1 },
            scrollTrigger: trigger,
            onStart: () => (el.textContent = '0'),
            onUpdate: () => (el.textContent = String(counter.v)),
          });
        }
      });
      refreshScrollSoon();
    });
  }
}
