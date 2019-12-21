import { Request, Response, NextFunction } from 'express';
import ServiceManager from './service.manager';

export default class ServiceController {
    public static async getAll(req: Request, res: Response, next: NextFunction) {
        let options = {};

        if (req.query.includeHosts !== undefined) {
            const includeHosts: boolean = req.query.includeHosts === 'true' || Number(req.query.includeHosts) === 1;
            options = { ...options, includeHosts };
        }

        if (req.query.areAlive !== undefined) {
            if (req.query.areAlive === 'true' || Number(req.query.areAlive) === 1) {
                options = { ...options, areAlive: true };
            } else if (req.query.areAlive === 'false' || Number(req.query.areAlive) === 0) {
                options = { ...options, areAlive: false };
            }
        }

        res.json(await ServiceManager.getMany(options));
    }
}
