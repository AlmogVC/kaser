import * as rabbit from '../utils/rabbit';
import config from '../config';
import AliveSignalManager from './aliveSignal.manager';
import {
    validateServiceName,
    validateHostname,
    validateAliveDate,
    validateUpTimeInSeconds,
} from './validators/aliveSignal.validator';

export default class AliveSignalSubscribeBroker {
    public static async subscribe() {
        rabbit.subscribe(
            config.rabbitMQ.exchange,
            config.rabbitMQ.exchangeType,
            config.rabbitMQ.queueName,
            config.rabbitMQ.pattern,
            async messageContent => {
                const { hostname, serviceName, aliveDate, upTimeInSeconds } = messageContent;
                if (
                    validateHostname(hostname) === undefined &&
                    validateServiceName(serviceName) === undefined &&
                    validateAliveDate(aliveDate) === undefined &&
                    validateUpTimeInSeconds(upTimeInSeconds) === undefined
                ) {
                    await AliveSignalManager.create({ hostname, serviceName, aliveDate, upTimeInSeconds });
                }
            },
        );
    }
}
