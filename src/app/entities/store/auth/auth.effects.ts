import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {exhaustMap, finalize, of, switchMap, tap} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {AuthService} from '../../../features/auth/services/auth.service';
import {AuthActions} from './auth.actions';
import {Router} from '@angular/router';
import appRoutes from '../../../shared/routes/routes';
import {getErrorMessage} from '../../helpers/error.message';


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
              return AuthActions.loginSuccess({token: data.accessToken, user: data.user})
            }),
            catchError((error) =>
              of(AuthActions.loginFailure({error: getErrorMessage(error)}))
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
              return AuthActions.registerSuccess({token: data.accessToken, user: {email: '', role: '', uid: ''}})
            }),
            catchError((error) =>
              of(AuthActions.registerFailure({error: getErrorMessage(error)}))
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


  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.authService.removeToken();
        this.router.navigate([`/${appRoutes.authRoute}`])
      }),
      map(() => AuthActions.clearToken())
    )
  );


  loadToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadToken),
      switchMap(() => {
        const token = this.authService.getToken();

        if (token) {
          return this.authService.validateTokenAndGetUser().pipe(
            map(user => {
              if (user) {
                return AuthActions.loadTokenSuccess({token, user});
              } else {
                return AuthActions.loadTokenFailure({error: 'Invalid or expired token'})
              }
            }),
            catchError(error => {
              return of(AuthActions.loadTokenFailure({error}));
            }),
          );
        } else {
          return of(AuthActions.loadTokenFailure({error: 'No token found in local storage'}));
        }
      }),
    )
  );
}

