import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {ChatRoomInterface} from '../../../features/chat-room/interfaces/chat-room.interface';
import {ApiStateInterface} from '../../../shared/interfaces/api-state.interface';

export interface ChatRoomsState extends EntityState<ChatRoomInterface>, ApiStateInterface  {
  selectedRoomId: string | null;
}

export const chatRoomAdapter = createEntityAdapter<ChatRoomInterface>({
  selectId: (room: ChatRoomInterface) => room.uid,
});

export const initialChatRoomsState: ChatRoomsState = chatRoomAdapter.getInitialState({
  isLoading: false,
  error: null,
  selectedRoomId: null,
});
