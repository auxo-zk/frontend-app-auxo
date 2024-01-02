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
    complieDone: 0 as number,
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
        await state.TypeZkApp!.DKG.UpdateKey.compile({ cache: FileSystem(args.fileCache) }); // 1
        console.log('complie DKG UpdateKey done');
        state.complieDone += 1;

        await state.TypeZkApp!.Round1.ReduceRound1.compile({ cache: FileSystem(args.fileCache) }); // 2
        console.log('complie ReduceRound1 done');
        state.complieDone += 1;

        await state.TypeZkApp!.Round1.FinalizeRound1.compile({ cache: FileSystem(args.fileCache) }); // 3
        console.log('complie FinalizeRound1 done');
        state.complieDone += 1;

        await state.TypeZkApp!.Round2.ReduceRound2.compile({ cache: FileSystem(args.fileCache) }); // 4
        console.log('complie ReduceRound2 done');
        state.complieDone += 1;

        await state.TypeZkApp!.Encryption.BatchEncryption.compile({ cache: FileSystem(args.fileCache) }); // 5
        console.log('complie BatchEncryption done');
        state.complieDone += 1;

        await state.TypeZkApp!.Round2.FinalizeRound2.compile({ cache: FileSystem(args.fileCache) }); // 6
        console.log('complie FinalizeRound2 done');
        state.complieDone += 1;

        await state.TypeZkApp!.Response.ReduceResponse.compile({ cache: FileSystem(args.fileCache) }); // 7
        console.log('complie ReduceResponse done');
        state.complieDone += 1;

        await state.TypeZkApp!.Encryption.BatchDecryption.compile({ cache: FileSystem(args.fileCache) }); // 8
        console.log('complie BatchDecryption done');
        state.complieDone += 1;

        await state.TypeZkApp!.Response.CompleteResponse.compile({ cache: FileSystem(args.fileCache) }); // 9
        console.log('complie CompleteResponse done');
        state.complieDone += 1;

        await state.TypeZkApp!.Committee.CreateCommittee.compile({ cache: FileSystem(args.fileCache) }); // 10
        console.log('complie Create Committee done');
        state.complieDone += 1;

        await state.TypeZkApp!.Request.CreateRequest.compile({ cache: FileSystem(args.fileCache) }); // 11
        console.log('complie Create Request done');
        state.complieDone += 1;

        await state.TypeZkApp!.Committee.CommitteeContract.compile({ cache: FileSystem(args.fileCache) }); // 12
        console.log('complie Committee Contract done');
        state.complieDone += 1;

        await state.TypeZkApp!.DKG.DKGContract.compile({ cache: FileSystem(args.fileCache) }); // 13
        console.log('complie DKG Contract done');
        state.complieDone += 1;

        await state.TypeZkApp!.Round1.Round1Contract.compile({ cache: FileSystem(args.fileCache) }); // 14
        console.log('complie Round1 Contract done');
        state.complieDone += 1;

        await state.TypeZkApp!.Round2.Round2Contract.compile({ cache: FileSystem(args.fileCache) }); // 15
        console.log('complie Round2 Contract done');
        state.complieDone += 1;

        await state.TypeZkApp!.Response.ResponseContract.compile({ cache: FileSystem(args.fileCache) }); // 16
        console.log('complie Response Contract done');
        state.complieDone += 1;

        await state.TypeZkApp!.Request.RequestContract.compile({ cache: FileSystem(args.fileCache) }); // 17
        console.log('complie Request Contract done');
        state.complieDone += 1;
    },
    getPercentageComplieDone: async (args: {}) => {
        return ((state.complieDone / 17) * 100).toFixed(0);
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
