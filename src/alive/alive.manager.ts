import IAliveSignal from './aliveSignal.interface';
import AliveRepository from './alive.repository';

export default class AliveManager {
    public static create(aliveSignal: IAliveSignal) {
        return AliveRepository.create(aliveSignal);
    }
}
