import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { FetchStatus } from 'src/constants';
import { TCommitteeData, getListCommittees } from 'src/services/services';
import { useWalletData } from 'src/states/wallet';

export type TEncrytionPageData = {
    status: FetchStatus;
    listCommittee: TCommitteeData[];
    selectedCommittee: TCommitteeData | null;
};

const initData: TEncrytionPageData = {
    status: FetchStatus.IDLE,
    listCommittee: [],
    selectedCommittee: null,
};

const state = atom<TEncrytionPageData>(initData);

export const useEncrytionPageData = () => useAtomValue(state);

export const useEncrytionPageFunction = () => {
    const _setData = useSetAtom(state);

    function setEncrytionPageData(data: Partial<TEncrytionPageData>) {
        _setData((prev) => {
            return { ...prev, ...data };
        });
    }

    async function getListCommitteeOptions(address: string, setStatus?: FetchStatus) {
        if (setStatus) {
            setEncrytionPageData({ status: setStatus });
        }
        try {
            const response = await getListCommittees(address);
            setEncrytionPageData({ status: FetchStatus.SUCCESS, listCommittee: response, selectedCommittee: null });
        } catch (error) {
            setEncrytionPageData({ status: FetchStatus.FAILED, listCommittee: [], selectedCommittee: null });
            console.log(error);
        }
    }

    return {
        setEncrytionPageData,
        getListCommitteeOptions,
    };
};

export default function InitStateEncrytionPage() {
    const { isConnecting, userAddress } = useWalletData();
    const { getListCommitteeOptions } = useEncrytionPageFunction();

    useEffect(() => {
        if (userAddress) {
            getListCommitteeOptions(userAddress, FetchStatus.FETCHING);
        }
    }, [userAddress]);
    return <></>;
}
