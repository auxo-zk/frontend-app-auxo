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
                await zkapp.workerClient.loadContract();
                await zkapp.workerClient.compileContract(cacheFiles);
                await zkapp.workerClient.initZkappInstance({
                    committeeContract: 'B62qj9PvzBPRtYensrBEtyr8fdcTyBr7pBgND5KSijWy8TYmAyP833o',
                    dkgContract: 'B62qizA7ZJxGakVK3Vcy6pdSedtXEY9rZber9EimAkzMAt4fCBpCQL9',
                    requestContract: 'B62qq1KbnHnU6ZDv3R1ZytiNpiU73wWnoC3WZkVF5Ndo8Nf5W6K2xe7',
                    responseContract: 'B62qkEdvSu3AYWuRYecU1jxUWEmueU8EDFKVLQNhatCRKSFcc6cREMn',
                    round1Contract: 'B62qpX4CwcA8vNvbJj4gv3uZPtsEbtfW3uWZL2h1Ew8GHDJqraKaBuX',
                    round2Contract: 'B62qrAvDSuSYgrysqENcFHRnocQ32mmtnCK4UrXBNt1i2ZjLM7KUJ5h',
                    rollUpContract: 'B62qiXmjKmziQPYWnaNQtq5hTbFoVdhG4nAMAtK3o8B8spQ6fAmzxBY',
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
