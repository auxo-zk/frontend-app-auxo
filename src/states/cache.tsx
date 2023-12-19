import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Cache } from 'o1js';
import { useEffect } from 'react';

export const FileSystem = (files: any): Cache => ({
    read({ persistentId, uniqueId, dataType }: any) {
        // read current uniqueId, return data if it matches
        if (!files[persistentId]) {
            console.log('read null file persistentId =>', { persistentId, uniqueId, dataType });
            return undefined;
        }

        const currentId = files[persistentId].header;

        if (currentId !== uniqueId) {
            console.log('current id did not match persistent id =>', currentId);
            return undefined;
        }

        if (dataType === 'string') {
            console.log('found in cache', { persistentId, uniqueId, dataType });
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
    { name: 'lagrange-basis-fp-32768', type: 'string' },
    { name: 'lagrange-basis-fp-8192', type: 'string' },
    { name: 'lagrange-basis-fq-16384', type: 'string' },
    { name: 'lagrange-basis-fq-8192', type: 'string' },
    { name: 'srs-fp-65536', type: 'string' },
    { name: 'srs-fq-32768', type: 'string' },
    { name: 'step-vk-batch-decryption-decrypt', type: 'string' },
    { name: 'step-vk-batch-encryption-encrypt', type: 'string' },
    { name: 'step-vk-committeecontract-checkconfig', type: 'string' },
    { name: 'step-vk-committeecontract-checkmember', type: 'string' },
    { name: 'step-vk-committeecontract-createcommittee', type: 'string' },
    { name: 'step-vk-committeecontract-rollupincrements', type: 'string' },
    { name: 'step-vk-complete-response-firststep', type: 'string' },
    { name: 'step-vk-complete-response-nextstep', type: 'string' },
    { name: 'step-vk-create-committee-firststep', type: 'string' },
    { name: 'step-vk-create-committee-nextstep', type: 'string' },
    { name: 'step-vk-create-request-firststep', type: 'string' },
    { name: 'step-vk-create-request-nextstep', type: 'string' },
    { name: 'step-vk-dkgcontract-committeeaction', type: 'string' },
    { name: 'step-vk-dkgcontract-publicaction', type: 'string' },
    { name: 'step-vk-dkgcontract-updatekeys', type: 'string' },
    { name: 'step-vk-finalize-round-1-firststep', type: 'string' },
    { name: 'step-vk-finalize-round-1-nextstep', type: 'string' },
    { name: 'step-vk-finalize-round-2-firststep', type: 'string' },
    { name: 'step-vk-finalize-round-2-nextstep', type: 'string' },
    { name: 'step-vk-reduce-response-contribution-firststep', type: 'string' },
    { name: 'step-vk-reduce-response-contribution-nextstep', type: 'string' },
    { name: 'step-vk-reduce-round-1-contribution-firststep', type: 'string' },
    { name: 'step-vk-reduce-round-1-contribution-nextstep', type: 'string' },
    { name: 'step-vk-reduce-round-2-contribution-firststep', type: 'string' },
    { name: 'step-vk-reduce-round-2-contribution-nextstep', type: 'string' },
    { name: 'step-vk-requestcontract-request', type: 'string' },
    { name: 'step-vk-requestcontract-resolverequest', type: 'string' },
    { name: 'step-vk-requestcontract-rolluprequest', type: 'string' },
    { name: 'step-vk-requestcontract-unrequest', type: 'string' },
    { name: 'step-vk-responsecontract-complete', type: 'string' },
    { name: 'step-vk-responsecontract-contribute', type: 'string' },
    { name: 'step-vk-responsecontract-reduce', type: 'string' },
    { name: 'step-vk-round1contract-contribute', type: 'string' },
    { name: 'step-vk-round1contract-finalize', type: 'string' },
    { name: 'step-vk-round1contract-reduce', type: 'string' },
    { name: 'step-vk-round2contract-contribute', type: 'string' },
    { name: 'step-vk-round2contract-finalize', type: 'string' },
    { name: 'step-vk-round2contract-reduce', type: 'string' },
    { name: 'step-vk-update-key-firststep', type: 'string' },
    { name: 'step-vk-update-key-nextstep', type: 'string' },
    { name: 'step-vk-update-key-nextstepgeneration', type: 'string' },
    { name: 'wrap-vk-batch-decryption', type: 'string' },
    { name: 'wrap-vk-batch-encryption', type: 'string' },
    { name: 'wrap-vk-committeecontract', type: 'string' },
    { name: 'wrap-vk-complete-response', type: 'string' },
    { name: 'wrap-vk-create-committee', type: 'string' },
    { name: 'wrap-vk-create-request', type: 'string' },
    { name: 'wrap-vk-dkgcontract', type: 'string' },
    { name: 'wrap-vk-finalize-round-1', type: 'string' },
    { name: 'wrap-vk-finalize-round-2', type: 'string' },
    { name: 'wrap-vk-reduce-response-contribution', type: 'string' },
    { name: 'wrap-vk-reduce-round-1-contribution', type: 'string' },
    { name: 'wrap-vk-reduce-round-2-contribution', type: 'string' },
    { name: 'wrap-vk-requestcontract', type: 'string' },
    { name: 'wrap-vk-responsecontract', type: 'string' },
    { name: 'wrap-vk-round1contract', type: 'string' },
    { name: 'wrap-vk-round2contract', type: 'string' },
    { name: 'wrap-vk-update-key', type: 'string' },
];

function fetchFiles(files: { name: string; type: string }[]) {
    return Promise.all(
        files.map((file) => {
            return Promise.all([fetch(`/Caches/${file.name}.header`).then((res) => res.text()), fetch(`/Caches/${file.name}`).then((res) => res.text())]).then(([header, data]) => ({
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

export function InitCache() {
    const { fetchFileCache } = useCacheContractFunction();
    useEffect(() => {
        fetchFileCache();
    }, []);
    return <></>;
}
