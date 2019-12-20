import IService from './service.interface';
import ServiceModel from './service.model';

export default class ServiceRepository {
    public static getOne(serviceFilter: Partial<IService>) {
        return ServiceModel.findOne(serviceFilter).exec();
    }

    public static create(service: IService) {
        return ServiceModel.create(service);
    }

    public static update(name: string, updatedService: Partial<IService>) {
        delete updatedService.name;
        delete updatedService.createdAt;
        delete updatedService.id;

        return ServiceModel.findOneAndUpdate({ name }, updatedService, { new: true });
    }
}
