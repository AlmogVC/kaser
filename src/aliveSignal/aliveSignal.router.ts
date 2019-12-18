import { Router } from 'express';
import AliveSignalController from './aliveSignal.controller';

const AliveRouter: Router = Router();

AliveRouter.post(`/`, AliveSignalController.create);

export default AliveRouter;
