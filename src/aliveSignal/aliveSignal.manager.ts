import IAliveSignal from './aliveSignal.interface';
import AliveSignalRepository from './aliveSignal.repository';
import ServiceManager from '../service/service.manager';
import ServiceHostManager from '../serviceHost/serviceHost.manager';

export default class AliveSignalManager {
    public static async create(aliveSignal: IAliveSignal) {
        return Promise.all([
            AliveSignalRepository.create(aliveSignal),
            ServiceHostManager.create({
                service: aliveSignal.serviceName,
                hostname: aliveSignal.hostname,
                upTimeInSeconds: aliveSignal.upTimeInSeconds,
            }),
            ServiceManager.update(aliveSignal),
        ]);
    }
}
