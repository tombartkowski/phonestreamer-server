export enum ErrorType {
  USER,
  INTERNAL,
}

export enum ErrorCode {
  UNKOWN_ERROR = 1,
  UNKNOWN_DATABASE_ERROR = 2,
  DUPLICATE_KEY = 3,
  NO_RESOURCE = 4,
  VALIDATION_ERROR = 5,
  VIRTUAL_MACHINE_ERROR = 6,
  UNKOWN_VIRTUAL_MACHINE_ERROR = 7,
  NO_VIRTUAL_MACHINES_AVAILABLE = 8,
  UNAUTHORIZED = 9,
  FORBIDDEN = 10,
  USER_ALREADY_EXISTS = 11,
}

export namespace ErrorMessage {
  export const DuplicateKey = (key: string) => `The '${key}' already exists.`;
  export const InvalidOrMissingField = (field: string) =>
    `Field '${field}' is missing or is incorrect.`;
  export const InvalidField = (field: string) => `Field '${field}' is incorrect.`;
  export const UnkownError = 'An unknown error has occured.';
  export const UnkownDatabaseError = 'An unknown database error has occured.';
  export const NoResource = 'The resource does not exist';
  export const UnkownVirtualMachineError =
    'An unknown simulator hosting error has occured.';
  export const NoVirtualMachinesAvailable =
    'Could not find a free virtual machine to host the requested session.';
  export const Unauthorized =
    "Looks like you aren't properly authroized. Try to log out and log in again.";
  export const Forbidden = "You're trying to access something you shouldn't.";
  export const UserAlreadyExists = 'That email is already taken. Sign in instead?';
}

export class AppError extends global.Error {
  constructor(msg: string, type: ErrorType, code?: number, statusCode?: number) {
    super(msg);
    this.type = type;
    this.code = code || 1;
    this.statusCode = statusCode;
  }

  type: ErrorType;
  code: number;
  statusCode?: number;

  static get default(): AppError {
    return new AppError(
      ErrorMessage.UnkownError,
      ErrorType.INTERNAL,
      ErrorCode.UNKOWN_ERROR,
      500
    );
  }

  static withCode(code: number): AppError {
    return new AppError(
      ErrorMessage.UnkownError,
      ErrorType.INTERNAL,
      ErrorCode.UNKOWN_ERROR,
      code
    );
  }

  static get empty(): AppError {
    return new AppError('', ErrorType.INTERNAL);
  }
}
