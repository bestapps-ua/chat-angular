import {createReducer, on} from '@ngrx/store';
import {ChatRoomsActions} from './chat-rooms.actions';
import {chatRoomAdapter,  initialChatRoomsState} from './chat-rooms.state';

export const chatRoomsReducer = createReducer(
  initialChatRoomsState,
  on(ChatRoomsActions.load, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(ChatRoomsActions.loadSuccess, (state, {chatRooms}) => {
    return chatRoomAdapter.setAll(chatRooms, {...state, isLoading: false, error: null})
  }),
  on(ChatRoomsActions.loadFailure, (state, {error}) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(ChatRoomsActions.selectRoom, (state, {roomId}) => ({
    ...state,
    selectedRoomId: roomId,
  })),
  on(ChatRoomsActions.create, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(ChatRoomsActions.createSuccess, (state, {chatRoom}) => {
    return chatRoomAdapter.addOne(chatRoom, {...state, isLoading: false, error: null, selectedRoomId: chatRoom.uid})
  }),
  on(ChatRoomsActions.createFailure, (state, {error}) => ({
    ...state,
    isLoading: false,
    error,
  })),
);
