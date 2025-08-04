import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {exhaustMap, of, tap} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {ChatRoomsActions} from './chat-rooms.actions';
import {ChatRoomsService} from '../../../features/chat-room/services/chat-rooms.service';
import {getErrorMessage} from '../../helpers/error.message';
import {DialogEventService} from '../../../shared/services/dialog-event.service';

@Injectable()
export class ChatRoomsEffects {
  private actions$: Actions = inject(Actions);
  private chatRoomsService: ChatRoomsService = inject(ChatRoomsService);
  private dialogEventService: DialogEventService = inject(DialogEventService);

  loadChatRooms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatRoomsActions.load),
      mergeMap(() =>
        this.chatRoomsService.getChatRooms().pipe(
          map((chatRooms) => {
            return ChatRoomsActions.loadSuccess({chatRooms})
          }),
          catchError((error) =>
            of(ChatRoomsActions.loadFailure({error: getErrorMessage(error)}))
          )
        )
      )
    )
  );

  createChatRoom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatRoomsActions.create),
      exhaustMap(action =>
        this.chatRoomsService.createChatRoom(action.name).pipe(
          map((chatRoom) => {
            this.dialogEventService.emitSuccess();
            return ChatRoomsActions.createSuccess({chatRoom})
          }),
          catchError((error) =>
            of(ChatRoomsActions.createFailure({error: getErrorMessage(error)})).pipe(
              tap(error => {
                this.dialogEventService.emitError(error)
              })
            )
          )
        )
      )
    )
  );
}

