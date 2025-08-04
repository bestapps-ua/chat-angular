import { Component } from '@angular/core';
import {ChatRoomListComponent} from '../../features/chat-room/components/chat-room-list/chat-room-list.component';
import {
  ChatRoomMessagesComponent
} from '../../features/chat-message/components/chat-room-messages/chat-room-messages-component';
import {MenuComponent} from '../../widgets/menu/menu-component';
import {SearchComponent} from '../../widgets/search/search-component';
import {TopPanelComponent} from '../../widgets/top-panel/top-panel-component';

@Component({
  selector: 'app-welcome',
  imports: [
    ChatRoomListComponent,
    ChatRoomMessagesComponent,
    MenuComponent,
    SearchComponent,
    TopPanelComponent
  ],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css'
})
export class Welcome {

}
