import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ChatRoomInterface } from '../interfaces/chat-room.interface';
import {delay, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomsService {
  private apiUrl = '/api/chatrooms';

  constructor(
    private http: HttpClient
  ) {

  }

  getChatRooms(): Observable<ChatRoomInterface[]> {

    const mockChatRooms: ChatRoomInterface[] = [
      { uid: '1', name: 'General Chat',},
      { uid: '2', name: 'Angular Devs',  },
      { uid: '3', name: 'NgRx Fanatics', },
    ];
    return of(mockChatRooms).pipe(
      delay(1000), // Simulate network latency
      map(data => {
        console.log('ChatRoomsService: Data being emitted from getChatRooms():', data);
        return data; // Ensure the full array is returned
      })
    );
  }
}
