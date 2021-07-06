import express from 'express';
import { __entity__Controller } from './__entity__(camelCase)Controller';

export default (
  expressRouter: express.Router,
  __entity__(camelCase)Controller: __entity__Controller
): express.Router =>
  expressRouter
    .get(``, __entity__(camelCase)Controller.find__entity__s)
    .get(`/:id`, __entity__(camelCase)Controller.find__entity__ById)
    .post(``, __entity__(camelCase)Controller.create__entity__)
    .patch(`/:id`, __entity__(camelCase)Controller.patch__entity__)
    .delete(`/:id`, __entity__(camelCase)Controller.delete__entity__);
