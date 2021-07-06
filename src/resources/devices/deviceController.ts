import { DeviceService } from './deviceService';
import { Request, Response } from 'express';
import { Controller, RequestType } from '../../core/controller';

export interface DeviceController {
  createDevice: RequestType;
  findDevices: RequestType;
  findDeviceById: RequestType;
  deleteDevice: RequestType;
  patchDevice: RequestType;
}

export default (
  controller: Controller,
  deviceService: DeviceService
): DeviceController => {
  return {
    createDevice: async (req: Request, res: Response) =>
      controller.handleCreate(req, res, deviceService.createDevice),
    findDevices: async (req: Request, res: Response) =>
      controller.handleFindList(req, res, deviceService.findDevices),
    findDeviceById: async (req: Request, res: Response) =>
      controller.handleFindById(req, res, deviceService.findDeviceById),
    deleteDevice: async (req: Request, res: Response) =>
      controller.handleDelete(req, res, deviceService.deleteDevice),
    patchDevice: async (req: Request, res: Response) =>
      controller.handlePatch(req, res, deviceService.patchDevice),
  };
};
