import {Component, inject, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../entities/store';
import {ChatRoomInterface} from '../../../chat-room/interfaces/chat-room.interface';
import {ChatMessagesActions} from '../../../../entities/store/chat-messages/chat-messages.actions';
import {ChatMessageInterface} from '../../interfaces/chat-message.interface';
import {Observable} from 'rxjs';
import {selectSelectedChatRoom} from '../../../../entities/store/chat-rooms/chat-rooms.selectors';
import {selectAll, selectChatMessagesState} from '../../../../entities/store/chat-messages/chat-messages.selectors';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-chat-room-messages',
  imports: [
    AsyncPipe
  ],
  templateUrl: './chat-room-messages-component.html',
  styleUrl: './chat-room-messages-component.css'
})
export class ChatRoomMessagesComponent implements OnInit {
  @Input() chatRoom!: ChatRoomInterface;

  private store = inject(Store<AppState>);

  public messages$: Observable<ChatMessageInterface[]> = this.store.select(selectAll);

  ngOnInit(): void {
    this.store.dispatch(ChatMessagesActions.load({chatRoom: this.chatRoom}))
  }
}
