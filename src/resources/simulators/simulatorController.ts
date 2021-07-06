import { SimulatorService } from './simulatorService';
import { Request, Response } from 'express';
import { Controller, RequestType } from '../../core/controller';

export interface SimulatorController {
  createSimulator: RequestType;
  findSimulators: RequestType;
  findSimulatorById: RequestType;
  deleteSimulator: RequestType;
  patchSimulator: RequestType;
}

export default (
  controller: Controller,
  simulatorService: SimulatorService
): SimulatorController => {
  return {
    createSimulator: async (req: Request, res: Response) =>
      controller.handleCreate(req, res, simulatorService.createSimulator),
    findSimulators: async (req: Request, res: Response) =>
      controller.handleFindList(req, res, simulatorService.findSimulators),
    findSimulatorById: async (req: Request, res: Response) =>
      controller.handleFindById(req, res, simulatorService.findSimulatorById),
    deleteSimulator: async (req: Request, res: Response) =>
      controller.handleDelete(req, res, simulatorService.deleteSimulator),
    patchSimulator: async (req: Request, res: Response) =>
      controller.handlePatch(req, res, simulatorService.patchSimulator),
  };
};
