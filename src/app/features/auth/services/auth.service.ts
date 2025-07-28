import {inject, Injectable} from '@angular/core';
import {catchError} from 'rxjs/operators';
import {ApiService} from '../../../shared/services/api.service';
import {ApiAuthInterface} from '../interfaces/api-auth.interface';
import {Observable, of, tap} from 'rxjs';
import {UserInterface} from '../../../shared/interfaces/user.interface';
import {LocalStorageService} from '../../../shared/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiService: ApiService = inject(ApiService);
  localStorageService: LocalStorageService = inject(LocalStorageService);

  private readonly TOKEN_KEY = 'auth.token';

  login(email: string, password: string) {
    return this.apiService.callPost<ApiAuthInterface>('auth/sign-in', {email, password}).pipe(
      tap(response => {
        const token = response.accessToken;
        if (token) {
          this.saveToken(token);
        }
      })
    );
  }

  register(email: string, username: string, password: string) {
    return this.apiService.callPost<ApiAuthInterface>('auth/sign-up', {email, username, password}).pipe(
      tap(response => {
        const token = response.accessToken;
        if (token) {
          this.saveToken(token);
        }
      })
    );
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

  validateTokenAndGetUser(): Observable<UserInterface | null> {
    const token = this.getToken();
    if (!token) {
      return of(null);
    }

    return this.apiService.callGet<UserInterface>(`profile`).pipe(
      catchError(error => {
        this.removeToken();
        return of(null);
      })
    );
  }
}
