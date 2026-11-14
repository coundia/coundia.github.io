import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ContentService } from '../core/content.service';
import { Lang } from '../core/models';
import { SeoService } from '../core/seo.service';

/** CV généré depuis les mêmes JSON que le site, mis en page pour l'impression / l'export PDF. */
@Component({
  selector: 'app-cv-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  styleUrl: './cv.page.css',
  templateUrl: './cv.page.html',
})
export class CvPage {
  protected readonly content = inject(ContentService);
  protected readonly t = this.content.t;
  protected readonly profile = this.content.profile;

  constructor() {
    this.content.setLang(inject(ActivatedRoute).snapshot.data['lang'] as Lang);
    inject(SeoService).update({
      title: this.t().meta.cvTitle,
      description: this.profile().tagline,
      path: this.content.cvPath(),
    });
  }

  protected print(): void {
    window.print();
  }
}
