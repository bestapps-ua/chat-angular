import {UserInterface} from '../../../shared/interfaces/user.interface';

export interface AuthInterface {
  user: UserInterface | null;
  token: string | null;
  isAuthenticated: boolean;
}
