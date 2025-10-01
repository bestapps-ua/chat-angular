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
import {AuthService} from './features/auth/services/auth.service';
import {providePrimeNG} from 'primeng/config';
import Lara from '@primeuix/themes/lara';
import {DialogService} from 'primeng/dynamicdialog';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {definePreset} from '@primeuix/themes';
import {ChatMessagesEffects} from './entities/store/chat-messages/chat-messages.effects';
import {KeyStorageService} from './features/crypto/services/key-storage.service';

async function initializeApp(): Promise<void> {
  const store = inject(Store<AppState>);
  const authService = inject(AuthService);

  try {
    store.dispatch(AuthActions.loadToken());
    const token = authService.getToken();
    if (token) {
      const user = await firstValueFrom(authService.validateTokenAndGetUser());
      if (user) {
        await authService.loadProfile(user, token);
      }
    }
    return Promise.resolve();
  } catch (error) {
    return Promise.resolve();
  }
}

const MyPreset = definePreset(Lara, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}'
    }
  }
});

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
    provideEffects([AuthEffects, ChatRoomsEffects, ChatMessagesEffects]),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideAppInitializer(initializeApp),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: 'light',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng'
          }
        },
      },
      ripple: true,                 // optional configuration
      inputVariant: 'filled'        // optional
    }),
    DialogService,
    provideAnimationsAsync(),
  ]
};
