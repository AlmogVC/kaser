import IAliveSignal from './aliveSignal.interface';
import AliveSignalRepository from './aliveSignal.repository';
import ServiceManager from '../service/service.manager';
import HostServiceManager from '../hostService/hostService.manager';

export default class AliveSignalManager {
    public static async create(aliveSignal: IAliveSignal) {
        return Promise.all([
            AliveSignalRepository.create(aliveSignal),
            HostServiceManager.create({ service: aliveSignal.serviceName, hostname: aliveSignal.hostname }),
            ServiceManager.update(aliveSignal),
        ]);
    }
}
