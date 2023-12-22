import { Mina, PublicKey, fetchAccount } from 'o1js';

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { ZkApp } from '@auxo-dev/dkg';
import { ArgumentTypes } from 'src/global.config';
import { FileSystem } from 'src/states/cache';

const state = {
    TypeZkApp: null as null | typeof ZkApp,
    CommitteeContract: null as null | ZkApp.Committee.CommitteeContract,
    transaction: null as null | Transaction,
};

// ---------------------------------------------------------------------------------------

export const zkFunctions = {
    setActiveInstanceToBerkeley: async (args: {}) => {
        const Berkeley = Mina.Network('https://proxy.berkeley.minaexplorer.com/graphql');
        console.log('Berkeley Instance Created');
        Mina.setActiveInstance(Berkeley);
    },
    loadContract: async (args: {}) => {
        const { ZkApp } = await import('@auxo-dev/dkg');
        state.TypeZkApp = ZkApp;
    },
    compileContract: async (args: { fileCache: any }) => {
        await state.TypeZkApp!.DKG.UpdateKey.compile({ cache: FileSystem(args.fileCache) });
        await state.TypeZkApp!.Round1.ReduceRound1.compile({ cache: FileSystem(args.fileCache) });
        await state.TypeZkApp!.Round1.FinalizeRound1.compile({ cache: FileSystem(args.fileCache) });
        await state.TypeZkApp!.Round2.ReduceRound2.compile({ cache: FileSystem(args.fileCache) });
        await state.TypeZkApp!.Encryption.BatchEncryption.compile({ cache: FileSystem(args.fileCache) });
        await state.TypeZkApp!.Round2.FinalizeRound2.compile({ cache: FileSystem(args.fileCache) });
        await state.TypeZkApp!.Response.ReduceResponse.compile({ cache: FileSystem(args.fileCache) });
        await state.TypeZkApp!.Encryption.BatchDecryption.compile({ cache: FileSystem(args.fileCache) });
        await state.TypeZkApp!.Response.CompleteResponse.compile({ cache: FileSystem(args.fileCache) });

        await state.TypeZkApp!.Committee.CreateCommittee.compile({ cache: FileSystem(args.fileCache) });
        console.log('complie Create Committee done');

        await state.TypeZkApp!.Request.CreateRequest.compile({ cache: FileSystem(args.fileCache) });
        console.log('complie Create Request done');

        await state.TypeZkApp!.Committee.CommitteeContract.compile({ cache: FileSystem(args.fileCache) });
        console.log('complie Committee Contract done');

        await state.TypeZkApp!.DKG.DKGContract.compile({ cache: FileSystem(args.fileCache) });
        console.log('complie DKG Contract done');

        await state.TypeZkApp!.Round1.Round1Contract.compile({ cache: FileSystem(args.fileCache) });
        console.log('complie Round1 Contract done');

        await state.TypeZkApp!.Round2.Round2Contract.compile({ cache: FileSystem(args.fileCache) });
        console.log('complie Round2 Contract done');

        await state.TypeZkApp!.Response.ResponseContract.compile({ cache: FileSystem(args.fileCache) });
        console.log('complie Response Contract done');

        await state.TypeZkApp!.Request.RequestContract.compile({ cache: FileSystem(args.fileCache) });
        console.log('complie Request Contract done');
    },
    fetchAccount: async (args: { publicKey58: string }) => {
        const publicKey = PublicKey.fromBase58(args.publicKey58);
        return await fetchAccount({ publicKey });
    },
    initZkappInstance: async (args: { publicKey58: string }) => {
        const publicKey = PublicKey.fromBase58(args.publicKey58);
        state.CommitteeContract = new state.TypeZkApp!.Committee.CommitteeContract!(publicKey as any);
    },

    createCommittee: async (args: { sender: PublicKey; action: ZkApp.Committee.CommitteeAction }) => {
        const transaction = await Mina.transaction(args.sender, () => {
            state.CommitteeContract!.createCommittee({
                ...args.action,
            });
        });
        state.transaction = transaction;
    },
    proveTransaction: async (args: {}) => {
        await state.transaction!.prove();
    },
    getTransactionJSON: async (args: {}) => {
        return state.transaction!.toJSON();
    },
};

export type TZkFuction = keyof typeof zkFunctions;
// ---------------------------------------------------------------------------------------
export type ArgumentZkFuction<NameFunction extends TZkFuction> = ArgumentTypes<(typeof zkFunctions)[NameFunction]>['0'];
export type ReturenValueZkFunction<NameFunction extends TZkFuction> = ReturnType<(typeof zkFunctions)[NameFunction]>;

// export type TCallEvent<NameFunction extends TZkFuction> = (fn: NameFunction, args: ArgumentTypes<(typeof zkFunctions)[NameFunction]>['0']) => ReturnType<(typeof zkFunctions)[NameFunction]>;
