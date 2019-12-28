import * as express from 'express';
import * as http from 'http';

import config from './config';
import AppRouter from './router';
import { userErrorHandler, serverErrorHandler, unknownErrorHandler } from './utils/errors/errorHandler';

import bodyParser = require('body-parser');

export default class Server {
    public app: express.Application;
    private server: http.Server;

    public static start(): Server {
        return new Server();
    }

    private constructor() {
        this.app = express();
        this.configureMiddlewares();
        this.app.use(AppRouter);
        this.initializeErrorHandler();

        this.server = http.createServer(this.app);
        this.server.listen(config.server.port, () => {
            console.log(`${config.server.name} is running on port ${config.server.port}`);
        });
    }

    private configureMiddlewares() {
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const origin = req.headers.origin as string;

            if (config.cors.allowedOrigins.indexOf(origin) !== -1) {
                res.setHeader('Access-Control-Allow-Origin', origin);
            }
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type');

            if (req.method === 'OPTIONS') {
                return res.status(200).end();
            }

            return next();
        });

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    private initializeErrorHandler() {
        this.app.use(userErrorHandler);
        this.app.use(serverErrorHandler);
        this.app.use(unknownErrorHandler);
    }
}
