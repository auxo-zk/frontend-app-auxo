import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { FileSystem } from '../cache';
import { PublicKey } from 'o1js';
import { sleep } from 'src/utils/format';
import ZkAppWorkerClient from 'src/libs/AppWorker/zkWorkerClient';
import { toast } from 'react-toastify';

export type TContractData = {
    workerClient: ZkAppWorkerClient | null;
    isInitWorker: boolean;
    isLoading: boolean;
    address: string;
    publicKey: PublicKey;
};

const initData: TContractData = {
    address: 'B62qmGae1WGtFY2rGBsP9nj4KuqY1nWqptYX5yu3dqvfu39kugHnyRh',
    workerClient: null,
    isInitWorker: true,
    isLoading: false,
    publicKey: PublicKey.fromBase58('B62qmGae1WGtFY2rGBsP9nj4KuqY1nWqptYX5yu3dqvfu39kugHnyRh'),
};

const committeeContract = atom<TContractData>(initData);

export const useCommitteeContract = () => useAtomValue(committeeContract);

export const useCommitteeContractFunction = () => {
    const [committee, _setCommitteeContractData] = useAtom(committeeContract);

    function setCommitteeContractData(data: Partial<TContractData>) {
        return _setCommitteeContractData((prev) => {
            return {
                ...prev,
                ...data,
            };
        });
    }
    async function initClient() {
        setCommitteeContractData({ isInitWorker: true });
        try {
            console.log('Loading web worker...');
            const _zkapp = new ZkAppWorkerClient();
            await _zkapp.loadWorker();
            console.log('Done loading web worker');
            setCommitteeContractData({
                isInitWorker: false,
                workerClient: _zkapp,
            });
        } catch (err) {
            console.log(err);
            setCommitteeContractData({
                isInitWorker: false,
                workerClient: null,
            });
        }
    }
    async function complie(cacheFiles: any) {
        setCommitteeContractData({ isLoading: true });
        try {
            if (committee.workerClient) {
                await committee.workerClient.setActiveInstanceToBerkeley();
                await committee.workerClient.loadContract();
                await committee.workerClient.compileContract(cacheFiles);
                await committee.workerClient.initZkappInstance('B62qmGae1WGtFY2rGBsP9nj4KuqY1nWqptYX5yu3dqvfu39kugHnyRh');
                setCommitteeContractData({
                    isLoading: false,
                });
                toast('Compiled contract successfully!', { position: 'bottom-left', type: 'success' });
            }
        } catch (err) {
            console.log(err);
            setCommitteeContractData({
                isLoading: false,
            });
        }
    }

    return {
        setCommitteeContractData,
        complie,
        initClient,
    };
};
