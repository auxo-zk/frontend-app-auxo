import { Field, Group, Mina, PublicKey, Scalar, fetchAccount } from 'o1js';

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import {
    BatchDecryption,
    BatchDecryptionInput,
    BatchEncryption,
    BatchEncryptionInput,
    Libs,
    PlainArray,
    RandomArray,
    Storage,
    ZkApp,
    generateRandomPolynomial,
    getResponseContribution,
    getRound1Contribution,
    getRound2Contribution,
} from '@auxo-dev/dkg';
import { ArgumentTypes } from 'src/global.config';
import { FileSystem } from 'src/states/cache';
import { Bit255, CustomScalar, IPFSHash } from '@auxo-dev/auxo-libs';
import { TRound1Data, TWitness } from 'src/services/services';
import { getLocalStorageKeySecret } from 'src/utils';
import { decrypt } from '@auxo-dev/dkg/build/esm/src/libs/Elgamal';

const state = {
    TypeZkApp: null as null | typeof ZkApp,
    CommitteeContract: null as null | ZkApp.Committee.CommitteeContract,
    DKGContract: null as null | ZkApp.DKG.DKGContract,
    Round1Contract: null as null | ZkApp.Round1.Round1Contract,
    Round2Contract: null as null | ZkApp.Round2.Round2Contract,
    ResponseContract: null as null | ZkApp.Response.ResponseContract,
    RequestContract: null as null | ZkApp.Request.RequestContract,
    transaction: null as null | Transaction,
    complieDone: 0 as number,
};

// ---------------------------------------------------------------------------------------

export const zkFunctions = {
    setActiveInstanceToBerkeley: async (args: {}) => {
        const MINAURL = 'https://api.minascan.io/node/berkeley/v1/graphql';
        const ARCHIVEURL = 'https://api.minascan.io/archive/berkeley/v1/graphql';
        const Berkeley = Mina.Network({
            mina: MINAURL,
            archive: ARCHIVEURL,
        });
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
    initZkappInstance: async (args: { committeeContract: string; dkgContract: string; round1Contract: string; round2Contract: string; responseContract: string; requestContract: string }) => {
        const committeeContractPub = PublicKey.fromBase58(args.committeeContract);
        state.CommitteeContract = new state.TypeZkApp!.Committee.CommitteeContract!(committeeContractPub as any);

        const dkgContractPub = PublicKey.fromBase58(args.dkgContract);
        state.DKGContract = new state.TypeZkApp!.DKG.DKGContract!(dkgContractPub as any);

        const round1ContractPub = PublicKey.fromBase58(args.round1Contract);
        state.Round1Contract = new state.TypeZkApp!.Round1.Round1Contract!(round1ContractPub as any);

        const round2ContractPub = PublicKey.fromBase58(args.round2Contract);
        state.Round2Contract = new state.TypeZkApp!.Round2.Round2Contract!(round2ContractPub as any);

        const responseContractPub = PublicKey.fromBase58(args.responseContract);
        state.ResponseContract = new state.TypeZkApp!.Response.ResponseContract!(responseContractPub as any);

        const requestContractPub = PublicKey.fromBase58(args.requestContract);
        state.RequestContract = new state.TypeZkApp!.Request.RequestContract!(requestContractPub);
    },

    createCommittee: async (args: { sender: string; action: { addresses: string[]; threshold: number; ipfsHash: string } }) => {
        const sender = PublicKey.fromBase58(args.sender);

        await fetchAccount({ publicKey: sender });
        await fetchAccount({ publicKey: state.CommitteeContract!.address });

        const transaction = await Mina.transaction(sender, () => {
            state.CommitteeContract!.createCommittee({
                addresses: Libs.Committee.MemberArray.from(args.action.addresses.map((member) => PublicKey.fromBase58(member))),
                threshold: new Field(args.action.threshold),
                ipfsHash: IPFSHash.fromString(args.action.ipfsHash),
            });
        });
        state.transaction = transaction;
    },

    genNewKeyContributions: async (args: { sender: string; memberId: string; committee: { committeeId: string; witness: TWitness }; memberWitness: { level1: TWitness; level2: TWitness } }) => {
        const sender = PublicKey.fromBase58(args.sender);

        await fetchAccount({ publicKey: sender });
        await fetchAccount({ publicKey: state.DKGContract!.address });
        await fetchAccount({ publicKey: state.CommitteeContract!.address });

        const transaction = await Mina.transaction(sender, () => {
            state.DKGContract!.committeeAction(
                new Field(args.committee.committeeId),
                new Field(-1),
                new Field(args.memberId),
                new Field(0),
                Storage.SharedStorage.ZkAppRef.fromJSON({
                    address: state.CommitteeContract!.address.toBase58(),
                    witness: Storage.SharedStorage.AddressWitness.fromJSON(args.committee.witness),
                }),
                Storage.CommitteeStorage.FullMTWitness.fromJSON({
                    level1: Storage.CommitteeStorage.Level1Witness.fromJSON(args.memberWitness.level1),
                    level2: Storage.CommitteeStorage.Level2Witness.fromJSON(args.memberWitness.level2),
                })
            );
        });
        state.transaction = transaction;
    },

    submitContributionRound1: async (args: {
        sender: string;
        keyId: string;
        t: number;
        n: number;
        committee: { committeeId: string; memberId: string; witness: TWitness };
        memberWitness: { level1: TWitness; level2: TWitness };
    }) => {
        const sender = PublicKey.fromBase58(args.sender);
        await fetchAccount({ publicKey: sender });
        await fetchAccount({ publicKey: state.Round1Contract!.address });
        await fetchAccount({ publicKey: state.CommitteeContract!.address });

        const secret = generateRandomPolynomial(args.t, args.n);
        const contribution = getRound1Contribution(secret);

        const transaction = await Mina.transaction(sender, () => {
            state.Round1Contract!.contribute(
                new Field(args.committee.committeeId),
                new Field(args.keyId),
                contribution.C,
                Storage.SharedStorage.ZkAppRef.fromJSON({
                    address: state.CommitteeContract!.address.toBase58(),
                    witness: Storage.SharedStorage.AddressWitness.fromJSON(args.committee.witness),
                }),
                Storage.CommitteeStorage.FullMTWitness.fromJSON({
                    level1: Storage.CommitteeStorage.Level1Witness.fromJSON(args.memberWitness.level1),
                    level2: Storage.CommitteeStorage.Level2Witness.fromJSON(args.memberWitness.level2),
                })
            );
        });
        state.transaction = transaction;
        return {
            key: getLocalStorageKeySecret(args.committee.committeeId, args.committee.memberId, args.keyId, 'Berkeley'),
            value: JSON.stringify(secret),
        };
    },

    submitContributionRound2: async (args: {
        sender: string;
        keyId: string;
        secret: string;
        round1Contributions: TRound1Data['contribution'][];
        committee: { committeeId: string; memberId: string; witness: TWitness };
        round1Witness: TWitness;
        memberWitness: { level1: TWitness; level2: TWitness };
        publicKeysWitness: { level1: TWitness };
    }) => {
        const sender = PublicKey.fromBase58(args.sender);
        await fetchAccount({ publicKey: sender });
        await fetchAccount({ publicKey: state.Round1Contract!.address });
        await fetchAccount({ publicKey: state.Round2Contract!.address });
        await fetchAccount({ publicKey: state.CommitteeContract!.address });

        const secretObj = JSON.parse(args.secret) as { C: { x: string; y: string }[]; a: string[]; f: string[] };
        const secret: Libs.Committee.SecretPolynomial = {
            a: secretObj.a.map((item) => Scalar.from(item)),
            C: secretObj.C.map((item) => new Group(item)),
            f: secretObj.f.map((item) => Scalar.from(item)),
        };
        const randoms = args.round1Contributions.map(() => {
            return Scalar.random();
        });
        const round2Contribution = getRound2Contribution(
            secret,
            Number(args.committee.memberId),
            args.round1Contributions.map((member) => {
                return new Libs.Committee.Round1Contribution({
                    C: new Libs.Committee.CArray(
                        member.map((item) => {
                            return new Group({ x: item.x, y: item.y });
                        })
                    ),
                });
            }),
            randoms
        );

        const proof = await BatchEncryption.encrypt(
            new BatchEncryptionInput({
                memberId: new Field(args.committee.memberId),
                publicKeys: new Libs.Committee.CArray(
                    args.round1Contributions.map((member) => {
                        return new Group(member[0]);
                    })
                ),
                c: round2Contribution.c,
                U: round2Contribution.U,
            }),
            new PlainArray(
                secret.f.map((s) => {
                    return CustomScalar.fromScalar(s);
                })
            ),
            new RandomArray(
                randoms.map((r) => {
                    return CustomScalar.fromScalar(r);
                })
            )
        );

        const transaction = await Mina.transaction(sender, () => {
            state.Round2Contract!.contribute(
                new Field(args.committee.committeeId),
                new Field(args.keyId),
                proof,
                new Storage.SharedStorage.ZkAppRef({
                    address: state.CommitteeContract!.address,
                    witness: Storage.SharedStorage.AddressWitness.fromJSON(args.committee.witness),
                }),
                new Storage.SharedStorage.ZkAppRef({
                    address: state.Round1Contract!.address,
                    witness: Storage.SharedStorage.AddressWitness.fromJSON(args.round1Witness),
                }),
                Storage.CommitteeStorage.FullMTWitness.fromJSON({
                    level1: Storage.CommitteeStorage.Level1Witness.fromJSON(args.memberWitness.level1),
                    level2: Storage.CommitteeStorage.Level2Witness.fromJSON(args.memberWitness.level2),
                }),

                Storage.DKGStorage.Level1Witness.fromJSON(args.publicKeysWitness.level1)
            );
        });
        state.transaction = transaction;
    },

    deprecateKey: async (args: { sender: string; keyId: string; memberId: string; committee: { committeeId: string; witness: TWitness }; memberWitness: { level1: TWitness; level2: TWitness } }) => {
        const sender = PublicKey.fromBase58(args.sender);
        await fetchAccount({ publicKey: sender });
        await fetchAccount({ publicKey: state.DKGContract!.address });
        await fetchAccount({ publicKey: state.CommitteeContract!.address });

        const transaction = await Mina.transaction(sender, () => {
            state.DKGContract?.committeeAction(
                new Field(args.committee.committeeId),
                new Field(args.keyId),
                new Field(args.memberId),
                new Field(1),
                Storage.SharedStorage.ZkAppRef.fromJSON({
                    address: state.CommitteeContract!.address.toBase58(),
                    witness: Storage.SharedStorage.AddressWitness.fromJSON(args.committee.witness),
                }),
                Storage.CommitteeStorage.FullMTWitness.fromJSON({
                    level1: Storage.CommitteeStorage.Level1Witness.fromJSON(args.memberWitness.level1),
                    level2: Storage.CommitteeStorage.Level2Witness.fromJSON(args.memberWitness.level2),
                })
            );
        });
        state.transaction = transaction;
    },

    submitContributionRequest: async (args: {
        sender: string;
        keyId: string;
        requestId: string;
        memberId: string;
        secret: string;
        committee: { committeeId: string; witness: TWitness };
        memberWitness: { level1: TWitness; level2: TWitness };
        round1Witness: TWitness;
        round2Witness: TWitness;
        fReceive: string[] | null;
        round2Datas: { c: string; u: { x: string; y: string } }[];
        R: { x: string; y: string }[];
        publicKeysWitness: { level1: TWitness; level2: TWitness };
        encryptionWitness: { level1: TWitness; level2: TWitness };
    }) => {
        const sender = PublicKey.fromBase58(args.sender);
        await fetchAccount({ publicKey: sender });
        await fetchAccount({ publicKey: state.Round1Contract!.address });
        await fetchAccount({ publicKey: state.Round2Contract!.address });
        await fetchAccount({ publicKey: state.CommitteeContract!.address });
        await fetchAccount({ publicKey: state.ResponseContract!.address });
        await fetchAccount({ publicKey: state.DKGContract!.address });

        const secretObj = JSON.parse(args.secret) as { C: { x: string; y: string }[]; a: string[]; f: string[] };
        const secret: Libs.Committee.SecretPolynomial = {
            a: secretObj.a.map((item) => Scalar.from(item)),
            C: secretObj.C.map((item) => new Group(item)),
            f: secretObj.f.map((item) => Scalar.from(item)),
        };

        const responseContribution = getResponseContribution(
            secret,
            Number(args.memberId),
            args.round2Datas.map((item) => {
                return {
                    c: Bit255.fromBigInt(BigInt(item.c)),
                    U: new Group({ x: item.u.x, y: item.u.y }),
                };
            }),
            args.R.map((item) => {
                return new Group({ x: item.x, y: item.y });
            })
        );

        let fReceive: string[] =
            args.fReceive == null
                ? args.round2Datas.map((item, index) => {
                      if (index == Number(args.memberId)) return secret.f[Number(args.memberId)].toJSON();
                      const decryptData = decrypt(Bit255.fromBigInt(BigInt(item.c)), new Group({ x: item.u.x, y: item.u.y }), Scalar.from(secret.a[0]));
                      return decryptData.m.toBigInt().toString();
                  })
                : args.fReceive;

        const decryptionProof = await BatchDecryption.decrypt(
            new BatchDecryptionInput({
                c: new Libs.Committee.cArray(args.round2Datas.map((item) => Bit255.fromBigInt(BigInt(item.c)))),
                memberId: new Field(args.memberId),
                publicKey: secret.C[0],
                U: new Libs.Committee.UArray(args.round2Datas.map((item) => new Group({ x: item.u.x, y: item.u.y }))),
            }),
            new PlainArray(fReceive.map((item) => CustomScalar.fromScalar(Scalar.from(BigInt(item))))),
            secret.a[0]
        );

        const transaction = await Mina.transaction(sender, () => {
            state.ResponseContract!.contribute(
                new Field(args.committee.committeeId),
                new Field(args.keyId),
                new Field(args.requestId),
                decryptionProof,
                new Libs.Requestor.RArray(
                    args.R.map((item) => {
                        return new Group({ x: item.x, y: item.y });
                    })
                ),
                responseContribution[1],
                Storage.SharedStorage.ZkAppRef.fromJSON({
                    address: state.CommitteeContract!.address.toBase58(),
                    witness: Storage.SharedStorage.AddressWitness.fromJSON(args.committee.witness),
                }),
                Storage.SharedStorage.ZkAppRef.fromJSON({
                    address: state.Round1Contract!.address.toBase58(),
                    witness: Storage.SharedStorage.AddressWitness.fromJSON(args.round1Witness),
                }),
                Storage.SharedStorage.ZkAppRef.fromJSON({
                    address: state.Round2Contract!.address.toBase58(),
                    witness: Storage.SharedStorage.AddressWitness.fromJSON(args.round2Witness),
                }),
                Storage.CommitteeStorage.FullMTWitness.fromJSON({
                    level1: Storage.CommitteeStorage.Level1Witness.fromJSON(args.memberWitness.level1),
                    level2: Storage.CommitteeStorage.Level2Witness.fromJSON(args.memberWitness.level2),
                }),
                Storage.DKGStorage.FullMTWitness.fromJSON({
                    level1: Storage.DKGStorage.Level1Witness.fromJSON(args.publicKeysWitness.level1),
                    level2: Storage.DKGStorage.Level2Witness.fromJSON(args.publicKeysWitness.level2),
                }),
                Storage.DKGStorage.FullMTWitness.fromJSON({
                    level1: Storage.DKGStorage.Level1Witness.fromJSON(args.encryptionWitness.level1),
                    level2: Storage.DKGStorage.Level2Witness.fromJSON(args.encryptionWitness.level2),
                })
            );
        });
        state.transaction = transaction;
        return fReceive;
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
