import { Router } from 'express';
import AliveSignalRouter from './aliveSignal/aliveSignal.router';
import ServiceRouter from './service/service.router';
import ConfigRouter from './config/config.router';

const AppRouter: Router = Router();

AppRouter.use(`/api/aliveSignal`, AliveSignalRouter);
AppRouter.use(`/api/service`, ServiceRouter);
AppRouter.use(`/api/config`, ConfigRouter);

export default AppRouter;
