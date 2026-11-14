import { Routes } from '@angular/router';

const home = () => import('./pages/home.page').then((m) => m.HomePage);
const caseStudy = () => import('./pages/case-study.page').then((m) => m.CaseStudyPage);
const cv = () => import('./pages/cv.page').then((m) => m.CvPage);
const notFound = () => import('./pages/not-found.page').then((m) => m.NotFoundPage);

export const routes: Routes = [
  { path: '', loadComponent: home, data: { lang: 'fr' } },
  { path: 'projets/:slug', loadComponent: caseStudy, data: { lang: 'fr' } },
  { path: 'cv', loadComponent: cv, data: { lang: 'fr' } },
  { path: 'en', loadComponent: home, data: { lang: 'en' } },
  { path: 'en/projects/:slug', loadComponent: caseStudy, data: { lang: 'en' } },
  { path: 'en/cv', loadComponent: cv, data: { lang: 'en' } },
  { path: '404', loadComponent: notFound },
  { path: '**', loadComponent: notFound },
];
