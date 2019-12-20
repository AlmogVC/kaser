export default interface IService {
    id?: string;
    name: string;
    createdAt?: Date;
    lastContactDate: Date;
    longestDeadPeriodInSeconds: number;
    longestAlivePeriodInSeconds: number;
    currentAlivePeriodInSeconds: number;
}
