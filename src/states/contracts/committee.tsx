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
};

const initData: TContractData = {
    address: 'B62qmGae1WGtFY2rGBsP9nj4KuqY1nWqptYX5yu3dqvfu39kugHnyRh',
    workerClient: null,
    isInitWorker: true,
    isLoading: false,
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
    async function check(id: any) {
        const percent = await committee.workerClient?.getPercentageComplieDone();
        // console.log('Call check', percent);
        if (Number(percent) < 100) {
            toast.update(id, { render: `Compiling contracts...! ${percent}%` });
        } else {
            toast.update(id, { render: `Compiled contract successfully!`, isLoading: false, type: 'success', autoClose: 3000, hideProgressBar: false });
            return true;
        }
        return false;
    }
    async function complie(cacheFiles: any) {
        setCommitteeContractData({ isLoading: true });

        try {
            if (committee.workerClient) {
                const idtoast = toast.loading('Compiling contracts...', { position: 'bottom-left' });
                const checkComplie = setInterval(async () => {
                    if (await check(idtoast)) {
                        clearInterval(checkComplie);
                    }
                }, 2000);
                await committee.workerClient.setActiveInstanceToBerkeley();
                await committee.workerClient.loadContract();
                await committee.workerClient.compileContract(cacheFiles);
                await committee.workerClient.initZkappInstance({
                    committeeContract: 'B62qoThuNontzdjMNABcYPcNh9PBsDayqmf8eoX2KPbwu7e5iG9NLWb',
                    dkgContract: 'B62qjYTkFZHdTQQb8sGsx2JHcLebGFfi5aDD6Kbdu5uRbWKFfT3V9kV',
                    responseContract: 'B62qnESJmcYus2nTHA7zKmrCWRVTEwxcCqNg2QJZsL6XvJe9Rz5TB1o',
                    round1Contract: 'B62qoEmjGL5T72rfKqh6S9fo8F71zbFwRjeWrkWSz2Crk8Jk6KrsPRt',
                    round2Contract: 'B62qnTmPcsukJe2oJhyDYWGo7xTUaBKa6GFAi2536V9HsfBxEqNmGxC',
                    requestContract: 'B62qqvGzbL8mfQEL4GnXt2v7JqGMrnh3qUgMRWbvibarStSJ2RXw9uA',
                });
                setCommitteeContractData({
                    isLoading: false,
                });
                // toast('Compiled contract successfully!', { position: 'bottom-left', type: 'success' });
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
