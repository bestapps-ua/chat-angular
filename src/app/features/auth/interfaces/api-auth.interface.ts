import {ApiDataInterface} from '../../../shared/interfaces/api-data.interface';
import {UserInterface} from '../../../shared/interfaces/user.interface';

export interface ApiAuthInterface extends ApiDataInterface{
  accessToken: string;
  user: UserInterface;
}
