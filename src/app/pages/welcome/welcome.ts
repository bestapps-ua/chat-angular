import { Component } from '@angular/core';
import {ChatRoomListComponent} from '../../features/chat-room/chat-room-list/chat-room-list.component';

@Component({
  selector: 'app-welcome',
  imports: [
    ChatRoomListComponent
  ],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css'
})
export class Welcome {

}
