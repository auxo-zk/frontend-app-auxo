import { sleep } from 'src/utils/format';
import { ZkappWorkerReponse, ZkappWorkerRequest } from './worker';
import { ArgumentZkFuction, ReturenValueZkFunction, TZkFuction } from './zkFunction';
import { CommitteeAction } from '@auxo-dev/dkg/build/types/src/contracts/Committee';
import { PublicKey } from 'o1js';

export default class ZkAppWorkerClient {
    worker: Worker;

    promises: { [id: number]: { resolve: (res: any) => void; reject: (err: any) => void } };

    nextId: number;

    constructor() {
        this.worker = new Worker(new URL('./worker.ts', import.meta.url));
        this.promises = {};
        this.nextId = 0;

        this.worker.onmessage = (event: MessageEvent<ZkappWorkerReponse>) => {
            this.promises[event.data.id].resolve(event.data.data);
            delete this.promises[event.data.id];
        };
    }
    async loadWorker(): Promise<void> {
        await sleep(5000);
    }

    _call<Key extends TZkFuction>(fn: Key, args: ArgumentZkFuction<Key>): ReturenValueZkFunction<Key> {
        return new Promise((resolve, reject) => {
            this.promises[this.nextId] = { resolve, reject };
            const message: ZkappWorkerRequest = { id: this.nextId, fn, args };
            this.worker.postMessage(message);
            this.nextId++;
        }) as ReturenValueZkFunction<Key>;
    }

    setActiveInstanceToBerkeley() {
        return this._call('setActiveInstanceToBerkeley', {});
    }
    loadContract() {
        console.log('Loading contract');
        return this._call('loadContract', {});
    }
    compileContract(fileCache: any) {
        return this._call('compileContract', { fileCache });
    }
    fetchAccount(publicKey58: string) {
        return this._call('fetchAccount', { publicKey58 });
    }
    initZkappInstance(publicKey58: string) {
        return this._call('initZkappInstance', { publicKey58 });
    }

    createCommittee(sender: PublicKey, action: CommitteeAction) {
        return this._call('createCommittee', { sender, action });
    }
    proveTransaction() {
        return this._call('proveTransaction', {});
    }
    getTransactionJSON() {
        return this._call('getTransactionJSON', {});
    }
}
