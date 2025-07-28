import {inject, Injectable} from '@angular/core';
import {HttpHandlerFn,  HttpRequest} from '@angular/common/http';
import {AuthService} from '../services/auth.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {

  const isAuthRequest = req.url.includes('/auth');
  if (isAuthRequest) {
    return next(req);
  }

  const token = inject(AuthService).getToken();

  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });

  return next(newReq);
}
