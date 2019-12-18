import IAliveSignal from './aliveSignal.interface';
import AliveSignalRepository from './aliveSignal.repository';

export default class AliveSignalManager {
    public static create(aliveSignal: IAliveSignal) {
        return AliveSignalRepository.create(aliveSignal);
    }
}
