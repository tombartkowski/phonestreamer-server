import { VirtualMachineService } from './virtualMachineService';
import { Request, Response } from 'express';
import { Controller, RequestType } from '../../core/controller';

export interface VirtualMachineController {
  createVirtualMachine: RequestType;
  findVirtualMachines: RequestType;
  findVirtualMachineById: RequestType;
  deleteVirtualMachine: RequestType;
  patchVirtualMachine: RequestType;
}

export default (
  controller: Controller,
  virtualMachineService: VirtualMachineService
): VirtualMachineController => {
  return {
    createVirtualMachine: async (req: Request, res: Response) =>
      controller.handleCreate(req, res, virtualMachineService.createVirtualMachine),
    findVirtualMachines: async (req: Request, res: Response) =>
      controller.handleFindList(req, res, virtualMachineService.findVirtualMachines),
    findVirtualMachineById: async (req: Request, res: Response) =>
      controller.handleFindById(req, res, virtualMachineService.findVirtualMachineById),
    deleteVirtualMachine: async (req: Request, res: Response) =>
      controller.handleDelete(req, res, virtualMachineService.deleteVirtualMachine),
    patchVirtualMachine: async (req: Request, res: Response) =>
      controller.handlePatch(req, res, virtualMachineService.patchVirtualMachine),
  };
};
