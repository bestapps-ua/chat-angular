import {createReducer, on} from '@ngrx/store';
import {chatMessageAdapter, initialChatMessagesState} from './chat-messages.state';
import {ChatMessagesActions} from './chat-messages.actions';

export const chatMessagesReducer = createReducer(
  initialChatMessagesState,
  on(ChatMessagesActions.load, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(ChatMessagesActions.loadSuccess, (state, {chatMessages}) => {
    return chatMessageAdapter.setAll(chatMessages, {...state, isLoading: false, error: null})
  }),
  on(ChatMessagesActions.loadFailure, (state, {error}) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(ChatMessagesActions.selectMessage, (state, {messageId}) => ({
    ...state,
    selected: [...state.selected, messageId],
  })),
  on(ChatMessagesActions.create, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(ChatMessagesActions.createSuccess, (state, {chatMessage}) => {
    return chatMessageAdapter.addOne(chatMessage, {
      ...state,
      isLoading: false,
      error: null,
    })
  }),
  on(ChatMessagesActions.createFailure, (state, {error}) => ({
    ...state,
    isLoading: false,
    error,
  })),
);
