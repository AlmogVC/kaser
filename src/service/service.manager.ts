import IAliveSignal from '../aliveSignal/aliveSignal.interface';
import IService from './service.interface';
import ServiceRepository from './service.repository';
import getTimeInSeconds from '../utils/utils';
import config from '../config';

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
        const currentAlivePeriodInSeconds: number = ServiceManager.getCurrentAlivePeriod(service, aliveSignal);

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

    private static getCurrentAlivePeriod(service: IService, aliveSignal: IAliveSignal): number {
        const currentDateInSeconds: number = getTimeInSeconds(new Date());
        const lastContactInSeconds: number = getTimeInSeconds(service.lastContactDate);

        const wasServiceDead: boolean =
            lastContactInSeconds + config.service.maxSilenceTimeInSeconds < currentDateInSeconds;

        if (wasServiceDead) return 0;

        return service.currentAlivePeriodInSeconds + (currentDateInSeconds - lastContactInSeconds);
    }

    private static create(aliveSignal: IAliveSignal) {
        return ServiceRepository.create({
            name: aliveSignal.serviceName,
            lastContactDate: new Date(),
            currentAlivePeriodInSeconds: 0,
            longestAlivePeriodInSeconds: 0,
            longestSilentPeriodInSeconds: 0,
        });
    }
}
