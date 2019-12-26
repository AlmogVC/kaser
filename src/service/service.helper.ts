import getTimeInSeconds from '../utils/utils';
import IService from './service.interface';

export function updateServiceTimes(service: IService, maxSilenceTimeInSeconds: number): IService {
    const currentDateInSeconds: number = getTimeInSeconds(new Date());
    const currentAlivePeriodInSeconds: number = getCurrentAlivePeriod(
        service,
        currentDateInSeconds,
        maxSilenceTimeInSeconds,
    );

    let { longestDeadPeriodInSeconds } = service;

    if (currentAlivePeriodInSeconds === 0) {
        const currentSilentPeriodInSeconds: number = getCurrentSilentPeriod(
            service.lastContactDate,
            currentDateInSeconds,
        );

        longestDeadPeriodInSeconds = Math.max(currentSilentPeriodInSeconds, longestDeadPeriodInSeconds);
    }

    return {
        name: service.name,
        lastContactDate: new Date(),
        currentAlivePeriodInSeconds,
        longestAlivePeriodInSeconds: Math.max(currentAlivePeriodInSeconds, service.longestAlivePeriodInSeconds),
        longestDeadPeriodInSeconds,
    };
}

export function getCurrentSilentPeriod(lastContactDate: Date, currentDateInSeconds: number) {
    return currentDateInSeconds - getTimeInSeconds(lastContactDate);
}

export function getCurrentAlivePeriod(
    service: IService,
    currentDateInSeconds: number,
    maxSilenceTimeInSeconds: number,
): number {
    const lastContactDateInSeconds: number = getTimeInSeconds(service.lastContactDate);

    const wasServiceDead: boolean = lastContactDateInSeconds + maxSilenceTimeInSeconds < currentDateInSeconds;

    if (wasServiceDead) return 0;

    return service.currentAlivePeriodInSeconds + (currentDateInSeconds - lastContactDateInSeconds);
}
