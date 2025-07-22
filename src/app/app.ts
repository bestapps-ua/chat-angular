import { Component, signal, inject } from '@angular/core';

import {RouterOutlet} from '@angular/router';
import {ChatRoomListComponent} from './chat-room/components/chat-room-list/chat-room-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatRoomListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('chat-app');

  constructor() {

  }
}
