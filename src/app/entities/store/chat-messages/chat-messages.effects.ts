import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {from, of} from 'rxjs';
import {firstValueFrom} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {getErrorMessage} from '../../helpers/error.message';
import {DialogEventService} from '../../../shared/services/dialog-event.service';
import {ChatMessageService} from '../../../features/chat-message/services/chat-message.service';
import {ChatMessagesActions} from './chat-messages.actions';
import {ChatRoomsService} from '../../../features/chat-room/services/chat-rooms.service';
import {ChatRoomKeyInterface} from '../../../features/chat-room/interfaces/chat-room-key.interface';

@Injectable()
export class ChatMessagesEffects {
  private actions$: Actions = inject(Actions);
  private chatMessageService: ChatMessageService = inject(ChatMessageService);
  private chatRoomsService: ChatRoomsService = inject(ChatRoomsService);
  private dialogEventService: DialogEventService = inject(DialogEventService);

  // Load messages for the currently selected room
  loadChatMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatMessagesActions.load),
      switchMap((action) => from(this.loadMessagesAsync(action)))
    )
  );

  private async loadMessagesAsync(action: any) {
    try {
      const chatMessages = await firstValueFrom(this.chatMessageService.getMessages(action.chatRoom.uid));
      return ChatMessagesActions.loadSuccess({chatMessages: chatMessages as any});
    } catch (error) {
      return ChatMessagesActions.loadFailure({error: getErrorMessage(error)});
    }
  }



// Create and send a message in the given room
createMessage$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ChatMessagesActions.create),
    switchMap((action) => from(this.createMessageAsync(action)))
  )
);

private async createMessageAsync(action: any) {
  try {
    const users: ChatRoomKeyInterface[] = await firstValueFrom(this.chatRoomsService.getRoomPublicKeys(action.chatRoom.uid));
    const recipientUserIds = users.map(u => u.uid);
    const chatMessage = await firstValueFrom(this.chatMessageService.sendMessage(action.chatRoom.uid, action.message, recipientUserIds));
    this.dialogEventService.emitSuccess();
    return ChatMessagesActions.createSuccess({chatMessage: chatMessage as any});
  } catch (error) {

    const errorMessage = getErrorMessage(error);
    this.dialogEventService.emitError(errorMessage);
    return ChatMessagesActions.createFailure({error: errorMessage});
  }
}
}

