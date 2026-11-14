import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import sceneConfig from '../../data/scene.json';
import { Layer, SceneConfig } from '../core/models';
import { ThemeService } from '../core/theme.service';
import { MOTION, loadMotion, prefersReducedMotion } from '../core/motion';
import type { SystemScene } from './system-scene';

const CONFIG = sceneConfig as SceneConfig;

/**
 * Une seule scène WebGL pour tout le site : sa racine DOM est déplacée dans le conteneur visible
 * (hero, expertise). Rendu en pause quand aucun conteneur n'est à l'écran ou que l'onglet est masqué.
 * La couche active (frontend, backend, paiement, qualité) est partagée avec le repli SVG.
 */
@Injectable({ providedIn: 'root' })
export class SystemService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly theme = inject(ThemeService);

  /** Couche mise en avant, ou null pour la vue d'ensemble. */
  readonly activeLayer = signal<Layer | null>(null);

  private scene: SystemScene | null = null;
  private loading: Promise<SystemScene | null> | null = null;
  private observer?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;
  private readonly visible = new Map<HTMLElement, boolean>();
  private current: HTMLElement | null = null;
  private introPlayed = false;
  private enabled: boolean | null = null;
  private cameraTween?: { kill: () => void };

  constructor() {
    effect(() => {
      const palette = this.theme.scenePalette(this.theme.theme());
      this.scene?.setPalette(palette);
    });
  }

  get config(): SceneConfig {
    return CONFIG;
  }

  /** La 3D est-elle souhaitable sur cet appareil ? Sinon, le repli SVG reste affiché. */
  get supported(): boolean {
    if (!this.isBrowser) return false;
    if (this.enabled !== null) return this.enabled;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    let webgl = false;
    try {
      const probe = document.createElement('canvas');
      webgl = !!(probe.getContext('webgl2') ?? probe.getContext('webgl'));
    } catch {
      webgl = false;
    }
    this.enabled =
      webgl &&
      !prefersReducedMotion() &&
      !nav.connection?.saveData &&
      (nav.deviceMemory === undefined || nav.deviceMemory >= 2);
    return this.enabled;
  }

  /** Enregistre un conteneur ; renvoie la fonction de désinscription. */
  register(stage: HTMLElement): () => void {
    if (!this.supported) return () => undefined;
    this.ensureObservers();
    this.visible.set(stage, false);
    this.observer!.observe(stage);
    void this.load();
    return () => {
      this.observer?.unobserve(stage);
      this.visible.delete(stage);
      if (this.current === stage) this.detach();
      if (this.visible.size === 0) this.scene?.stop();
    };
  }

  /**
   * Met une couche en avant. Avec `moveCamera`, la caméra se déplace vers cette partie de l'architecture.
   */
  async focus(layer: Layer | null, moveCamera = true): Promise<void> {
    this.activeLayer.set(layer);
    const scene = await this.load();
    if (!scene) return;
    scene.setActiveLayer(layer);
    if (!moveCamera) return;
    const { gsap } = await loadMotion();
    const view = CONFIG.views[layer ?? 'overview'];
    const state = { ...scene.currentView };
    this.cameraTween?.kill();
    this.cameraTween = gsap.to(state, {
      x: view.target[0],
      y: view.target[1],
      z: view.target[2],
      zoom: view.zoom,
      duration: MOTION.duration.l * 1.2,
      ease: MOTION.ease.inOut,
      onUpdate: () => scene.setView(state),
    });
  }

  private load(): Promise<SystemScene | null> {
    if (!this.supported) return Promise.resolve(null);
    this.loading ??= (async () => {
      const [{ SystemScene }, { gsap }] = await Promise.all([import('./system-scene'), loadMotion()]);
      const mobile = matchMedia('(max-width: 767.98px)').matches;
      try {
        this.scene = new SystemScene({ config: CONFIG, palette: this.theme.scenePalette(), mobile });
      } catch {
        this.enabled = false;
        return null;
      }
      this.scene.setActiveLayer(this.activeLayer());
      for (const group of this.scene.nodeGroups) group.scale.y = 0.001;
      gsap.ticker.add((_time: number, delta: number) => this.scene?.tick(delta));
      if (matchMedia('(pointer: fine)').matches) {
        window.addEventListener(
          'pointermove',
          (e) => this.scene?.setPointer((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1),
          { passive: true },
        );
      }
      document.addEventListener('visibilitychange', () => this.updateHost());
      this.updateHost();
      return this.scene;
    })();
    return this.loading;
  }

  private ensureObservers(): void {
    this.observer ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) this.visible.set(entry.target as HTMLElement, entry.isIntersecting);
        this.updateHost();
      },
      { rootMargin: '10% 0px' },
    );
    this.resizeObserver ??= new ResizeObserver(() => this.resize());
  }

  /** Choisit le conteneur qui reçoit la scène et démarre / arrête le rendu. */
  private updateHost(): void {
    const scene = this.scene;
    if (!scene) return;
    if (document.hidden) {
      scene.stop();
      return;
    }
    const stages = [...this.visible].filter(([, v]) => v).map(([el]) => el);
    if (stages.length === 0) {
      scene.stop();
      return;
    }
    const next = this.current && stages.includes(this.current) ? this.current : stages[0];
    if (next !== this.current) this.attach(next);
    scene.start();
  }

  private attach(stage: HTMLElement): void {
    const scene = this.scene!;
    if (this.current) {
      this.resizeObserver?.unobserve(this.current);
      this.current.classList.remove('is-live');
    }
    this.current = stage;
    stage.appendChild(scene.element);
    stage.classList.add('is-live');
    this.resizeObserver?.observe(stage);
    this.resize();
    if (!this.introPlayed) {
      this.introPlayed = true;
      void this.playIntro(scene);
    }
  }

  private detach(): void {
    this.current?.classList.remove('is-live');
    if (this.current) this.resizeObserver?.unobserve(this.current);
    this.scene?.element.remove();
    this.current = null;
  }

  private resize(): void {
    if (!this.current || !this.scene) return;
    const { width, height } = this.current.getBoundingClientRect();
    this.scene.resize(width, height);
  }

  /** Les volumes sortent du sol de l'arrière vers l'avant, puis les liens se tracent et les paquets circulent. */
  private async playIntro(scene: SystemScene): Promise<void> {
    const { gsap } = await loadMotion();
    const tl = gsap.timeline();
    tl.to(
      scene.nodeGroups.map((g) => g.scale),
      { y: 1, duration: MOTION.duration.m * 1.3, ease: 'back.out(1.6)', stagger: 0.06 },
    );
    for (let i = 0; i < scene.linkCount; i++) {
      const state = { p: 0 };
      tl.to(
        state,
        { p: 1, duration: MOTION.duration.m, ease: MOTION.ease.inOut, onUpdate: () => scene.setLinkProgress(i, state.p) },
        i === 0 ? '-=0.4' : '<0.05',
      );
    }
    tl.call(() => scene.showPackets());
  }
}
