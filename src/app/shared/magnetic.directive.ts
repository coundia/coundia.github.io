import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';

import { loadMotion, prefersReducedMotion } from '../core/motion';

/** Bouton « magnétique » : suit légèrement le pointeur (souris uniquement, hors mouvement réduit). */
@Directive({ selector: '[appMagnetic]' })
export class MagneticDirective {
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(async () => {
      if (prefersReducedMotion() || !matchMedia('(pointer: fine)').matches) return;
      const { gsap } = await loadMotion();
      const toX = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
      const toY = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        toX((e.clientX - (r.left + r.width / 2)) * 0.25);
        toY((e.clientY - (r.top + r.height / 2)) * 0.35);
      };
      const leave = () => {
        toX(0);
        toY(0);
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      destroyRef.onDestroy(() => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      });
    });
  }
}
