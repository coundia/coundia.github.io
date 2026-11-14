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
import { Layer } from '../core/models';
import { MEDIA, MOTION, loadMotion, refreshScrollSoon, releaseMotionPending } from '../core/motion';
import { MagneticDirective } from '../shared/magnetic.directive';
import { SystemComponent } from '../system/system.component';
import { SystemService } from '../system/system.service';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SystemComponent, MagneticDirective],
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
  /** Les couches du schéma portent les titres de expertise.json : même vocabulaire que le reste du site. */
  protected readonly layers = computed(() => this.content.expertise().map((e) => ({ id: e.id, label: e.title })));
  protected readonly activeNodes = computed(() => {
    const active = this.system.activeLayer();
    return active
      ? this.system.config.nodes.filter((n) => n.layers.includes(active)).map((n) => n.label).join(' · ')
      : '';
  });
  protected readonly activeLabel = computed(() => {
    const active = this.system.activeLayer();
    return this.layers().find((l) => l.id === active)?.label ?? this.t().hero.overview;
  });

  /** Dès que le visiteur choisit une couche, le défilement automatique ne la change plus. */
  private userControlled = false;

  constructor() {
    const destroyRef = inject(DestroyRef);
    let revert: (() => void) | undefined;
    let roleTimer: ReturnType<typeof setInterval> | undefined;
    destroyRef.onDestroy(() => {
      revert?.();
      clearInterval(roleTimer);
    });

    afterNextRender(async () => {
      const { gsap, ScrollTrigger, SplitText } = await loadMotion();
      const q = gsap.utils.selector(this.host);
      const mm = gsap.matchMedia();
      revert = () => mm.revert();

      mm.add(MEDIA.motion, () => {
        const tagline = SplitText.create(q('.tagline')[0], { type: 'lines', mask: 'lines' });
        const tl = gsap.timeline({ defaults: { ease: MOTION.ease.expo } });
        tl.from(q('.name__line'), { yPercent: 110, duration: MOTION.duration.l * 1.2, stagger: 0.12 })
          .fromTo(
            q('.badge'),
            { clipPath: 'inset(0% 100% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: MOTION.duration.m, clearProps: 'clipPath' },
            0.2,
          )
          .fromTo(
            q('.role'),
            { clipPath: 'inset(100% 0% 0% 0%)', y: 24 },
            { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: MOTION.duration.m * 1.4, clearProps: 'clipPath' },
            0.45,
          )
          .from(tagline.lines, { yPercent: 110, duration: MOTION.duration.l, stagger: MOTION.stagger.cards }, 0.6)
          // On anime le conteneur, pas les boutons : leurs transformations appartiennent à l'effet magnétique.
          .fromTo(
            q('.ctas'),
            { clipPath: 'inset(100% 0% 0% 0%)', y: 40 },
            { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: MOTION.duration.l, clearProps: 'clipPath,transform' },
            0.75,
          )
          .fromTo(
            q('.window'),
            { clipPath: 'inset(0% 0% 0% 100%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: MOTION.duration.l * 1.2, ease: MOTION.ease.inOut, clearProps: 'clipPath' },
            0.1,
          )
          .fromTo(
            q('.strip'),
            { clipPath: 'inset(0% 100% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: MOTION.duration.l, ease: MOTION.ease.inOut },
            0.9,
          );
        releaseMotionPending();

        // Les rôles défilent en texte brouillé et allument la couche correspondante du schéma.
        const word = q('.role__word')[0];
        const roles = this.profile().roles;
        let i = 0;
        roleTimer = setInterval(() => {
          i = (i + 1) % roles.length;
          gsap.to(word, { duration: 0.9, scrambleText: { text: roles[i].label, chars: 'upperCase', speed: 0.6 } });
          if (!this.userControlled) void this.system.focus(roles[i].layer, false);
        }, 2800);

        // Retour au hero : vue d'ensemble, et la main repasse au défilement automatique.
        ScrollTrigger.create({
          trigger: this.host,
          start: 'top top',
          end: 'bottom 40%',
          onEnterBack: () => {
            this.userControlled = false;
            void this.system.focus(null, true);
          },
        });

        return () => clearInterval(roleTimer);
      });

      mm.add(MEDIA.reduce, () => releaseMotionPending());
      refreshScrollSoon();
    });
  }

  protected select(layer: Layer | null): void {
    this.userControlled = layer !== null;
    void this.system.focus(layer, true);
  }
}
