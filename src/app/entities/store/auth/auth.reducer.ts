import {Action, createFeature, createReducer, on} from '@ngrx/store';
import {AuthState, initialAuthState} from './auth.state';
import {AuthActions} from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, (state) => ({
    ...state,
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })),
  on(AuthActions.register, (state) => ({
    ...state,
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    user: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, {token, user}) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, {error}) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(AuthActions.registerSuccess, (state, {token, user}) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  })),
  on(AuthActions.registerFailure, (state, {error}) => ({
    ...state,
    isLoading: false,
    error,
  })),
);
