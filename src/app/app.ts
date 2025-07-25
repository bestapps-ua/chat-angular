import { Component, signal, inject } from '@angular/core';

import {RouterOutlet} from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('chat-app');

  constructor() {

  }
}
