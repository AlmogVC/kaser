import { Router } from 'express';
import ConfigController from './config.controller';

const ConfigRouter: Router = Router();

ConfigRouter.get(`/`, ConfigController.get);

export default ConfigRouter;
