import {createFeatureSelector, createSelector} from '@ngrx/store';
import {chatMessageAdapter, ChatMessagesState} from './chat-messages.state';
import {chatMessagesFeatureKey} from './chat-messages.constants';

export const selectChatMessagesState = createFeatureSelector<ChatMessagesState>(
  chatMessagesFeatureKey
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = chatMessageAdapter.getSelectors(selectChatMessagesState);

export const selectChatMessagesLoading = createSelector(
  selectChatMessagesState,
  (state: ChatMessagesState) => state.isLoading
);

export const selectChatMessagesError = createSelector(
  selectChatMessagesState,
  (state: ChatMessagesState) => state.error
);

export const selectSelectedMessageIds = createSelector(
  selectChatMessagesState,
  (state: ChatMessagesState) => state.selected
);

export const selectSelectedMessages = createSelector(
  selectEntities,
  selectSelectedMessageIds,
  (entities, selectedIds) => Array.isArray(selectedIds) && selectedIds.length
    ? selectedIds.map(id => entities[id]).filter(Boolean)
    : []
);

