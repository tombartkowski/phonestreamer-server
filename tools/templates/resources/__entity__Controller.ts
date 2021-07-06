import { __entity__Service } from './__entity__(camelCase)Service';
import { Request, Response } from 'express';
import { Controller, RequestType } from '../../core/controller';

export interface __entity__Controller {
  create__entity__: RequestType;
  find__entity__s: RequestType;
  find__entity__ById: RequestType;
  delete__entity__: RequestType;
  patch__entity__: RequestType;
}

export default (
  controller: Controller,
  __entity__(camelCase)Service: __entity__Service
): __entity__Controller => {
  return {
    create__entity__: async (req: Request, res: Response) =>
      controller.handleCreate(req, res, __entity__(camelCase)Service.create__entity__),
    find__entity__s: async (req: Request, res: Response) =>
      controller.handleFindList(req, res, __entity__(camelCase)Service.find__entity__s),
    find__entity__ById: async (req: Request, res: Response) =>
      controller.handleFindById(req, res, __entity__(camelCase)Service.find__entity__ById),
    delete__entity__: async (req: Request, res: Response) =>
      controller.handleDelete(req, res, __entity__(camelCase)Service.delete__entity__),
    patch__entity__: async (req: Request, res: Response) =>
      controller.handlePatch(req, res, __entity__(camelCase)Service.patch__entity__),
  };
};
