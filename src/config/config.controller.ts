import { Request, Response, NextFunction } from 'express';
import config from '../config';

export default class ConfigController {
    public static async get(req: Request, res: Response, next: NextFunction) {
        res.json({
            rabbitMQ: {
                isActive: config.rabbitMQ.active,
                exchange: config.rabbitMQ.exchange,
                exchangeType: config.rabbitMQ.exchangeType,
                host: config.rabbitMQ.host,
                port: config.rabbitMQ.port,
            },
            service: {
                maxSilenceTimeInSeconds: config.service.maxSilenceTimeInSeconds,
            },
        });
    }
}
