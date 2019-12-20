import IAliveSignal from '../aliveSignal/aliveSignal.interface';
import IService from './service.interface';
import ServiceRepository from './service.repository';
import getTimeInSeconds from '../utils/utils';

export default class ServiceManager {
    public static async update(aliveSignal: IAliveSignal) {
        const service: IService | null = await ServiceRepository.getOne({ name: aliveSignal.serviceName });

        if (!service) {
            return ServiceManager.create(aliveSignal);
        }

        return ServiceRepository.update(
            aliveSignal.serviceName,
            ServiceManager.updateServiceTimes(service, aliveSignal),
        );
    }

    private static updateServiceTimes(service: IService, aliveSignal: IAliveSignal): IService {
        const currentAlivePeriodInSeconds: number = Number(aliveSignal.upTimeInSeconds);

        const lastContactDateInSeconds: number = getTimeInSeconds(service.lastContactDate);
        const currentDateInSeconds: number = getTimeInSeconds(new Date());

        const currentSilentPeriodInSeconds: number =
            currentDateInSeconds - (lastContactDateInSeconds + currentAlivePeriodInSeconds);

        return {
            name: service.name,
            lastContactDate: new Date(),
            currentAlivePeriodInSeconds,
            longestAlivePeriodInSeconds: Math.max(currentAlivePeriodInSeconds, service.longestAlivePeriodInSeconds),
            longestSilentPeriodInSeconds: Math.max(currentSilentPeriodInSeconds, service.longestSilentPeriodInSeconds),
        };
    }

    private static create(aliveSignal: IAliveSignal) {
        return ServiceRepository.create({
            name: aliveSignal.serviceName,
            lastContactDate: new Date(),
            currentAlivePeriodInSeconds: Number(aliveSignal.upTimeInSeconds),
            longestAlivePeriodInSeconds: Number(aliveSignal.upTimeInSeconds),
            longestSilentPeriodInSeconds: 0,
        });
    }
}
