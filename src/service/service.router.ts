import { Router } from 'express';
import ServiceController from './service.controller';

const ServiceRouter: Router = Router();

ServiceRouter.get(`/`, ServiceController.getAll);

export default ServiceRouter;
