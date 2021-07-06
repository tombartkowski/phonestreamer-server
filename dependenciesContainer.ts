import {
  asFunction,
  createContainer,
  InjectionMode,
  asValue,
  Lifetime,
} from 'awilix';
import simulatorRouter from './src/resources/simulators/simulatorRouter';
import simulatorController from './src/resources/simulators/simulatorController';
import simulatorService from './src/resources/simulators/simulatorService';
import simulatorRepository from './src/resources/simulators/simulatorRepository';
import simulatorMapper from './src/resources/simulators/simulatorMapper';

import virtualMachineRouter from './src/resources/virtualMachines/virtualMachineRouter';
import virtualMachineController from './src/resources/virtualMachines/virtualMachineController';
import virtualMachineService from './src/resources/virtualMachines/virtualMachineService';
import virtualMachineRepository from './src/resources/virtualMachines/virtualMachineRepository';
import virtualMachineMapper from './src/resources/virtualMachines/virtualMachineMapper';

import sessionRouter from './src/resources/sessions/sessionRouter';
import sessionController from './src/resources/sessions/sessionController';
import sessionService from './src/resources/sessions/sessionService';
import sessionRepository from './src/resources/sessions/sessionRepository';
import sessionMapper from './src/resources/sessions/sessionMapper';

import deviceRouter from './src/resources/devices/deviceRouter';
import deviceController from './src/resources/devices/deviceController';
import deviceService from './src/resources/devices/deviceService';
import deviceRepository from './src/resources/devices/deviceRepository';
import deviceMapper from './src/resources/devices/deviceMapper';

import appRouter from './src/resources/apps/appRouter';
import appController from './src/resources/apps/appController';
import appService from './src/resources/apps/appService';
import appRepository from './src/resources/apps/appRepository';
import appMapper from './src/resources/apps/appMapper';

import userRouter from './src/resources/users/userRouter';
import userController from './src/resources/users/userController';
import userService from './src/resources/users/userService';
import userRepository from './src/resources/users/userRepository';
import userMapper from './src/resources/users/userMapper';

import express from 'express';
import { Api } from './src/networking/api';
import { controller } from './src/core/controller.default';
import { uploadProgressSocket } from './uploadProgressSocket';
import { storageService } from './src/resources/apps/storageService';
import { unzipService } from './src/resources/apps/unzipService';
import { filesService } from './src/resources/apps/filesService';

const expressRouter = () => express.Router();
const container = createContainer({ injectionMode: InjectionMode.CLASSIC });
container.register({
  controller: asFunction(controller),
  expressRouter: asFunction(expressRouter),
  simulatorRouter: asFunction(simulatorRouter),
  simulatorController: asFunction(simulatorController),
  simulatorService: asFunction(simulatorService),
  simulatorRepository: asFunction(simulatorRepository),
  simulatorMapper: asFunction(simulatorMapper),

  virtualMachineRouter: asFunction(virtualMachineRouter),
  virtualMachineController: asFunction(virtualMachineController),
  virtualMachineService: asFunction(virtualMachineService),
  virtualMachineRepository: asFunction(virtualMachineRepository),
  virtualMachineMapper: asFunction(virtualMachineMapper),

  sessionRouter: asFunction(sessionRouter),
  sessionController: asFunction(sessionController),
  sessionService: asFunction(sessionService),
  sessionRepository: asFunction(sessionRepository),
  sessionMapper: asFunction(sessionMapper),

  deviceRouter: asFunction(deviceRouter),
  deviceController: asFunction(deviceController),
  deviceService: asFunction(deviceService),
  deviceRepository: asFunction(deviceRepository),
  deviceMapper: asFunction(deviceMapper),

  appRouter: asFunction(appRouter),
  appController: asFunction(appController),
  appService: asFunction(appService),
  appRepository: asFunction(appRepository),
  appMapper: asFunction(appMapper),

  userRouter: asFunction(userRouter),
  userController: asFunction(userController),
  userService: asFunction(userService),
  userRepository: asFunction(userRepository),
  userMapper: asFunction(userMapper),

  httpClient: asFunction(Api.httpClient),
  uploadProgressSocket: asFunction(uploadProgressSocket, {
    lifetime: Lifetime.SINGLETON,
  }),
  filesService: asFunction(filesService),
  unzipService: asFunction(unzipService),
  storageService: asFunction(storageService),
});

export default container;
