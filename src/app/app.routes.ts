import { Routes } from '@angular/router';
import {
  AuthErrorPage,
  ForbiddenPage,
  NotFoundPage,
  ServerErrorPage,
} from '@fhss-web-team/frontend-utils';
import { HomePage } from './pages/home/home.page';

export const routes: Routes = [
  { path: 'server-error', component: ServerErrorPage },
  { path: 'forbidden', component: ForbiddenPage },
  { path: 'auth-error', component: AuthErrorPage },
  { path: '', pathMatch: 'full', component: HomePage },
  { path: '**', component: NotFoundPage },
];
