import { Router } from 'express';
import AliveRouter from './alive/alive.router';

const AppRouter: Router = Router();

AppRouter.use(`/api/alive`, AliveRouter);

export default AppRouter;
