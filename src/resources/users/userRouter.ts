import express from 'express';
import { verifyToken } from '../../middlewares/authMiddleware';
import { usePostCache } from '../../middlewares/cacheMiddleware';
import { AppController } from '../apps/appController';
import { UserController } from './userController';

export default (
  expressRouter: express.Router,
  userController: UserController,
  appController: AppController
): express.Router =>
  expressRouter
    .get(``, userController.findUsers)
    .get(`/me`, verifyToken, userController.findCurrentUser)
    .get(`/:id`, userController.findUserById)
    .post(``, userController.createUser)
    .post(
      `/emails/check-availability`,
      (req, res, next) =>
        usePostCache(req, res, next, 'email', isValid => ({ isValid })),
      userController.checkEmailAvailability
    )
    .get('/:userId/apps', verifyToken, appController.findApps)
    .patch(`/:id`, userController.patchUser)
    .delete(`/:id`, userController.deleteUser);
