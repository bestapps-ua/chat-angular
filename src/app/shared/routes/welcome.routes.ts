import { Routes } from '@angular/router';
import appRoutes from './routes';

export const welcomeRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: appRoutes.welcomePage.split('/').pop(),
        loadComponent: () => import('../../pages/welcome/welcome')
          .then((m) => m.Welcome),
      },
      {
        path: '',
        redirectTo: `/${appRoutes.welcomePage}`,
        pathMatch: 'full',
      },
    ],
  },
];
