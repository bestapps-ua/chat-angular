import {createActionGroup, emptyProps, props} from '@ngrx/store';
import { ChatRoomInterface } from '../../../features/chat-room/interfaces/chat-room.interface';
import {chatRoomsName} from './chat-rooms.constants';

export const ChatRoomsActions = createActionGroup({
  source: chatRoomsName,
  events: {
    'Load': emptyProps(),
    'Load Success': props<{ chatRooms: ChatRoomInterface[] }>(),
    'Load Failure': props<{ error: string }>(),

    'Select Room': props<{ roomId: string }>(),

    'Create':  props<{ name: string }>(),
    'Create Success': props<{ chatRoom: ChatRoomInterface }>(),
    'Create Failure': props<{ error: string }>(),
  },
});
