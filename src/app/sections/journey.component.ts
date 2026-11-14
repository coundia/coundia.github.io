import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentService } from '../core/content.service';
import { loadMotion, refreshScrollSoon } from '../core/motion';
import { TechIconComponent } from '../shared/tech-icon.component';
import { SystemService } from '../system/system.service';

const EXPERIENCE_CLUSTERS: Record<string, string[]> = {
  consultant: ['web', 'gateway', 'transfer', 'postgres', 'registry'],
  devalto: ['web', 'gateway', 'import', 'postgres', 'registry', 'qa'],
  atps: ['web', 'mobile', 'gateway', 'transfer', 'payment', 'bank', 'momo', 'ci'],
  'money-express': ['web', 'import', 'payment', 'momo'],
};

/** 03 · Parcours : une expérience active à la fois, synchronisée avec les nœuds 3D associés. */
@Component({
  selector: 'app-journey',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TechIconComponent],
  styleUrl: './journey.component.css',
  templateUrl: './journey.component.html',
})
export class JourneyComponent {
  protected readonly content = inject(ContentService);
  protected readonly system = inject(SystemService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected readonly t = this.content.t;
  protected readonly experiences = this.content.experiences;
  protected readonly activeIndex = signal(0);
  protected readonly current = computed(() => this.experiences()[this.activeIndex()] ?? this.experiences()[0]);
  private userLocked = false;

  protected nodesLabel(id: string): string {
    return this.system.nodeLabelsFor(EXPERIENCE_CLUSTERS[id] ?? []).join(' · ');
  }

  protected selectIndex(index: number): void {
    this.userLocked = true;
    this.activate(index);
  }

  private activate(index: number): void {
    const exp = this.experiences()[index];
    if (!exp) return;
    this.activeIndex.set(index);
    const nodes = EXPERIENCE_CLUSTERS[exp.id] ?? null;
    const caption = exp.company ? `${exp.role} · ${exp.company}` : exp.role;
    void this.system.focusCluster(nodes, caption, true);
  }

  constructor() {
    const destroyRef = inject(DestroyRef);
    let revert: (() => void) | undefined;
    destroyRef.onDestroy(() => revert?.());

    afterNextRender(async () => {
      const { gsap, ScrollTrigger } = await loadMotion();
      const mm = gsap.matchMedia();
      revert = () => mm.revert();

      mm.add('all', () => {
        ScrollTrigger.create({
          trigger: this.host,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => {
            this.userLocked = false;
            this.activate(this.activeIndex());
          },
          onEnterBack: () => {
            this.userLocked = false;
            this.activate(this.activeIndex());
          },
          onUpdate: (self) => {
            if (this.userLocked || !self.isActive) return;
            const total = this.experiences().length;
            const idx = Math.min(total - 1, Math.max(0, Math.floor(self.progress * total)));
            if (idx !== this.activeIndex()) this.activate(idx);
          },
        });
      });

      refreshScrollSoon();
    });
  }
}
