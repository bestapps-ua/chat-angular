import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http: HttpClient = inject(HttpClient);
  public apiUrl = environment.apiUrl;

  private initHeaders(reqOpts: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams(),
      };
    }

    if (!reqOpts.headers) {
      reqOpts.headers = new HttpHeaders();
    }
  }

  get<T>(endpoint = '', params: any = {}, reqOpts: { [key: string]: any }): Observable<T> {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams(),
      };
    }
    if (params) {
      reqOpts['params'] = new HttpParams();

      Object.keys(params).forEach((key) => {
        // @ts-ignore
        reqOpts.params = reqOpts.params.set(key, params[key]);
      });
    }
    this.initHeaders(reqOpts);
    return this.http.get<T>(this.apiUrl + '/' + endpoint, reqOpts);
  }

  post<T>(endpoint: string, body: unknown = {}, reqOpts: { [key: string]: any }): Observable<T> {
    this.initHeaders(reqOpts);
    return this.http.post<T>(this.apiUrl + '/' + endpoint, body, reqOpts);
  }

  put<T>(endpoint: string, body: unknown, reqOpts: { [key: string]: any }): Observable<T> {
    this.initHeaders(reqOpts);
    return this.http.put<T>(this.apiUrl + '/' + endpoint, body, reqOpts);
  }

  delete<T>(endpoint: string, reqOpts: { [key: string]: any }): Observable<T> {
    this.initHeaders(reqOpts);
    return this.http.delete<T>(this.apiUrl + '/' + endpoint, reqOpts);
  }

  patch<T>(endpoint: string, body: unknown, reqOpts: { [key: string]: any }): Observable<T> {
    this.initHeaders(reqOpts);
    return this.http.patch<T>(this.apiUrl + '/' + endpoint, body, reqOpts);
  }

  call<T>(type: string, url: string, params: any = {}, reqOpts: { [key: string]: any }): Observable<T> {
    switch (type) {
      case 'get':
        return this.get<T>(url, params, reqOpts);
      case 'post':
        return this.post<T>(url, params, reqOpts);
      case 'put':
        return this.put<T>(url, params, reqOpts);
      case 'delete':
        return this.delete<T>(url, reqOpts);
      case 'patch':
        return this.patch<T>(url, params, reqOpts);
      default:
        throw new Error('Unsupported HTTP method: ' + type);
    }
  }

  callPost<T>(url: string, params: any = {}, reqOpts: { [key: string]: any } = {}): Observable<T> {
    return this.post<T>(url, params, reqOpts);
  }

  callGet<T>(url: string, params: any = {}, reqOpts: { [key: string]: any } = {}): Observable<T> {
    return this.get<T>(url, params, reqOpts);
  }

  callDelete<T>(url: string, params: any = {}, reqOpts: { [key: string]: any } = {}): Observable<T> {
    return this.delete<T>(url, reqOpts);
  }

  callPut<T>(url: string, params: any = {}, reqOpts: { [key: string]: any } = {}): Observable<T> {
    return this.put<T>(url, params, reqOpts);
  }

}
