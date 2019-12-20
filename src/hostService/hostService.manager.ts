import IHostService from './hostService.interface';
import HostServiceRepository from './hostService.repository';

export default class HostServiceManager {
    public static async create(hostService: IHostService) {
        const existingHostService: IHostService | null = await HostServiceManager.getOne(
            hostService.service,
            hostService.hostname,
        );

        if (!existingHostService) {
            return HostServiceRepository.create(hostService);
        }

        return HostServiceRepository.updateLastAliveDate(hostService.service, hostService.hostname);
    }

    public static getOne(service: string, hostname: string) {
        return HostServiceRepository.getOne(service, hostname);
    }
}
