import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentService } from '../core/content.service';
import { MEDIA, loadMotion, refreshScrollSoon } from '../core/motion';
import { RevealDirective } from '../shared/reveal.directive';
import { SectionHeaderComponent } from '../shared/section-header.component';

/** Études de cas : défilement horizontal épinglé sur desktop, pile verticale sur mobile. */
@Component({
  selector: 'app-work',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SectionHeaderComponent, RevealDirective],
  styleUrl: './work.component.css',
  template: `
    <section id="work" class="section section--surface work" aria-labelledby="work-title">
      <div class="container">
        <app-section-header
          index="03"
          headingId="work-title"
          [eyebrow]="t().sections.work"
          [title]="t().headings.work"
        />
      </div>
      <div class="viewport">
        <ul class="track" appReveal="stagger">
          @for (cs of caseStudies(); track cs.slug) {
            <li class="card">
              <a class="card__link" [routerLink]="content.caseStudyPath(cs.slug)">
                <div class="card__top">
                  <span class="card__number">{{ cs.number }}</span>
                  <span class="mono muted">{{ cs.sector }} · {{ cs.period }}</span>
                </div>
                <h3 class="h3 card__title">{{ cs.title }}</h3>
                <p class="mono card__client">{{ cs.client }}</p>
                <p class="muted card__summary">{{ cs.summary }}</p>
                <ul class="tag-list">
                  @for (tag of cs.stack.slice(0, 5); track tag) {
                    <li class="tag">{{ tag }}</li>
                  }
                </ul>
                <span class="card__cta">{{ t().work.read }} <span class="btn__arrow" aria-hidden="true">→</span></span>
              </a>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class WorkComponent {
  protected readonly content = inject(ContentService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  protected readonly t = this.content.t;
  protected readonly caseStudies = this.content.caseStudies;

  constructor() {
    const destroyRef = inject(DestroyRef);
    let revert: (() => void) | undefined;
    destroyRef.onDestroy(() => revert?.());

    afterNextRender(async () => {
      const { gsap } = await loadMotion();
      const mm = gsap.matchMedia();
      revert = () => mm.revert();
      mm.add(MEDIA.desktopMotion, () => {
        const section = this.host.querySelector<HTMLElement>('.work')!;
        const track = this.host.querySelector<HTMLElement>('.track')!;
        const distance = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
        if (distance() <= 0) return;
        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      });
      refreshScrollSoon();
    });
  }
}
