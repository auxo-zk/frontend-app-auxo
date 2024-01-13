import React from 'react';
import InitWalletData from './wallet';
import InitCache from './cache';
import InitContracts from './contracts/InitContract';

export default function InitStateAll() {
    return (
        <>
            <InitWalletData />
            <InitCache />
            <InitContracts />
        </>
    );
}
