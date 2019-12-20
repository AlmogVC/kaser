import { Request, Response, NextFunction } from 'express';
import IAliveSignal from './aliveSignal.interface';
import AliveSignalManager from './aliveSignal.manager';

export default class AliveSignalController {
    public static async create(req: Request, res: Response, next: NextFunction) {
        const aliveSignal: IAliveSignal = {
            hostname: req.body.hostname,
            serviceName: req.body.serviceName,
            aliveDate: req.body.aliveDate,
            upTimeInSeconds: req.body.upTimeInSeconds,
        };

        res.json(await AliveSignalManager.create(aliveSignal));
    }
}
