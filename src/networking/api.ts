import { Result } from '../core/resolve';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { HTTP } from './http';
import { AppError, ErrorCode, ErrorMessage, ErrorType } from '../core/AppError';

export namespace Api {
  export interface Request {
    url: string;
    method: HTTP.Method;
    params?: any;
  }

  export const httpClient = (): HTTP.Client => {
    return {
      request: async <T>(request: Api.Request): Promise<Result<T>> => {
        try {
          const response: AxiosResponse<T> = await axios.get(request.url);
          const result = response.data;
          return [result, null];
        } catch (error: any | AxiosError) {
          if (axios.isAxiosError(error)) {
            return [
              null,
              new AppError(
                error.message,
                ErrorType.INTERNAL,
                ErrorCode.VIRTUAL_MACHINE_ERROR,
                500
              ),
            ];
          }
          return [
            null,
            new AppError(
              ErrorMessage.UnkownVirtualMachineError,
              ErrorType.INTERNAL,
              ErrorCode.UNKOWN_VIRTUAL_MACHINE_ERROR,
              500
            ),
          ];
        }
      },
    };
  };
}
