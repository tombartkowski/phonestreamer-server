import { Request, Response } from 'express';
import { Result } from './resolve';
import { Entity } from './entity';

export type RequestType = (req: Request, res: Response) => void;
export type RequestInput = {
  body: Record<string, any>;
  query: Record<string, any>;
  params: Record<string, any>;
};

export interface Controller {
  handleCreate: <T extends Entity<any>>(
    req: Request,
    res: Response,
    serviceFunction: (body: any) => Promise<Result<T>>
  ) => Promise<void>;
  handleAction: <T extends Entity<any>>(
    req: Request,
    res: Response,
    serviceFunction: (body: any) => Promise<Result<T>>
  ) => Promise<void>;
  handleFindList: <T extends Entity<any>>(
    req: Request,
    res: Response,
    serviceFunction: (query: RequestInput) => Promise<Result<T[]>>
  ) => Promise<void>;
  handleFindById: <T extends Entity<any>>(
    req: Request,
    res: Response,
    serviceFunction: (id: string, query: RequestInput) => Promise<Result<T>>
  ) => Promise<void>;
  handleFindOne: <T extends Entity<any>>(
    req: Request,
    res: Response,
    serviceFunction: (query: RequestInput) => Promise<Result<T>>
  ) => Promise<void>;
  handleDelete: <T extends Entity<any>>(
    req: Request,
    res: Response,
    serviceFunction: (id: string) => Promise<Result<T>>
  ) => Promise<void>;
  handlePatch: <T extends Entity<any>>(
    req: Request,
    res: Response,
    serviceFunction: (id: string, body: any) => Promise<Result<T>>
  ) => Promise<void>;
}
