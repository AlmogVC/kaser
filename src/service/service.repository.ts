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

    public static getMany(options?: { areAlive: boolean; silentSeconds: number }) {
        let conditions = {};

        if (options && options.silentSeconds) {
            const currentDate = new Date();
            const oldestAllowedSilenceDate = new Date().setSeconds(+currentDate.getSeconds() - options.silentSeconds);

            const lastContactDate = options.areAlive
                ? { $gt: oldestAllowedSilenceDate }
                : { $lte: oldestAllowedSilenceDate };
            conditions = { ...conditions, lastContactDate };
        }

        return ServiceModel.find(conditions)
            .lean()
            .exec();
    }
}
