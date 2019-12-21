import { Request, Response, NextFunction } from 'express';
import ServiceManager from './service.manager';

export default class ServiceController {
    public static async getAll(req: Request, res: Response, next: NextFunction) {
        let options = {};

        if (req.query.includeHosts !== undefined) {
            const includeHosts: boolean = req.query.includeHosts === 'true' || Number(req.query.includeHosts) === 1;
            options = { includeHosts };
        }

        res.json(await ServiceManager.getMany(options));
    }
}
