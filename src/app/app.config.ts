import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideState, provideStore, Store} from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import {Actions, ofType, provideEffects} from '@ngrx/effects';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptors} from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {AppState, metaReducers, reducers} from './entities/store';
import {ChatRoomsEffects} from './entities/store/chat-rooms/chat-rooms.effects';
import {AuthEffects} from './entities/store/auth/auth.effects';
import {authInterceptor} from './features/auth/interceptors/auth.interceptor';
import {AuthActions} from './entities/store/auth/auth.actions';
import {finalize, firstValueFrom, of, race, take, tap} from 'rxjs';
import {map} from 'rxjs/operators';
import {AuthService} from './features/auth/services/auth.service';

async function initializeApp(): Promise<void> {
  const store = inject(Store<AppState>);
  const authService = inject(AuthService);

  try {
    store.dispatch(AuthActions.loadToken());
    const token = authService.getToken();
    if (token) {
      const user = await firstValueFrom(authService.validateTokenAndGetUser());
      if (user) {
        store.dispatch(AuthActions.loadTokenSuccess({ token, user }));
      }
    }
    return Promise.resolve();
  } catch (error) {
    return Promise.resolve();
  }
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideStore(reducers, { metaReducers }),

    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
    provideEffects([AuthEffects, ChatRoomsEffects]),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideAppInitializer(initializeApp),
  ]
};
