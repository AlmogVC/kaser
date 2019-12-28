import { Request, Response, NextFunction } from 'express';
import {
    HostnameInvalidError,
    ServiceNameInvalidError,
    AliveDateInvalidError,
    UpTimeInSecondsInvalidError,
} from '../../utils/errors/userErrors';

export function canCreateAliveSignal(req: Request, res: Response, next: NextFunction) {
    next(
        validateHostname(req.body.hostname) ||
            validateServiceName(req.body.serviceName) ||
            validateAliveDate(req.body.aliveDate) ||
            validateUpTimeInSeconds(req.body.upTimeInSeconds),
    );
}

export function validateHostname(hostname: string) {
    return validate(isStringValid(hostname, 1, 256), new HostnameInvalidError());
}

export function validateServiceName(serviceName: string) {
    return validate(isStringValid(serviceName, 1, 64), new ServiceNameInvalidError());
}

export function validateAliveDate(aliveDate: string) {
    const condition = aliveDate && !Number.isNaN(Date.parse(aliveDate));
    return validate(condition, new AliveDateInvalidError());
}

export function validateUpTimeInSeconds(upTimeInSeconds: number) {
    const condition = upTimeInSeconds && !Number.isNaN(upTimeInSeconds) && upTimeInSeconds >= 0;
    return validate(condition, new UpTimeInSecondsInvalidError());
}

function validate(condition: boolean, error: Error) {
    if (!condition) return error;
    return undefined;
}

function isStringValid(str: string, minLength: number, maxLength: number) {
    return str && typeof str === 'string' && str.length >= minLength && str.length <= maxLength;
}
