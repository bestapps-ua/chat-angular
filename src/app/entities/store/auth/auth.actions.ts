import {createActionGroup, emptyProps, props} from '@ngrx/store';

import {authName} from './auth.constants';
import {UserInterface} from '../../../shared/interfaces/user.interface';

const success = props<{ token: string, user: UserInterface }>();
const error =  props<{ error: string }>();

export const AuthActions = createActionGroup({
  source: authName,
  events: {
    'Register': props<{ email: string, username: string, password: string }>(),
    'Register Success': success,
    'Register Failure': error,
    'Login': props<{ email: string, password: string }>(),
    'Login Success': success,
    'Login Failure': error,
    'Check': emptyProps(),
    'Check Success': success,
    'Check Failure': error,
    'Logout': emptyProps(),
    'Load Token': emptyProps(),
    'Clear Token': emptyProps(),
    'Load Token Success': success,
    'Load Token Failure': error,
  },
});
