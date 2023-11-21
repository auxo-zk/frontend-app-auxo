// import { CommitteeContract,  } from '@auxo-dev/dkg/build/esm/src/contracts/Committee';
// import { ZkApp } from '@auxo-dev/dkg';
import { CommitteeContract } from '@auxo-dev/dkg/build/esm/src/contracts/Committee';
import { Box, Typography } from '@mui/material';
import { PublicKey, Cache } from 'o1js';
import React, { useEffect, useState } from 'react';
import { sleep } from 'src/utils/format';

const createCommittee = [
    { name: 'step-vk-create-committee-firststep', type: 'string' },
    { name: 'step-vk-create-committee-nextstep', type: 'string' },
    { name: 'wrap-vk-create-committee', type: 'string' },
    { name: 'step-vk-committeecontract-checkconfig', type: 'string' },
    { name: 'step-vk-committeecontract-checkmember', type: 'string' },
    { name: 'step-vk-committeecontract-createcommittee', type: 'string' },
    { name: 'step-vk-committeecontract-rollupincrements', type: 'string' },
    { name: 'wrap-vk-committeecontract', type: 'string' },
    { name: 'lagrange-basis-fp-16384', type: 'string' },
    { name: 'lagrange-basis-fp-2048', type: 'string' },
    { name: 'lagrange-basis-fp-32768', type: 'string' },
    { name: 'lagrange-basis-fp-4096', type: 'string' },
    { name: 'lagrange-basis-fp-65536', type: 'string' },
    { name: 'lagrange-basis-fq-16384', type: 'string' },
    { name: 'lagrange-basis-fq-8192', type: 'string' },
    { name: 'srs-fp-65536', type: 'string' },
    { name: 'srs-fq-32768', type: 'string' },
];

const committeeContract = [
    { name: 'public/Caches/step-vk-committeecontract-checkconfig', type: 'string' },
    { name: 'public/Caches/step-vk-committeecontract-checkmember', type: 'string' },
    { name: 'public/Caches/step-vk-committeecontract-createcommittee', type: 'string' },
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

const FileSystem = (files: any): Cache => ({
    read({ persistentId, uniqueId, dataType }: any) {
        // read current uniqueId, return data if it matches
        if (!files[persistentId]) {
            console.log('read');
            console.log({ persistentId, uniqueId, dataType });

            return undefined;
        }

        const currentId = files[persistentId].header;

        if (currentId !== uniqueId) {
            console.log('current id did not match persistent id');

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
        console.log('write');
        console.log({ persistentId, uniqueId, dataType });
    },
    canWrite: true,
});

export default function Test() {
    const [compiling, setCompiling] = useState<boolean>(true);
    const [zkAppPubkey, setZkAppPubkey] = useState<PublicKey | null>(null);
    const [zkApp, setApp] = useState<CommitteeContract | null>(null);
    const [error, setError] = useState<Error | null>(null);
    useEffect(() => {
        (async () => {
            setCompiling(true);

            try {
                await sleep(3000);
                const { ZkApp } = await import('@auxo-dev/dkg');
                console.log('load import zkApp done....');
                const zkappPublicKey = PublicKey.fromBase58('B62qmGae1WGtFY2rGBsP9nj4KuqY1nWqptYX5yu3dqvfu39kugHnyRh');
                const _zkapp = new ZkApp.Committee.CommitteeContract!(zkappPublicKey);
                console.log('new CommitteeContract....', zkappPublicKey);

                const cacheFiles = await fetchFiles(createCommittee);
                console.log('Load cacheFile done', cacheFiles);
                await ZkApp.Committee.CreateCommittee.compile({ cache: FileSystem(cacheFiles) });
                console.log('await CreateCommittee done');
                await ZkApp.Committee.CommitteeContract.compile({ cache: FileSystem(cacheFiles) });
                console.log('await CommitteeContract done done');
                setApp(_zkapp);
                setZkAppPubkey(zkappPublicKey);
            } catch (err) {
                console.log(err);
                setError(err as Error);
            }

            setCompiling(false);
        })();
    }, []);
    return (
        <Box>
            {compiling ? (
                <Typography textAlign={'center'}>Compiling contract CommitteeContract......</Typography>
            ) : (
                <>{error ? <Typography>{error.message}</Typography> : <Typography textAlign={'center'}>Done</Typography>}</>
            )}
        </Box>
    );
}
