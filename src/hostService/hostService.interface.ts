export default interface IHostService {
    id?: string;
    hostname: string;
    service: string;
    createdAt?: Date;
    lastAliveSignal?: Date;
}
