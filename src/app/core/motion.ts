/*
 * Chargement différé de GSAP et de ses plugins (chunk séparé, hors bundle initial).
 * Règle du design system : aucune animation d'opacité - uniquement masques, translations,
 * échelles, tracés et changements francs de couleur.
 */
import tokens from '../../data/tokens.json';

export const MEDIA = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  desktopMotion: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
  mobileMotion: '(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)',
} as const;

export const MOTION = tokens.motion;

export type MotionKit = Awaited<ReturnType<typeof importMotion>>;

async function importMotion() {
  const [{ gsap }, { ScrollTrigger }, { SplitText }, { ScrambleTextPlugin }, { DrawSVGPlugin }, { Flip }] =
    await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('gsap/SplitText'),
      import('gsap/ScrambleTextPlugin'),
      import('gsap/DrawSVGPlugin'),
      import('gsap/Flip'),
    ]);
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin, Flip);
  gsap.defaults({ ease: MOTION.ease.out, duration: MOTION.duration.m });
  return { gsap, ScrollTrigger, SplitText, Flip };
}

let kit: Promise<MotionKit> | null = null;

export function loadMotion(): Promise<MotionKit> {
  kit ??= importMotion();
  return kit;
}

let refreshTimer: ReturnType<typeof setTimeout> | undefined;

/** Recalcule les positions ScrollTrigger une fois que toutes les sections ont initialisé leurs animations. */
export function refreshScrollSoon(): void {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    void loadMotion().then(({ ScrollTrigger }) => ScrollTrigger.refresh());
  }, 120);
}

export function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia(MEDIA.reduce).matches;
}

/** Signale que l'intro peut démarrer : le texte du hero redevient visible. */
export function releaseMotionPending(): void {
  document.documentElement.classList.remove('motion-pending');
}
