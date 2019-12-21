import { Router } from 'express';
import AliveSignalRouter from './aliveSignal/aliveSignal.router';
import ServiceRouter from './service/service.router';

const AppRouter: Router = Router();

AppRouter.use(`/api/aliveSignal`, AliveSignalRouter);
AppRouter.use(`/api/service`, ServiceRouter);

export default AppRouter;
