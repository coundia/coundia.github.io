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

import { ContentService } from '../core/content.service';
import { Layer } from '../core/models';
import { loadMotion, refreshScrollSoon } from '../core/motion';
import { TechIconComponent } from '../shared/tech-icon.component';
import { SystemService } from '../system/system.service';

/**
 * 01 · Expertise : une seule carte focalisée à gauche, synchronisée 1-to-1 avec les couches 3D.
 */
@Component({
  selector: 'app-expertise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TechIconComponent],
  styleUrl: './expertise.component.css',
  templateUrl: './expertise.component.html',
})
export class ExpertiseComponent {
  private readonly content = inject(ContentService);
  protected readonly system = inject(SystemService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected readonly t = this.content.t;
  protected readonly expertise = this.content.expertise;
  protected readonly activeIndex = signal(0);
  protected readonly current = computed(() => this.expertise()[this.activeIndex()] ?? this.expertise()[0]);
  private userLocked = false;

  protected nodesFor(layer: Layer): string {
    return this.system.config.nodes
      .filter((n) => n.layers.includes(layer))
      .map((n) => n.label)
      .join(' · ');
  }

  protected selectIndex(index: number): void {
    this.userLocked = true;
    this.activate(index);
  }

  private activate(index: number): void {
    const item = this.expertise()[index];
    if (!item) return;
    this.activeIndex.set(index);
    void this.system.focus(item.id, true);
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
            const total = this.expertise().length;
            const idx = Math.min(total - 1, Math.max(0, Math.floor(self.progress * total)));
            if (idx !== this.activeIndex()) this.activate(idx);
          },
        });
      });
      refreshScrollSoon();
    });
  }
}
