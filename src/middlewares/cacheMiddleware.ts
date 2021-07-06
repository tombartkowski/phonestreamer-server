import { Request, Response, NextFunction } from 'express';
import { memoryCache } from '../infra/memoryCache';

export const usePostCache = (
  req: Request,
  res: Response,
  next: NextFunction,
  key: string,
  makeResponse: (value: any) => any
) => {
  const cacheKey = (req.body[key] + '').trim().toLowerCase();
  const cachedObject = memoryCache.get(cacheKey);
  if (cachedObject !== undefined) {
    res.status(200).json(makeResponse(cachedObject));
  } else {
    next();
  }
};
