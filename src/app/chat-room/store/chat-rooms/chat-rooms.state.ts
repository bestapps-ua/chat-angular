import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { ChatRoomInterface } from '../../interfaces/chat-room.interface';

export interface ChatRoomsState extends EntityState<ChatRoomInterface> {
  isLoading: boolean;
  error: string | null;
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
