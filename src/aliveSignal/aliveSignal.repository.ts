import IAliveSignal from './aliveSignal.interface';
import AliveSignalModel from './aliveSignal.model';

export default class AliveSignalRepository {
    public static create(aliveSignal: IAliveSignal) {
        return AliveSignalModel.create(aliveSignal);
    }
}
