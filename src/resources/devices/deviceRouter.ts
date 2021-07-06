import express from 'express';
import { verifyToken } from '../../middlewares/authMiddleware';
import { DeviceController } from './deviceController';

export default (
  expressRouter: express.Router,
  deviceController: DeviceController
): express.Router =>
  expressRouter
    .get(``, deviceController.findDevices)
    .get(`/:id`, deviceController.findDeviceById)
    .post(``, deviceController.createDevice)
    .patch(`/:id`, deviceController.patchDevice)
    .delete(`/:id`, deviceController.deleteDevice);
