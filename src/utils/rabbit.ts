import * as amqplib from 'amqplib';
import config from '../config';

let connection: amqplib.Connection;
let publishChannel: amqplib.Channel;

export interface SubscribeOptions {
    consumer: amqplib.Options.Consume;
    exchange: amqplib.Options.AssertExchange;
    queue: amqplib.Options.AssertQueue;
    channel: {
        prefetch?: number;
    };
}

const defualtSubscribeOptions: SubscribeOptions = {
    consumer: {
        noAck: false,
    },
    exchange: {
        durable: true,
    },
    queue: {
        durable: true,
    },
    channel: {},
};

export async function connect() {
    const { username, password, host, port } = config.rabbitMQ;
    connection = await amqplib.connect(`amqp://${username}:${password}@${host}:${port}`);

    connection.on('error', error => {
        console.log('[RabbitMQ] connection error');
        console.log(error);

        process.exit(1);
    });

    connection.on('close', error => {
        if (process.env.NODE_ENV !== 'test') {
            console.log('[RabbitMQ] connection close');
            console.log(error);

            process.exit(1);
        }
    });

    console.log(`[RabbitMQ] connected on port ${port}`);

    return connection;
}

export function closeConnection() {
    if (connection) {
        return connection.close();
    }

    return Promise.resolve(null);
}

export async function subscribe(
    exchange: string,
    type: string,
    queue: string,
    pattern: string,
    messageHandler: (
        messageContent: any,
        messageFields: amqplib.MessageFields,
        messageProperties: amqplib.MessageProperties,
    ) => Promise<void>,
    options: SubscribeOptions = defualtSubscribeOptions,
) {
    if (!connection) {
        throw new Error('No connection available');
    }

    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, type, options.exchange);

    if (options.channel.prefetch) {
        channel.prefetch(options.channel.prefetch);
    }

    const assertedQueue = await channel.assertQueue(queue, options.queue);

    channel.on('error', error => {
        console.log('[RabbitMQ] channel error');
        console.log(error);

        process.exit(1);
    });

    channel.on('close', error => {
        if (process.env.NODE_ENV !== 'test') {
            console.log('[RabbitMQ] channel close');
            console.log(error);

            process.exit(1);
        }
    });

    await channel.bindQueue(assertedQueue.queue, exchange, pattern);

    channel.consume(
        queue,
        async (message: amqplib.Message | null) => {
            if (message) {
                const messageString = message.content.toString();
                try {
                    await messageHandler(JSON.parse(messageString), message.fields, message.properties);
                    channel.ack(message);
                } catch (err) {
                    channel.nack(message, false, false);
                }
            }
        },
        options.consumer,
    );

    return channel;
}

export async function publish(
    exchange: string,
    type: string,
    routingKey: string,
    message: Object,
    options?: amqplib.Options.Publish,
) {
    if (!publishChannel) {
        publishChannel = await connection.createChannel();

        publishChannel.on('error', error => {
            console.log('[RabbitMQ] channel error');
            console.log(error);

            process.exit(1);
        });

        publishChannel.on('close', error => {
            if (process.env.NODE_ENV !== 'test') {
                console.log('[RabbitMQ] channel close');
                console.log(error);

                process.exit(1);
            }
        });

        await publishChannel.assertExchange(exchange, type, {
            durable: true,
        });
    }

    publishChannel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), {
        persistent: true,
        ...options,
    });
}
