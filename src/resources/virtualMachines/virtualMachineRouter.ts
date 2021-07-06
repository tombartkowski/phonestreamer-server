import express from 'express';
import { VirtualMachineController } from './virtualMachineController';

export default (
  expressRouter: express.Router,
  virtualMachineController: VirtualMachineController
): express.Router =>
  expressRouter
    .get(``, virtualMachineController.findVirtualMachines)
    .get(`/:id`, virtualMachineController.findVirtualMachineById)
    .post(``, virtualMachineController.createVirtualMachine)
    .patch(`/:id`, virtualMachineController.patchVirtualMachine)
    .delete(`/:id`, virtualMachineController.deleteVirtualMachine);
