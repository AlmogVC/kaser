export default interface IAliveSignal {
    id?: string;
    hostname: string;
    aliveDate: Date;
    createdAt?: Date;
    serviceName: string;
    upTimeInSeconds: number;
}
