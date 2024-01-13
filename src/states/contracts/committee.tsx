import { atom, useAtom, useAtomValue } from 'jotai';
import ZkAppWorkerClient from 'src/libs/AppWorker/zkWorkerClient';
import { toast } from 'react-toastify';

export type TContractData = {
    workerClient: ZkAppWorkerClient | null;
    isInitWorker: boolean;
    isLoading: boolean;
};

const initData: TContractData = {
    workerClient: null,
    isInitWorker: true,
    isLoading: false,
};

const committeeContract = atom<TContractData>(initData);

export const useContractData = () => useAtomValue(committeeContract);

export const useContractFunction = () => {
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
                // await committee.workerClient.setActiveInstanceToBerkeley();
                await committee.workerClient.loadContract();
                await committee.workerClient.compileContract(cacheFiles);
                await committee.workerClient.initZkappInstance({
                    committeeContract: 'B62qmpvE5LFDgC5ocRiCMEFWhigtJ88FRniCpPPou2MMQqBLancqB7f',
                    dkgContract: 'B62qqW6Zparz1cdzjTtwX6ytWtq58bbraBr15FLHGMTm6pGqtNHF6ZJ',
                    responseContract: 'B62qkQcrJRMhNZ1NQKuSr6bBixygm89QPK2pfiwkhCQVX7Wff6xuXDj',
                    round1Contract: 'B62qnBrR7nnKt3rVLbBYKzseJNYvZzirqLKMgD4cTuNRqi86GccZKfV',
                    round2Contract: 'B62qmHEtKzNY1Zf3WhmagCLBr6j6gr9VRoGbm5Vk8tuEUsMmHVDQKLi',
                    requestContract: 'B62qjJxzrjVFTQZyW781zVYB6roGP5UBwvbRyjxXNXXssxoyjmbgVpB',
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
