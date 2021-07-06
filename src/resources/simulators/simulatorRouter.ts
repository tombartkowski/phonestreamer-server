import express from 'express';
import { SimulatorController } from './simulatorController';

export default (
  expressRouter: express.Router,
  simulatorController: SimulatorController
): express.Router =>
  expressRouter
    .get(``, simulatorController.findSimulators)
    .get(`/:id`, simulatorController.findSimulatorById)
    .post(``, simulatorController.createSimulator)
    .patch(`/:id`, simulatorController.patchSimulator)
    .delete(`/:id`, simulatorController.deleteSimulator);
