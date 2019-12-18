import IHostService from './hostService.interface';
import HostServiceModel from './hostService.model';

export default class HostServiceRepository {
    public static create(hostService: IHostService) {
        return HostServiceModel.create(hostService);
    }
}
