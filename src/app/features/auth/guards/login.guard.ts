import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {inject} from "@angular/core";

import {Observable, take} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../entities/store';
import {selectAuthenticated} from '../../../entities/store/auth/auth.selectors';
import {map} from 'rxjs/operators';
import appRoutes from '../../../shared/routes/routes';

export const loginGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const router: Router = inject(Router);
  const store: Store<AppState> = inject(Store<AppState>);

  return store.select(selectAuthenticated).pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return router.parseUrl(`/${appRoutes.welcomeRoute}`);
      }
      return true;
    })
  );
};
