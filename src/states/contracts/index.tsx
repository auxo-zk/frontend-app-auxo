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

const appContract = atom<TContractData>(initData);

export const useContractData = () => useAtomValue(appContract);

export const useContractFunction = () => {
    const [zkapp, _setAppContractData] = useAtom(appContract);

    function setContractData(data: Partial<TContractData>) {
        return _setAppContractData((prev) => {
            return {
                ...prev,
                ...data,
            };
        });
    }
    async function initClient() {
        setContractData({ isInitWorker: true });
        try {
            console.log('Loading web worker...');
            const _zkapp = new ZkAppWorkerClient();
            await _zkapp.loadWorker();
            console.log('Done loading web worker');
            setContractData({
                isInitWorker: false,
                workerClient: _zkapp,
            });
        } catch (err) {
            console.log(err);
            setContractData({
                isInitWorker: false,
                workerClient: null,
            });
        }
    }
    async function check(id: any) {
        const percent = await zkapp.workerClient?.getPercentageComplieDone();
        if (Number(percent) < 100) {
            toast.update(id, { render: `Compiling contracts...! ${percent}%` });
        } else {
            toast.update(id, { render: `Compiled contract successfully!`, isLoading: false, type: 'success', autoClose: 3000, hideProgressBar: false });
            return true;
        }
        return false;
    }
    async function complie(cacheFiles: any) {
        setContractData({ isLoading: true });

        try {
            if (zkapp.workerClient) {
                const idtoast = toast.loading('Compiling contracts...', { position: 'bottom-left' });
                const checkComplie = setInterval(async () => {
                    if (await check(idtoast)) {
                        clearInterval(checkComplie);
                    }
                }, 2000);
                // await committee.workerClient.setActiveInstanceToBerkeley();
                await zkapp.workerClient.loadContract();
                await zkapp.workerClient.compileContract(cacheFiles);
                await zkapp.workerClient.initZkappInstance({
                    committeeContract: 'B62qmpvE5LFDgC5ocRiCMEFWhigtJ88FRniCpPPou2MMQqBLancqB7f',
                    dkgContract: 'B62qqW6Zparz1cdzjTtwX6ytWtq58bbraBr15FLHGMTm6pGqtNHF6ZJ',
                    responseContract: 'B62qn3hAqnsixpenxJfmz8zLpQA4pgLeWxsT4B9rzcZJAFnnKtSXbnJ',
                    round1Contract: 'B62qnBrR7nnKt3rVLbBYKzseJNYvZzirqLKMgD4cTuNRqi86GccZKfV',
                    round2Contract: 'B62qmHEtKzNY1Zf3WhmagCLBr6j6gr9VRoGbm5Vk8tuEUsMmHVDQKLi',
                    requestContract: 'B62qmEJ65XKnAe5H4wb5NepcvtCDwCJKiquSUW3wK8N4R9kTXyA9cdh',
                });
                setContractData({
                    isLoading: false,
                });
                // toast('Compiled contract successfully!', { position: 'bottom-left', type: 'success' });
            }
        } catch (err) {
            console.log(err);
            setContractData({
                isLoading: false,
            });
        }
    }

    return {
        setContractData,
        complie,
        initClient,
    };
};
