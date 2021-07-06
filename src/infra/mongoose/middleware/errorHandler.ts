import {
  AppError,
  ErrorCode,
  ErrorMessage,
  ErrorType,
} from '../../../core/AppError';

export const handleDuplicatedKey = (error: any, _res: any, next: any) => {
  console.error(error);
  if (error.name === 'MongoError' && error.code === 11000 && error.keyValue) {
    next(
      new AppError(
        ErrorMessage.DuplicateKey(Object.keys(error.keyValue)[0]),
        ErrorType.USER,
        ErrorCode.DUPLICATE_KEY,
        400
      )
    );
  } else {
    next(
      new AppError(
        ErrorMessage.UnkownDatabaseError,
        ErrorType.INTERNAL,
        ErrorCode.UNKNOWN_DATABASE_ERROR,
        500
      )
    );
  }
};
