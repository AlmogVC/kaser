export class ApplicationError extends Error {
    status: number;
    type: string;

    constructor(name: string, message: string, status: number) {
        super();
        Object.setPrototypeOf(this, ApplicationError.prototype);
        Error.captureStackTrace(this, this.constructor);
        this.name = name;
        this.message = message || 'Error: Undefined Application Error';
        this.status = status || 500;
    }
}

export class ServerError extends ApplicationError {
    constructor(name: string, message?: string, status?: number) {
        super(name, message || 'Internal Server Error', status || 500);
        Object.setPrototypeOf(this, ServerError.prototype);
    }
}

export class UserError extends ApplicationError {
    constructor(name: string, message?: string, status?: number) {
        super(name, message || 'User Error', status || 400);
        Object.setPrototypeOf(this, UserError.prototype);
    }
}
