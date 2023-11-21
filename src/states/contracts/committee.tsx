import { ZkApp } from '@auxo-dev/dkg';
import { CommitteeContract } from '@auxo-dev/dkg/build/types/src/contracts/Committee';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { FileSystem } from '../cache';
import { PublicKey } from 'o1js';
import { sleep } from 'src/utils/format';

export type TContractData = {
    committee: CommitteeContract | null;
    isLoading: boolean;
    address: string;
    publicKey: PublicKey;
};

const initData: TContractData = {
    address: 'B62qmGae1WGtFY2rGBsP9nj4KuqY1nWqptYX5yu3dqvfu39kugHnyRh',
    committee: null,
    isLoading: false,
    publicKey: PublicKey.fromBase58('B62qmGae1WGtFY2rGBsP9nj4KuqY1nWqptYX5yu3dqvfu39kugHnyRh'),
};

const committeeContract = atom<TContractData>(initData);

export const useCommitteeContract = () => useAtomValue(committeeContract);

export const useCommitteeContractFunction = () => {
    const [committee, _setCommitteeContractData] = useAtom(committeeContract);

    function setCommitteeContractData(data: Partial<TContractData>) {
        return _setCommitteeContractData((prev) => {
            return {
                ...prev,
                ...data,
            };
        });
    }
    async function complie(cacheFiles: any) {
        setCommitteeContractData({ isLoading: true });
        try {
            const _zkapp = new ZkApp.Committee.CommitteeContract!(committee.publicKey);
            console.log('complie Create Committee....');
            await ZkApp.Committee.CreateCommittee.compile({ cache: FileSystem(cacheFiles) });
            console.log('complie Create Committee done');
            await ZkApp.Committee.CommitteeContract.compile({ cache: FileSystem(cacheFiles) });
            console.log('complie Committee Contract done');

            setCommitteeContractData({
                isLoading: false,
                committee: _zkapp,
            });
        } catch (err) {
            console.log(err);
            setCommitteeContractData({
                isLoading: false,
                committee: null,
            });
        }
    }

    return {
        setCommitteeContractData,
        complie,
    };
};
