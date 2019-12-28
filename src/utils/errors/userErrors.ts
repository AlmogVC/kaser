import { UserError } from './applicationError';

export class HostnameInvalidError extends UserError {
    constructor(message?: string) {
        super('HostnameInvalidError', message || 'Hostname is invalid', 400);
        Object.setPrototypeOf(this, HostnameInvalidError.prototype);
    }
}

export class ServiceNameInvalidError extends UserError {
    constructor(message?: string) {
        super('ServiceNameInvalidError', message || 'Service name is invalid', 400);
        Object.setPrototypeOf(this, ServiceNameInvalidError.prototype);
    }
}

export class AliveDateInvalidError extends UserError {
    constructor(message?: string) {
        super('AliveDateInvalidError', message || 'Alive date is invalid', 400);
        Object.setPrototypeOf(this, AliveDateInvalidError.prototype);
    }
}

export class UpTimeInSecondsInvalidError extends UserError {
    constructor(message?: string) {
        super('UpTimeInSecondsInvalidError', message || 'Up Time is invalid', 400);
        Object.setPrototypeOf(this, UpTimeInSecondsInvalidError.prototype);
    }
}
