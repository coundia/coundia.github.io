import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  viewChild,
} from '@angular/core';

import { Layer, SceneNode, Vec3 } from '../core/models';
import { SystemService } from './system.service';
import { isoProject, labelAnchor, linkRoute, nodeMap } from './iso';
import { LogoShape, resolveTechLogo } from './tech-logos';

interface Face {
  cls: 'top' | 'left' | 'right' | 'screen';
  d: string;
}

interface FallbackNode {
  id: string;
  layers: Layer[];
  faces: Face[];
  icon: { x: number; y: number; size: number; shapes: LogoShape[]; color: string };
  label: { x: number; y: number; w: number; text: string };
}

interface Fallback {
  viewBox: string;
  grid: string;
  links: { d: string; layers: Layer[] }[];
  nodes: FallbackNode[];
}

const r = (n: number) => Math.round(n * 1000) / 1000;
const pt = (v: Vec3) => isoProject(v).map(r).join(' ');
const poly = (points: Vec3[]) => `M${points.map(pt).join('L')}Z`;

/**
 * Architecture en isométrie. Le repli SVG (aplats, même projection, mêmes données que la scène 3D)
 * est pré-rendu dans le HTML : il s'affiche sans JavaScript, sans WebGL, en mouvement réduit
 * et pendant le chargement de Three.js, avec les vrais logos vectoriels des technologies.
 */
@Component({
  selector: 'app-system',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './system.component.css',
  template: `
    <svg class="fallback" [attr.viewBox]="fb.viewBox" role="img" [attr.aria-label]="label()">
      <path class="grid" [attr.d]="fb.grid" />
      @for (link of fb.links; track $index) {
        <path class="link" [class.is-active]="isActive(link.layers)" [attr.d]="link.d" />
      }
      @for (node of fb.nodes; track node.id) {
        <g class="node" [class.is-active]="isActive(node.layers)">
          @for (face of node.faces; track $index) {
            <path [class]="face.cls" [attr.d]="face.d" />
          }
          <g [attr.transform]="'translate(' + node.icon.x + ',' + node.icon.y + ') scale(' + node.icon.size / 24 + ')'">
            @for (s of node.icon.shapes; track $index) {
              <path
                class="node__logo"
                [attr.d]="s.d"
                [attr.fill]="s.strokeWidth ? 'none' : (s.color ?? node.icon.color)"
                [attr.stroke]="s.strokeWidth ? (s.color ?? node.icon.color) : 'none'"
                [attr.stroke-width]="s.strokeWidth ?? null"
                [attr.fill-rule]="s.fillRule ?? null"
              />
            }
          </g>
        </g>
      }
      @for (node of fb.nodes; track node.id) {
        <g
          class="label"
          [class.is-active]="isActive(node.layers)"
          [class.is-hidden]="system.activeLayer() !== null && !isActive(node.layers)"
        >
          <rect [attr.x]="node.label.x - node.label.w / 2" [attr.y]="node.label.y - 0.36" [attr.width]="node.label.w" height="0.36" rx="0.03" />
          <text [attr.x]="node.label.x" [attr.y]="node.label.y - 0.11" text-anchor="middle">{{ node.label.text }}</text>
        </g>
      }
    </svg>
    <div #stage class="stage" aria-hidden="true"></div>
  `,
})
export class SystemComponent {
  readonly label = input.required<string>();

  protected readonly system = inject(SystemService);
  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  protected readonly fb = this.buildFallback();

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const unregister = this.system.register(this.stage().nativeElement);
      destroyRef.onDestroy(unregister);
    });
  }

  protected isActive(layers: Layer[]): boolean {
    const active = this.system.activeLayer();
    return active !== null && layers.includes(active);
  }

  private buildFallback(): Fallback {
    const config = this.system.config;
    const xs: number[] = [];
    const ys: number[] = [];
    const track = (v: Vec3) => {
      const [x, y] = isoProject(v);
      xs.push(x);
      ys.push(y);
    };

    const { halfX, halfZ, step } = config.grid;
    let grid = '';
    for (let x = -halfX; x <= halfX + 1e-6; x += step) grid += `M${pt([x, 0, -halfZ])}L${pt([x, 0, halfZ])}`;
    for (let z = -halfZ; z <= halfZ + 1e-6; z += step) grid += `M${pt([-halfX, 0, z])}L${pt([halfX, 0, z])}`;
    [[-halfX, 0, -halfZ], [halfX, 0, -halfZ], [-halfX, 0, halfZ], [halfX, 0, halfZ]].forEach((c) => track(c as Vec3));

    const byId = nodeMap(config);
    const links = config.links.map((link) => ({
      d: linkRoute(link, byId)
        .map((p, i) => `${i ? 'L' : 'M'}${pt(p)}`)
        .join(''),
      layers: link.layers,
    }));

    const sorted = [...config.nodes].sort(
      (a, b) => a.position[0] + a.position[1] - (b.position[0] + b.position[1]),
    );
    const nodes = sorted.map((node) => {
      const anchor = labelAnchor(node);
      track(anchor);
      const [lx, ly] = isoProject(anchor);
      const logo = resolveTechLogo(node.id);
      const iconCenterY = node.kind === 'screen' ? node.size[1] * 0.5 : node.size[1];
      const iconCenterZ = node.kind === 'screen' ? node.position[1] + node.size[2] / 2 : node.position[1];
      const [ix, iy] = isoProject([node.position[0], iconCenterY, iconCenterZ]);
      const iconSize = 0.44;
      return {
        id: node.id,
        layers: node.layers,
        faces: node.kind === 'cylinder' ? this.cylinder(node) : this.box(node),
        icon: {
          x: r(ix - iconSize / 2),
          y: r(iy - iconSize / 2),
          size: iconSize,
          shapes: logo.shapes,
          color: logo.color,
        },
        label: { x: r(lx), y: r(ly), w: r(node.label.length * 0.145 + 0.25), text: node.label },
      };
    });

    const pad = 0.7;
    const minX = Math.min(...xs) - pad;
    const minY = Math.min(...ys) - pad;
    const w = Math.max(...xs) - Math.min(...xs) + pad * 2;
    const h = Math.max(...ys) - Math.min(...ys) + pad * 2;
    return { viewBox: `${r(minX)} ${r(minY)} ${r(w)} ${r(h)}`, grid, links, nodes };
  }

  private box(node: SceneNode): Face[] {
    const [cx, cz] = node.position;
    const [w, h, d] = node.size;
    const [x0, x1, z0, z1] = [cx - w / 2, cx + w / 2, cz - d / 2, cz + d / 2];
    return [
      { cls: 'top', d: poly([[x0, h, z0], [x1, h, z0], [x1, h, z1], [x0, h, z1]]) },
      { cls: 'right', d: poly([[x1, 0, z0], [x1, h, z0], [x1, h, z1], [x1, 0, z1]]) },
      {
        cls: node.kind === 'screen' ? 'screen' : 'left',
        d: poly([[x0, 0, z1], [x1, 0, z1], [x1, h, z1], [x0, h, z1]]),
      },
    ];
  }

  private cylinder(node: SceneNode): Face[] {
    const [cx, cz] = node.position;
    const [radius, h] = node.size;
    const [tx, ty] = isoProject([cx, h, cz]);
    const [, by] = isoProject([cx, 0, cz]);
    const ry = radius / Math.sqrt(3);
    const side =
      `M${r(tx - radius)} ${r(ty)}L${r(tx - radius)} ${r(by)}` +
      `A${r(radius)} ${r(ry)} 0 0 0 ${r(tx + radius)} ${r(by)}L${r(tx + radius)} ${r(ty)}Z`;
    const top =
      `M${r(tx - radius)} ${r(ty)}A${r(radius)} ${r(ry)} 0 1 0 ${r(tx + radius)} ${r(ty)}` +
      `A${r(radius)} ${r(ry)} 0 1 0 ${r(tx - radius)} ${r(ty)}Z`;
    return [
      { cls: 'left', d: side },
      { cls: 'top', d: top },
    ];
  }
}
