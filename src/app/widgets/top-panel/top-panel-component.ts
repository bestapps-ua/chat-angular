import {Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {ChatRoomsService} from '../../features/chat-room/services/chat-rooms.service';

@Component({
  selector: 'app-top-panel',
  imports: [
    AsyncPipe
  ],
  templateUrl: './top-panel-component.html',
  styleUrl: './top-panel-component.css'
})
export class TopPanelComponent {
  chatRoomsService: ChatRoomsService = inject(ChatRoomsService);

}
