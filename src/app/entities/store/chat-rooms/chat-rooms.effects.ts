import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {ChatRoomsActions} from './chat-rooms.actions';
import {ChatRoomsService} from '../../../features/chat-room/services/chat-rooms.service';

@Injectable()
export class ChatRoomsEffects {
  private actions$: Actions = inject(Actions);
  private chatRoomsService: ChatRoomsService = inject(ChatRoomsService);

  loadChatRooms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatRoomsActions.load),
      mergeMap(() =>
        this.chatRoomsService.getChatRooms().pipe(
          map((chatRooms) => {
            return ChatRoomsActions.loadSuccess({chatRooms})
          }),
          catchError((error) =>
            of(ChatRoomsActions.loadFailure({error: error.message}))
          )
        )
      )
    )
  );
}

