import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ContentService } from '../core/content.service';
import { MOTION, loadMotion, prefersReducedMotion, refreshScrollSoon } from '../core/motion';
import { MagneticDirective } from '../shared/magnetic.directive';
import { SystemService } from '../system/system.service';

type Status = 'idle' | 'sending' | 'success' | 'error' | 'unavailable';

/** 06 · Contact : fiche compacte à gauche face à la vue d'ensemble 3D. */
@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MagneticDirective],
  styleUrl: './contact.component.css',
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  private readonly content = inject(ContentService);
  private readonly system = inject(SystemService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly fb = inject(FormBuilder);
  private readonly injector = inject(Injector);
  private readonly result = viewChild<ElementRef<HTMLElement>>('result');

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
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => void this.system.focusCluster(null, '', true),
          onEnterBack: () => void this.system.focusCluster(null, '', true),
        });
      });
      refreshScrollSoon();
    });
  }

  protected readonly t = this.content.t;
  protected readonly profile = this.content.profile;
  protected readonly status = signal<Status>('idle');
  protected readonly submitted = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
    company: ['', Validators.maxLength(120)],
    type: ['freelance' as string, Validators.required],
    budget: ['', Validators.maxLength(120)],
    message: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(5000)]],
    website: [''],
  });

  protected error(field: 'name' | 'email' | 'message'): string | null {
    const control = this.form.controls[field];
    if (!(control.invalid && (control.touched || this.submitted()))) return null;
    const c = this.t().contact;
    if (control.hasError('required')) return c.required;
    if (control.hasError('email')) return c.invalidEmail;
    if (control.hasError('minlength')) return c.minMessage;
    return c.required;
  }

  protected async submit(): Promise<void> {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      document.querySelector<HTMLElement>('.field--invalid input, .field--invalid textarea')?.focus();
      return;
    }
    const { website, ...payload } = this.form.getRawValue();
    if (website) {
      this.finish('success');
      return;
    }

    const endpoint = this.content.site.formEndpoint;
    if (!endpoint) {
      const email = this.profile().email;
      if (email) {
        const subject = encodeURIComponent(`[${payload.type}] ${payload.name}`);
        const body = encodeURIComponent(`${payload.message}\n\n- ${payload.name} (${payload.email})`);
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
        this.finish('success');
      } else {
        this.finish('unavailable');
      }
      return;
    }

    this.status.set('sending');
    try {
      const body = new FormData();
      body.append('access_key', this.content.site.formAccessKey);
      body.append('subject', `[Portfolio] ${payload.type} - ${payload.name}`);
      body.append('from_name', 'Portfolio coundia.github.io');
      for (const [key, value] of Object.entries({ ...payload, lang: this.content.lang() })) body.append(key, value);
      const response = await fetch(endpoint, { method: 'POST', body });
      const result = (await response.json().catch(() => ({}))) as { success?: boolean };
      if (!response.ok || result.success === false) throw new Error(String(response.status));
      this.form.reset();
      this.submitted.set(false);
      this.finish('success');
    } catch {
      this.finish('error');
    }
  }

  private finish(status: Status): void {
    this.status.set(status);
    afterNextRender(
      async () => {
        const el = this.result()?.nativeElement;
        if (!el) return;
        el.focus();
        if (prefersReducedMotion()) return;
        const { gsap } = await loadMotion();
        gsap.fromTo(
          el,
          { clipPath: 'inset(0% 100% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: MOTION.duration.m, ease: MOTION.ease.inOut, clearProps: 'clipPath' },
        );
      },
      { injector: this.injector },
    );
  }
}
