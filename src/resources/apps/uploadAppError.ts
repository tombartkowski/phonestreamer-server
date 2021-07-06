import { AppError, ErrorCode, ErrorType } from '../../core/AppError';

enum UploadAppErrorCode {
  UNZIP = 100,
  SAVE_TO_DISK = 101,
  READ_PLIST = 102,
  CLOUD_UPLOAD = 103,
  UNKOWN = 104,
}

export const UploadAppError = {
  unzip: new AppError('Unzipping failed.', ErrorType.INTERNAL, UploadAppErrorCode.UNZIP, 500),
  saveToDisk: new AppError(
    'Saving to disk failed.',
    ErrorType.INTERNAL,
    UploadAppErrorCode.SAVE_TO_DISK,
    500
  ),
  readPlist: new AppError(
    'Reading metadata failed.',
    ErrorType.INTERNAL,
    UploadAppErrorCode.READ_PLIST,
    500
  ),
  uploadToCloud: new AppError(
    'Saving to cloud failed.',
    ErrorType.INTERNAL,
    UploadAppErrorCode.CLOUD_UPLOAD,
    500
  ),
  unknown: new AppError(
    'Unkown upload app error.',
    ErrorType.INTERNAL,
    UploadAppErrorCode.UNKOWN,
    500
  ),
};
