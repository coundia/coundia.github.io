/**
 * Registre officiel des logos vectoriels des technologies (24x24, aplats stricts sans alpha ni dégradé).
 * Utilisé à la fois pour les textures 3D (CanvasTexture), les étiquettes de scène, le repli SVG et les tags UI.
 */

export interface LogoShape {
  d: string;
  /** Couleur hexadécimale 6 chiffres, ou 'contrast' (suit le contraste) / 'bg' (suit le fond). */
  color?: string;
  fillRule?: 'evenodd' | 'nonzero';
  strokeWidth?: number;
}

export interface TechLogoDef {
  id: string;
  name: string;
  short: string;
  color: string;
  accent: string;
  shapes: LogoShape[];
}

export const TECH_LOGOS: Record<string, TechLogoDef> = {
  angular: {
    id: 'angular',
    name: 'Angular',
    short: 'ANGULAR',
    color: '#DD0031',
    accent: '#C3002F',
    shapes: [
      { d: 'M12 1.5L2.2 5l1.5 12.9L12 22.5l8.3-4.6L21.8 5 12 1.5z', color: '#DD0031' },
      { d: 'M12 1.5v21l8.3-4.6L21.8 5 12 1.5z', color: '#C3002F' },
      {
        d: 'M12 4.3L6.1 17.3h2.2l1.2-2.95h5l1.2 2.95h2.2L12 4.3zm1.72 8.15h-3.44L12 8.2l1.72 4.25z',
        color: '#FFFFFF',
        fillRule: 'evenodd',
      },
    ],
  },
  typescript: {
    id: 'typescript',
    name: 'TypeScript',
    short: 'TS',
    color: '#3178C6',
    accent: '#235A97',
    shapes: [
      { d: 'M3 2h18a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z', color: '#3178C6' },
      { d: 'M5.5 11.2h6.8v1.7H9.8v6.6H8v-6.6H5.5v-1.7z', color: '#FFFFFF' },
      {
        d: 'M13.2 17.7c.6.4 1.4.65 2.25.65 1.15 0 1.85-.48 1.85-1.22 0-.65-.45-1.02-1.7-1.45-1.6-.55-2.55-1.35-2.55-2.68 0-1.58 1.3-2.62 3.2-2.62.95 0 1.75.2 2.35.52l-.55 1.58c-.5-.28-1.15-.48-1.8-.48-.98 0-1.55.44-1.55 1.05 0 .64.5.96 1.8 1.42 1.65.58 2.48 1.38 2.48 2.72 0 1.6-1.22 2.75-3.45 2.75-1.08 0-2.08-.28-2.73-.68l.5-1.56z',
        color: '#FFFFFF',
      },
    ],
  },
  rxjs: {
    id: 'rxjs',
    name: 'RxJS',
    short: 'RXJS',
    color: '#D81B60',
    accent: '#AD1457',
    shapes: [
      { d: 'M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z', color: '#D81B60' },
      {
        d: 'M12 5.4c3.6 0 6.5 2.7 6.5 6.2 0 2.4-1.4 4.5-3.6 5.5-.4.2-.8-.2-.6-.6.6-1.3.2-3-1-3.8-1-.7-2.4-.5-3.2.4-.6.7-.7 1.7-.3 2.4.2.4-.3.8-.7.5-1.3-1-2-2.6-1.7-4.3.5-3.4 2.4-6.3 4.6-6.3z',
        color: '#FFFFFF',
      },
      { d: 'M12 10.3a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4z', color: '#FCE4EC' },
    ],
  },
  spring: {
    id: 'spring',
    name: 'Spring Boot',
    short: 'SPRING',
    color: '#6DB33F',
    accent: '#4C8B2B',
    shapes: [
      { d: 'M12 1.8L20.8 6.9v10.2L12 22.2 3.2 17.1V6.9L12 1.8z', color: '#6DB33F' },
      { d: 'M12 4.4l6.5 3.75v7.5L12 19.4l-6.5-3.75v-7.5L12 4.4z', color: '#1F3A16' },
      { d: 'M12 6.8a1 1 0 0 1 1 1v4.1a1 1 0 0 1-2 0V7.8a1 1 0 0 1 1-1z', color: '#FFFFFF' },
      {
        d: 'M8.8 9.4a4.4 4.4 0 1 0 6.4 0 .9.9 0 0 1 1.25-1.3 6.2 6.2 0 1 1-8.9 0 .9.9 0 0 1 1.25 1.3z',
        color: '#FFFFFF',
      },
    ],
  },
  java: {
    id: 'java',
    name: 'Java',
    short: 'JAVA',
    color: '#ED8B00',
    accent: '#5382A1',
    shapes: [
      {
        d: 'M6 12h9v3.2a3.8 3.8 0 0 1-3.8 3.8H9.8A3.8 3.8 0 0 1 6 15.2V12zm9 .6h1.8a1.9 1.9 0 0 1 0 3.8H15v-1.2h1.6a.7.7 0 0 0 0-1.4H15v-1.2z',
        color: '#5382A1',
      },
      { d: 'M4.5 20.1c3.5.7 9 .7 12.5 0-.8 1.1-3.3 1.7-6.25 1.7S5.3 21.2 4.5 20.1z', color: '#5382A1' },
      {
        d: 'M10.1 2.5c-1.5 1.6-.2 2.9 1.1 4.1 1.1 1 .8 2.2-.3 3.2 1.9-1.1 2.4-2.8 1.1-4.1-1-.9-1.9-1.8-1.9-3.2zm3.2 1.6c-1.1 1.2-.2 2.2.8 3 .8.7.6 1.6-.2 2.4 1.4-.8 1.8-2.1.8-3-.7-.7-1.4-1.3-1.4-2.4z',
        color: '#ED8B00',
      },
    ],
  },
  rabbitmq: {
    id: 'rabbitmq',
    name: 'RabbitMQ',
    short: 'RABBITMQ',
    color: '#FF6600',
    accent: '#CC5200',
    shapes: [
      { d: 'M3 2h18a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z', color: '#FF6600' },
      {
        d: 'M6.4 5.6c0-.45.38-.8.85-.8h1.5c.47 0 .85.35.85.8v5.1h1.7V5.6c0-.45.38-.8.85-.8h1.5c.47 0 .85.35.85.8v5.1h2.7c.77 0 1.4.63 1.4 1.4v4.7c0 .77-.63 1.4-1.4 1.4H7.8c-.77 0-1.4-.63-1.4-1.4V5.6zm7.4 8a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6z',
        color: '#FFFFFF',
        fillRule: 'evenodd',
      },
    ],
  },
  postgres: {
    id: 'postgres',
    name: 'PostgreSQL',
    short: 'POSTGRES',
    color: '#4169E1',
    accent: '#336791',
    shapes: [
      {
        d: 'M12 2.8c-4.3 0-7.7 2.6-7.7 6.5 0 2.9 1.6 5.1 3.7 6-.1 1.6.4 3.2 1.6 4.2.5.4 1.2.2 1.3-.4.2-1-.2-2-.2-2.9.8.1 1.8.1 2.6 0 0 .9-.4 1.9-.2 2.9.1.6.8.8 1.3.4 1.2-1 1.7-2.6 1.6-4.2 2.1-.9 3.7-3.1 3.7-6 0-3.9-3.4-6.5-7.7-6.5z',
        color: '#336791',
      },
      { d: 'M8.7 8.4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm6.6 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z', color: '#FFFFFF' },
      { d: 'M10.5 13.7c0 2.3.65 4 1.5 4s1.5-1.7 1.5-4c0-1.1-.65-1.6-1.5-1.6s-1.5.5-1.5 1.6z', color: '#FFFFFF' },
    ],
  },
  docker: {
    id: 'docker',
    name: 'Docker',
    short: 'DOCKER',
    color: '#2496ED',
    accent: '#1D63ED',
    shapes: [
      {
        d: 'M6.4 8.8h2.2v2H6.4v-2zm2.8 0h2.2v2H9.2v-2zm2.8 0h2.2v2H12v-2zm0-2.5h2.2v2H12v-2zm-2.8 0h2.2v2H9.2v-2zm5.6 2.5H17v2h-2.2v-2z',
        color: '#2496ED',
      },
      {
        d: 'M2.2 12h14.5c.45-1.4 1.35-2.4 2.6-2.8-.2 1.2.1 2.1.8 2.7.8-.3 1.8-.3 2.7.2-.8 1.45-2.3 2.15-3.9 1.95-1.4 3.05-4.7 4.85-9 4.85-4.7 0-7.8-2.7-7.7-6.9zm5 2.1a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8z',
        color: '#2496ED',
        fillRule: 'evenodd',
      },
    ],
  },
  git: {
    id: 'git',
    name: 'Git',
    short: 'GIT',
    color: '#F05032',
    accent: '#C9381E',
    shapes: [
      { d: 'M12 2.1l9.9 9.9-9.9 9.9L2.1 12 12 2.1z', color: '#F05032' },
      {
        d: 'M8.8 5.3l2.6 2.6a1.5 1.5 0 0 1 1.9 1.9l2.1 2.1a1.5 1.5 0 1 1-.9.9l-2-2v5.1a1.5 1.5 0 1 1-1.2 0V9.5a1.5 1.5 0 0 1-.8-2L7.9 6.2l.9-.9z',
        color: '#FFFFFF',
      },
    ],
  },
  gitlab: {
    id: 'gitlab',
    name: 'GitLab CI',
    short: 'GITLAB',
    color: '#FC6D26',
    accent: '#E24329',
    shapes: [
      { d: 'M12 21.4l3.5-10.7H8.5L12 21.4z', color: '#E24329' },
      { d: 'M3.4 10.7L5.8 3.3c.15-.45.78-.45.93 0L8.5 10.7H3.4z', color: '#E24329' },
      { d: 'M20.6 10.7L18.2 3.3c-.15-.45-.78-.45-.93 0L15.5 10.7h5.1z', color: '#E24329' },
      { d: 'M8.5 10.7L12 21.4 3.4 10.7h5.1z', color: '#FC6D26' },
      { d: 'M15.5 10.7L12 21.4l8.6-10.7h-5.1z', color: '#FC6D26' },
      { d: 'M3.4 10.7L2.1 14.8c-.12.38.01.8.33 1.03L12 21.4 3.4 10.7z', color: '#FCA326' },
      { d: 'M20.6 10.7l1.3 4.1c.12.38-.01.8-.33 1.03L12 21.4l8.6-10.7z', color: '#FCA326' },
    ],
  },
  githubactions: {
    id: 'githubactions',
    name: 'GitHub Actions',
    short: 'GH ACTIONS',
    color: '#2088FF',
    accent: '#1B6AC9',
    shapes: [
      { d: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', color: '#2088FF' },
      { d: 'M9.8 7.6l6.8 4.4-6.8 4.4V7.6z', color: '#FFFFFF' },
      { d: 'M6.8 7.8a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zm0 6a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z', color: '#FFFFFF' },
    ],
  },
  php: {
    id: 'php',
    name: 'PHP',
    short: 'PHP',
    color: '#777BB4',
    accent: '#4F5B93',
    shapes: [
      { d: 'M12 5.5c5.8 0 10.5 2.9 10.5 6.5S17.8 18.5 12 18.5 1.5 15.6 1.5 12 6.2 5.5 12 5.5z', color: '#777BB4' },
      {
        d: 'M5.1 14.8l1-5h2c1.1 0 1.7.6 1.5 1.6-.2 1.1-1 1.7-2.2 1.7h-.9l-.3 1.7H5.1zm1.6-2.7h.7c.6 0 1-.3 1.1-.8.1-.4-.1-.6-.7-.6h-.7l-.4 1.4zm3.9 2.7l1.3-6.5H13l-.4 1.9h.9c1 0 1.6.5 1.4 1.5l-.6 3.1h-1.1l.6-2.8c.1-.5-.1-.7-.6-.7h-.8l-.7 3.5h-1.1zm5 0l1-5h2c1.1 0 1.7.6 1.5 1.6-.2 1.1-1 1.7-2.2 1.7h-.9l-.3 1.7h-1.1zm1.6-2.7h.7c.6 0 1-.3 1.1-.8.1-.4-.1-.6-.7-.6h-.7l-.4 1.4z',
        color: '#FFFFFF',
      },
    ],
  },
  symfony: {
    id: 'symfony',
    name: 'Symfony',
    short: 'SYMFONY',
    color: '#38BDF8',
    accent: '#0284C7',
    shapes: [
      { d: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', color: '#38BDF8' },
      { d: 'M12 3.8a8.2 8.2 0 1 0 0 16.4 8.2 8.2 0 0 0 0-16.4z', color: '#12151C' },
      {
        d: 'M13.5 7.2c-.8 0-1.4.4-1.7 1.1l-.9 2.4H8.8l-.4 1.3h2.1l-1 2.9c-.2.5-.5.8-.9.8-.3 0-.5-.1-.6-.3l-1 1.1c.4.5 1 .8 1.8.8 1.1 0 1.9-.6 2.3-1.8l1.2-3.5h2.2l.4-1.3h-2.1l.6-1.7c.1-.4.4-.6.8-.6.3 0 .5.1.6.3l.9-1.1c-.4-.3-.9-.4-1.5-.4zm3 3.4c-1.1 0-1.9.6-1.9 1.6 0 .8.5 1.2 1.5 1.5.7.2 1 .4 1 .7 0 .4-.4.6-1 .6-.6 0-1.1-.2-1.5-.5l-.6 1.1c.5.4 1.2.6 2 .6 1.3 0 2.2-.7 2.2-1.7 0-.8-.5-1.3-1.5-1.6-.7-.2-1-.4-1-.7 0-.3.3-.5.8-.5.5 0 .9.1 1.3.4l.5-1.1c-.4-.3-1-.4-1.8-.4z',
        color: '#FFFFFF',
      },
    ],
  },
  laravel: {
    id: 'laravel',
    name: 'Laravel',
    short: 'LARAVEL',
    color: '#FF2D20',
    accent: '#D91D12',
    shapes: [
      {
        d: 'M8 3.2L3.5 5.8v9.8l4.5 2.6 4.5 2.6 4.5-2.6 3.5-2V9.8l-3.5-2-3.5 2v4.6l-3.5 2V5.8L8 3.2z',
        color: '#FF2D20',
        strokeWidth: 1.7,
      },
      { d: 'M3.5 5.8L8 8.4l4.5-2.6M8 8.4v8.2M17 7.8l3.5 2-3.5 2-3.5-2', color: '#FF2D20', strokeWidth: 1.5 },
    ],
  },
  apiplatform: {
    id: 'apiplatform',
    name: 'API Platform',
    short: 'API PLAT',
    color: '#0099A8',
    accent: '#007380',
    shapes: [
      { d: 'M12 2.4L20.3 7.2v9.6L12 21.6 3.7 16.8V7.2L12 2.4z', color: '#0099A8', strokeWidth: 1.8 },
      { d: 'M12 6.8l4.5 2.6v5.2L12 17.2l-4.5-2.6V9.4L12 6.8z', color: '#38BDF8', strokeWidth: 1.4 },
      { d: 'M12 2.4v19.2M3.7 7.2l16.6 9.6M20.3 7.2L3.7 16.8', color: '#0099A8', strokeWidth: 1.1 },
    ],
  },
  axon: {
    id: 'axon',
    name: 'Axon CQRS',
    short: 'AXON',
    color: '#3B82F6',
    accent: '#1D4ED8',
    shapes: [
      { d: 'M12 3L4.5 7.2v9.6L12 21l7.5-4.2V7.2L12 3z', color: '#3B82F6' },
      { d: 'M7 9.5h10v2H7v-2zm0 3.5h7v2H7v-2z', color: '#FFFFFF' },
      { d: 'M15.5 12.2l2.7 1.8-2.7 1.8v-3.6z', color: '#93C5FD' },
    ],
  },
  selenium: {
    id: 'selenium',
    name: 'Selenium',
    short: 'SELENIUM',
    color: '#43B02A',
    accent: '#2D7D1B',
    shapes: [
      { d: 'M3 3h18v18H3V3z', color: '#43B02A' },
      { d: 'M13.8 13.3l2.1 2.1 4.4-5 1.3 1.2-5.7 6.5-3.4-3.4 1.3-1.4z', color: '#FFFFFF' },
      {
        d: 'M5.6 13.7c.5.35 1.15.55 1.8.55.8 0 1.25-.35 1.25-.9 0-.48-.35-.75-1.25-1.08-1.15-.4-1.85-1-1.85-2 0-1.15.95-1.95 2.35-1.95.72 0 1.32.15 1.78.4l-.42 1.2c-.38-.22-.85-.35-1.36-.35-.72 0-1.12.32-1.12.78 0 .48.38.72 1.32 1.05 1.2.42 1.85 1.02 1.85 2.02 0 1.18-.92 2.05-2.55 2.05-.8 0-1.58-.2-2.08-.52l.38-1.25z',
        color: '#FFFFFF',
      },
    ],
  },
  rust: {
    id: 'rust',
    name: 'Rust',
    short: 'RUST',
    color: '#F74C00',
    accent: '#DEA584',
    shapes: [
      {
        d: 'M12 2.4l1.3 1.7 2.1-.4.4 2.1 2.1.5-.5 2.1 1.7 1.3-1.2 1.8.9 2-1.8 1.2-.1 2.1-2.1.4-.9 1.9-2-.5-1.6 1.4-1.6-1.4-2 .5-.9-1.9-2.1-.4-.1-2.1-1.8-1.2.9-2-1.2-1.8 1.7-1.3-.5-2.1 2.1-.5.4-2.1 2.1.4L12 2.4z',
        color: '#F74C00',
      },
      { d: 'M12 6.2a5.8 5.8 0 1 0 0 11.6 5.8 5.8 0 0 0 0-11.6z', color: '#12151C' },
      {
        d: 'M9.1 8.3h3.5c1.5 0 2.4.8 2.4 2.1 0 1-.6 1.7-1.5 2l1.8 3.1h-2l-1.5-2.8h-.9v2.8H9.1V8.3zm1.8 1.4v1.7h1.5c.6 0 1-.3 1-.85s-.4-.85-1-.85h-1.5z',
        color: '#FFFFFF',
      },
    ],
  },
  kotlin: {
    id: 'kotlin',
    name: 'Kotlin',
    short: 'KOTLIN',
    color: '#7F52FF',
    accent: '#E44857',
    shapes: [
      { d: 'M3 3h18L12 12 3 21V3z', color: '#7F52FF' },
      { d: 'M3 21l9-9 9 9H3z', color: '#E44857' },
      { d: 'M3 3h9l-9 9.5V3z', color: '#C711E1' },
    ],
  },
  swift: {
    id: 'swift',
    name: 'Swift',
    short: 'SWIFT',
    color: '#F05138',
    accent: '#C93A23',
    shapes: [
      { d: 'M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z', color: '#F05138' },
      {
        d: 'M19.2 16.4c-.6 1.3-2.1 2.1-4.1 2-2.7-.1-6-1.9-8.9-5.3 2.4 1.7 4.8 2.5 6.7 2.3-2-1.8-3.8-4.2-5.2-7.2 1.8 1.8 4 3.5 6.3 4.5-1-1.5-1.9-3.2-2.8-5 2.6 2.2 5.2 4.7 6.5 7.2 1-.1 1.6-.8 1.7-1.8.5 1 .3 2.3-.2 3.3z',
        color: '#FFFFFF',
      },
    ],
  },
  solidjs: {
    id: 'solidjs',
    name: 'SolidJS',
    short: 'SOLID',
    color: '#4F88C6',
    accent: '#2C4F7C',
    shapes: [
      { d: 'M4 7.5l8-3.5 8 3.5-8 3.5-8-3.5z', color: '#76B3E1' },
      { d: 'M4 12l8 3.5 8-3.5v4.5l-8 3.5-8-3.5V12z', color: '#4F88C6' },
      { d: 'M12 15.5v4.5l8-3.5V12l-8 3.5z', color: '#2C4F7C' },
    ],
  },
  rest: {
    id: 'rest',
    name: 'REST Gateway',
    short: 'API GW',
    color: '#10B981',
    accent: '#059669',
    shapes: [
      { d: 'M3 5h18v14H3V5z', color: '#10B981' },
      { d: 'M8.5 9L5.5 12l3 3M15.5 9l3 3-3 3M13.2 8.5l-2.4 7', color: '#FFFFFF', strokeWidth: 1.8 },
    ],
  },
  soap: {
    id: 'soap',
    name: 'SOAP XML',
    short: 'SOAP',
    color: '#F59E0B',
    accent: '#D97706',
    shapes: [
      { d: 'M3 5h18v14H3V5z', color: '#F59E0B' },
      { d: 'M3 5l9 7 9-7', color: '#FFFFFF', strokeWidth: 1.8 },
      { d: 'M8 14.5l-2-1.5 2-1.5M16 14.5l2-1.5-2-1.5', color: '#FFFFFF', strokeWidth: 1.6 },
    ],
  },
  bank: {
    id: 'bank',
    name: 'Bank API',
    short: 'BANK',
    color: '#F59E0B',
    accent: '#B45309',
    shapes: [
      { d: 'M12 3L3 8h18L12 3z', color: '#F59E0B' },
      { d: 'M5 10h2.5v7H5v-7zm5.75 0h2.5v7h-2.5v-7zm5.75 0H19v7h-2.5v-7z', color: '#FBBF24' },
      { d: 'M3 18.5h18V21H3v-2.5z', color: '#F59E0B' },
    ],
  },
  momo: {
    id: 'momo',
    name: 'Mobile Money',
    short: 'MOMO',
    color: '#10B981',
    accent: '#047857',
    shapes: [
      { d: 'M6 2.5h12a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 20V4A1.5 1.5 0 0 1 6 2.5z', color: '#10B981' },
      { d: 'M7 5.5h10v11H7v-11z', color: '#0B0D12' },
      { d: 'M12 8.2a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6z', color: '#4ADE80' },
      { d: 'M10.5 18.5h3v1h-3v-1z', color: '#FFFFFF' },
    ],
  },
  ddd: {
    id: 'ddd',
    name: 'DDD & Clean Arch',
    short: 'DDD',
    color: '#60A5FA',
    accent: '#3B82F6',
    shapes: [
      { d: 'M12 2L20.66 7v10L12 22l-8.66-5V7L12 2z', color: '#3B82F6', strokeWidth: 1.8 },
      { d: 'M12 5.6l5.5 3.2v6.4L12 18.4l-5.5-3.2V8.8L12 5.6z', color: '#60A5FA', strokeWidth: 1.6 },
      { d: 'M12 9.4l2.4 1.4v2.4L12 14.6l-2.4-1.4v-2.4L12 9.4z', color: '#93C5FD' },
    ],
  },
};

const ALIASES: Record<string, string> = {
  web: 'angular',
  angular: 'angular',
  angularjs: 'angular',
  extjs: 'typescript',
  mobile: 'kotlin',
  kotlin: 'kotlin',
  swift: 'swift',
  backoffice: 'typescript',
  typescript: 'typescript',
  'html / css': 'typescript',
  rxjs: 'rxjs',
  gateway: 'rest',
  'api gateway': 'rest',
  rest: 'rest',
  soap: 'soap',
  'soap → rest': 'rest',
  transfer: 'spring',
  'transfer-svc': 'spring',
  'spring boot': 'spring',
  'spring pay': 'spring',
  payment: 'spring',
  'payment-svc': 'spring',
  topup: 'java',
  'topup-svc': 'java',
  java: 'java',
  import: 'symfony',
  'import-svc': 'symfony',
  symfony: 'symfony',
  php: 'php',
  laravel: 'laravel',
  'api platform': 'apiplatform',
  bus: 'rabbitmq',
  rabbitmq: 'rabbitmq',
  postgres: 'postgres',
  postgresql: 'postgres',
  eventstore: 'axon',
  'event store': 'axon',
  axon: 'axon',
  'axon framework': 'axon',
  'axon cqrs': 'axon',
  cqrs: 'axon',
  'event sourcing': 'axon',
  bank: 'bank',
  'bank api': 'bank',
  momo: 'momo',
  'mobile money': 'momo',
  git: 'git',
  ci: 'gitlab',
  'ci/cd': 'gitlab',
  'gitlab ci': 'gitlab',
  'github actions': 'githubactions',
  registry: 'docker',
  docker: 'docker',
  vagrant: 'docker',
  qa: 'selenium',
  selenium: 'selenium',
  rust: 'rust',
  solidjs: 'solidjs',
  ddd: 'ddd',
  'clean architecture': 'ddd',
  microservices: 'spring',
  'multi-tenant': 'ddd',
  rbac: 'ddd',
  fintech: 'momo',
  'financial partners': 'bank',
  'partenaires financiers': 'bank',
  'white label': 'angular',
  'marque blanche': 'angular',
  agile: 'git',
  'code reviews': 'git',
  'revues de code': 'git',
};

/** Associe un identifiant de nœud 3D ou un nom de technologie au logo officiel correspondant. */
export function resolveTechLogo(key: string): TechLogoDef {
  const norm = key.trim().toLowerCase();
  const mapped = ALIASES[norm];
  if (mapped && TECH_LOGOS[mapped]) return TECH_LOGOS[mapped];
  for (const [alias, id] of Object.entries(ALIASES)) {
    if (norm.includes(alias) && TECH_LOGOS[id]) return TECH_LOGOS[id];
  }
  return TECH_LOGOS['ddd'];
}
