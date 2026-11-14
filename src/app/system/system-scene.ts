/*
 * Scène Three.js « Le système » : architecture 3D épurée avec vrais logos vectoriels des technologies,
 * focus ciblé par cluster (1-to-1 avec la section affichée), orbite 360° et raycasting.
 *
 * Règles du design system : aplats stricts (MeshBasicMaterial, aucune lumière,
 * aucune transparence, aucun dégradé, renderer opaque).
 */
import {
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
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
  Object3D,
  OrthographicCamera,
  Raycaster,
  SRGBColorSpace,
  Scene,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

import { Layer, SceneConfig, SceneLink, SceneNode, ScenePalette, SceneView } from '../core/models';
import { FIT, labelAnchor, linkRoute, nodeMap } from './iso';
import { TechLogoDef, resolveTechLogo } from './tech-logos';
import { getLinkProtocol, resolveTechSpec } from './tech-specs';

export interface SystemSceneOptions {
  config: SceneConfig;
  palette: ScenePalette;
  mobile: boolean;
  onNodeSelect?: (node: SceneNode | null) => void;
  onNodeHover?: (node: SceneNode | null) => void;
}

export interface CameraViewState {
  x: number;
  y: number;
  z: number;
  zoom: number;
  azimuth: number;
  elevation: number;
}

interface NodeView {
  config: SceneNode;
  logo: TechLogoDef;
  group: Group;
  top: MeshBasicMaterial;
  left: MeshBasicMaterial;
  right: MeshBasicMaterial;
  plinth: MeshBasicMaterial;
  topLogoMat: MeshBasicMaterial;
  frontLogoMat: MeshBasicMaterial;
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
  active: boolean;
  label: HTMLSpanElement;
  midpoint: Vector3;
}

const TUBE_SEGMENTS = 64;
const TUBE_RADIAL = 4;
const DEFAULT_AZIMUTH = Math.PI / 4;
const DEFAULT_ELEVATION = Math.atan(1 / Math.SQRT2);
const OVERVIEW_LANDMARKS = new Set(['web', 'gateway', 'transfer', 'bus', 'postgres', 'registry']);

export class SystemScene {
  /** Racine DOM : canvas + calque d'étiquettes 3D. */
  readonly element: HTMLDivElement;

  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new OrthographicCamera(-1, 1, 1, -1, -120, 240);
  private readonly root = new Group();
  private readonly raycaster = new Raycaster();
  private readonly ndc = new Vector2();

  private readonly gridMaterial: LineBasicMaterial;
  private readonly accentGridMaterial: LineBasicMaterial;
  private readonly packetMaterial: MeshBasicMaterial;
  private readonly nodes = new Map<string, NodeView>();
  private readonly links: LinkView[] = [];
  private readonly hitTargets: Object3D[] = [];
  private readonly labels: HTMLDivElement;
  private readonly textures = new Map<string, CanvasTexture>();

  private palette: ScenePalette;
  private active: Layer | null = null;
  private focusedNodeIds: Set<string> | null = null;
  private hoveredNodeId: string | null = null;
  private selectedNodeId: string | null = null;
  private highlightedTech: string | null = null;

  private readonly view: CameraViewState = {
    x: -1.2,
    y: 0.35,
    z: 0.2,
    zoom: 1,
    azimuth: DEFAULT_AZIMUTH,
    elevation: DEFAULT_ELEVATION,
  };
  private pointer = { x: 0, y: 0 };
  private dragging = false;
  private dragMoved = 0;
  private dragStart = { x: 0, y: 0, azim: DEFAULT_AZIMUTH, elev: DEFAULT_ELEVATION };
  private autoOrbit = true;

  private running = false;
  private time = 0;
  private width = 1;
  private height = 1;
  private packetsOn = false;
  private degraded = false;
  private frameSamples: number[] = [];
  private readonly speed: number;
  private readonly tmp = new Vector3();
  private readonly onNodeSelect?: (node: SceneNode | null) => void;
  private readonly onNodeHover?: (node: SceneNode | null) => void;

  constructor(options: SystemSceneOptions) {
    const { config, palette, mobile, onNodeSelect, onNodeHover } = options;
    this.palette = palette;
    this.speed = config.packetSpeed;
    this.onNodeSelect = onNodeSelect;
    this.onNodeHover = onNodeHover;

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

    // Grille architecturale au sol + périmètre net.
    this.gridMaterial = new LineBasicMaterial({ color: palette.grid });
    this.accentGridMaterial = new LineBasicMaterial({ color: palette['node-edge'] });
    this.root.add(new LineSegments(this.gridGeometry(config), this.gridMaterial));
    this.root.add(new LineSegments(this.perimeterGeometry(config), this.accentGridMaterial));

    // Volumes d'architecture avec vrais logos 3D.
    for (const node of config.nodes) this.addNode(node);

    // Liens orthogonaux et paquets de données en circulation.
    this.packetMaterial = new MeshBasicMaterial({ color: palette.packet });
    const packetGeometry = new BoxGeometry(0.14, 0.14, 0.14);
    const byId = nodeMap(config);
    const perLink = mobile ? config.packetsPerLink.mobile : config.packetsPerLink.desktop;
    for (const link of config.links) {
      const points = linkRoute(link, byId).map((p) => new Vector3(...p));
      if (points.length < 2) continue;
      const curve = new CurvePath<Vector3>();
      for (let i = 1; i < points.length; i++) curve.add(new LineCurve3(points[i - 1], points[i]));
      const mesh = new Mesh(
        new TubeGeometry(curve, TUBE_SEGMENTS, 0.04, TUBE_RADIAL, false),
        new MeshBasicMaterial({ color: palette.link }),
      );
      mesh.geometry.setDrawRange(0, 0);
      this.root.add(mesh);
      const packets = Array.from({ length: perLink }, (_, i) => {
        const p = new Mesh(packetGeometry, this.packetMaterial);
        p.visible = false;
        this.root.add(p);
        return { mesh: p, offset: i / perLink + Math.random() * 0.25 };
      });
      const label = document.createElement('span');
      label.className = 'sys__link-label';
      label.textContent = getLinkProtocol(link.from, link.to);
      this.labels.append(label);
      const midpoint = curve.getPointAt(0.5);
      this.links.push({ config: link, curve, length: curve.getLength(), mesh, packets, active: false, label, midpoint });
    }

    this.bindCanvasInteractions(canvas);

    this.setView({
      x: -1.2,
      y: 0.35,
      z: 0.2,
      zoom: config.views.overview.zoom,
      azimuth: DEFAULT_AZIMUTH,
      elevation: DEFAULT_ELEVATION,
    });
    this.applyColors();
  }

  get nodeGroups(): Group[] {
    return [...this.nodes.values()]
      .sort((a, b) => a.config.position[0] + a.config.position[1] - (b.config.position[0] + b.config.position[1]))
      .map((n) => n.group);
  }

  get linkCount(): number {
    return this.links.length;
  }

  get currentView(): CameraViewState {
    return { ...this.view };
  }

  setLinkProgress(index: number, value: number): void {
    const link = this.links[index];
    if (!link) return;
    const total = TUBE_SEGMENTS * TUBE_RADIAL * 6;
    link.mesh.geometry.setDrawRange(0, Math.floor((total * value) / 6) * 6);
  }

  showPackets(): void {
    this.packetsOn = true;
  }

  setView(v: Partial<CameraViewState>): void {
    Object.assign(this.view, v);
    this.updateCamera();
  }

  rotateBy(deltaAzimuth: number): void {
    this.view.azimuth += deltaAzimuth;
    this.updateCamera();
  }

  zoomBy(deltaZoom: number): void {
    this.view.zoom = Math.max(0.65, Math.min(2.4, this.view.zoom + deltaZoom));
    this.camera.zoom = this.view.zoom;
    this.camera.updateProjectionMatrix();
  }

  resetOrbit(): void {
    this.view.azimuth = DEFAULT_AZIMUTH;
    this.view.elevation = DEFAULT_ELEVATION;
    this.updateCamera();
  }

  setAutoOrbit(enabled: boolean): void {
    this.autoOrbit = enabled;
  }

  setFocusCluster(nodeIds: string[] | null): void {
    this.focusedNodeIds = nodeIds && nodeIds.length ? new Set(nodeIds) : null;
    this.applyColors();
  }

  clusterView(nodeIds: string[]): { target: [number, number, number]; zoom: number } {
    const coords: [number, number][] = [];
    for (const id of nodeIds) {
      const node = this.nodes.get(id);
      if (node) coords.push(node.config.position);
    }
    if (!coords.length) return { target: [-1.2, 0.35, 0.2], zoom: 1 };
    const xs = coords.map((c) => c[0]);
    const zs = coords.map((c) => c[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minZ = Math.min(...zs);
    const maxZ = Math.max(...zs);
    const cx = (minX + maxX) / 2;
    const cz = (minZ + maxZ) / 2;
    const span = Math.max(maxX - minX, maxZ - minZ, 2.2);
    const zoom = Math.max(1.05, Math.min(1.6, 6.2 / (span + 2.2)));
    return { target: [cx - 1.25, 0.35, cz + 0.15], zoom };
  }

  setSelectedNode(nodeId: string | null): void {
    this.selectedNodeId = nodeId;
    this.applyColors();
  }

  setHighlightedTech(techName: string | null): void {
    this.highlightedTech = techName;
    this.applyColors();
  }

  viewFor(layer: Layer | null, config: SceneConfig): SceneView {
    return config.views[layer ?? 'overview'];
  }

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
    this.accentGridMaterial.color.set(palette['node-edge']);
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

  tick(deltaMs: number): void {
    if (!this.running) return;
    const dt = Math.min(deltaMs, 64) / 1000;
    this.time += dt;
    this.monitor(deltaMs);

    if (this.autoOrbit && !this.dragging && !this.degraded) {
      this.view.azimuth += dt * 0.05;
      this.updateCamera();
    }

    if (!this.dragging) {
      this.root.position.y += (-this.pointer.y * 0.1 - this.root.position.y) * Math.min(1, dt * 3);
    }

    const showPackets = this.packetsOn && !this.degraded;
    const hasFocus = this.hasFocus();
    for (const link of this.links) {
      const linkVisible = showPackets && (!hasFocus || link.active);
      for (const p of link.packets) {
        p.mesh.visible = linkVisible;
        if (!linkVisible) continue;
        const t = (this.time * this.speed) / link.length + p.offset;
        link.curve.getPointAt(t % 1, p.mesh.position);
        p.mesh.position.y += 0.065;
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
    for (const tex of this.textures.values()) tex.dispose();
    this.textures.clear();
    this.renderer.dispose();
    this.element.remove();
  }

  private hasFocus(): boolean {
    return (
      this.focusedNodeIds !== null ||
      this.active !== null ||
      this.highlightedTech !== null ||
      this.selectedNodeId !== null
    );
  }

  private updateCamera(): void {
    const target = this.tmp.set(this.view.x, this.view.y, this.view.z);
    const cosElev = Math.cos(this.view.elevation);
    const sinElev = Math.sin(this.view.elevation);
    const dist = 55;
    this.camera.position.set(
      target.x + Math.sin(this.view.azimuth) * cosElev * dist,
      target.y + sinElev * dist,
      target.z + Math.cos(this.view.azimuth) * cosElev * dist,
    );
    this.camera.lookAt(target);
    this.camera.zoom = this.view.zoom;
    this.camera.updateProjectionMatrix();
  }

  private addNode(node: SceneNode): void {
    const [w, h, d] = node.size;
    const logo = resolveTechLogo(node.id);
    const top = new MeshBasicMaterial();
    const left = new MeshBasicMaterial();
    const right = new MeshBasicMaterial();
    const plinth = new MeshBasicMaterial();
    const topLogoMat = new MeshBasicMaterial();
    const frontLogoMat = new MeshBasicMaterial();
    const edges = new LineBasicMaterial();

    const group = new Group();
    group.position.set(node.position[0], 0, node.position[1]);

    // 1. Socle architectural au sol.
    const plinthGeo =
      node.kind === 'cylinder'
        ? new CylinderGeometry(w + 0.1, w + 0.1, 0.06, 40, 1)
        : new BoxGeometry(w + 0.14, 0.06, d + 0.14);
    plinthGeo.translate(0, 0.03, 0);
    group.add(new Mesh(plinthGeo, plinth), new LineSegments(new EdgesGeometry(plinthGeo, 25), edges));

    // 2. Volume principal + textures logos 1:1.
    let geometry: BufferGeometry;
    let materials: MeshBasicMaterial[];
    if (node.kind === 'cylinder') {
      geometry = new CylinderGeometry(w, w, h, 48, 1);
      materials = [left, topLogoMat, top];
    } else if (node.kind === 'screen') {
      geometry = new BoxGeometry(w, h, d);
      materials = [right, right, top, top, frontLogoMat, frontLogoMat];
    } else {
      geometry = new BoxGeometry(w, h, d);
      const isWideBar = w > d * 1.8;
      materials = isWideBar
        ? [right, right, top, top, left, left]
        : [frontLogoMat, frontLogoMat, topLogoMat, top, frontLogoMat, frontLogoMat];
    }
    geometry.translate(0, h / 2 + 0.06, 0);
    const mainMesh = new Mesh(geometry, materials);
    mainMesh.userData['nodeId'] = node.id;
    this.hitTargets.push(mainMesh);
    group.add(mainMesh, new LineSegments(new EdgesGeometry(geometry, 25), edges));

    // 3. Plaque logo 3D carrée sur le dessus.
    const plaqueSize = node.kind === 'cylinder' ? w * 1.25 : Math.min(w, d, 0.92) * 0.92;
    if (node.kind !== 'screen') {
      const plaqueGeo = new BoxGeometry(plaqueSize, 0.05, plaqueSize);
      plaqueGeo.translate(0, h + 0.085, 0);
      const plaqueMesh = new Mesh(plaqueGeo, [right, right, topLogoMat, top, right, right]);
      plaqueMesh.userData['nodeId'] = node.id;
      this.hitTargets.push(plaqueMesh);
      group.add(plaqueMesh, new LineSegments(new EdgesGeometry(plaqueGeo, 25), edges));
    }

    // Pour les barres larges (API Gateway, RabbitMQ), façade logo frontale centrée 1:1.
    if (node.kind === 'box' && w > d * 1.8) {
      const frontPlateGeo = new BoxGeometry(0.9, h * 0.88, 0.05);
      frontPlateGeo.translate(0, h / 2 + 0.06, d / 2 + 0.026);
      const frontPlate = new Mesh(frontPlateGeo, [right, right, top, top, frontLogoMat, frontLogoMat]);
      frontPlate.userData['nodeId'] = node.id;
      this.hitTargets.push(frontPlate);
      group.add(frontPlate, new LineSegments(new EdgesGeometry(frontPlateGeo, 25), edges));
    }

    this.root.add(group);

    // 4. Étiquette HTML avec le vrai logo SVG inline + nom.
    const label = document.createElement('span');
    label.className = 'sys__label';
    if (OVERVIEW_LANDMARKS.has(node.id)) label.classList.add('is-overview-label');
    label.append(this.buildLogoSvg(logo, 13));
    const textSpan = document.createElement('span');
    textSpan.textContent = node.label;
    label.append(textSpan);
    this.labels.append(label);

    this.nodes.set(node.id, {
      config: node,
      logo,
      group,
      top,
      left,
      right,
      plinth,
      topLogoMat,
      frontLogoMat,
      edges,
      label,
      anchor: new Vector3(...labelAnchor(node)),
    });
  }

  private applyColors(): void {
    const p = this.palette;
    const isDark = p.bg.toLowerCase() === '#0b0d12';
    const layer = this.active;
    const hasFocus = this.hasFocus();
    this.element.classList.toggle('has-focus', hasFocus);

    const hl = this.highlightedTech?.trim().toLowerCase() ?? null;
    const hlLogoId = hl ? resolveTechLogo(hl).id : null;
    const hlSpec = hl ? resolveTechSpec(hl) : null;

    const inspectedIds = new Set<string>();
    if (this.selectedNodeId) inspectedIds.add(this.selectedNodeId);
    if (hlSpec) {
      if (hlSpec.nodeIds.length > 0) {
        for (const id of hlSpec.nodeIds) inspectedIds.add(id);
      } else if (hl) {
        for (const [id, n] of this.nodes) {
          if (n.logo.id === hlLogoId || n.config.label.toLowerCase().includes(hl)) inspectedIds.add(id);
        }
      }
    }

    const neighborIds = new Set<string>();
    for (const l of this.links) {
      let linkOn = false;
      const showProtocol =
        inspectedIds.size > 0 && (inspectedIds.has(l.config.from) || inspectedIds.has(l.config.to));
      if (inspectedIds.size > 0) {
        linkOn = showProtocol;
        if (linkOn) {
          neighborIds.add(l.config.from);
          neighborIds.add(l.config.to);
        }
      } else if (this.focusedNodeIds !== null) {
        linkOn =
          this.focusedNodeIds.size <= 1
            ? this.focusedNodeIds.has(l.config.from) || this.focusedNodeIds.has(l.config.to)
            : this.focusedNodeIds.has(l.config.from) && this.focusedNodeIds.has(l.config.to);
      } else if (layer !== null) {
        linkOn = l.config.layers.includes(layer);
      }
      l.active = linkOn;
      l.mesh.material.color.set(linkOn ? p['link-active'] : p.link);
      l.label.classList.toggle('is-visible', showProtocol);
    }

    for (const [id, n] of this.nodes) {
      const inCluster = this.focusedNodeIds?.has(id) ?? false;
      const inLayer = layer !== null && n.config.layers.includes(layer);
      const isHovered = id === this.hoveredNodeId;
      const isSelected = id === this.selectedNodeId;
      const isInspected = inspectedIds.has(id);
      const isNeighbor = inspectedIds.size > 0 && neighborIds.has(id);
      const on = inCluster || inLayer || isHovered || isSelected || isInspected;

      n.top.color.set(on ? p['active-top'] : p['node-top']);
      n.left.color.set(on ? p['active-left'] : p['node-left']);
      n.right.color.set(on ? p['active-right'] : p['node-right']);
      n.plinth.color.set(on ? p['active-right'] : p.grid);
      n.edges.color.set(on ? p['active-edge'] : p['node-edge']);

      const textureActive = on || isNeighbor || !hasFocus;
      n.topLogoMat.map = this.getLogoTexture(n.logo, n.config.label, 'top', isDark, on, textureActive, 1);
      n.topLogoMat.needsUpdate = true;

      const frontAspect =
        n.config.kind === 'screen'
          ? n.config.size[0] / n.config.size[1]
          : n.config.size[0] > n.config.size[2] * 1.8
            ? 0.9 / (n.config.size[1] * 0.88)
            : n.config.size[0] / n.config.size[1];
      n.frontLogoMat.map = this.getLogoTexture(
        n.logo,
        n.config.label,
        'front',
        isDark,
        on,
        textureActive,
        frontAspect,
      );
      n.frontLogoMat.needsUpdate = true;

      n.label.classList.toggle('is-active', on || isNeighbor);
    }
  }

  private getLogoTexture(
    logo: TechLogoDef,
    caption: string,
    variant: 'top' | 'front',
    isDark: boolean,
    active: boolean,
    vivid: boolean,
    faceAspect = 1,
  ): CanvasTexture {
    const aspectKey = Math.round(faceAspect * 100);
    const key = `${logo.id}|${caption}|${variant}|${isDark ? 'd' : 'l'}|${active ? '1' : '0'}|${vivid ? 'v' : 'm'}|${aspectKey}`;
    const existing = this.textures.get(key);
    if (existing) return existing;

    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const bgFill = active
        ? isDark
          ? '#172554'
          : '#DBEAFE'
        : variant === 'top'
          ? this.palette['node-top']
          : this.palette['node-left'];
      const frameColor = active ? this.palette['active-edge'] : vivid ? logo.color : this.palette['node-edge'];
      const textColor = isDark ? (vivid ? '#F4F6FA' : '#808999') : vivid ? '#0B0D12' : '#6B7385';
      const mutedLine = isDark ? '#272C37' : '#CBD5E1';

      ctx.fillStyle = bgFill;
      ctx.fillRect(0, 0, size, size);

      ctx.strokeStyle = mutedLine;
      ctx.lineWidth = 2;
      for (let g = 64; g < size; g += 64) {
        ctx.beginPath();
        ctx.moveTo(g, 0);
        ctx.lineTo(g, size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, g);
        ctx.lineTo(size, g);
        ctx.stroke();
      }

      ctx.strokeStyle = frameColor;
      ctx.lineWidth = active ? 16 : 10;
      ctx.strokeRect(14, 14, size - 28, size - 28);

      if (variant === 'front') {
        ctx.fillStyle = isDark ? '#0B0D12' : '#E2E8F0';
        ctx.fillRect(20, 20, size - 40, 52);
        ctx.fillStyle = vivid ? logo.color : this.palette['node-edge'];
        ctx.beginPath();
        ctx.arc(50, 46, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = textColor;
        ctx.font = '600 22px "JetBrains Mono", monospace';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(logo.short, size - 42, 46);
      }

      const baseScale = variant === 'top' ? 12.2 : 10.5;
      const scaleX = faceAspect >= 1 ? baseScale / faceAspect : baseScale;
      const scaleY = faceAspect < 1 ? baseScale * faceAspect : baseScale;
      const logoOffsetX = (size - 24 * scaleX) / 2;
      const logoOffsetY = variant === 'front' ? 112 : 76;

      if (typeof Path2D !== 'undefined') {
        ctx.save();
        ctx.translate(logoOffsetX, logoOffsetY);
        ctx.scale(scaleX, scaleY);
        for (const shape of logo.shapes) {
          const path = new Path2D(shape.d);
          const color = vivid ? (shape.color ?? logo.color) : this.palette['node-edge'];
          if (shape.strokeWidth) {
            ctx.strokeStyle = color;
            ctx.lineWidth = shape.strokeWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke(path);
          } else {
            ctx.fillStyle = color;
            ctx.fill(path, shape.fillRule ?? 'nonzero');
          }
        }
        ctx.restore();
      }

      const pillY = size - 86;
      ctx.fillStyle = isDark ? '#0B0D12' : '#FFFFFF';
      ctx.fillRect(40, pillY, size - 80, 52);
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(40, pillY, size - 80, 52);

      ctx.fillStyle = textColor;
      ctx.font = '600 26px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(caption.toUpperCase().slice(0, 14), size / 2, pillY + 26);
    }

    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    tex.needsUpdate = true;
    this.textures.set(key, tex);
    return tex;
  }

  private buildLogoSvg(logo: TechLogoDef, size: number): SVGSVGElement {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('sys__logo');
    for (const shape of logo.shapes) {
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', shape.d);
      if (shape.strokeWidth) {
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', shape.color ?? logo.color);
        path.setAttribute('stroke-width', String(shape.strokeWidth));
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
      } else {
        path.setAttribute('fill', shape.color ?? logo.color);
        if (shape.fillRule) path.setAttribute('fill-rule', shape.fillRule);
      }
      svg.append(path);
    }
    return svg;
  }

  private placeLabels(): void {
    for (const n of this.nodes.values()) {
      const v = this.tmp.copy(n.anchor).add(new Vector3(0, 0.25, 0)).applyMatrix4(this.root.matrixWorld).project(this.camera);
      const x = ((v.x + 1) / 2) * this.width;
      const y = ((1 - v.y) / 2) * this.height;
      n.label.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -100%)`;
    }
    for (const l of this.links) {
      if (!l.label.classList.contains('is-visible')) continue;
      const v = this.tmp.copy(l.midpoint).add(new Vector3(0, 0.22, 0)).applyMatrix4(this.root.matrixWorld).project(this.camera);
      const x = ((v.x + 1) / 2) * this.width;
      const y = ((1 - v.y) / 2) * this.height;
      l.label.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
    }
  }

  private bindCanvasInteractions(canvas: HTMLCanvasElement): void {
    canvas.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      this.dragging = true;
      this.dragMoved = 0;
      this.dragStart = {
        x: e.clientX,
        y: e.clientY,
        azim: this.view.azimuth,
        elev: this.view.elevation,
      };
      canvas.setPointerCapture(e.pointerId);
    });

    canvas.addEventListener('pointermove', (e) => {
      if (this.dragging) {
        const dx = e.clientX - this.dragStart.x;
        const dy = e.clientY - this.dragStart.y;
        this.dragMoved = Math.hypot(dx, dy);
        this.view.azimuth = this.dragStart.azim - dx * 0.0065;
        this.view.elevation = Math.max(0.22, Math.min(1.18, this.dragStart.elev + dy * 0.005));
        this.updateCamera();
        return;
      }
      this.pickAt(e.clientX, e.clientY, false);
    });

    canvas.addEventListener('pointerup', (e) => {
      if (!this.dragging) return;
      this.dragging = false;
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
      if (this.dragMoved <= 5) {
        this.pickAt(e.clientX, e.clientY, true);
      }
    });

    canvas.addEventListener('pointerleave', () => {
      this.dragging = false;
      if (this.hoveredNodeId !== null) {
        this.hoveredNodeId = null;
        this.applyColors();
        this.onNodeHover?.(null);
      }
    });
  }

  private pickAt(clientX: number, clientY: number, isClick: boolean): void {
    const rect = this.renderer.domElement.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    this.ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.ndc, this.camera);
    const hits = this.raycaster.intersectObjects(this.hitTargets, false);
    const nodeId = hits[0]?.object?.userData['nodeId'] as string | undefined;

    this.renderer.domElement.style.cursor = nodeId ? 'pointer' : 'grab';

    if (!isClick) {
      if ((nodeId ?? null) !== this.hoveredNodeId) {
        this.hoveredNodeId = nodeId ?? null;
        this.applyColors();
        this.onNodeHover?.(nodeId ? (this.nodes.get(nodeId)?.config ?? null) : null);
      }
      return;
    }

    if (nodeId) {
      const node = this.nodes.get(nodeId)?.config ?? null;
      this.selectedNodeId = nodeId;
      this.applyColors();
      this.onNodeSelect?.(node);
    } else {
      this.selectedNodeId = null;
      this.applyColors();
      this.onNodeSelect?.(null);
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

  private perimeterGeometry(config: SceneConfig): BufferGeometry {
    const { halfX, halfZ } = config.grid;
    const y = 0.01;
    const positions = [
      -halfX, y, -halfZ, halfX, y, -halfZ,
      halfX, y, -halfZ, halfX, y, halfZ,
      halfX, y, halfZ, -halfX, y, halfZ,
      -halfX, y, halfZ, -halfX, y, -halfZ,
    ];
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    return geometry;
  }

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
