import IHostService from './hostService.interface';
import HostServiceRepository from './hostService.repository';

export default class HostServiceManager {
    public static create(hostService: IHostService) {
        return HostServiceRepository.create(hostService);
    }
}
