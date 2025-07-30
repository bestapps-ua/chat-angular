import {ApiDataInterface} from '../../../shared/interfaces/api-data.interface';
import {ProfileInterface} from '../../../shared/interfaces/profileInterface';

export interface ApiAuthInterface extends ApiDataInterface{
  accessToken: string;
  user: ProfileInterface;
}
