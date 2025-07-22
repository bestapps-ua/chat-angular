import {createReducer, on} from '@ngrx/store';
import {initialChatRoomsState, chatRoomAdapter} from './chat-rooms.state';
import * as ChatRoomsActions from './chat-rooms.actions';

export const chatRoomsFeatureKey = 'chatRooms'; // Key for your feature in the root state

export const chatRoomsReducer = createReducer(
  initialChatRoomsState,

  on(ChatRoomsActions.loadChatRooms, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(ChatRoomsActions.loadChatRoomsSuccess, (state, {chatRooms}) => {
    return chatRoomAdapter.setAll(chatRooms, {...state, isLoading: false, error: null})
  }),

  on(ChatRoomsActions.loadChatRoomsFailure, (state, {error}) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(ChatRoomsActions.selectChatRoom, (state, {roomId}) => ({
    ...state,
    selectedRoomId: roomId,
  }))
);
