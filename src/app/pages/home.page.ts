import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ContentService } from '../core/content.service';
import { Lang } from '../core/models';
import { SeoService } from '../core/seo.service';
import { ContactComponent } from '../sections/contact.component';
import { ExpertiseComponent } from '../sections/expertise.component';
import { HeroComponent } from '../sections/hero.component';
import { JourneyComponent } from '../sections/journey.component';
import { OpenSourceComponent } from '../sections/open-source.component';
import { StackComponent } from '../sections/stack.component';
import { WorkComponent } from '../sections/work.component';
import { TechIconComponent } from '../shared/tech-icon.component';
import { SystemComponent } from '../system/system.component';
import { SystemService } from '../system/system.service';

@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SystemComponent,
    TechIconComponent,
    HeroComponent,
    ExpertiseComponent,
    WorkComponent,
    JourneyComponent,
    OpenSourceComponent,
    StackComponent,
    ContactComponent,
  ],
  template: `
    <div class="world-stage">
      <app-system [label]="t().hero.sceneLabel" />
    </div>

    <div class="world-content" [class.is-pure-3d]="system.pure3dMode()">
      <app-hero />
      <app-expertise />
      <app-work />
      <app-journey />
      <app-open-source />
      <app-stack />
      <app-contact />
    </div>

    <aside class="world-hud" [attr.aria-label]="t().hero.explore">
      <div class="world-hud__info mono">
        @if (system.selectedTech(); as tech) {
          <span class="world-hud__node">
            <app-tech-icon [name]="tech.id" [size]="15" />
            <strong>{{ tech.name }} · {{ tech.years }}+ {{ t().hud.yearsExp }}</strong>
          </span>
        } @else if (inspectedNode(); as node) {
          <span class="world-hud__node">
            <app-tech-icon [name]="node.id" [size]="15" />
            <strong>{{ node.label }} · {{ system.techFor(node.id).years }}+ {{ t().hud.yearsExp }}</strong>
          </span>
        } @else if (system.activeCaption()) {
          <span class="world-hud__node">
            <strong>{{ system.activeCaption() }}</strong>
          </span>
        } @else {
          <span class="world-hud__hint">{{ t().hud.dragHint }}</span>
        }
      </div>

      <div class="world-hud__controls">
        <button
          type="button"
          class="hud-btn hud-btn--icon"
          [attr.aria-label]="t().hud.rotateLeft"
          [title]="t().hud.rotateLeft"
          (click)="system.rotate(-0.45)"
        >
          ↺
        </button>
        <button
          type="button"
          class="hud-btn hud-btn--icon"
          [attr.aria-label]="t().hud.rotateRight"
          [title]="t().hud.rotateRight"
          (click)="system.rotate(0.45)"
        >
          ↻
        </button>
        <button
          type="button"
          class="hud-btn hud-btn--icon"
          [attr.aria-label]="t().hud.zoomIn"
          [title]="t().hud.zoomIn"
          (click)="system.zoomBy(0.2)"
        >
          +
        </button>
        <button
          type="button"
          class="hud-btn hud-btn--icon"
          [attr.aria-label]="t().hud.zoomOut"
          [title]="t().hud.zoomOut"
          (click)="system.zoomBy(-0.2)"
        >
          −
        </button>
        <button
          type="button"
          class="hud-btn"
          [attr.aria-pressed]="system.autoOrbit()"
          (click)="system.toggleAutoOrbit()"
        >
          {{ t().hud.autoOrbit }}
        </button>
        <button type="button" class="hud-btn" (click)="system.resetView()">
          {{ t().hud.reset }}
        </button>
        <button
          type="button"
          class="hud-btn"
          [attr.aria-pressed]="system.pure3dMode()"
          (click)="system.togglePure3dMode()"
        >
          {{ system.pure3dMode() ? t().hud.pure3dExit : t().hud.pure3d }}
        </button>
      </div>
    </aside>

    @if (system.selectedTech(); as tech) {
      <aside class="tech-inspector" aria-live="polite" [attr.aria-label]="tech.name">
        <div class="tech-inspector__head">
          <div class="tech-inspector__title">
            <app-tech-icon [name]="tech.id" [size]="22" />
            <strong>{{ tech.name }}</strong>
          </div>
          <span class="mono tech-inspector__years">
            {{ tech.years }}+ {{ t().hud.yearsExp }} · {{ t().hud.since }} {{ tech.since }}
          </span>
          <button
            type="button"
            class="hud-btn hud-btn--icon"
            [attr.aria-label]="t().hud.closeInspector"
            (click)="system.selectTech(null)"
          >
            ✕
          </button>
        </div>

        <p class="tech-inspector__summary">{{ tech.summary[content.lang()] }}</p>

        <div class="tech-inspector__group">
          <p class="mono tech-inspector__label">{{ t().hud.protocols }}</p>
          <ul class="tech-inspector__protos">
            @for (proto of tech.protocols; track proto) {
              <li class="mono tech-inspector__proto">{{ proto }}</li>
            }
          </ul>
        </div>

        @if (activeConnections().length) {
          <div class="tech-inspector__group">
            <p class="mono tech-inspector__label">{{ t().hud.flows }}</p>
            <ul class="tech-inspector__flows">
              @for (conn of activeConnections(); track conn.direction + conn.peerLabel + conn.protocol) {
                <li class="tech-inspector__flow">
                  <span class="mono tech-inspector__peer">
                    {{ conn.direction === 'out' ? '→' : '←' }} {{ conn.peerLabel }}
                  </span>
                  <span class="mono tech-inspector__flow-proto">{{ conn.protocol }}</span>
                </li>
              }
            </ul>
          </div>
        }
      </aside>
    }
  `,
  styles: `
    .tech-inspector {
      position: fixed;
      right: var(--page-gutter);
      bottom: 68px;
      z-index: 40;
      width: min(400px, calc(100vw - 2 * var(--page-gutter)));
      max-height: min(62svh, 460px);
      overflow-y: auto;
      display: grid;
      gap: var(--space-3);
      padding: var(--space-4);
      border: 1px solid var(--color-border-strong);
      border-left: 4px solid var(--color-accent);
      border-radius: var(--radius-sm);
      background: var(--color-bg);
      box-shadow: var(--shadow-hard);
      pointer-events: auto;
    }

    .tech-inspector__head {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .tech-inspector__title {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-display);
      font-size: 1.05rem;
      margin-right: auto;
    }

    .tech-inspector__years {
      padding: 3px 8px;
      border: 1px solid var(--color-accent);
      border-radius: var(--radius-pill);
      background: var(--color-accent);
      color: var(--color-on-accent);
      font-size: 0.72rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .tech-inspector__summary {
      font-size: var(--fs-small);
      color: var(--color-text-muted);
      line-height: 1.45;
    }

    .tech-inspector__group {
      display: grid;
      gap: 6px;
      padding-top: var(--space-2);
      border-top: 1px solid var(--color-border);
    }

    .tech-inspector__label {
      font-size: 0.7rem;
      color: var(--color-accent);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .tech-inspector__protos {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .tech-inspector__proto {
      padding: 2px 8px;
      border: 1px solid var(--color-border-strong);
      border-radius: 3px;
      background: var(--color-surface-1);
      color: var(--color-text);
      font-size: 0.72rem;
    }

    .tech-inspector__flows {
      display: grid;
      gap: 4px;
    }

    .tech-inspector__flow {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-2);
      padding: 4px 8px;
      border-radius: 3px;
      background: var(--color-surface-1);
      font-size: 0.72rem;
    }

    .tech-inspector__peer {
      font-weight: 500;
      color: var(--color-text);
    }

    .tech-inspector__flow-proto {
      color: var(--color-accent);
      font-weight: 500;
      text-align: right;
    }

    @media (max-width: 1023.98px) {
      .tech-inspector {
        left: 50%;
        right: auto;
        bottom: 76px;
        transform: translateX(-50%);
      }
    }
  `,
})
export class HomePage {
  protected readonly content = inject(ContentService);
  protected readonly system = inject(SystemService);
  protected readonly t = this.content.t;

  protected readonly inspectedNode = computed(() => this.system.hoveredNode() ?? this.system.selectedNode());
  protected readonly activeConnections = computed(() => {
    const spec = this.system.selectedTech();
    return spec ? this.system.connectionsFor(spec) : [];
  });

  constructor() {
    this.content.setLang(inject(ActivatedRoute).snapshot.data['lang'] as Lang);
    const t = this.content.t();
    const seo = inject(SeoService);
    seo.update({
      title: t.meta.homeTitle,
      description: t.meta.homeDescription,
      path: this.content.homePath(),
      type: 'profile',
      jsonLd: seo.personJsonLd(),
    });
  }
}
