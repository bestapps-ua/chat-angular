import {createFeatureSelector, createSelector} from '@ngrx/store';
import {chatRoomAdapter, ChatRoomsState} from './chat-rooms.state';
import {chatRoomsFeatureKey} from './chat-rooms.constants';

export const selectChatRoomsState = createFeatureSelector<ChatRoomsState>(
  chatRoomsFeatureKey
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = chatRoomAdapter.getSelectors(selectChatRoomsState);

export const selectChatRoomsLoading = createSelector(
  selectChatRoomsState,
  (state: ChatRoomsState) => state.isLoading
);

export const selectChatRoomsError = createSelector(
  selectChatRoomsState,
  (state: ChatRoomsState) => state.error
);

export const selectSelectedChatRoomId = createSelector(
  selectChatRoomsState,
  (state: ChatRoomsState) => state.selectedRoomId
);

export const selectSelectedChatRoom = createSelector(
  selectEntities,
  selectSelectedChatRoomId,
  (entities, selectedId) => selectedId ? entities[selectedId] : null
);
