import IService from './service.interface';
import ServiceModel from './service.model';

export default class ServiceRepository {
    public static getOne(serviceFilter: Partial<IService>) {
        return ServiceModel.findOne(serviceFilter)
            .lean()
            .exec();
    }

    public static create(service: IService) {
        return ServiceModel.create(service);
    }

    public static update(name: string, updatedService: Partial<IService>) {
        delete updatedService.name;
        delete updatedService.createdAt;
        delete updatedService.id;

        return ServiceModel.findOneAndUpdate({ name }, updatedService, { new: true }).lean();
    }

    public static getAll() {
        return ServiceModel.find({})
            .lean()
            .exec();
    }

    public static getServicesByAliveState(areAlive: boolean, silentSeconds: number) {
        const currentDate = new Date();
        const oldestAllowedSilenceDate = new Date().setSeconds(+currentDate.getSeconds() - silentSeconds);
        let condition: { [key: string]: number };

        if (areAlive) {
            condition = { $gt: oldestAllowedSilenceDate };
        } else {
            condition = { $lte: oldestAllowedSilenceDate };
        }

        return ServiceModel.find({ lastContactDate: condition })
            .lean()
            .exec();
    }
}
