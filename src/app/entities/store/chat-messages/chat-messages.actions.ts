import {createActionGroup, emptyProps, props} from '@ngrx/store';
import { ChatRoomInterface } from '../../../features/chat-room/interfaces/chat-room.interface';
import {chatMessagesName} from './chat-messages.constants';
import {ChatMessageInterface} from '../../../features/chat-message/interfaces/chat-message.interface';

export const ChatMessagesActions = createActionGroup({
  source: chatMessagesName,
  events: {
    'Load': props<{chatRoom: ChatRoomInterface}>(),
    'Load Success': props<{ chatMessages: ChatMessageInterface[] }>(),
    'Load Failure': props<{ error: string }>(),

    'Select Message': props<{ messageId: string }>(),

    'Create':  props<{ chatRoom: ChatRoomInterface, message: string }>(),
    'Create Success': props<{ chatMessage: ChatMessageInterface }>(),
    'Create Failure': props<{ error: string }>(),
  },
});
