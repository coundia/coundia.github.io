import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import sceneConfig from '../../data/scene.json';
import { Layer, SceneConfig, SceneNode } from '../core/models';
import { ThemeService } from '../core/theme.service';
import { MOTION, loadMotion, prefersReducedMotion } from '../core/motion';
import type { SystemScene } from './system-scene';
import { TechSpec, getLinkProtocol, resolveTechSpec } from './tech-specs';

export interface TechConnection {
  peerLabel: string;
  direction: 'out' | 'in';
  protocol: string;
}

const CONFIG = sceneConfig as SceneConfig;
const OVERVIEW_TARGET: [number, number, number] = [-1.2, 0.35, 0.2];

/**
 * Orchestrateur de la scène 3D plein écran : synchronisation 1-to-1 entre la section visible
 * et les blocs 3D allumés dans la scène (couche ou cluster exact de nœuds).
 */
@Injectable({ providedIn: 'root' })
export class SystemService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly theme = inject(ThemeService);

  readonly activeLayer = signal<Layer | null>(null);
  readonly focusedNodes = signal<string[] | null>(null);
  readonly activeCaption = signal<string>('');
  readonly selectedNode = signal<SceneNode | null>(null);
  readonly selectedTech = signal<TechSpec | null>(null);
  readonly hoveredNode = signal<SceneNode | null>(null);
  readonly highlightedTech = signal<string | null>(null);
  readonly autoOrbit = signal<boolean>(true);
  readonly pure3dMode = signal<boolean>(false);

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

  /** Met une couche d'architecture en avant et cadre la caméra à droite de la carte HUD. */
  async focus(layer: Layer | null, moveCamera = true): Promise<void> {
    this.activeLayer.set(layer);
    this.focusedNodes.set(null);
    this.activeCaption.set('');
    const scene = await this.load();
    if (!scene) return;
    scene.setFocusCluster(null);
    scene.setActiveLayer(layer);
    if (!moveCamera) return;
    const view = CONFIG.views[layer ?? 'overview'];
    const target: [number, number, number] =
      layer === null ? OVERVIEW_TARGET : [view.target[0] - 1.0, view.target[1], view.target[2]];
    await this.tweenCamera(target, view.zoom, 0.615);
  }

  /** Met exactement les nœuds 3D correspondant à l'élément courant en avant (cohérence 1-to-1). */
  async focusCluster(nodeIds: string[] | null, caption = '', moveCamera = true): Promise<void> {
    this.activeLayer.set(null);
    this.focusedNodes.set(nodeIds);
    this.activeCaption.set(caption);
    const scene = await this.load();
    if (!scene) return;
    scene.setActiveLayer(null);
    scene.setFocusCluster(nodeIds);
    if (!moveCamera) return;
    if (nodeIds && nodeIds.length) {
      const { target, zoom } = scene.clusterView(nodeIds);
      await this.tweenCamera(target, zoom, 0.615);
    } else {
      await this.tweenCamera(OVERVIEW_TARGET, CONFIG.views.overview.zoom, 0.615);
    }
  }

  techFor(key: string): TechSpec {
    return resolveTechSpec(key);
  }

  isTechSelected(key: string): boolean {
    const current = this.selectedTech();
    return current !== null && current.id === resolveTechSpec(key).id;
  }

  async selectTech(keyOrNull: string | null, focusCamera = true): Promise<void> {
    if (!keyOrNull) {
      this.clearTechSelection();
      return;
    }
    const spec = resolveTechSpec(keyOrNull);
    if (this.selectedTech()?.id === spec.id) {
      this.clearTechSelection();
      return;
    }
    this.selectedTech.set(spec);
    this.highlightedTech.set(spec.name);
    const primaryNode = spec.nodeIds.length
      ? (CONFIG.nodes.find((n) => n.id === spec.nodeIds[0]) ?? null)
      : null;
    this.selectedNode.set(primaryNode);
    const scene = await this.load();
    if (!scene) return;
    scene.setSelectedNode(primaryNode?.id ?? null);
    scene.setHighlightedTech(spec.name);
    if (focusCamera && spec.nodeIds.length) {
      const framingIds = new Set<string>(spec.nodeIds);
      for (const l of CONFIG.links) {
        if (framingIds.has(l.from)) framingIds.add(l.to);
        if (framingIds.has(l.to)) framingIds.add(l.from);
      }
      const { target, zoom } = scene.clusterView([...framingIds]);
      await this.tweenCamera(target, zoom, 0.615);
    }
  }

  private clearTechSelection(): void {
    this.selectedTech.set(null);
    this.selectedNode.set(null);
    this.highlightedTech.set(null);
    this.scene?.setSelectedNode(null);
    this.scene?.setHighlightedTech(null);
  }

  connectionsFor(spec: TechSpec): TechConnection[] {
    const owned = new Set(spec.nodeIds);
    const byId = new Map(CONFIG.nodes.map((n) => [n.id, n.label]));
    const out: TechConnection[] = [];
    const seen = new Set<string>();
    for (const l of CONFIG.links) {
      const protocol = getLinkProtocol(l.from, l.to);
      if (owned.has(l.from) && !owned.has(l.to)) {
        const peerLabel = byId.get(l.to) ?? l.to;
        const key = `out|${peerLabel}|${protocol}`;
        if (!seen.has(key)) {
          seen.add(key);
          out.push({ peerLabel, direction: 'out', protocol });
        }
      } else if (owned.has(l.to) && !owned.has(l.from)) {
        const peerLabel = byId.get(l.from) ?? l.from;
        const key = `in|${peerLabel}|${protocol}`;
        if (!seen.has(key)) {
          seen.add(key);
          out.push({ peerLabel, direction: 'in', protocol });
        }
      }
    }
    return out;
  }

  async highlightTech(techName: string | null): Promise<void> {
    this.highlightedTech.set(techName);
    const scene = await this.load();
    scene?.setHighlightedTech(techName);
  }

  selectNode(node: SceneNode | null): void {
    void this.selectTech(node ? node.id : null, false);
  }

  rotate(deltaAzimuth: number): void {
    this.scene?.rotateBy(deltaAzimuth);
  }

  zoomBy(deltaZoom: number): void {
    this.scene?.zoomBy(deltaZoom);
  }

  toggleAutoOrbit(): void {
    const next = !this.autoOrbit();
    this.autoOrbit.set(next);
    this.scene?.setAutoOrbit(next);
  }

  async togglePure3dMode(): Promise<void> {
    const next = !this.pure3dMode();
    this.pure3dMode.set(next);
    if (next) {
      await this.tweenCamera(CONFIG.views.overview.target, 1.05, 0.615);
    } else if (this.focusedNodes()?.length) {
      await this.focusCluster(this.focusedNodes(), this.activeCaption(), true);
    } else {
      await this.focus(this.activeLayer(), true);
    }
  }

  async resetView(): Promise<void> {
    this.activeLayer.set(null);
    this.focusedNodes.set(null);
    this.activeCaption.set('');
    this.selectedTech.set(null);
    this.selectedNode.set(null);
    this.highlightedTech.set(null);
    this.scene?.setActiveLayer(null);
    this.scene?.setFocusCluster(null);
    this.scene?.setSelectedNode(null);
    this.scene?.setHighlightedTech(null);
    this.scene?.resetOrbit();
    await this.tweenCamera(OVERVIEW_TARGET, CONFIG.views.overview.zoom, 0.615);
  }

  connectedLabels(nodeId: string): string[] {
    const byId = new Map(CONFIG.nodes.map((n) => [n.id, n.label]));
    const out = new Set<string>();
    for (const l of CONFIG.links) {
      if (l.from === nodeId && byId.has(l.to)) out.add(byId.get(l.to)!);
      if (l.to === nodeId && byId.has(l.from)) out.add(byId.get(l.from)!);
    }
    return [...out];
  }

  nodeLabelsFor(nodeIds: string[]): string[] {
    const byId = new Map(CONFIG.nodes.map((n) => [n.id, n.label]));
    return nodeIds.map((id) => byId.get(id)).filter((x): x is string => Boolean(x));
  }

  private async tweenCamera(target: [number, number, number], zoom: number, elevation: number): Promise<void> {
    const scene = await this.load();
    if (!scene) return;
    const { gsap } = await loadMotion();
    const current = scene.currentView;
    const state = {
      x: current.x,
      y: current.y,
      z: current.z,
      zoom: current.zoom,
      elevation: current.elevation,
    };
    this.cameraTween?.kill();
    this.cameraTween = gsap.to(state, {
      x: target[0],
      y: target[1],
      z: target[2],
      zoom,
      elevation,
      duration: MOTION.duration.l,
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
        this.scene = new SystemScene({
          config: CONFIG,
          palette: this.theme.scenePalette(),
          mobile,
          onNodeSelect: (node) => void this.selectTech(node ? node.id : null, false),
          onNodeHover: (node) => this.hoveredNode.set(node),
        });
      } catch {
        this.enabled = false;
        return null;
      }
      this.scene.setActiveLayer(this.activeLayer());
      this.scene.setFocusCluster(this.focusedNodes());
      this.scene.setAutoOrbit(this.autoOrbit());
      if (!mobile) {
        this.scene.setView({
          x: OVERVIEW_TARGET[0],
          y: OVERVIEW_TARGET[1],
          z: OVERVIEW_TARGET[2],
          zoom: CONFIG.views.overview.zoom,
        });
      }
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

  private async playIntro(scene: SystemScene): Promise<void> {
    const { gsap } = await loadMotion();
    const tl = gsap.timeline();
    tl.to(
      scene.nodeGroups.map((g) => g.scale),
      { y: 1, duration: MOTION.duration.m * 1.1, ease: 'back.out(1.6)', stagger: 0.045 },
    );
    for (let i = 0; i < scene.linkCount; i++) {
      const state = { p: 0 };
      tl.to(
        state,
        { p: 1, duration: MOTION.duration.m * 0.85, ease: MOTION.ease.inOut, onUpdate: () => scene.setLinkProgress(i, state.p) },
        i === 0 ? '-=0.35' : '<0.04',
      );
    }
    tl.call(() => scene.showPackets());
  }
}
