import {inject, Injectable} from '@angular/core';
import {Observable, of, tap} from 'rxjs';
import {ChatRoomInterface} from '../interfaces/chat-room.interface';
import {ApiService} from '../../../shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomsService {
  apiService: ApiService = inject(ApiService);

  getChatRooms(): Observable<ChatRoomInterface[]> {
    return this.apiService.callGet<ChatRoomInterface[]>('chat/rooms');
  }
}
