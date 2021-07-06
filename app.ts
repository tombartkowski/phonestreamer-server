import { config as dotenv } from 'dotenv';
dotenv();
import mongoose from './src/infra/mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import container from './dependenciesContainer';
import morgan from 'morgan';
import cors from 'cors';
import createWebSocketServer from './signalingServer';
import firebase from './src/infra/firebase';
mongoose();
firebase();

const app = express();
app.use(morgan('📤[:method] :url - :status, :response-time[digits]ms'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const simulatorRouter = container.cradle.simulatorRouter;
const virtualMachineRouter = container.cradle.virtualMachineRouter;
const sessionRouter = container.cradle.sessionRouter;
const deviceRouter = container.cradle.deviceRouter;
const appRouter = container.cradle.appRouter;
const userRouter = container.cradle.userRouter;

app.use('/simulators', simulatorRouter);
app.use('/virtual-machines', virtualMachineRouter);
app.use('/sessions', sessionRouter);
app.use('/devices', deviceRouter);
app.use('/apps', appRouter);
app.use('/users', userRouter);

createWebSocketServer();
app.listen(process.env.PORT ?? 3030, () => {
  console.log(
    `⚡️[server]: Server is running at http://localhost:${process.env.PORT ?? 3030}`
  );
});
