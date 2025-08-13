import {Component, inject, OnInit} from '@angular/core';
import {InputText} from 'primeng/inputtext';
import {Menubar} from 'primeng/menubar';
import {Ripple} from 'primeng/ripple';
import {MenuItem} from 'primeng/api';
import {ChatRoomsService} from '../../features/chat-room/services/chat-rooms.service';
import { DynamicDialogModule} from 'primeng/dynamicdialog';
import {Button} from 'primeng/button';
import {Menu} from 'primeng/menu';

@Component({
  selector: 'app-menu',
  imports: [
    DynamicDialogModule,
    Menu,
    Button,
  ],
  providers: [],
  templateUrl: './menu-component.html',
  styleUrl: './menu-component.css'
})
export class MenuComponent implements OnInit {
  items: MenuItem[] = [];

  chatRoomsService: ChatRoomsService = inject(ChatRoomsService);

  ngOnInit() {

    this.items = [
      {
        label: 'Create Chat',
        icon: 'pi pi-plus',
        command: () => this.createRoom(),
      },
    ];

  }

  createRoom() {
    this.chatRoomsService.create();
  }

  myFunction() {

  }
}
