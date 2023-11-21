import { PrimitiveAtom, atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Mina, PublicKey, fetchAccount } from 'o1js';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export type TWalletData = {
    userAddress: string;
    userPubKey: null | PublicKey;
    accountExists: boolean;
    isConnecting: boolean;
    loadingZkClient: boolean;
};
const initData: TWalletData = {
    userAddress: '',
    userPubKey: null,
    accountExists: false,
    isConnecting: false,
    loadingZkClient: true,
};

const wallet = atom<TWalletData>(initData);

export const useWalletData = () => useAtomValue(wallet);
export const useWalletFunction = () => {
    const _setWalletData = useSetAtom(wallet);

    function setWalletData(data: Partial<TWalletData>) {
        _setWalletData((prev) => {
            return { ...prev, ...data };
        });
    }

    async function connectWallet() {
        setWalletData({ isConnecting: true });
        try {
            const mina = (window as any).mina;
            if (mina == null) {
                throw Error('You have to install Auro wallet first!');
            }

            const address: string = (await mina.requestAccounts())[0];
            const publicKey = PublicKey.fromBase58(address);

            const res = await fetchAccount({ publicKey });
            const accountExists = res.error == null;

            setWalletData({ userAddress: address, userPubKey: publicKey, accountExists: accountExists, isConnecting: false });
        } catch (err) {
            console.log(err);
            toast((err as Error).message, { type: 'error', position: 'top-center', theme: 'dark' });

            setWalletData({
                userAddress: '',
                userPubKey: null,
                accountExists: false,
                isConnecting: false,
            });
        }
    }

    return {
        setWalletData,
        connectWallet,
    };
};

export function InitWalletData() {
    useEffect(() => {
        const Berkeley = Mina.Network('https://proxy.berkeley.minaexplorer.com/graphql');
        console.log('Berkeley Instance Created');
        Mina.setActiveInstance(Berkeley);
    }, []);
    return null;
}
