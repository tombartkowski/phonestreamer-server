import { Result } from '../core/resolve';
import { Api } from './api';

export namespace HTTP {
  export enum Method {
    GET,
    POST,
    PUT,
    PATCH,
    DELETE,
  }
  export interface Client {
    request: <T>(request: Api.Request) => Promise<Result<T>>;
  }
}
