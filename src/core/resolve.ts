import { AppError, ErrorCode, ErrorMessage, ErrorType } from './AppError';

export type Result<T> = [T | null, AppError | null];

export namespace Result {
  export const ok = <T>(data: T): Result<T> => {
    return [data, null];
  };

  export const error = <T>(error: AppError): Result<T> => {
    return [null, error];
  };
}

const resolve = async <T>(
  promise: Promise<T> | Promise<T | null>
): Promise<Result<T>> => {
  try {
    const result = await promise;
    return [result, null];
  } catch (error) {
    if (error instanceof AppError) {
      return [null, error];
    } else {
      return [
        null,
        new AppError(
          ErrorMessage.UnkownError,
          ErrorType.INTERNAL,
          ErrorCode.UNKOWN_ERROR,
          500
        ),
      ];
    }
  }
};

export const unwrap = async <T>(promise: Promise<Result<T>>): Promise<T> => {
  const [result, error] = await promise;
  if (error) {
    throw error;
  }
  return result!;
};

export default resolve;
