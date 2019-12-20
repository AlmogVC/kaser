export default interface IServiceHost {
    id?: string;
    hostname: string;
    service: string;
    createdAt?: Date;
    upTimeInSeconds: number;
    lastAliveSignal?: Date;
}
