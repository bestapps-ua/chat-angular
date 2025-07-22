import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {chatRoomsFeatureKey, chatRoomsReducer} from '../chat-room/store/chat-rooms/chat-rooms.reducer';
import { ChatRoomsState } from '../chat-room/store/chat-rooms/chat-rooms.state';

export interface AppState {
  [chatRoomsFeatureKey]: ChatRoomsState;
}

export const reducers: ActionReducerMap<AppState> = {
  [chatRoomsFeatureKey]: chatRoomsReducer,
};

export const metaReducers: MetaReducer<AppState>[] = [

];
