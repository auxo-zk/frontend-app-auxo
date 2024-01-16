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
            if (event.data.status == 'failed') {
                this.promises[event.data.id].reject(event.data.error);
                delete this.promises[event.data.id];
            } else {
                this.promises[event.data.id].resolve(event.data.data);
                delete this.promises[event.data.id];
            }
        };
    }
    async loadWorker(): Promise<void> {
        await sleep(4100);
    }
    async sendTransaction(transactionJSON: string, memo?: string) {
        const transactionFee = 0.1;
        const { hash } = await window.mina!.sendTransaction({
            transaction: transactionJSON,
            feePayer: {
                fee: transactionFee,
                memo: memo || '',
            },
        });
        const transactionLink = `https://berkeley.minaexplorer.com/transaction/${hash}`;
        return { hash, transactionLink };
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
    initZkappInstance(args: ArgumentZkFuction<'initZkappInstance'>) {
        return this._call('initZkappInstance', args);
    }

    createCommittee(args: ArgumentZkFuction<'createCommittee'>) {
        return this._call('createCommittee', args);
    }
    genNewKeyContributions(args: ArgumentZkFuction<'genNewKeyContributions'>) {
        return this._call('genNewKeyContributions', args);
    }
    proveTransaction() {
        return this._call('proveTransaction', {});
    }
    getTransactionJSON() {
        return this._call('getTransactionJSON', {});
    }
    getPercentageComplieDone() {
        return this._call('getPercentageComplieDone', {});
    }
    submitContributionRound1(args: ArgumentZkFuction<'submitContributionRound1'>) {
        return this._call('submitContributionRound1', args);
    }
    submitContributionRound2(args: ArgumentZkFuction<'submitContributionRound2'>) {
        return this._call('submitContributionRound2', args);
    }
    deprecateKey(args: ArgumentZkFuction<'deprecateKey'>) {
        return this._call('deprecateKey', args);
    }
    submitContributionRequest(args: ArgumentZkFuction<'submitContributionRequest'>) {
        return this._call('submitContributionRequest', args);
    }
}
