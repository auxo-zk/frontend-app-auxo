import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Cache } from 'o1js';
import { useEffect } from 'react';

export const FileSystem = (files: any): Cache => ({
    read({ persistentId, uniqueId, dataType }: any) {
        // read current uniqueId, return data if it matches
        if (!files[persistentId]) {
            console.log('=========================================================================');
            console.log('read null file persistentId =>', { persistentId, uniqueId, dataType });
            return undefined;
        }

        const currentId = files[persistentId].header;

        if (currentId !== uniqueId) {
            console.log('=========================================================================');
            console.log('current id did not match persistent id =>', currentId);
            return undefined;
        }

        if (dataType === 'string') {
            // console.log('found in cache', { persistentId, uniqueId, dataType });
            return new TextEncoder().encode(files[persistentId].data);
        }
        // else {
        //   let buffer = readFileSync(resolve(cacheDirectory, persistentId));
        //   return new Uint8Array(buffer.buffer);
        // }

        return undefined;
    },
    write({ persistentId, uniqueId, dataType }: any, data: any) {
        console.log('write =>', { persistentId, uniqueId, dataType });
    },
    canWrite: true,
});

const cacheContractFile = [
    { name: 'lagrange-basis-fp-1024', type: 'string' },
    { name: 'lagrange-basis-fp-16384', type: 'string' },
    { name: 'lagrange-basis-fp-2048', type: 'string' },
    { name: 'lagrange-basis-fp-4096', type: 'string' },
    { name: 'lagrange-basis-fp-32768', type: 'string' },
    { name: 'lagrange-basis-fp-8192', type: 'string' },
    { name: 'lagrange-basis-fq-16384', type: 'string' },
    { name: 'lagrange-basis-fq-8192', type: 'string' },
    { name: 'srs-fp-65536', type: 'string' },
    { name: 'srs-fq-32768', type: 'string' },
    { name: 'step-vk-batchdecryption-decrypt', type: 'string' },
    { name: 'step-vk-batchencryption-encrypt', type: 'string' },
    { name: 'step-vk-committeecontract-create', type: 'string' },
    { name: 'step-vk-committeecontract-update', type: 'string' },
    { name: 'step-vk-computeresponse-compute', type: 'string' },
    { name: 'step-vk-computeresponse-init', type: 'string' },
    { name: 'step-vk-computeresult-compute', type: 'string' },
    { name: 'step-vk-computeresult-init', type: 'string' },
    { name: 'step-vk-dkgcontract-committeeaction', type: 'string' },
    { name: 'step-vk-dkgcontract-finalizecontributionround', type: 'string' },
    { name: 'step-vk-dkgcontract-update', type: 'string' },
    { name: 'step-vk-finalizeresponse-compute', type: 'string' },
    { name: 'step-vk-finalizeresponse-contribute', type: 'string' },
    { name: 'step-vk-finalizeresponse-finalize', type: 'string' },
    { name: 'step-vk-finalizeresponse-init', type: 'string' },
    { name: 'step-vk-finalizeround1-contribute', type: 'string' },
    { name: 'step-vk-finalizeround1-init', type: 'string' },
    { name: 'step-vk-finalizeround2-contribute', type: 'string' },
    { name: 'step-vk-finalizeround2-init', type: 'string' },
    { name: 'step-vk-requestcontract-claimfee', type: 'string' },
    { name: 'step-vk-requestcontract-initialize', type: 'string' },
    { name: 'step-vk-requestcontract-refund', type: 'string' },
    { name: 'step-vk-requestcontract-resolve', type: 'string' },
    { name: 'step-vk-requestcontract-update', type: 'string' },
    { name: 'step-vk-requestercontract-createtask', type: 'string' },
    { name: 'step-vk-requestercontract-finalizetask', type: 'string' },
    { name: 'step-vk-requestercontract-submitencryption', type: 'string' },
    { name: 'step-vk-requestercontract-updatetasks', type: 'string' },
    { name: 'step-vk-responsecontract-contribute', type: 'string' },
    { name: 'step-vk-responsecontract-finalize', type: 'string' },
    { name: 'step-vk-rollup-init', type: 'string' },
    { name: 'step-vk-rollup-rollup', type: 'string' },
    { name: 'step-vk-rollupcontract-recordaction', type: 'string' },
    { name: 'step-vk-rollupcontract-rollup', type: 'string' },
    { name: 'step-vk-round1contract-contribute', type: 'string' },
    { name: 'step-vk-round1contract-finalize', type: 'string' },
    { name: 'step-vk-round2contract-contribute', type: 'string' },
    { name: 'step-vk-round2contract-finalize', type: 'string' },
    { name: 'step-vk-updatecommittee-init', type: 'string' },
    { name: 'step-vk-updatecommittee-update', type: 'string' },
    { name: 'step-vk-updatekey-generate', type: 'string' },
    { name: 'step-vk-updatekey-init', type: 'string' },
    { name: 'step-vk-updatekey-update', type: 'string' },
    { name: 'step-vk-updaterequest-init', type: 'string' },
    { name: 'step-vk-updaterequest-initialize', type: 'string' },
    { name: 'step-vk-updaterequest-resolve', type: 'string' },
    { name: 'step-vk-updatetask-accumulate', type: 'string' },
    { name: 'step-vk-updatetask-create', type: 'string' },
    { name: 'step-vk-updatetask-init', type: 'string' },
    { name: 'wrap-vk-batchdecryption', type: 'string' },
    { name: 'wrap-vk-batchencryption', type: 'string' },
    { name: 'wrap-vk-committeecontract', type: 'string' },
    { name: 'wrap-vk-computeresponse', type: 'string' },
    { name: 'wrap-vk-computeresult', type: 'string' },
    { name: 'wrap-vk-dkgcontract', type: 'string' },
    { name: 'wrap-vk-finalizeresponse', type: 'string' },
    { name: 'wrap-vk-finalizeround1', type: 'string' },
    { name: 'wrap-vk-finalizeround2', type: 'string' },
    { name: 'wrap-vk-requestcontract', type: 'string' },
    { name: 'wrap-vk-requestercontract', type: 'string' },
    { name: 'wrap-vk-responsecontract', type: 'string' },
    { name: 'wrap-vk-rollup', type: 'string' },
    { name: 'wrap-vk-rollupcontract', type: 'string' },
    { name: 'wrap-vk-round1contract', type: 'string' },
    { name: 'wrap-vk-round2contract', type: 'string' },
    { name: 'wrap-vk-updatecommittee', type: 'string' },
    { name: 'wrap-vk-updatekey', type: 'string' },
    { name: 'wrap-vk-updaterequest', type: 'string' },
    { name: 'wrap-vk-updatetask', type: 'string' },
];

function fetchFiles(files: { name: string; type: string }[]) {
    return Promise.all(
        files.map((file) => {
            // return Promise.all([fetch(`/Caches/${file.name}.header`).then((res) => res.text()), fetch(`/Caches/${file.name}`).then((res) => res.text())]).then(([header, data]) => ({
            return Promise.all([
                fetch(`https://storage.googleapis.com/dkg-0_4_5-caches/${file.name}.header`).then((res) => res.text()),
                fetch(`https://storage.googleapis.com/dkg-0_4_5-caches/${file.name}`).then((res) => res.text()),
            ]).then(([header, data]) => ({
                file,
                header,
                data,
            }));
        })
    ).then((cacheList) =>
        cacheList.reduce((acc: any, { file, header, data }) => {
            acc[file.name] = { file, header, data };

            return acc;
        }, {})
    );
}

export type TCacheData = {
    isFetching: boolean;
    filesCache: any;
};
const initData: TCacheData = {
    isFetching: true,
    filesCache: null,
};

const cacheContract = atom<TCacheData>(initData);

export const useCacheContractData = () => useAtomValue(cacheContract);

export const useCacheContractFunction = () => {
    const _setCacheContractData = useSetAtom(cacheContract);

    function setCacheContractData(data: Partial<TCacheData>) {
        _setCacheContractData((prev) => {
            return { ...prev, ...data };
        });
    }

    async function fetchFileCache() {
        setCacheContractData({ isFetching: true });
        try {
            console.log('Fetching file cache....');
            const files = await fetchFiles(cacheContractFile);
            console.log('Fetch file cache done', files);
            setCacheContractData({ filesCache: files, isFetching: false });
        } catch (err) {
            console.log(err);
            setCacheContractData({ filesCache: null, isFetching: false });
        }
    }
    return {
        fetchFileCache,
    };
};

export default function InitCache() {
    const { fetchFileCache } = useCacheContractFunction();
    useEffect(() => {
        fetchFileCache();
    }, []);
    return <></>;
}
