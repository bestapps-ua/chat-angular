import {Component, inject, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ChatRoomInterface } from '../../interfaces/chat-room.interface';
import * as ChatRoomsActions from '../../store/chat-rooms/chat-rooms.actions';
import * as ChatRoomsSelectors from '../../store/chat-rooms/chat-rooms.selectors';
import {AsyncPipe} from '@angular/common';
import {AppState} from '../../../store';

@Component({
  selector: 'app-chat-room-list',
  templateUrl: './chat-room-list.component.html',
  imports: [
    AsyncPipe
  ],
  styleUrls: ['./chat-room-list.component.css'],
  standalone: true
})
export class ChatRoomListComponent implements OnInit {

  private store = inject(Store<AppState>);

  chatRooms$: Observable<ChatRoomInterface[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  selectedRoom$: Observable<ChatRoomInterface | null | undefined>;


  constructor() {

    this.chatRooms$ = this.store.select(ChatRoomsSelectors.selectAll);
    this.isLoading$ = this.store.select(ChatRoomsSelectors.selectChatRoomsLoading);
    this.error$ = this.store.select(ChatRoomsSelectors.selectChatRoomsError);
    this.selectedRoom$ = this.store.select(ChatRoomsSelectors.selectSelectedChatRoom);
    this.chatRooms$.subscribe((data) => {
      console.log('DATA', data);
    })
  }

  ngOnInit(): void {
    this.store.dispatch(ChatRoomsActions.loadChatRooms());
  }

  onSelectRoom(roomId: string): void {
    this.store.dispatch(ChatRoomsActions.selectChatRoom({ roomId }));
  }
}
