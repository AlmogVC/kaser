import IAliveSignal from '../aliveSignal/aliveSignal.interface';
import IService from './service.interface';
import ServiceRepository from './service.repository';
import getTimeInSeconds from '../utils/utils';
import config from '../config';
import ServiceHostManager from '../serviceHost/serviceHost.manager';
import IServiceHost from '../serviceHost/serviceHost.interface';

export default class ServiceManager {
    public static async update(aliveSignal: IAliveSignal) {
        const service: IService | null = await ServiceRepository.getOne({ name: aliveSignal.serviceName });

        if (!service) {
            return ServiceManager.create(aliveSignal);
        }

        return ServiceRepository.update(aliveSignal.serviceName, ServiceManager.updateServiceTimes(service));
    }

    public static async getMany(options?: Partial<{ includeHosts: boolean; areAlive: boolean }>) {
        let services: IService[];

        if (options && options.areAlive !== undefined) {
            services = await ServiceRepository.getServicesByAliveState(
                options.areAlive,
                config.service.maxSilenceTimeInSeconds,
            );
        } else {
            services = await ServiceRepository.getAll();
        }

        if (options && options.includeHosts !== undefined) {
            const hosts: IServiceHost[] = await ServiceHostManager.getMany({});

            return ServiceManager.populateServiceHosts(services, hosts);
        }

        return services;
    }

    private static populateServiceHosts(services: IService[], hosts: IServiceHost[]) {
        const populatedServices: (IService & { hosts?: Omit<IServiceHost, 'service'>[] })[] = services;
        const serviceDictionary: { [key: string]: Omit<IServiceHost, 'service'>[] } = {};

        hosts.forEach(host => {
            const { service, ...hostWithoutServiceName } = host;

            if (!serviceDictionary[service]) serviceDictionary[service] = [];

            serviceDictionary[service].push(hostWithoutServiceName);
        });

        return populatedServices.map(service => {
            return { ...service, hosts: serviceDictionary[service.name] };
        });
    }

    private static updateServiceTimes(service: IService): IService {
        const currentDateInSeconds: number = getTimeInSeconds(new Date());
        const currentAlivePeriodInSeconds: number = ServiceManager.getCurrentAlivePeriod(service, currentDateInSeconds);

        const currentSilentPeriodInSeconds: number = ServiceManager.getCurrentSilentPeriod(
            service.lastContactDate,
            currentAlivePeriodInSeconds,
            currentDateInSeconds,
        );

        let { longestDeadPeriodInSeconds } = service;

        if (currentAlivePeriodInSeconds === 0) {
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

    private static getCurrentSilentPeriod(
        lastContactDate: Date,
        currentAlivePeriodInSeconds: number,
        currentDateInSeconds: number,
    ) {
        return currentDateInSeconds - (getTimeInSeconds(lastContactDate) + currentAlivePeriodInSeconds);
    }

    private static getCurrentAlivePeriod(service: IService, currentDateInSeconds: number): number {
        const lastContactDateInSeconds: number = getTimeInSeconds(service.lastContactDate);

        const wasServiceDead: boolean =
            lastContactDateInSeconds + config.service.maxSilenceTimeInSeconds < currentDateInSeconds;

        if (wasServiceDead) return 0;

        return service.currentAlivePeriodInSeconds + (currentDateInSeconds - lastContactDateInSeconds);
    }

    private static create(aliveSignal: IAliveSignal) {
        return ServiceRepository.create({
            name: aliveSignal.serviceName,
            lastContactDate: new Date(),
            currentAlivePeriodInSeconds: 0,
            longestAlivePeriodInSeconds: 0,
            longestDeadPeriodInSeconds: 0,
        });
    }
}
