import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';

import { ContentService } from '../core/content.service';
import { ThemeService } from '../core/theme.service';
import { MEDIA, MOTION, loadMotion } from '../core/motion';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  styleUrl: './header.component.css',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  protected readonly content = inject(ContentService);
  protected readonly theme = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  protected readonly t = this.content.t;
  protected readonly menuOpen = signal(false);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.document.location?.pathname ?? '/' },
  );

  protected readonly otherLang = computed(() => (this.content.lang() === 'fr' ? 'en' : 'fr'));
  protected readonly otherLangPath = computed(() =>
    this.content.translatePath(this.url(), this.otherLang()),
  );
  protected readonly home = computed(() => this.content.homePath());
  protected readonly links = computed(() => [
    { fragment: 'journey', label: this.t().nav.journey },
    { fragment: 'work', label: this.t().nav.work },
    { fragment: 'open-source', label: this.t().nav.openSource },
  ]);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(async () => {
      const { gsap, ScrollTrigger } = await loadMotion();
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        // Masque la barre en descendant, la réaffiche en remontant (translation, sans fondu).
        ScrollTrigger.create({
          start: 'top top-=240',
          end: 'max',
          onUpdate: (self) => {
            if (this.menuOpen()) return;
            gsap.to(this.host, {
              yPercent: self.direction === 1 ? -100 : 0,
              duration: MOTION.duration.s,
              ease: MOTION.ease.out,
              overwrite: true,
            });
          },
          onLeaveBack: () => gsap.to(this.host, { yPercent: 0, duration: MOTION.duration.s, overwrite: true }),
        });
      });
      destroyRef.onDestroy(() => mm.revert());
    });
  }

  protected toggleMenu(): void {
    this.menuOpen() ? this.closeMenu() : this.openMenu();
  }

  protected async openMenu(): Promise<void> {
    this.menuOpen.set(true);
    this.document.body.style.overflow = 'hidden';
    const { gsap } = await loadMotion();
    const panel = this.panel()?.nativeElement;
    if (!panel || matchMedia(MEDIA.reduce).matches) return;
    gsap.fromTo(
      panel,
      { clipPath: 'inset(0% 0% 100% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: MOTION.duration.m, ease: MOTION.ease.inOut },
    );
    gsap.from(panel.querySelectorAll('.panel__link'), {
      yPercent: 110,
      duration: MOTION.duration.m,
      stagger: MOTION.stagger.words,
      delay: 0.2,
      ease: MOTION.ease.expo,
    });
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
    this.document.body.style.overflow = '';
  }
}
