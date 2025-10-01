import {Action, ActionReducer, ActionReducerMap, MetaReducer} from '@ngrx/store';
import {chatRoomsFeatureKey} from './chat-rooms/chat-rooms.constants';
import {ChatRoomsState} from './chat-rooms/chat-rooms.state';
import {authFeatureKey} from './auth/auth.constants';
import {AuthState} from './auth/auth.state';
import {chatRoomsReducer} from './chat-rooms/chat-rooms.reducer';
import {authReducer} from './auth/auth.reducer';
import {chatMessagesReducer} from './chat-messages/chat-messages.reducer';
import {chatMessagesFeatureKey} from './chat-messages/chat-messages.constants';

export interface AppState {
  [authFeatureKey]: AuthState;
  [chatRoomsFeatureKey]: ChatRoomsState;
}

export const reducers: ActionReducerMap<AppState> = {
  [authFeatureKey]: authReducer,
  [chatRoomsFeatureKey]: chatRoomsReducer,
  [chatMessagesFeatureKey]: chatMessagesReducer,
}as ActionReducerMap<AppState, Action<string>>;

export function debugReducer(reducer: ActionReducer<any, Action<string>>): ActionReducer<any, Action<string>> {
  return function(state, action) {
    console.log('state', state);
    console.log('action', action);
    return reducer(state, action);
  };
}


export const metaReducers: MetaReducer<AppState, Action<string>>[] = [
  debugReducer,
];
