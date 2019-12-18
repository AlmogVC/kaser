import { Request, Response, NextFunction } from 'express';
import IAliveSignal from './aliveSignal.interface';
import AliveManager from './alive.manager';

export default class AliveController {
    public static async create(req: Request, res: Response, next: NextFunction) {
        const aliveSignal: IAliveSignal = {
            hostname: req.body.hostname,
            serviceName: req.body.serviceName,
        };

        res.json(await AliveManager.create(aliveSignal));
    }
}
