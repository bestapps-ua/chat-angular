import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AuthState} from './auth.state';
import {authFeatureKey} from './auth.constants';

export const selectAuthState = createFeatureSelector<AuthState>(
  authFeatureKey
);

export const selectAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectAuthUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectAuthToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

