import React from 'react';
import { InitWalletData } from './wallet';
import { InitCache } from './cache';
import { InitContracts } from './contracts/contract';

export default function InitStateAll() {
    return (
        <>
            <InitWalletData />
            <InitCache />
            <InitContracts />
        </>
    );
}
