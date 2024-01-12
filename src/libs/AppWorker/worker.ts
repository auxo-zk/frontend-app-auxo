import { TZkFuction, zkFunctions } from './zkFunction';

export type ZkappWorkerRequest = {
    id: number;
    fn: TZkFuction;
    args: any;
};

export type ZkappWorkerReponse = {
    id: number;
    data: any;
    status: 'success' | 'failed';
    error: any;
};

if (typeof window !== 'undefined') {
    addEventListener('message', async (event: MessageEvent<ZkappWorkerRequest>) => {
        try {
            const returnData = await zkFunctions[event.data.fn](event.data.args);

            const message: ZkappWorkerReponse = {
                id: event.data.id,
                data: returnData,
                error: null,
                status: 'success',
            };
            postMessage(message);
        } catch (error) {
            console.error(error);
            const message: ZkappWorkerReponse = {
                id: event.data.id,
                data: null,
                error: (error as Error).message,
                status: 'failed',
            };
            postMessage(message);
        }
    });
}

console.log('Web Worker Successfully Initialized.');
