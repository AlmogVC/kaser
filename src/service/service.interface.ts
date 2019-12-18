export default interface IService {
    name: string;
    lastAliveDate: Date;
    longestSilentPeriodInMinutes: number;
    longestAlivePeriodInMinutes: number;
    currentAlivePeriodInMinutes: number;
}
