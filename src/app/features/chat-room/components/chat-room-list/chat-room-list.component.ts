import {Component, Inject, inject, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {ChatRoomInterface} from '../../interfaces/chat-room.interface';
import {ChatRoomsActions} from '../../../../entities/store/chat-rooms/chat-rooms.actions';

import {AsyncPipe} from '@angular/common';
import {AppState} from '../../../../entities/store';
import {
  selectAll,
  selectChatRoomsError,
  selectChatRoomsLoading,
  selectSelectedChatRoom
} from '../../../../entities/store/chat-rooms/chat-rooms.selectors';
import {ChatRoomsService} from '../../services/chat-rooms.service';

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

  chatRoomsService: ChatRoomsService = inject(ChatRoomsService);

  ngOnInit(): void {
    this.store.dispatch(ChatRoomsActions.load());
  }

  onSelectRoom(roomId: string): void {
    this.store.dispatch(ChatRoomsActions.selectRoom({roomId}));
  }
}
