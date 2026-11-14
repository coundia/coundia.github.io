import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentService } from '../core/content.service';
import { MEDIA, MOTION, loadMotion, refreshScrollSoon } from '../core/motion';
import { SectionHeaderComponent } from '../shared/section-header.component';

/** Parcours : la ligne de temps se trace au défilement, l'étape lue est mise en avant. */
@Component({
  selector: 'app-journey',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SectionHeaderComponent],
  styleUrl: './journey.component.css',
  templateUrl: './journey.component.html',
})
export class JourneyComponent {
  protected readonly content = inject(ContentService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected readonly t = this.content.t;
  protected readonly experiences = this.content.experiences;
  protected readonly education = this.content.education;
  protected readonly active = signal<string | null>(null);

  constructor() {
    const destroyRef = inject(DestroyRef);
    let revert: (() => void) | undefined;
    destroyRef.onDestroy(() => revert?.());

    afterNextRender(async () => {
      const { gsap, ScrollTrigger } = await loadMotion();
      const q = gsap.utils.selector(this.host);
      const mm = gsap.matchMedia();
      revert = () => mm.revert();

      mm.add('all', () => {
        for (const step of q('.step') as HTMLElement[]) {
          ScrollTrigger.create({
            trigger: step,
            start: 'top 55%',
            end: 'bottom 55%',
            onToggle: (self) => self.isActive && this.active.set(step.dataset['id'] ?? null),
          });
        }
      });

      mm.add(MEDIA.motion, () => {
        gsap.fromTo(
          q('.timeline__progress'),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: q('.timeline')[0], start: 'top 60%', end: 'bottom 60%', scrub: 0.6 },
          },
        );
        for (const body of q('.step__body') as HTMLElement[]) {
          gsap.fromTo(
            body,
            { clipPath: 'inset(0% 100% 0% 0%)', x: -24 },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              x: 0,
              duration: MOTION.duration.l,
              ease: MOTION.ease.inOut,
              clearProps: 'clipPath,transform',
              scrollTrigger: { trigger: body, start: 'top 85%', once: true },
            },
          );
        }
      });
      refreshScrollSoon();
    });
  }
}
