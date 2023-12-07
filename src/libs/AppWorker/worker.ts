import { TZkFuction, zkFunctions } from './zkFunction';

export type ZkappWorkerRequest = {
    id: number;
    fn: TZkFuction;
    args: any;
};

export type ZkappWorkerReponse = {
    id: number;
    data: any;
};

if (typeof window !== 'undefined') {
    addEventListener('message', async (event: MessageEvent<ZkappWorkerRequest>) => {
        const returnData = await zkFunctions[event.data.fn](event.data.args);

        const message: ZkappWorkerReponse = {
            id: event.data.id,
            data: returnData,
        };
        postMessage(message);
    });
}

console.log('Web Worker Successfully Initialized.');
