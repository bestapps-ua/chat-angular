import {Component, inject} from '@angular/core';
import {ChatRoomListComponent} from '../../features/chat-room/components/chat-room-list/chat-room-list.component';
import {
  ChatRoomMessagesComponent
} from '../../features/chat-message/components/chat-room-messages/chat-room-messages-component';
import {MenuComponent} from '../../widgets/menu/menu-component';
import {SearchComponent} from '../../widgets/search/search-component';
import {TopPanelComponent} from '../../widgets/top-panel/top-panel-component';
import {ChatMessageComponent} from '../../widgets/chat-message/chat-message-component';
import {ChatRoomsService} from '../../features/chat-room/services/chat-rooms.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-welcome',
  imports: [
    ChatRoomListComponent,
    ChatRoomMessagesComponent,
    MenuComponent,
    SearchComponent,
    TopPanelComponent,
    ChatMessageComponent,
    AsyncPipe
  ],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css'
})
export class Welcome {
  chatRoomsService: ChatRoomsService = inject(ChatRoomsService);
}
