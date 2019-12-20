import { Router } from 'express';
import AliveSignalController from './aliveSignal.controller';

const AliveSignalRouter: Router = Router();

AliveSignalRouter.post(`/`, AliveSignalController.create);

export default AliveSignalRouter;
