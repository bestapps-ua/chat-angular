import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {exhaustMap, of, tap} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {AuthService} from '../../../features/auth/services/auth.service';
import {AuthActions} from './auth.actions';
import {Router} from '@angular/router';
import appRoutes from '../../../shared/routes/routes';


@Injectable()
export class AuthEffects {
  private actions$: Actions = inject(Actions);
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);


  login$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(AuthActions.login),
        exhaustMap(action =>
          this.authService.login(action.email, action.password).pipe(
            map((data) => {
              return AuthActions.loginSuccess({token: data.access_token, user: {email: '', role: '', uid: ''}})
            }),
            catchError((error) =>
              of(AuthActions.loginFailure({error: error.error?.message || error.error}))
            )
          )
        )
      )
    }
  );

  register$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(AuthActions.register),
        exhaustMap(action =>
          this.authService.register(action.email, action.username, action.password).pipe(
            map((data) => {
              return AuthActions.registerSuccess({token: data.access_token, user: {email: '', role: '', uid: ''}})
            }),
            catchError((error) =>
              of(AuthActions.registerFailure({error: error.error?.message || error.error}))
            )
          )
        )
      )
    }
  );

  loginSuccessRedirect$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          this.router.navigate([`/${appRoutes.welcomeRoute}`]);
        })
      ),
    {dispatch: false}
  );

  registerSuccessRedirect$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => {
          this.router.navigate([`/${appRoutes.welcomeRoute}`]);
        })
      ),
    {dispatch: false}
  );
}

