import { UserService } from './userService';
import { Request, Response } from 'express';
import { Controller, RequestType } from '../../core/controller';

export interface UserController {
  createUser: RequestType;
  checkEmailAvailability: RequestType;
  findUsers: RequestType;
  findUserById: RequestType;
  findCurrentUser: RequestType;
  deleteUser: RequestType;
  patchUser: RequestType;
}

export default (
  controller: Controller,
  userService: UserService
): UserController => {
  return {
    createUser: async (req: Request, res: Response) =>
      controller.handleCreate(req, res, userService.createUser),
    checkEmailAvailability: async (req: Request, res: Response) =>
      controller.handleAction(req, res, userService.checkEmailAvailability),
    findUsers: async (req: Request, res: Response) =>
      controller.handleFindList(req, res, userService.findUsers),
    findUserById: async (req: Request, res: Response) =>
      controller.handleFindById(req, res, userService.findUserById),
    findCurrentUser: async (req: Request, res: Response) =>
      controller.handleFindOne(req, res, userService.findCurrentUser),
    deleteUser: async (req: Request, res: Response) =>
      controller.handleDelete(req, res, userService.deleteUser),
    patchUser: async (req: Request, res: Response) =>
      controller.handlePatch(req, res, userService.patchUser),
  };
};
