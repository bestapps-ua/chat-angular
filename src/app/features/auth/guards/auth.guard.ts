import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {inject} from "@angular/core";
import {selectAuthenticated} from '../../../entities/store/auth/auth.selectors';
import {Store} from '@ngrx/store';
import {AppState} from '../../../entities/store';
import {Observable, take} from 'rxjs';
import {map} from 'rxjs/operators';
import appRoutes from '../../../shared/routes/routes';

export const authGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const store = inject(Store<AppState>);
  return store.select(selectAuthenticated).pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
         return router.parseUrl(`/${appRoutes.authRoute}`);
      }
    })
  );
};

