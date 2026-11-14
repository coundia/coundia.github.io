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
import { Layer } from '../core/models';
import { MEDIA, MOTION, loadMotion, refreshScrollSoon } from '../core/motion';
import { SectionHeaderComponent } from '../shared/section-header.component';
import { SystemComponent } from '../system/system.component';
import { SystemService } from '../system/system.service';

/**
 * Expertise immersive : chaque domaine d'expertise est une couche de l'architecture.
 * Sur desktop, le schéma reste collé à droite ; au défilement, la caméra se déplace vers
 * la couche décrite à gauche et ses composants passent en bleu.
 */
@Component({
  selector: 'app-expertise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, SystemComponent],
  styleUrl: './expertise.component.css',
  templateUrl: './expertise.component.html',
})
export class ExpertiseComponent {
  private readonly content = inject(ContentService);
  private readonly system = inject(SystemService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected readonly t = this.content.t;
  protected readonly expertise = this.content.expertise;
  protected readonly active = signal<Layer | null>(null);
  protected readonly activeTitle = computed(
    () => this.expertise().find((e) => e.id === this.active())?.title ?? this.t().hero.overview,
  );

  /** Composants du schéma qui appartiennent à une couche (lien direct texte ↔ 3D). */
  protected nodesFor(layer: Layer): string {
    return this.system.config.nodes
      .filter((n) => n.layers.includes(layer))
      .map((n) => n.label)
      .join(' · ');
  }

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
            start: 'top 60%',
            end: 'bottom 60%',
            onToggle: (self) => {
              if (!self.isActive) return;
              const layer = step.dataset['layer'] as Layer;
              this.active.set(layer);
              // Le schéma n'est affiché qu'à partir de 1024 px : la caméra ne bouge que là.
              if (matchMedia('(min-width: 1024px)').matches) void this.system.focus(layer, true);
            },
          });
        }
      });

      mm.add(MEDIA.motion, () => {
        for (const card of q('.step__card') as HTMLElement[]) {
          gsap.fromTo(
            card,
            { clipPath: 'inset(100% 0% 0% 0%)', y: 48 },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              y: 0,
              duration: MOTION.duration.m * 1.4,
              clearProps: 'clipPath,transform',
              scrollTrigger: { trigger: card, start: 'top 88%', once: true },
            },
          );
        }
      });
      refreshScrollSoon();
    });
  }
}
