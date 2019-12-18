import IAliveSignal from './aliveSignal.interface';
import AliveSignalModel from './aliveSignal.model';

export default class AliveRepository {
    public static create(aliveSignal: IAliveSignal) {
        return AliveSignalModel.create(aliveSignal);
    }
}
