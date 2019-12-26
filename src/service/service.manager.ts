import IAliveSignal from '../aliveSignal/aliveSignal.interface';
import IService from './service.interface';
import ServiceRepository from './service.repository';
import config from '../config';
import ServiceHostManager from '../serviceHost/serviceHost.manager';
import IServiceHost from '../serviceHost/serviceHost.interface';
import { updateServiceTimes } from './service.helper';

export default class ServiceManager {
    public static async update(aliveSignal: IAliveSignal) {
        const service: IService | null = await ServiceRepository.getOne({ name: aliveSignal.serviceName });

        if (!service) {
            return ServiceManager.create(aliveSignal.serviceName);
        }

        return ServiceRepository.update(
            aliveSignal.serviceName,
            updateServiceTimes(service, config.service.maxSilenceTimeInSeconds),
        );
    }

    public static async getMany(options?: Partial<{ includeHosts: boolean; areAlive: boolean }>) {
        let queryOptions;

        if (options && options.areAlive !== undefined) {
            queryOptions = {
                areAlive: options.areAlive,
                silentSeconds: config.service.maxSilenceTimeInSeconds,
            };
        }

        const services: IService[] = await ServiceRepository.getMany(queryOptions);

        if (options && options.includeHosts === true) {
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

    private static create(name: string) {
        return ServiceRepository.create({
            name,
            lastContactDate: new Date(),
            currentAlivePeriodInSeconds: 0,
            longestAlivePeriodInSeconds: 0,
            longestDeadPeriodInSeconds: 0,
        });
    }
}
