import express from 'express';
import multer from 'multer';
const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, './tmp');
  },
  filename: (_req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(null, file.fieldname + '-' + uniqueSuffix + '.zip');
  },
});
const upload = multer({ storage: storage });
import { AppController } from './appController';

export default (expressRouter: express.Router, appController: AppController): express.Router =>
  expressRouter
    .get(``, appController.findApps)
    .get(`/:id`, appController.findAppById)
    .post(
      ``,
      upload.single('app'),
      (req, _res, next) => {
        req.body.file = req.file;
        next();
      },
      appController.createApp
    )
    .patch(`/:id`, appController.patchApp)
    .delete(`/:id`, appController.deleteApp);
