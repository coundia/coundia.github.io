/*
 * Scène Three.js « Le système » (chunk chargé en différé) : l'architecture que Papa conçoit,
 * en isométrie — applications Angular, API Gateway, microservices Spring Boot, RabbitMQ,
 * bases de données, partenaires financiers, chaîne CI/CD. Des paquets (requêtes, transactions)
 * circulent sur les liens.
 *
 * Règles du design system : aplats uniquement (MeshBasicMaterial, aucune lumière donc aucun
 * dégradé d'ombrage), trois tons pleins par volume, renderer et matériaux opaques.
 */
import {
  BoxGeometry,
  BufferGeometry,
  CurvePath,
  CylinderGeometry,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineCurve3,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  Scene,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';

import { Layer, SceneConfig, SceneLink, SceneNode, ScenePalette, SceneView } from '../core/models';
import { FIT, labelAnchor, linkRoute, nodeMap } from './iso';

export interface SystemSceneOptions {
  config: SceneConfig;
  palette: ScenePalette;
  mobile: boolean;
}

interface NodeView {
  config: SceneNode;
  group: Group;
  top: MeshBasicMaterial;
  left: MeshBasicMaterial;
  right: MeshBasicMaterial;
  screen?: MeshBasicMaterial;
  edges: LineBasicMaterial;
  label: HTMLSpanElement;
  anchor: Vector3;
}

interface LinkView {
  config: SceneLink;
  curve: CurvePath<Vector3>;
  length: number;
  mesh: Mesh<TubeGeometry, MeshBasicMaterial>;
  packets: { mesh: Mesh; offset: number }[];
}

const TUBE_SEGMENTS = 64;
const TUBE_RADIAL = 4;
const DIRECTION = new Vector3(1, 1, 1).normalize();

export class SystemScene {
  /** Racine DOM : canvas + calque d'étiquettes (déplacée d'un conteneur à l'autre). */
  readonly element: HTMLDivElement;

  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new OrthographicCamera(-1, 1, 1, -1, -100, 200);
  /** Groupe racine (légère parallaxe au pointeur). */
  private readonly root = new Group();
  private readonly gridMaterial: LineBasicMaterial;
  private readonly packetMaterial: MeshBasicMaterial;
  private readonly nodes = new Map<string, NodeView>();
  private readonly links: LinkView[] = [];
  private readonly labels: HTMLDivElement;

  private palette: ScenePalette;
  private active: Layer | null = null;
  private readonly view = { x: 0, y: 0, z: 0, zoom: 1 };
  private pointer = { x: 0, y: 0 };
  private running = false;
  private time = 0;
  private width = 1;
  private height = 1;
  private packetsOn = false;
  private degraded = false;
  private frameSamples: number[] = [];
  private readonly speed: number;
  private readonly tmp = new Vector3();

  constructor(options: SystemSceneOptions) {
    const { config, palette, mobile } = options;
    this.palette = palette;
    this.speed = config.packetSpeed;

    this.element = document.createElement('div');
    this.element.className = 'sys';
    this.element.setAttribute('aria-hidden', 'true');
    const canvas = document.createElement('canvas');
    canvas.className = 'sys__canvas';
    this.labels = document.createElement('div');
    this.labels.className = 'sys__labels';
    this.element.append(canvas, this.labels);

    this.renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
    this.renderer.setClearColor(palette.bg, 1);
    this.scene.add(this.root);

    // Grille au sol (lignes pleines).
    this.gridMaterial = new LineBasicMaterial({ color: palette.grid });
    this.root.add(new LineSegments(this.gridGeometry(config), this.gridMaterial));

    // Volumes.
    for (const node of config.nodes) this.addNode(node);

    // Liens (tracés orthogonaux) et paquets.
    this.packetMaterial = new MeshBasicMaterial({ color: palette.packet });
    const packetGeometry = new BoxGeometry(0.13, 0.13, 0.13);
    const byId = nodeMap(config);
    const perLink = mobile ? config.packetsPerLink.mobile : config.packetsPerLink.desktop;
    for (const link of config.links) {
      const points = linkRoute(link, byId).map((p) => new Vector3(...p));
      if (points.length < 2) continue;
      const curve = new CurvePath<Vector3>();
      for (let i = 1; i < points.length; i++) curve.add(new LineCurve3(points[i - 1], points[i]));
      const mesh = new Mesh(
        new TubeGeometry(curve, TUBE_SEGMENTS, 0.035, TUBE_RADIAL, false),
        new MeshBasicMaterial({ color: palette.link }),
      );
      mesh.geometry.setDrawRange(0, 0);
      this.root.add(mesh);
      const packets = Array.from({ length: perLink }, (_, i) => {
        const p = new Mesh(packetGeometry, this.packetMaterial);
        p.visible = false;
        this.root.add(p);
        return { mesh: p, offset: i / perLink + Math.random() * 0.2 };
      });
      this.links.push({ config: link, curve, length: curve.getLength(), mesh, packets });
    }

    const overview = config.views.overview;
    this.setView({ x: overview.target[0], y: overview.target[1], z: overview.target[2], zoom: overview.zoom });
    this.applyColors();
  }

  /** Nœuds triés de l'arrière vers l'avant (ordre de construction de l'intro). */
  get nodeGroups(): Group[] {
    return [...this.nodes.values()]
      .sort((a, b) => a.config.position[0] + a.config.position[1] - (b.config.position[0] + b.config.position[1]))
      .map((n) => n.group);
  }

  get linkCount(): number {
    return this.links.length;
  }

  /** Tracé progressif d'un lien (0 → 1). */
  setLinkProgress(index: number, value: number): void {
    const link = this.links[index];
    if (!link) return;
    const total = TUBE_SEGMENTS * TUBE_RADIAL * 6;
    link.mesh.geometry.setDrawRange(0, Math.floor((total * value) / 6) * 6);
  }

  showPackets(): void {
    this.packetsOn = true;
  }

  get currentView(): { x: number; y: number; z: number; zoom: number } {
    return this.view;
  }

  setView(v: { x: number; y: number; z: number; zoom: number }): void {
    Object.assign(this.view, v);
    const target = this.tmp.set(v.x, v.y, v.z);
    this.camera.position.copy(target).addScaledVector(DIRECTION, 50);
    this.camera.lookAt(target);
    this.camera.zoom = v.zoom;
    this.camera.updateProjectionMatrix();
  }

  viewFor(layer: Layer | null, config: SceneConfig): SceneView {
    return config.views[layer ?? 'overview'];
  }

  /** Met une couche en avant : ses volumes et ses liens passent en bleu, les autres restent neutres. */
  setActiveLayer(layer: Layer | null): void {
    this.active = layer;
    this.applyColors();
  }

  setPointer(x: number, y: number): void {
    this.pointer = { x, y };
  }

  setPalette(palette: ScenePalette): void {
    this.palette = palette;
    this.renderer.setClearColor(palette.bg, 1);
    this.gridMaterial.color.set(palette.grid);
    this.packetMaterial.color.set(palette.packet);
    this.applyColors();
  }

  resize(width: number, height: number): void {
    if (!width || !height) return;
    this.width = width;
    this.height = height;
    const aspect = width / height;
    const halfW = Math.max(FIT.halfW, FIT.halfH * aspect);
    const halfH = halfW / aspect;
    Object.assign(this.camera, { left: -halfW, right: halfW, top: halfH, bottom: -halfH });
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  start(): void {
    this.running = true;
  }

  stop(): void {
    this.running = false;
  }

  /** Appelé à chaque image par le ticker GSAP partagé. */
  tick(deltaMs: number): void {
    if (!this.running) return;
    const dt = Math.min(deltaMs, 64) / 1000;
    this.time += dt;
    this.monitor(deltaMs);

    this.root.rotation.y += (this.pointer.x * 0.07 - this.root.rotation.y) * Math.min(1, dt * 3);
    this.root.position.y += (-this.pointer.y * 0.12 - this.root.position.y) * Math.min(1, dt * 3);

    const showPackets = this.packetsOn && !this.degraded;
    for (const link of this.links) {
      for (const p of link.packets) {
        p.mesh.visible = showPackets;
        if (!showPackets) continue;
        const t = (this.time * this.speed) / link.length + p.offset;
        link.curve.getPointAt(t % 1, p.mesh.position);
        p.mesh.position.y += 0.06;
      }
    }

    this.root.updateMatrixWorld();
    this.renderer.render(this.scene, this.camera);
    this.placeLabels();
  }

  dispose(): void {
    this.stop();
    this.scene.traverse((object) => {
      const mesh = object as Mesh;
      mesh.geometry?.dispose();
      const material = mesh.material;
      if (Array.isArray(material)) material.forEach((m) => m.dispose());
      else material?.dispose();
    });
    this.renderer.dispose();
    this.element.remove();
  }

  private addNode(node: SceneNode): void {
    const [w, h, d] = node.size;
    const top = new MeshBasicMaterial();
    const left = new MeshBasicMaterial();
    const right = new MeshBasicMaterial();
    let geometry: BufferGeometry;
    let materials: MeshBasicMaterial[];
    let screen: MeshBasicMaterial | undefined;

    if (node.kind === 'cylinder') {
      geometry = new CylinderGeometry(w, w, h, 48, 1);
      materials = [left, top, top]; // flanc, couvercle, fond
    } else {
      geometry = new BoxGeometry(w, h, d);
      // Ordre des faces : +x (droite), -x, +y (dessus), -y, +z (gauche, face écran), -z.
      if (node.kind === 'screen') {
        screen = new MeshBasicMaterial();
        materials = [right, right, top, top, screen, screen];
      } else {
        materials = [right, right, top, top, left, left];
      }
    }
    geometry.translate(0, h / 2, 0);

    const group = new Group();
    group.position.set(node.position[0], 0, node.position[1]);
    const edges = new LineBasicMaterial();
    group.add(new Mesh(geometry, materials), new LineSegments(new EdgesGeometry(geometry, 25), edges));
    this.root.add(group);

    const label = document.createElement('span');
    label.className = 'sys__label';
    label.textContent = node.label;
    this.labels.append(label);

    this.nodes.set(node.id, {
      config: node,
      group,
      top,
      left,
      right,
      screen,
      edges,
      label,
      anchor: new Vector3(...labelAnchor(node)),
    });
  }

  private applyColors(): void {
    const p = this.palette;
    const layer = this.active;
    this.element.classList.toggle('has-focus', layer !== null);
    for (const n of this.nodes.values()) {
      const on = layer !== null && n.config.layers.includes(layer);
      n.top.color.set(on ? p['active-top'] : p['node-top']);
      n.left.color.set(on ? p['active-left'] : p['node-left']);
      n.right.color.set(on ? p['active-right'] : p['node-right']);
      n.edges.color.set(on ? p['active-edge'] : p['node-edge']);
      n.screen?.color.set(on ? p['active-top'] : p.screen);
      n.label.classList.toggle('is-active', on);
    }
    for (const l of this.links) {
      const on = layer !== null && l.config.layers.includes(layer);
      l.mesh.material.color.set(on ? p['link-active'] : p.link);
    }
  }

  private placeLabels(): void {
    for (const n of this.nodes.values()) {
      const v = this.tmp.copy(n.anchor).applyMatrix4(this.root.matrixWorld).project(this.camera);
      const x = ((v.x + 1) / 2) * this.width;
      const y = ((1 - v.y) / 2) * this.height;
      n.label.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -100%)`;
    }
  }

  private gridGeometry(config: SceneConfig): BufferGeometry {
    const { halfX, halfZ, step } = config.grid;
    const positions: number[] = [];
    for (let x = -halfX; x <= halfX + 1e-6; x += step) positions.push(x, 0, -halfZ, x, 0, halfZ);
    for (let z = -halfZ; z <= halfZ + 1e-6; z += step) positions.push(-halfX, 0, z, halfX, 0, z);
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    return geometry;
  }

  /** Dégradation automatique si l'appareil peine (fps moyen < 30 sur les premières secondes). */
  private monitor(deltaMs: number): void {
    if (this.degraded || this.frameSamples.length > 120) return;
    this.frameSamples.push(deltaMs);
    if (this.frameSamples.length === 120) {
      const avg = this.frameSamples.reduce((a, b) => a + b, 0) / this.frameSamples.length;
      if (avg > 33) {
        this.degraded = true;
        this.renderer.setPixelRatio(1);
      }
    }
  }
}
