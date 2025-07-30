import {ProfileInterface} from '../../../shared/interfaces/profileInterface';

export interface AuthInterface {
  user: ProfileInterface | null;
  token: string | null;
  isAuthenticated: boolean;
}
