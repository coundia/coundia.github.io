import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentService } from '../core/content.service';
import { MEDIA, MOTION, loadMotion, refreshScrollSoon, releaseMotionPending } from '../core/motion';
import { MagneticDirective } from '../shared/magnetic.directive';
import { SystemService } from '../system/system.service';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MagneticDirective],
  styleUrl: './hero.component.css',
  templateUrl: './hero.component.html',
})
export class HeroComponent {
  private readonly content = inject(ContentService);
  protected readonly system = inject(SystemService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected readonly t = this.content.t;
  protected readonly profile = this.content.profile;
  protected readonly home = computed(() => this.content.homePath());
  protected readonly cv = computed(() => this.content.cvPath());

  constructor() {
    const destroyRef = inject(DestroyRef);
    let revert: (() => void) | undefined;
    destroyRef.onDestroy(() => revert?.());

    afterNextRender(async () => {
      const { gsap, ScrollTrigger, SplitText } = await loadMotion();
      const q = gsap.utils.selector(this.host);
      const mm = gsap.matchMedia();
      revert = () => mm.revert();

      mm.add('all', () => {
        ScrollTrigger.create({
          trigger: this.host,
          start: 'top 60%',
          end: 'bottom 45%',
          onEnter: () => void this.system.focusCluster(null, '', true),
          onEnterBack: () => void this.system.focusCluster(null, '', true),
        });
      });

      mm.add(MEDIA.motion, () => {
        const tagline = SplitText.create(q('.tagline')[0], { type: 'lines', mask: 'lines' });
        const tl = gsap.timeline({ defaults: { ease: MOTION.ease.expo } });
        tl.from(q('.name__line'), { yPercent: 110, duration: MOTION.duration.l * 1.1, stagger: 0.1 })
          .fromTo(
            q('.badge'),
            { clipPath: 'inset(0% 100% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: MOTION.duration.m, clearProps: 'clipPath' },
            0.15,
          )
          .fromTo(
            q('.role'),
            { clipPath: 'inset(100% 0% 0% 0%)', y: 20 },
            { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: MOTION.duration.m, clearProps: 'clipPath' },
            0.35,
          )
          .from(tagline.lines, { yPercent: 110, duration: MOTION.duration.m * 1.2, stagger: MOTION.stagger.cards }, 0.5)
          .fromTo(
            q('.ctas'),
            { clipPath: 'inset(100% 0% 0% 0%)', y: 30 },
            { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: MOTION.duration.m * 1.2, clearProps: 'clipPath,transform' },
            0.65,
          );
        releaseMotionPending();
      });

      mm.add(MEDIA.reduce, () => releaseMotionPending());
      refreshScrollSoon();
    });
  }
}
