import IServiceHost from './serviceHost.interface';
import ServiceHostModel from './serviceHost.model';

export default class ServiceHostRepository {
    public static create(serviceHost: IServiceHost) {
        return ServiceHostModel.create(serviceHost);
    }

    public static updateLastAliveDate(service: string, hostname: string) {
        return ServiceHostModel.findOneAndUpdate({ service, hostname }, { lastAliveDate: new Date() }, { new: true });
    }

    public static getOne(service: string, hostname: string) {
        return ServiceHostModel.findOne({ service, hostname });
    }
}
