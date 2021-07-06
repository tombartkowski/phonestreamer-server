import { Request, Response } from 'express';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { Result } from './resolve';
import { Entity } from './entity';
import { Controller, RequestInput } from './controller';
import { AppError, ErrorCode, ErrorMessage, ErrorType } from './AppError';

interface ResponseOptions {
  successStatusCode: number;
  errorStatusCode: number;
  fields?: any;
  sendEmptyResponse?: boolean;
}

type ResultPromise = Promise<Result<Entity<any>>> | Promise<Result<Entity<any>[]>>;

export const controller = (): Controller => {
  const parser = new MongooseQueryParser();

  const sendError = (appError: AppError, statusCode: number, res: Response) => {
    res.status(appError.statusCode || statusCode).json({
      error: {
        code: appError.code,
        message: appError.message,
      },
    });
  };

  const sendResponse = (
    data: Entity<any> | Entity<any>[],
    statusCode: number,
    res: Response,
    fields?: any,
    sendEmptyResponse?: boolean
  ) => {
    if (sendEmptyResponse) {
      res.sendStatus(statusCode);
    } else if (Array.isArray(data)) {
      res.status(statusCode).json(data.map(data => data.toDto(fields)));
    } else {
      res.status(statusCode).json(data.toDto(fields));
    }
  };

  const handleRequest = async (
    resultPromise: ResultPromise,
    res: Response,
    options: ResponseOptions
  ) => {
    const [data, error] = await resultPromise;
    if (data !== null) {
      sendResponse(
        data,
        options.successStatusCode,
        res,
        options.fields,
        options.sendEmptyResponse
      );
    } else if (error) {
      sendError(error, options.errorStatusCode, res);
    } else {
      sendError(
        new AppError(ErrorMessage.NoResource, ErrorType.USER, ErrorCode.NO_RESOURCE),
        404,
        res
      );
    }
    return;
  };

  return {
    handleCreate: async <T extends Entity<any>>(
      req: Request,
      res: Response,
      serviceFunction: (body: any) => Promise<Result<T>>
    ) =>
      handleRequest(serviceFunction(req.body), res, {
        successStatusCode: 201,
        errorStatusCode: 500,
      }),
    handleAction: async <T extends Entity<any>>(
      req: Request,
      res: Response,
      serviceFunction: (body: any) => Promise<Result<T>>
    ) =>
      handleRequest(serviceFunction(req.body), res, {
        successStatusCode: 200,
        errorStatusCode: 500,
      }),
    handleFindList: async <T extends Entity<any>>(
      req: Request,
      res: Response,
      serviceFunction: (input: RequestInput) => Promise<Result<T[]>>
    ) => {
      return handleRequest(
        serviceFunction({
          body: req.body,
          query: req.query,
          params: req.params,
        }),
        res,
        {
          successStatusCode: 200,
          errorStatusCode: 500,
          fields: parser.parse(req.query).select,
        }
      );
    },
    handleFindById: async <T extends Entity<any>>(
      req: Request,
      res: Response,
      serviceFunction: (id: string, input: RequestInput) => Promise<Result<T>>
    ) =>
      handleRequest(
        serviceFunction(req.params.id, {
          body: req.body,
          query: req.query,
          params: req.params,
        }),
        res,
        {
          successStatusCode: 200,
          errorStatusCode: 500,
          fields: parser.parse(req.query).select,
        }
      ),
    handleFindOne: async <T extends Entity<any>>(
      req: Request,
      res: Response,
      serviceFunction: (input: RequestInput) => Promise<Result<T>>
    ) =>
      handleRequest(
        serviceFunction({
          body: req.body,
          query: req.query,
          params: req.params,
        }),
        res,
        {
          successStatusCode: 200,
          errorStatusCode: 500,
          fields: parser.parse(req.query).select,
        }
      ),
    handleDelete: async <T extends Entity<any>>(
      req: Request,
      res: Response,
      serviceFunction: (id: string) => Promise<Result<T>>
    ) =>
      handleRequest(serviceFunction(req.params.id), res, {
        successStatusCode: 204,
        errorStatusCode: 500,
        sendEmptyResponse: true,
      }),
    handlePatch: async <T extends Entity<any>>(
      req: Request,
      res: Response,
      serviceFunction: (id: string, body: any) => Promise<Result<T>>
    ) =>
      handleRequest(serviceFunction(req.params.id, req.body), res, {
        successStatusCode: 200,
        errorStatusCode: 500,
      }),
  };
};
