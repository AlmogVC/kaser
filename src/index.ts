import * as mongoose from 'mongoose';
import * as rabbit from './utils/rabbit';
import Server from './server';
import config from './config';
import AliveSignalSubscribeBroker from './aliveSignal/aliveSignal.subscribe.broker';

initEventHandlers();

(async () => {
    await setMongoConnection();
    Server.start();
})();

function initEventHandlers() {
    process.on('uncaughtException', error => {
        console.error('Unhandled Exception', error.stack);

        if (config.rabbitMQ.active) rabbit.closeConnection();

        process.exit(1);
    });

    process.on('unhandledRejection', error => {
        console.error('Unhandled Rejection', error);

        if (config.rabbitMQ.active) rabbit.closeConnection();

        process.exit(1);
    });

    process.on('SIGINT', async () => {
        try {
            console.log('User Termination');

            await mongoose.disconnect();

            if (config.rabbitMQ.active) rabbit.closeConnection();

            process.exit(0);
        } catch (error) {
            console.error('Failed to close MongoDB connection before server shutdown', error);
        }
    });
}

async function setMongoConnection() {
    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useUnifiedTopology', true);

    mongoose.connection.on('connecting', () => {
        console.log('[MongoDB] connecting...');
    });

    mongoose.connection.on('connected', () => {
        console.log('[MongoDB] connected');
    });

    mongoose.connection.on('error', error => {
        console.log('[MongoDB] error');
        console.log(error);
        process.exit(1);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('[MongoDB] disconnected');
        process.exit(1);
    });

    mongoose.connection.on('reconnected', () => {
        console.log('[MongoDB] reconnected');
    });

    if (config.rabbitMQ.active) {
        await rabbit.connect();
        await AliveSignalSubscribeBroker.subscribe();
    }

    return mongoose.connect(config.db.connectionString, { useNewUrlParser: true });
}
