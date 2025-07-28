import {createReducer, on} from '@ngrx/store';
import {initialAuthState} from './auth.state';
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
    ...initialAuthState
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
  on(AuthActions.loadToken, state => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(AuthActions.loadTokenSuccess, (state, { token, user }) => ({
    ...state,
    isAuthenticated: true,
    user,
    token,
    isLoading: false,
    error: null,
  })),
  on(AuthActions.loadTokenFailure, (state, { error }) => ({
    ...initialAuthState,
    //error,
  })),
  on(AuthActions.clearToken, state => ({
    ...initialAuthState
  })),
);
