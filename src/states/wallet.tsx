import { PrimitiveAtom, atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Mina, PublicKey, fetchAccount } from 'o1js';
import { useEffect, useLayoutEffect } from 'react';
import { toast } from 'react-toastify';
import { LocalStorageKey, LocalStorageValue } from 'src/constants';

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
    isConnecting: true,
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
            localStorage.setItem(LocalStorageKey.IsConnected, LocalStorageValue.IsConnectedYes);
        } catch (err) {
            console.log(err);
            toast((err as Error).message, { type: 'error', position: 'top-center', theme: 'dark' });

            setWalletData({
                userAddress: '',
                userPubKey: null,
                accountExists: false,
                isConnecting: false,
            });
            localStorage.setItem(LocalStorageKey.IsConnected, LocalStorageValue.IsConnectedNo);
        }
    }

    async function disconnectWallet() {
        localStorage.setItem(LocalStorageKey.IsConnected, LocalStorageValue.IsConnectedNo);
        window.location.reload();
    }

    return {
        setWalletData,
        connectWallet,
        disconnectWallet,
    };
};

export default function InitWalletData() {
    const { userAddress } = useWalletData();
    const { connectWallet, setWalletData } = useWalletFunction();
    useEffect(() => {
        if (localStorage.getItem(LocalStorageKey.IsConnected) == LocalStorageValue.IsConnectedYes) {
            connectWallet();
        } else {
            setWalletData({ isConnecting: false });
        }
    }, []);

    useEffect(() => {
        if (userAddress) {
            window.mina?.on('accountsChanged', (accounts: string[]) => {
                connectWallet();
            });

            return () => {
                window.mina?.on('accountsChanged', (accounts: string[]) => {});
            };
        }
    }, [userAddress]);

    return null;
}
