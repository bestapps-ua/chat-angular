import { createAction, props } from '@ngrx/store';
import { ChatRoomInterface } from '../../interfaces/chat-room.interface';

export const loadChatRooms = createAction(
  '[Chat Rooms] Load Chat Rooms'
);

export const loadChatRoomsSuccess = createAction(
  '[Chat Rooms] Load Chat Rooms Success',
  props<{ chatRooms: ChatRoomInterface[] }>()
);

export const loadChatRoomsFailure = createAction(
  '[Chat Rooms] Load Chat Rooms Failure',
  props<{ error: string }>()
);

export const selectChatRoom = createAction(
  '[Chat Rooms] Select Chat Room',
  props<{ roomId: string }>()
);
