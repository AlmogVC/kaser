import { Router } from 'express';
import AliveController from './alive.controller';

const AliveRouter: Router = Router();

AliveRouter.post(`/`, AliveController.create);

export default AliveRouter;
