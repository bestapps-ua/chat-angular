import {ApiDataInterface} from '../../../shared/interfaces/api-data.interface';

export interface ApiAuthInterface extends ApiDataInterface{
  access_token: string;
}
