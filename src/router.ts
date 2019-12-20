import { Router } from 'express';
import AliveSignalRouter from './aliveSignal/aliveSignal.router';

const AppRouter: Router = Router();

AppRouter.use(`/api/aliveSignal`, AliveSignalRouter);

export default AppRouter;
