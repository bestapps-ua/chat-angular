import {inject, Injectable} from '@angular/core';
import {Observable, of, tap} from 'rxjs';
import {ChatRoomInterface} from '../interfaces/chat-room.interface';
import {ApiService} from '../../../shared/services/api.service';
import {
  selectAll,
  selectChatRoomsError,
  selectChatRoomsLoading,
  selectSelectedChatRoom
} from '../../../entities/store/chat-rooms/chat-rooms.selectors';
import {Store} from '@ngrx/store';
import {AppState} from '../../../entities/store';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ChatCreateComponent} from '../../../widgets/chat-create/chat-create-component';
import {DialogFooterComponent} from '../../../widgets/dialog/dialog-footer/dialog-footer-component';
import {ChatRoomKeyInterface} from '../interfaces/chat-room-key.interface';



@Injectable({
  providedIn: 'root',

})
export class ChatRoomsService {
  apiService: ApiService = inject(ApiService);
  dialogService: DialogService = inject(DialogService);

  private store = inject(Store<AppState>);

  chatRooms$: Observable<ChatRoomInterface[]> = this.store.select(selectAll);
  isLoading$: Observable<boolean> = this.store.select(selectChatRoomsLoading);
  error$: Observable<string | null> = this.store.select(selectChatRoomsError);
  selectedRoom$: Observable<ChatRoomInterface | null | undefined> = this.store.select(selectSelectedChatRoom);

  ref: DynamicDialogRef | undefined;

  getChatRooms(): Observable<ChatRoomInterface[]> {
    return this.apiService.callGet<ChatRoomInterface[]>('chat/rooms');
  }

  createChatRoom(name: string): Observable<ChatRoomInterface> {
    return this.apiService.callPost<ChatRoomInterface>('chat/rooms', {name, type: 'public'});
  }

  create() {
    this.ref = this.dialogService.open(ChatCreateComponent, {
      header: 'New Room',
      width: '50vw',
      modal: true,
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      data: {
        buttons: [
          { label: 'Save', icon: 'pi pi-check', action: 'save' },
          { label: 'Close', icon: 'pi pi-times', styleClass: 'p-button-secondary', action: 'close' },
        ],
      },
      templates: {
        footer: DialogFooterComponent,
      }
    });

    this.ref.onClose.subscribe((data: Partial<ChatRoomInterface>) => {
      if (data) {
        console.log(data);
      }
    });
  }

  getRoomPublicKeys(roomId: string): Observable<ChatRoomKeyInterface[]> {
    console.log('HERE');
    return this.apiService.callGet<ChatRoomKeyInterface[]>(`chat/rooms/${roomId}/public-keys`);
  }
}
