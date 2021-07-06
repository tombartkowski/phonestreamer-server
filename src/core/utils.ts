import { Types } from 'mongoose';

export const keys = (object: any) => Object.keys(object);
export const values = (object: any) => Object.values(object);

export const isObject = (value?: any) =>
  value && typeof value == 'object' && !(value instanceof Types.ObjectId);
