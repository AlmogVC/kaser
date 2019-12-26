import { Request, Response, NextFunction } from 'express';
import AliveSignalManager from './aliveSignal.manager';

export default class AliveSignalController {
    public static async create(req: Request, res: Response, next: NextFunction) {
        const { hostname, serviceName, aliveDate, upTimeInSeconds } = req.body;

        res.json(await AliveSignalManager.create({ hostname, serviceName, aliveDate, upTimeInSeconds }));
    }
}
