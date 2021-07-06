import express from 'express';
import { SessionController } from './sessionController';

export default (
  expressRouter: express.Router,
  sessionController: SessionController
): express.Router =>
  expressRouter
    .get(``, sessionController.findSessions)
    .get(`/:id`, sessionController.findSessionById)
    .post(``, sessionController.createSession)
    .patch(`/:id`, sessionController.patchSession)
    .delete(`/:id`, sessionController.deleteSession);
