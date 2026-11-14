import { DOCUMENT, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import tokens from '../../data/tokens.json';
import { ScenePalette } from './models';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly theme = signal<Theme>(this.readInitial());

  /** Couleurs pleines de la scène 3D pour le thème courant. */
  scenePalette(theme: Theme = this.theme()): ScenePalette {
    return { ...tokens.scene[theme], bg: tokens.color[theme].bg };
  }

  toggle(): void {
    this.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  set(theme: Theme): void {
    this.theme.set(theme);
    const root = this.document.documentElement;
    root.setAttribute('data-theme', theme);
    this.document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', tokens.color[theme].bg);
    if (this.isBrowser) {
      try {
        localStorage.setItem('theme', theme);
      } catch {
        /* stockage indisponible : le thème reste valable pour la session */
      }
    }
  }

  private readInitial(): Theme {
    if (!this.isBrowser) return 'dark';
    return this.document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }
}
