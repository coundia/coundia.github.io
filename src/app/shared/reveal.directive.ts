import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

import { MEDIA, MOTION, loadMotion, refreshScrollSoon } from '../core/motion';

export type RevealType = 'lines' | 'rise' | 'wipe' | 'stagger';

/**
 * Révélation au défilement, sans opacité :
 * - lines   : lignes de texte qui montent dans leur masque (SplitText)
 * - rise    : bloc dévoilé de bas en haut (clip-path) en remontant
 * - wipe    : volet horizontal (clip-path)
 * - stagger : enfants dévoilés en décalé
 * En mouvement réduit, rien n'est animé : le contenu est déjà dans son état final.
 */
@Directive({ selector: '[appReveal]' })
export class RevealDirective {
  readonly appReveal = input<RevealType>('rise');
  readonly revealDelay = input(0);
  /** Animation au chargement (hero) plutôt qu'au défilement. */
  readonly revealOnLoad = input(false);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    let destroyed = false;
    let revert: (() => void) | undefined;
    destroyRef.onDestroy(() => {
      destroyed = true;
      revert?.();
    });

    afterNextRender(async () => {
      const { gsap, SplitText } = await loadMotion();
      if (destroyed) return;
      const mm = gsap.matchMedia();
      revert = () => mm.revert();
      mm.add(MEDIA.motion, () => {
        const delay = this.revealDelay();
        const scrollTrigger = this.revealOnLoad() ? undefined : { trigger: el, start: 'top 88%', once: true };
        const clear = 'clipPath,transform';

        switch (this.appReveal()) {
          case 'lines':
            SplitText.create(el, {
              type: 'lines',
              mask: 'lines',
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.lines, {
                  yPercent: 110,
                  duration: MOTION.duration.l,
                  ease: MOTION.ease.expo,
                  stagger: MOTION.stagger.cards,
                  delay,
                  scrollTrigger,
                }),
            });
            break;
          case 'wipe':
            gsap.fromTo(
              el,
              { clipPath: 'inset(0% 100% 0% 0%)' },
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: MOTION.duration.l,
                ease: MOTION.ease.inOut,
                delay,
                scrollTrigger,
                clearProps: clear,
              },
            );
            break;
          case 'stagger':
            gsap.fromTo(
              el.children,
              { clipPath: 'inset(100% 0% 0% 0%)', y: 48 },
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                y: 0,
                duration: MOTION.duration.m * 1.4,
                stagger: MOTION.stagger.cards,
                delay,
                scrollTrigger: scrollTrigger ?? undefined,
                clearProps: clear,
              },
            );
            break;
          default:
            gsap.fromTo(
              el,
              { clipPath: 'inset(100% 0% 0% 0%)', y: 40 },
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                y: 0,
                duration: MOTION.duration.m * 1.4,
                delay,
                scrollTrigger,
                clearProps: clear,
              },
            );
        }
      });
      refreshScrollSoon();
    });
  }
}
