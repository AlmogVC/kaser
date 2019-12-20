export default interface IService {
    id?: string;
    name: string;
    createdAt?: Date;
    lastContactDate: Date;
    longestSilentPeriodInSeconds: number;
    longestAlivePeriodInSeconds: number;
    currentAlivePeriodInSeconds: number;
}
