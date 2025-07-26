import {inject, Injectable} from '@angular/core';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../../../shared/services/api.service';
import {ApiAuthInterface} from '../interfaces/api-auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiService: ApiService = inject(ApiService);

  login(email: string, password: string) {
    return this.apiService.callPost<ApiAuthInterface>('auth/sign-in', {email, password});
  }

  register(email: string, username: string, password: string) {
    return this.apiService.callPost<ApiAuthInterface>('auth/sign-up', {email, username, password});
  }
}
