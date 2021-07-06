import { SessionService } from './sessionService';
import { Request, Response } from 'express';
import { Controller, RequestType } from '../../core/controller';

export interface SessionController {
  createSession: RequestType;
  findSessions: RequestType;
  findSessionById: RequestType;
  deleteSession: RequestType;
  patchSession: RequestType;
}

export default (
  controller: Controller,
  sessionService: SessionService
): SessionController => {
  return {
    createSession: async (req: Request, res: Response) =>
      controller.handleCreate(req, res, sessionService.createSession),
    findSessions: async (req: Request, res: Response) =>
      controller.handleFindList(req, res, sessionService.findSessions),
    findSessionById: async (req: Request, res: Response) =>
      controller.handleFindById(req, res, sessionService.findSessionById),
    deleteSession: async (req: Request, res: Response) =>
      controller.handleDelete(req, res, sessionService.deleteSession),
    patchSession: async (req: Request, res: Response) =>
      controller.handlePatch(req, res, sessionService.patchSession),
  };
};
