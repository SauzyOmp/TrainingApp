import { Routes } from '@angular/router';
import {
  AuthErrorPage,
  ForbiddenPage,
  NotFoundPage,
  ServerErrorPage,
} from '@fhss-web-team/frontend-utils';
import { HomePage } from './pages/home/home.page';
import { ByuLayout } from './layouts/byu/byu.layout';

export const routes: Routes = [
  { path: 'server-error', component: ServerErrorPage },
  { path: 'forbidden', component: ForbiddenPage },
  { path: 'auth-error', component: AuthErrorPage },
  { path: '',
    component: ByuLayout,
    children: [
      { path: '', component: HomePage }
    ],
  },
  { path: '**', component: NotFoundPage },
];
