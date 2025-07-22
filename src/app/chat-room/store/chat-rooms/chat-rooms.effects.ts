import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import * as ChatRoomsActions from './chat-rooms.actions';
import {ChatRoomsService} from '../../services/chat-rooms.service';

@Injectable()
export class ChatRoomsEffects {
  private actions$: Actions = inject(Actions);

  constructor(
    private chatRoomsService: ChatRoomsService
  ) {
    console.log('ChatRoomsEffects constructor called.');
    console.log('Actions instance:', this.actions$);
    console.log('ChatRoomsService instance:', this.chatRoomsService);

  }

  loadChatRooms$ = createEffect(() =>

    this.actions$.pipe(
      ofType(ChatRoomsActions.loadChatRooms),
      mergeMap(() =>
        this.chatRoomsService.getChatRooms().pipe(
          map((chatRooms) => {
            console.log('[CHAT ROOM s]', chatRooms);
            return ChatRoomsActions.loadChatRoomsSuccess({chatRooms})
          }),
          catchError((error) =>
            of(ChatRoomsActions.loadChatRoomsFailure({error: error.message}))
          )
        )
      )
    )
  );
}

