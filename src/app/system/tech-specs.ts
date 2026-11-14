/**
 * Référentiel d'expérience (années, année de début) et des protocoles de communication
 * associé à chaque brique 3D et badge technologique du portfolio.
 */

export interface TechSpec {
  id: string;
  name: string;
  years: number;
  since: number;
  nodeIds: string[];
  protocols: string[];
  summary: { fr: string; en: string };
}

/** Protocole de communication exact sur chaque arête orientée (from->to) de `scene.json`. */
export const LINK_PROTOCOLS: Record<string, string> = {
  'rxjs->web': 'RxJS Observable Stream',
  'web->gateway': 'HTTPS / REST JSON · JWT',
  'mobile->gateway': 'HTTPS / REST · OAuth2',
  'backoffice->gateway': 'HTTPS / REST · RBAC',
  'gateway->transfer': 'REST JSON / SOAP XML',
  'gateway->topup': 'REST / HTTP/2',
  'gateway->import': 'HTTP Multipart / Stream',
  'gateway->payment': 'HTTPS / REST · mTLS',
  'transfer->bus': 'AMQP 0-9-1 (Pub/Sub)',
  'topup->bus': 'AMQP 0-9-1 (Pub/Sub)',
  'import->bus': 'AMQP 0-9-1 (Async Batch)',
  'payment->bus': 'AMQP 0-9-1 (Events)',
  'bus->postgres': 'TCP :5432 · JDBC / SQL',
  'bus->eventstore': 'Axon Event Bus · CQRS',
  'payment->bank': 'SOAP / ISO 8583 · mTLS',
  'payment->momo': 'HTTPS REST · Webhook HMAC',
  'git->ci': 'Git SSH / HTTPS Webhook',
  'ci->registry': 'OCI Registry API / TLS',
  'registry->qa': 'W3C WebDriver / HTTP',
  'registry->transfer': 'OCI Image Pull / TLS',
};

export function getLinkProtocol(from: string, to: string): string {
  return LINK_PROTOCOLS[`${from}->${to}`] ?? LINK_PROTOCOLS[`${to}->${from}`] ?? 'HTTPS / JSON';
}

export const TECH_SPECS: Record<string, TechSpec> = {
  angular: {
    id: 'angular',
    name: 'Angular',
    years: 7,
    since: 2019,
    nodeIds: ['web'],
    protocols: ['HTTPS / REST JSON', 'OAuth2 / JWT Bearer', 'RxJS Streams', 'SSE / WebSockets'],
    summary: {
      fr: 'Applications front-end d’entreprise FinTech et SaaS multi-tenant en production.',
      en: 'Enterprise FinTech and multi-tenant SaaS front-end applications in production.',
    },
  },
  angularjs: {
    id: 'angularjs',
    name: 'AngularJS',
    years: 3,
    since: 2018,
    nodeIds: ['web'],
    protocols: ['HTTPS / REST JSON', 'SOAP / XML Legacy Bridge', 'Session Token HTTP'],
    summary: {
      fr: 'Plateformes de transfert en marque blanche et maintenance évolutive.',
      en: 'White-label money transfer platforms and legacy progressive upgrades.',
    },
  },
  typescript: {
    id: 'typescript',
    name: 'TypeScript',
    years: 7,
    since: 2019,
    nodeIds: ['backoffice'],
    protocols: ['HTTPS / REST JSON', 'OpenAPI Typed Contracts', 'RBAC Claims / JWT'],
    summary: {
      fr: 'Typage strict bout-en-bout pour consoles back-office et SDK client.',
      en: 'End-to-end strict typing for back-office consoles and client SDKs.',
    },
  },
  extjs: {
    id: 'extjs',
    name: 'ExtJS',
    years: 3,
    since: 2022,
    nodeIds: ['backoffice'],
    protocols: ['AJAX / REST JSON', 'HTTP Multipart', 'RBAC Session Cookie'],
    summary: {
      fr: 'Grilles analytiques lourdes et interfaces d’administration SaaS multi-tenant.',
      en: 'Heavy analytical grids and multi-tenant SaaS admin interfaces.',
    },
  },
  rxjs: {
    id: 'rxjs',
    name: 'RxJS',
    years: 7,
    since: 2019,
    nodeIds: ['rxjs'],
    protocols: ['RxJS Observable Stream', 'WebSockets Push', 'HTTP Interceptors / Retry'],
    summary: {
      fr: 'Gestion d’états réactifs, orchestration d’appels HTTP concurrents et temps réel.',
      en: 'Reactive state pipelines, concurrent HTTP orchestration, and real-time streams.',
    },
  },
  mobile: {
    id: 'mobile',
    name: 'Kotlin / Swift',
    years: 4,
    since: 2020,
    nodeIds: ['mobile'],
    protocols: ['HTTPS / REST JSON', 'OAuth2 / PKCE', 'Push Notification Webhook'],
    summary: {
      fr: 'Applications mobiles de paiement Upay App / Proximo et ponts natifs.',
      en: 'Upay App / Proximo payment mobile apps and cross-platform native bridges.',
    },
  },
  rust: {
    id: 'rust',
    name: 'Rust',
    years: 2,
    since: 2024,
    nodeIds: ['mobile'],
    protocols: ['IPC Bridge (Tauri)', 'FFI C-ABI', 'HTTPS / TLS (Reqwest)'],
    summary: {
      fr: 'Noyaux systèmes performants et applications multiplateformes (Buntu).',
      en: 'High-performance system cores and cross-platform desktop/mobile runtime (Buntu).',
    },
  },
  solidjs: {
    id: 'solidjs',
    name: 'SolidJS',
    years: 2,
    since: 2024,
    nodeIds: ['web'],
    protocols: ['IPC Command Bus', 'Fine-Grained Signals', 'HTTPS / REST JSON'],
    summary: {
      fr: 'Interfaces légères ultra-réactives sur projets open source récents.',
      en: 'Lightweight ultra-reactive interfaces on recent open source tooling.',
    },
  },
  gateway: {
    id: 'gateway',
    name: 'API Gateway / REST',
    years: 7,
    since: 2019,
    nodeIds: ['gateway'],
    protocols: ['HTTPS / HTTP/2', 'REST JSON · OpenAPI', 'OAuth2 / JWT · mTLS', 'SOAP XML Adapter'],
    summary: {
      fr: 'Routage sécurisé, limitation de débit, contrats OpenAPI et transition SOAP → REST.',
      en: 'Secure routing, rate limiting, OpenAPI contracts, and SOAP → REST migration.',
    },
  },
  soap: {
    id: 'soap',
    name: 'SOAP → REST',
    years: 4,
    since: 2019,
    nodeIds: ['gateway', 'bank'],
    protocols: ['SOAP 1.1 / 1.2 XML', 'WSDL / WS-Security', 'HTTPS REST JSON Bridge'],
    summary: {
      fr: 'Modernisation d’anciens web services bancaires SOAP vers des API REST scalables.',
      en: 'Modernizing legacy banking SOAP web services into scalable REST APIs.',
    },
  },
  transfer: {
    id: 'transfer',
    name: 'Spring Boot',
    years: 7,
    since: 2019,
    nodeIds: ['transfer'],
    protocols: ['REST JSON / HTTP/2', 'AMQP 0-9-1 (RabbitMQ)', 'JDBC / PostgreSQL', 'OCI Image / TLS'],
    summary: {
      fr: 'Microservices critiques de transfert d’argent, recharge et orchestration métier.',
      en: 'Mission-critical money transfer, top-up, and business orchestration microservices.',
    },
  },
  payment: {
    id: 'payment',
    name: 'Spring Pay',
    years: 6,
    since: 2019,
    nodeIds: ['payment'],
    protocols: ['HTTPS / REST · mTLS', 'SOAP / ISO 8583', 'Webhook HMAC-SHA256', 'AMQP 0-9-1'],
    summary: {
      fr: 'Moteur d’encaissement et d’interopérabilité avec banques et Mobile Money.',
      en: 'Payment acquiring engine integrated with banking cores and Mobile Money.',
    },
  },
  spring: {
    id: 'spring',
    name: 'Spring Boot / Microservices',
    years: 7,
    since: 2019,
    nodeIds: ['transfer', 'payment'],
    protocols: ['HTTPS / REST · mTLS', 'AMQP 0-9-1 (RabbitMQ)', 'Axon CQRS / Event Bus', 'JDBC'],
    summary: {
      fr: 'Architecture distribuée Spring Boot orientée domaine et résilience financière.',
      en: 'Distributed domain-driven Spring Boot architecture built for financial resilience.',
    },
  },
  java: {
    id: 'java',
    name: 'Java / DDD',
    years: 7,
    since: 2019,
    nodeIds: ['topup'],
    protocols: ['REST / HTTP/2', 'AMQP 0-9-1 (Pub/Sub)', 'Axon Command / Event Bus', 'JDBC'],
    summary: {
      fr: 'Modélisation DDD, services transactionnels haute disponibilité et tests E2E.',
      en: 'DDD domain modeling, high-availability transactional services, and E2E automation.',
    },
  },
  php: {
    id: 'php',
    name: 'PHP / Symfony',
    years: 8,
    since: 2018,
    nodeIds: ['import'],
    protocols: ['HTTP Multipart / Stream', 'REST JSON / OpenAPI', 'AMQP Async Batch', 'PDO / PostgreSQL'],
    summary: {
      fr: 'Plateformes SaaS multi-tenant, imports volumineux et générateurs open source.',
      en: 'Multi-tenant SaaS backends, heavy file pipelines, and open source generators.',
    },
  },
  symfony: {
    id: 'symfony',
    name: 'Symfony',
    years: 6,
    since: 2019,
    nodeIds: ['import'],
    protocols: ['REST JSON / API Platform', 'Symfony Messenger AMQP', 'HTTP StreamedResponse'],
    summary: {
      fr: 'Architectures modulaires DDD, files de traitement asynchrone et bundles open source.',
      en: 'Modular DDD architectures, async Messenger workers, and open source bundles.',
    },
  },
  laravel: {
    id: 'laravel',
    name: 'Laravel',
    years: 5,
    since: 2018,
    nodeIds: ['import'],
    protocols: ['HTTPS / REST JSON', 'Sanctum / Passport OAuth2', 'Redis / AMQP Queues'],
    summary: {
      fr: 'API métier multi-tenant et génération automatisée d’architecture REST.',
      en: 'Multi-tenant business APIs and automated REST scaffolding.',
    },
  },
  apiplatform: {
    id: 'apiplatform',
    name: 'API Platform',
    years: 4,
    since: 2021,
    nodeIds: ['gateway', 'import'],
    protocols: ['JSON-LD / Hydra / REST', 'OpenAPI 3.1', 'JWT / RBAC Voters'],
    summary: {
      fr: 'Exposition standardisée d’API REST documentées, sécurisées et paginées.',
      en: 'Standardized REST APIs with OpenAPI specs, pagination, and RBAC security.',
    },
  },
  bus: {
    id: 'bus',
    name: 'RabbitMQ',
    years: 6,
    since: 2020,
    nodeIds: ['bus'],
    protocols: ['AMQP 0-9-1', 'Topic / Direct Exchanges', 'Dead-Letter Queue (DLQ)', 'Publisher Confirms'],
    summary: {
      fr: 'Découplage asynchrone des microservices et absorption des pics d’imports.',
      en: 'Asynchronous microservice decoupling and spike smoothing for batch workloads.',
    },
  },
  postgres: {
    id: 'postgres',
    name: 'PostgreSQL',
    years: 8,
    since: 2018,
    nodeIds: ['postgres'],
    protocols: ['TCP :5432 / TLS', 'JDBC / PDO Wire Protocol', 'ACID · Partitioning'],
    summary: {
      fr: 'Stockage transactionnel multi-tenant, indexation poussée et intégrité comptable.',
      en: 'Multi-tenant transactional storage, query tuning, and ledger data integrity.',
    },
  },
  eventstore: {
    id: 'eventstore',
    name: 'Axon CQRS',
    years: 5,
    since: 2021,
    nodeIds: ['eventstore'],
    protocols: ['Axon Command Bus', 'Axon Event Bus', 'gRPC / Axon Server', 'Event Store Append'],
    summary: {
      fr: 'Séparation commandes/lectures et piste d’audit immuable par événements métier.',
      en: 'CQRS command/query separation and immutable domain event sourcing audit trails.',
    },
  },
  ddd: {
    id: 'ddd',
    name: 'DDD & Clean Architecture',
    years: 6,
    since: 2020,
    nodeIds: ['topup', 'eventstore'],
    protocols: ['Domain Events (AMQP)', 'Anti-Corruption Layer', 'REST OpenAPI', 'RBAC / JWT Claims'],
    summary: {
      fr: 'Bounded contexts isolés, séparation stricte domaine/infrastructure et multi-tenant.',
      en: 'Isolated bounded contexts, strict domain/infra boundaries, and multi-tenancy.',
    },
  },
  bank: {
    id: 'bank',
    name: 'Bank API',
    years: 5,
    since: 2019,
    nodeIds: ['bank'],
    protocols: ['SOAP 1.2 / WS-Security', 'ISO 8583', 'HTTPS REST · mTLS', 'SFTP Settlement'],
    summary: {
      fr: 'Interfaçage sécurisé avec les systèmes bancaires et partenaires financiers agréés.',
      en: 'Secure integration with core banking rails and licensed financial institutions.',
    },
  },
  momo: {
    id: 'momo',
    name: 'Mobile Money',
    years: 6,
    since: 2019,
    nodeIds: ['momo'],
    protocols: ['HTTPS / REST JSON', 'Webhook HMAC-SHA256', 'OAuth2 Client Credentials', 'Idempotency Keys'],
    summary: {
      fr: 'Connecteurs temps réel opérateurs Mobile Money : encaissement, transfert, callback.',
      en: 'Real-time Mobile Money operator connectors for cash-in, payout, and callbacks.',
    },
  },
  git: {
    id: 'git',
    name: 'Git',
    years: 8,
    since: 2018,
    nodeIds: ['git'],
    protocols: ['Git over SSH / HTTPS', 'Webhooks PR / MR', 'Signed Commits GPG'],
    summary: {
      fr: 'Workflows collaboratifs, revues de code rigoureuses et historique propre.',
      en: 'Collaborative branching workflows, strict code reviews, and clean history.',
    },
  },
  gitlab: {
    id: 'gitlab',
    name: 'GitLab CI',
    years: 6,
    since: 2019,
    nodeIds: ['ci'],
    protocols: ['Git Webhook Trigger', 'HTTPS Runner API', 'OCI Registry Push / TLS'],
    summary: {
      fr: 'Pipelines automatisés build, tests, sécurité et déploiement continu FinTech.',
      en: 'Automated build, test, security, and continuous delivery pipelines.',
    },
  },
  githubactions: {
    id: 'githubactions',
    name: 'GitHub Actions',
    years: 4,
    since: 2022,
    nodeIds: ['ci'],
    protocols: ['GitHub Events Webhook', 'OIDC Cloud Auth', 'OCI Registry / HTTPS'],
    summary: {
      fr: 'Chaînes CI/CD multi-environnements pour SaaS Québec et dépôts open source.',
      en: 'Multi-environment CI/CD workflows for Quebec SaaS and open source repositories.',
    },
  },
  docker: {
    id: 'docker',
    name: 'Docker',
    years: 7,
    since: 2019,
    nodeIds: ['registry'],
    protocols: ['OCI Registry HTTP v2', 'Docker Engine TLS Socket', 'Bridge Network / gRPC'],
    summary: {
      fr: 'Conteneurisation reproductible de microservices Java, PHP, Angular et bases.',
      en: 'Reproducible containerization of Java, PHP, Angular services and databases.',
    },
  },
  qa: {
    id: 'qa',
    name: 'Selenium QA',
    years: 5,
    since: 2020,
    nodeIds: ['qa'],
    protocols: ['W3C WebDriver / HTTP', 'Headless Chrome CDP', 'JUnit / CI Artifacts'],
    summary: {
      fr: 'Tests fonctionnels automatisés de bout en bout intégrés aux pipelines CI.',
      en: 'Automated end-to-end functional regression suites integrated in CI pipelines.',
    },
  },
};

const ALIASES: Record<string, string> = {
  web: 'angular',
  angular: 'angular',
  angularjs: 'angularjs',
  'white label': 'angular',
  'marque blanche': 'angular',
  backoffice: 'typescript',
  typescript: 'typescript',
  'html / css': 'typescript',
  extjs: 'extjs',
  rxjs: 'rxjs',
  mobile: 'mobile',
  kotlin: 'mobile',
  swift: 'mobile',
  rust: 'rust',
  solidjs: 'solidjs',
  gateway: 'gateway',
  'api gateway': 'gateway',
  rest: 'gateway',
  soap: 'soap',
  'soap → rest': 'soap',
  'api platform': 'apiplatform',
  transfer: 'transfer',
  'spring pay': 'payment',
  payment: 'payment',
  'spring boot': 'spring',
  microservices: 'spring',
  topup: 'java',
  java: 'java',
  'java / ddd': 'java',
  import: 'php',
  php: 'php',
  'symfony / php': 'symfony',
  symfony: 'symfony',
  laravel: 'laravel',
  bus: 'bus',
  rabbitmq: 'bus',
  postgres: 'postgres',
  postgresql: 'postgres',
  eventstore: 'eventstore',
  'axon cqrs': 'eventstore',
  'axon framework': 'eventstore',
  axon: 'eventstore',
  cqrs: 'eventstore',
  'event sourcing': 'eventstore',
  ddd: 'ddd',
  'clean architecture': 'ddd',
  'multi-tenant': 'ddd',
  rbac: 'ddd',
  bank: 'bank',
  'bank api': 'bank',
  'financial partners': 'bank',
  'partenaires financiers': 'bank',
  momo: 'momo',
  'mobile money': 'momo',
  fintech: 'momo',
  git: 'git',
  agile: 'git',
  'code reviews': 'git',
  'revues de code': 'git',
  ci: 'gitlab',
  'gitlab ci': 'gitlab',
  'github actions': 'githubactions',
  registry: 'docker',
  docker: 'docker',
  vagrant: 'docker',
  qa: 'qa',
  selenium: 'qa',
  'selenium qa': 'qa',
};

export function normalizeTechKey(key: string): string {
  const norm = key.trim().toLowerCase();
  return ALIASES[norm] ?? norm;
}

/** Retourne les métadonnées d'expérience (années) et protocoles de communication d'un outil ou nœud 3D. */
export function resolveTechSpec(key: string): TechSpec {
  const mapped = normalizeTechKey(key);
  if (TECH_SPECS[mapped]) return TECH_SPECS[mapped];
  for (const [k, v] of Object.entries(ALIASES)) {
    if (mapped.includes(k) && TECH_SPECS[v]) return TECH_SPECS[v];
  }
  return {
    id: mapped,
    name: key.trim(),
    years: 5,
    since: 2021,
    nodeIds: [],
    protocols: ['HTTPS / REST JSON', 'AMQP 0-9-1'],
    summary: {
      fr: 'Technologie mise en œuvre sur plateformes de production critiques.',
      en: 'Technology deployed in production on mission-critical platforms.',
    },
  };
}
