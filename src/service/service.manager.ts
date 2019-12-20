import IAliveSignal from '../aliveSignal/aliveSignal.interface';
import IService from './service.interface';
import ServiceRepository from './service.repository';

const MILLISECONDS_IN_SECONDS: number = 1000;

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
        let { longestAlivePeriodInSeconds, longestSilentPeriodInSeconds } = service;

        const lastContactDateInSeconds: number = service.lastContactDate.getTime() / MILLISECONDS_IN_SECONDS;
        const currentDateInSeconds: number = new Date().getTime() / MILLISECONDS_IN_SECONDS;
        const currentSilentPeriodInSeconds: number =
            currentDateInSeconds - (lastContactDateInSeconds + currentAlivePeriodInSeconds);

        if (currentAlivePeriodInSeconds > longestAlivePeriodInSeconds) {
            longestAlivePeriodInSeconds = currentAlivePeriodInSeconds;
        }

        if (currentSilentPeriodInSeconds >= longestSilentPeriodInSeconds) {
            longestSilentPeriodInSeconds = currentSilentPeriodInSeconds;
        }

        return {
            name: service.name,
            lastContactDate: new Date(),
            currentAlivePeriodInSeconds,
            longestAlivePeriodInSeconds,
            longestSilentPeriodInSeconds,
        };
    }

    private static create(aliveSignal: IAliveSignal) {
        return ServiceRepository.create({
            name: aliveSignal.serviceName,
            lastContactDate: new Date(),
            currentAlivePeriodInSeconds: aliveSignal.upTimeInSeconds,
            longestAlivePeriodInSeconds: aliveSignal.upTimeInSeconds,
            longestSilentPeriodInSeconds: 0,
        });
    }
}
