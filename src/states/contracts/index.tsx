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
                    committeeContract: 'B62qjDLMhAw54JMrJLNZsrBRcoSjbQHQwn4ryceizpsQi8rwHQLA6R1',
                    dkgContract: 'B62qogHpAHHNP7PXAiRzHkpKnojERnjZq34GQ1PjjAv5wCLgtbYthAS',
                    responseContract: 'B62qr5LYkp91sQJ9denJTY5KNg8PuSBHkf5UGKwYn7myJx8UroQ4pZk',
                    round1Contract: 'B62qony53NMnmq49kxhtW1ttrQ8xvr58SNoX5jwgPY17pMChKLrjjWc',
                    round2Contract: 'B62qpvKFv8ey9FhsGAdcXxkg8yg1vZJQGoB2EySqJDZdANwP6Mh8SZ7',
                    requestContract: 'B62qjujctknmNAsUHEiRhxttm6vZ9ipSd5nfWP8ijGgHHcRzMDRHDcu',
                });
                setContractData({
                    isLoading: false,
                });
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
