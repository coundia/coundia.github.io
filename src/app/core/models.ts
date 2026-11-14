// Modèles des données JSON (src/data). Les schémas de référence sont dans src/data/schemas.

export type Lang = 'fr' | 'en';

/** Couches de l'architecture : identiques aux identifiants de expertise.json. */
export type Layer = 'frontend' | 'backend' | 'payment' | 'quality';

export interface Role {
  label: string;
  layer: Layer | null;
}

export interface Link {
  label: string;
  url: string;
}

export interface Profile {
  firstName: string;
  lastName: string;
  title: string;
  headline: string;
  roles: Role[];
  tagline: string;
  location: string;
  timezone: string;
  careerStart: string;
  availability: { status: 'available' | 'from' | 'unavailable'; label: string };
  email: string;
  links: Link[];
  about: string[];
  summaryStrip: string[];
}

export interface Stat {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export interface Expertise {
  id: Layer;
  title: string;
  description: string;
  items: string[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  remote: boolean;
  start: string;
  end: string | null;
  highlights: string[];
  stack: string[];
  sector: string;
  caseStudySlug: string | null;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  start: string;
  end: string;
}

export interface SkillGroup {
  id: string;
  domain: string;
  items: string[];
}

export interface CaseStudy {
  slug: string;
  number: string;
  title: string;
  client: string;
  sector: string;
  period: string;
  role: string;
  summary: string;
  context: string;
  challenge: string;
  approach: { title: string; detail: string }[];
  outcomes: string[];
  stack: string[];
}

export interface OpenSourceProject {
  id: string;
  name: string;
  url: string;
  description: string;
  stack: string[];
  highlight: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  position: string;
  company: string;
  url?: string;
}

export type Vec3 = [number, number, number];

export interface SceneView {
  target: Vec3;
  zoom: number;
}

export interface SceneNode {
  id: string;
  label: string;
  kind: 'box' | 'screen' | 'cylinder';
  /** Position au sol [x, z]. */
  position: [number, number];
  /** [largeur x, hauteur y, profondeur z] ; pour un cylindre : [rayon, hauteur, rayon]. */
  size: Vec3;
  layers: Layer[];
  /** Décalage [x, z] de l'étiquette (composants longs). */
  labelOffset?: [number, number];
}

export interface SceneLink {
  from: string;
  to: string;
  route: 'xz' | 'zx';
  via?: [number, number][];
  layers: Layer[];
}

export interface SceneConfig {
  views: Record<'overview' | Layer, SceneView>;
  nodes: SceneNode[];
  links: SceneLink[];
  grid: { halfX: number; halfZ: number; step: number };
  packetsPerLink: { desktop: number; mobile: number };
  packetSpeed: number;
}

export interface ScenePalette {
  bg: string;
  grid: string;
  'node-top': string;
  'node-left': string;
  'node-right': string;
  'node-edge': string;
  screen: string;
  'active-top': string;
  'active-left': string;
  'active-right': string;
  'active-edge': string;
  link: string;
  'link-active': string;
  packet: string;
}

export interface SiteConfig {
  url: string;
  formEndpoint: string;
  bookingUrl: string;
  ogImage: string;
}
