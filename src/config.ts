const config = {
    server: {
        port: +(process.env.SERVICE_PORT || 5001),
        name: process.env.SERVICE_NAME || 'keep-alive',
    },
    db: {
        connectionString: `mongodb://${process.env.DB_SERVERS || 'localhost:27017'}/${process.env.KEEP_ALIVE_DB_NAME ||
            'drop-box-keep-alive'}${process.env.DB_REPLICA_NAME ? `?replicaSet=${process.env.DB_REPLICA_NAME}` : ''}`,
    },
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*'],
    },
};

export default config;
