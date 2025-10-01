import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {ApiStateInterface} from '../../../shared/interfaces/api-state.interface';
import {ChatMessageInterface} from '../../../features/chat-message/interfaces/chat-message.interface';

export interface ChatMessagesState extends EntityState<ChatMessageInterface>, ApiStateInterface  {
  selected: string[];
}

export const chatMessageAdapter = createEntityAdapter<ChatMessageInterface>({
  selectId: (message: ChatMessageInterface) => message.uid,
});

export const initialChatMessagesState: ChatMessagesState = chatMessageAdapter.getInitialState({
  isLoading: false,
  error: null,
  selected: [],
});
