import { AppService } from './appService';
import { Request, Response } from 'express';
import { Controller, RequestType } from '../../core/controller';

export interface AppController {
  createApp: RequestType;
  findApps: RequestType;
  findAppById: RequestType;
  deleteApp: RequestType;
  patchApp: RequestType;
}

export default (
  controller: Controller,
  appService: AppService
): AppController => {
  return {
    createApp: async (req: Request, res: Response) =>
      controller.handleCreate(req, res, appService.createApp),
    findApps: async (req: Request, res: Response) =>
      controller.handleFindList(req, res, appService.findApps),
    findAppById: async (req: Request, res: Response) =>
      controller.handleFindById(req, res, appService.findAppById),
    deleteApp: async (req: Request, res: Response) =>
      controller.handleDelete(req, res, appService.deleteApp),
    patchApp: async (req: Request, res: Response) =>
      controller.handlePatch(req, res, appService.patchApp),
  };
};
