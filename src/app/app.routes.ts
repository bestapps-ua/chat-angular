import { Routes } from '@angular/router';
import appRoutes from './shared/routes/routes';
import {authGuard} from './features/auth/guards/auth.guard';
import {loginGuard} from './features/auth/guards/login.guard';

export const routes: Routes = [
  {
    path: appRoutes.authRoute,
    canActivate: [loginGuard],
    loadChildren: () => import('./shared/routes/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: appRoutes.welcomeRoute,
    canActivate: [authGuard],
    loadChildren: () => import('./shared/routes/welcome.routes').then((m) => m.welcomeRoutes),
  },
  {
    path: '',
    redirectTo: `/${appRoutes.welcomeRoute}`,
    pathMatch: 'full',
  },

];
