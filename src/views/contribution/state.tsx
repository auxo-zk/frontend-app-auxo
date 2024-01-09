import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { FetchStatus } from 'src/constants';
import { TCommitteeData, getListCommittees } from 'src/services/services';
import { useWalletData } from 'src/states/wallet';

export type TContributionPageData = {
    status: FetchStatus;
    listCommittee: TCommitteeData[];
    selectedCommittee: TCommitteeData | null;
};

const initData: TContributionPageData = {
    status: FetchStatus.IDLE,
    listCommittee: [],
    selectedCommittee: null,
};

const wallet = atom<TContributionPageData>(initData);

export const useContributionPageData = () => useAtomValue(wallet);

export const useContributionPageFunction = () => {
    const _setData = useSetAtom(wallet);

    function setContributionPageData(data: Partial<TContributionPageData>) {
        _setData((prev) => {
            return { ...prev, ...data };
        });
    }

    async function getListCommitteeOptions(address: string, setStatus?: FetchStatus) {
        if (setStatus) {
            setContributionPageData({ status: setStatus });
        }
        try {
            const response = await getListCommittees(address);
            setContributionPageData({ status: FetchStatus.SUCCESS, listCommittee: response, selectedCommittee: null });
        } catch (error) {
            setContributionPageData({ status: FetchStatus.FAILED, listCommittee: [], selectedCommittee: null });
            console.log(error);
        }
    }

    return {
        setContributionPageData,
        getListCommitteeOptions,
    };
};

export default function InitStateDistributionPage() {
    const { isConnecting, userAddress } = useWalletData();
    const { getListCommitteeOptions } = useContributionPageFunction();

    useEffect(() => {
        if (userAddress) {
            getListCommitteeOptions(userAddress, FetchStatus.FETCHING);
        }
    }, [userAddress]);
    return <></>;
}
