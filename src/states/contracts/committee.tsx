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
                await committee.workerClient.setActiveInstanceToBerkeley();
                await committee.workerClient.loadContract();
                await committee.workerClient.compileContract(cacheFiles);
                await committee.workerClient.initZkappInstance({
                    committeeContract: 'B62qiYCgNQhu1KddDQZs7HL8cLqRd683YufYX1BNceZ6BHnC1qfEcJ9',
                    dkgContract: 'B62qr8z7cT4D5Qq2aH7SabUDbpXEb8EXMCUin26xmcJNQtVu616CNFC',
                    responseContract: 'B62qoFQQosbN2JfquHyzePdyEN71cbCWf2Jb6am9RR65KVHy1s9kh67',
                    round1Contract: 'B62qmj3E8uH1gqtzvywLvP3aaTSaxby9z8LyvBcK7nNQJ67NQMXRXz8',
                    round2Contract: 'B62qmZrJai7AG7pffzP4MdufR9ejPesn9ZdZkvJQXisMDUSTJZ846LE',
                    requestContract: 'B62qjidL7d5rEjkoNqSJRZxdv84ZXrAFpADiaaEyL3pbb9TYcAfMCgy',
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
