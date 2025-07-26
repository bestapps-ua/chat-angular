import { Routes } from '@angular/router';
import appRoutes from './routes';

export const authRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: appRoutes.loginPage.split('/').pop(),
        loadComponent: () => import('../../pages/login/login')
          .then((m) => m.Login),
      },
      {
        path: appRoutes.registerPage.split('/').pop(),
        loadComponent: () => import('../../pages/register/register')
          .then((m) => m.Register),
      },
      {
        path: '',
        redirectTo: `/${appRoutes.loginPage}`,
        pathMatch: 'full',
      },
    ],
  },
];
