import IServiceHost from './serviceHost.interface';
import ServiceHostRepository from './serviceHost.repository';

export default class ServiceHostManager {
    public static async create(serviceHost: IServiceHost) {
        const existingHostService: IServiceHost | null = await ServiceHostManager.getOne(
            serviceHost.service,
            serviceHost.hostname,
        );

        if (!existingHostService) {
            return ServiceHostRepository.create(serviceHost);
        }

        return ServiceHostRepository.updateLastAliveDate(serviceHost.service, serviceHost.hostname);
    }

    public static getOne(service: string, hostname: string) {
        return ServiceHostRepository.getOne(service, hostname);
    }

    public static getMany(serviceHostFilter: Partial<IServiceHost>) {
        return ServiceHostRepository.getMany(serviceHostFilter);
    }
}
