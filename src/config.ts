const config = {
    server: {
        port: +(process.env.SERVICE_PORT || 5001),
        name: process.env.SERVICE_NAME || 'keep-alive',
    },
    db: {
        connectionString: process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/kaser',
        autoIndex: process.env.MONGO_AUTO_INDEX === '1' || false,
    },
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*'],
    },
    rabbitMQ: {
        host: process.env.RMQ_HOST || 'localhost',
        port: +(process.env.RMQ_PORT || 5672),
        password: process.env.RMQ_PASSWORD || 'guest',
        username: process.env.RMQ_USERNAME || 'guest',
        exchange: process.env.RMQ_EXCHANGE || 'kaser-exchange',
        exchangeType: process.env.RMQ_EXCHANGE_TYPE || 'topic',
        queueName: process.env.RMQ_QUEUE_NAME || 'alive-signal-queue',
        pattern: process.env.RMQ_PATTERN || '#.aliveSignal',
        active: process.env.RMQ_ACTIVE === '1' || false,
    },
    aliveSignal: {
        expirationTimeInSeconds: +(process.env.ALIVE_SIGNAL_EXPIRATION_TIME || 60 * 60 * 24),
    },
    hostService: {
        expirationTimeInSeconds: +(process.env.HOST_SERVICE_EXPIRATION_TIME || 60 * 60 * 24),
    },
    service: {
        maxSilenceTimeInSeconds: +(process.env.SERVICE_MAX_SILENCE_TIME || 60),
    },
};

export default config;
