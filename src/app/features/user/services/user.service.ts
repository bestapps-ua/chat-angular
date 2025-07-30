import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {UserInterface} from '../interfaces/user.interface';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  getPublicKeysForConversation(conversationId: string): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>(`${this.apiUrl}/conversation/${conversationId}/public-keys`);
  }
}
