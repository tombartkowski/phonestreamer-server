import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import { AppError, ErrorCode, ErrorMessage, ErrorType } from '../core/AppError';
import userModel from '../resources/users/userModel';

const AuthError = {
  unauthorized: new AppError(
    ErrorMessage.Unauthorized,
    ErrorType.USER,
    ErrorCode.UNAUTHORIZED
  ),
  forbidden: new AppError(
    ErrorMessage.Forbidden,
    ErrorType.USER,
    ErrorCode.FORBIDDEN
  ),
};

const sendError = (appError: AppError, statusCode: number, res: Response) => {
  res.status(appError.statusCode || statusCode).json({
    error: {
      code: appError.code,
      message: appError.message,
    },
  });
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers) {
    sendError(AuthError.unauthorized, 401, res);
    return;
  }
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    sendError(AuthError.unauthorized, 401, res);
    return;
  }
  const parts = authorizationHeader.split(' ');
  if (parts.length == 2) {
    const [scheme, token] = parts;
    if (/^Bearer$/i.test(scheme)) {
      admin
        .auth()
        .verifyIdToken(token)
        .then(decodedToken => {
          const uid = String(decodedToken.uid).trim();
          userModel
            .findOne({ firebaseId: uid }, '_id firebaseId')
            .lean()
            .exec()
            .then((user: any) => {
              if (user && user.firebaseId && user.firebaseId === uid) {
                req.params = { userId: user._id, ...req.params };
                next();
              } else {
                sendError(AuthError.forbidden, 403, res);
              }
            });
        })
        .catch(_error => {
          console.log(_error);
          sendError(AuthError.unauthorized, 401, res);
          return;
        });
    } else {
      sendError(AuthError.unauthorized, 401, res);
      return;
    }
  } else {
    sendError(AuthError.unauthorized, 401, res);
    return;
  }
};
