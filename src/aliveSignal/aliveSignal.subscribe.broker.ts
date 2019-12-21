import * as rabbit from '../utils/rabbit';
import config from '../config';
import AliveSignalManager from './aliveSignal.manager';
import IAliveSignal from './aliveSignal.interface';

export default class AliveSignalSubscribeBroker {
    public static async subscribe() {
        rabbit.subscribe(
            config.rabbitMQ.exchange,
            config.rabbitMQ.exchangeType,
            config.rabbitMQ.queueName,
            '#.aliveSignal',
            async messageContent => {
                const { hostname, serviceName, aliveDate, upTimeInSeconds } = messageContent;

                await AliveSignalManager.create({ hostname, serviceName, aliveDate, upTimeInSeconds });
            },
        );
    }
}
