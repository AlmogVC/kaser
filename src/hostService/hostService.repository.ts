import IHostService from './hostService.interface';
import HostServiceModel from './hostService.model';

export default class HostServiceRepository {
    public static create(hostService: IHostService) {
        return HostServiceModel.create(hostService);
    }

    public static getOne(service: string, hostname: string) {
        return HostServiceModel.findOne({ service, hostname });
    }
}
