import {inject, Injectable} from '@angular/core';
import {catchError, map, pluck} from 'rxjs/operators';
import {ApiService} from '../../../shared/services/api.service';
import {ApiAuthInterface} from '../interfaces/api-auth.interface';
import {BehaviorSubject, Observable, of, switchMap, tap} from 'rxjs';
import {firstValueFrom} from 'rxjs';
import {ProfileInterface} from '../../../shared/interfaces/profileInterface';
import {LocalStorageService} from '../../../shared/services/local-storage.service';
import {CryptoService} from '../../crypto/services/crypto.service';
import { KeyStorageService } from '../../crypto/services/key-storage.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../../entities/store';
import {selectAuthUser} from '../../../entities/store/auth/auth.selectors';
import {toSignal} from '@angular/core/rxjs-interop';
import {AuthActions} from '../../../entities/store/auth/auth.actions';
import {UserInterface} from '../../user/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiService: ApiService = inject(ApiService);
  localStorageService: LocalStorageService = inject(LocalStorageService);
  cryptoService: CryptoService = inject(CryptoService);
  keyStorageService: KeyStorageService = inject(KeyStorageService);
  private userPrivateKeySubject = new BehaviorSubject<CryptoKey | null>(null);
  private store = inject(Store<AppState>);

  user$: Observable<ProfileInterface | null> = this.store.select(selectAuthUser);
  user = toSignal(this.user$);

  private readonly TOKEN_KEY = 'auth.token';

  public userPrivateKey$ = this.userPrivateKeySubject.asObservable();


  login(email: string, password: string) {
    return this.apiService.callPost<ApiAuthInterface>('auth/sign-in', {email, password}).pipe(
      tap(async response => {
        const token = response.accessToken;
        if (token) {
          try {
            const privateKey = await firstValueFrom(this.keyStorageService.loadPrivateKey(response.user.uid));
            this.userPrivateKeySubject.next(privateKey);
          } catch (error) {
            console.error('Failed to load private key:', error);
            this.userPrivateKeySubject.next(null);
          }
          this.saveToken(token);
        }
      })
    );
  }

  register(email: string, username: string, password: string) {
    return this.cryptoService.generateUserKeyPair().pipe(
      switchMap(keyPair => {
        this.userPrivateKeySubject.next(keyPair.privateKey);
        return this.cryptoService.exportKeyToPem(keyPair.publicKey, 'PUBLIC').pipe(
          switchMap(publicKeyPem => {
            return this.cryptoService.exportKeyToPem(keyPair.privateKey, 'PRIVATE').pipe(
              switchMap(privateKeyPem => {
                return this.apiService.callPost<ApiAuthInterface>('auth/sign-up',
                  {
                    email,
                    username,
                    password,
                    publicKey: publicKeyPem,
                  }
                ).pipe(
                  tap(response => {
                    this.keyStorageService.savePrivateKey(response.user.uid, privateKeyPem).subscribe({
                      next: () => console.log('Private key saved after registration.'),
                      error: err => console.error('Error saving private key:', err)
                    });

                    const token = response.accessToken;
                    if (token) {
                      this.saveToken(token);
                    }
                  })
                )
              })
            )
          }),
        )
      })
    )
  }

  saveToken(token: string): void {
    this.localStorageService.setItem(this.TOKEN_KEY, token);
  }


  getToken(): string | null {
    return this.localStorageService.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    this.localStorageService.removeItem(this.TOKEN_KEY);
  }

  validateTokenAndGetUser(): Observable<ProfileInterface | null> {
    const token = this.getToken();
    if (!token) {
      return of(null);
    }

    return this.apiService.callGet<ProfileInterface>(`profile`).pipe(
      catchError(error => {
        this.removeToken();
        return of(null);
      })
    );
  }

  getCurrentUserId(): string | undefined {
    return this.user()?.uid;
  }

  async loadProfile(user: ProfileInterface, token: string) {
    // Load private key directly from IndexedDB without password
    try {
      const privateKey = await firstValueFrom(this.keyStorageService.loadPrivateKey(user.uid));
      this.userPrivateKeySubject.next(privateKey);
      console.log('loadProfile called - private key loaded from IndexedDB');
    } catch (error) {
      console.error('Failed to load private key during profile load:', error);
      this.userPrivateKeySubject.next(null);
    }
    this.store.dispatch(AuthActions.loadTokenSuccess({ token, user }));
  }
}
