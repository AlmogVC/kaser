import { Router } from 'express';
import AliveSignalController from './aliveSignal.controller';
import { canCreateAliveSignal } from './validators/aliveSignal.validator';

const AliveSignalRouter: Router = Router();

AliveSignalRouter.post(`/`, canCreateAliveSignal, AliveSignalController.create);

export default AliveSignalRouter;
