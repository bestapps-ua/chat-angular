import {AuthInterface} from '../../../features/auth/interfaces/auth.interface';
import {ApiStateInterface} from '../../../shared/interfaces/api-state.interface';

export interface AuthState extends AuthInterface, ApiStateInterface {}

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  isLoading: false,
  error: null,
}
