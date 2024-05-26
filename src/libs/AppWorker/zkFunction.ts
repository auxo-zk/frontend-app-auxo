import { Field, Group, Mina, PublicKey, Scalar, UInt32, UInt64, UInt8, fetchAccount } from 'o1js';

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import {
    BatchDecryption,
    BatchDecryptionInput,
    BatchEncryption,
    BatchEncryptionInput,
    CommitteeAction,
    CommitteeWitness,
    ComputeResponse,
    DkgActionEnum,
    DkgLevel1Witness,
    GroupVectorStorage,
    Libs,
    MemberArray,
    PlainArray,
    RandomArray,
    Storage,
    UArray,
    ZkApp,
    ZkAppRef,
    cArray,
    generateRandomPolynomial,
    getResponseContribution,
    getRound1Contribution,
    getRound2Contribution,
    Constants,
    RequestLevel2Witness,
    DKGWitness,
    RequestLevel1Witness,
    RequesterLevel1Witness,
    generateEncryption,
} from '@auxo-dev/dkg';
import { ArgumentTypes } from 'src/global.config';
import { FileSystem } from 'src/states/cache';
import { Bit255, CustomScalar, IpfsHash } from '@auxo-dev/auxo-libs';
import { TCommitteeKey, TRequest, TRound1Data } from 'src/services/services';
import { getLocalStorageKeySecret } from 'src/utils';
import { decrypt } from '@auxo-dev/dkg/build/esm/src/libs/Elgamal';
import { TResponseGetGenNewKey } from 'src/services/api/generateNewKey';
import { TResponseGetRount1Contribution } from 'src/services/api/getRound1Contribution';
import { TResponseGetRount2Contribution } from 'src/services/api/getRound2Contribution';
import { TResponseGetResponseContribution } from 'src/services/api/getResponseContribution';
import { TResponseGetDataCreateTask } from 'src/services/api/getDataCreateTask';
import { TResponseDataFinalizeTask } from 'src/services/api/getDataFinalizeTask';
import { TResponseDataSubmitEncryptionTask } from 'src/services/api/getDataSubmitEncryptionTask';
import { sleep } from 'src/utils/format';
import { NetworkName } from 'src/constants';

const state = {
    TypeZkApp: null as null | typeof ZkApp,
    RollupContract: null as null | ZkApp.Rollup.RollupContract,
    CommitteeContract: null as null | ZkApp.Committee.CommitteeContract,
    DKGContract: null as null | ZkApp.DKG.DkgContract,
    Round1Contract: null as null | ZkApp.Round1.Round1Contract,
    Round2Contract: null as null | ZkApp.Round2.Round2Contract,
    ResponseContract: null as null | ZkApp.Response.ResponseContract,
    RequestContract: null as null | ZkApp.Request.RequestContract,
    TaskManagerContract: null as null | ZkApp.Requester.TaskManagerContract,
    SubmissionContract: null as null | ZkApp.Requester.SubmissionContract,
    RequesterContract: null as null | ZkApp.Requester.RequesterContract,
    transaction: null as null | Transaction,
    complieDone: 0 as number,
};

// ---------------------------------------------------------------------------------------

export const zkFunctions = {
    setActiveInstanceToBerkeley: async (args: {}) => {
        const MINAURL = 'https://explorer.auxo.fund/graphql';
        const ARCHIVEURL = 'https://explorer.auxo.fund/archive';
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
        await state.TypeZkApp!.Rollup.Rollup.compile({ cache: FileSystem(args.fileCache) }); // 1
        console.log('1. complie Rollup done');
        state.complieDone += 1;

        await state.TypeZkApp!.Rollup.RollupContract.compile({ cache: FileSystem(args.fileCache) }); // 2
        console.log('2. complie RollupContract done');
        state.complieDone += 1;

        await state.TypeZkApp!.Committee.UpdateCommittee.compile({ cache: FileSystem(args.fileCache) }); // 3
        console.log('3. complie UpdateCommittee done');
        state.complieDone += 1;

        await state.TypeZkApp!.Committee.CommitteeContract.compile({ cache: FileSystem(args.fileCache) }); // 4
        console.log('4. complie CommitteeContract done');
        state.complieDone += 1;

        await state.TypeZkApp!.DKG.UpdateKey.compile({ cache: FileSystem(args.fileCache) }); // 5
        console.log('5. complie UpdateKey done');
        state.complieDone += 1;

        await state.TypeZkApp!.DKG.DkgContract.compile({ cache: FileSystem(args.fileCache) }); // 6
        console.log('6. complie DkgContract done');
        state.complieDone += 1;

        await state.TypeZkApp!.Round1.FinalizeRound1.compile({ cache: FileSystem(args.fileCache) }); // 7
        console.log('7. complie FinalizeRound1 done');
        state.complieDone += 1;

        await state.TypeZkApp!.Round1.Round1Contract.compile({ cache: FileSystem(args.fileCache) }); // 8
        console.log('8. complie Round1Contract done');
        state.complieDone += 1;

        await state.TypeZkApp!.Encryption.BatchEncryption.compile({ cache: FileSystem(args.fileCache) }); // 9
        console.log('9. complie BatchEncryption done');
        state.complieDone += 1;

        await state.TypeZkApp!.Round2.FinalizeRound2.compile({ cache: FileSystem(args.fileCache) }); // 10
        console.log('10. complie FinalizeRound2 done');
        state.complieDone += 1;

        await state.TypeZkApp!.Round2.Round2Contract.compile({ cache: FileSystem(args.fileCache) }); // 11
        console.log('11. complie Round2Contract done');
        state.complieDone += 1;

        await state.TypeZkApp!.Encryption.BatchDecryption.compile({ cache: FileSystem(args.fileCache) }); // 12
        console.log('12. complie BatchDecryption done');
        state.complieDone += 1;

        await state.TypeZkApp!.Response.ComputeResponse.compile({ cache: FileSystem(args.fileCache) }); // 13
        console.log('13. complie ComputeResponse done');
        state.complieDone += 1;

        await state.TypeZkApp!.Response.FinalizeResponse.compile({ cache: FileSystem(args.fileCache) }); // 14
        console.log('14. complie FinalizeResponse done');
        state.complieDone += 1;

        await state.TypeZkApp!.Response.ResponseContract.compile({ cache: FileSystem(args.fileCache) }); // 15
        console.log('15. complie ResponseContract done');
        state.complieDone += 1;

        await state.TypeZkApp!.Request.ComputeResult.compile({ cache: FileSystem(args.fileCache) }); // 16
        console.log('16. complie ComputeResult done');
        state.complieDone += 1;

        await state.TypeZkApp!.Request.UpdateRequest.compile({ cache: FileSystem(args.fileCache) }); // 17
        console.log('17. complie UpdateRequest done');
        state.complieDone += 1;

        await state.TypeZkApp!.Request.RequestContract.compile({ cache: FileSystem(args.fileCache) }); // 18
        console.log('18. complie RequestContract done');
        state.complieDone += 1;

        await state.TypeZkApp!.Requester.UpdateTask.compile({ cache: FileSystem(args.fileCache) }); // 19
        console.log('19. complie UpdateTask done');
        state.complieDone += 1;

        await state.TypeZkApp!.Requester.RequesterContract.compile({ cache: FileSystem(args.fileCache) }); // 20
        console.log('20. complie RequesterContract done');
        state.complieDone += 1;

        await state.TypeZkApp!.Requester.TaskManagerContract.compile({ cache: FileSystem(args.fileCache) }); // 21
        console.log('21. complie TaskManagerContract done');
        state.complieDone += 1;

        await state.TypeZkApp!.Requester.SubmissionContract.compile({ cache: FileSystem(args.fileCache) }); // 22
        console.log('22. complie SubmissionContract done');
        state.complieDone += 1;
    },
    getPercentageComplieDone: async (args: {}) => {
        return ((state.complieDone / 22) * 100).toFixed(0);
    },
    fetchAccount: async (args: { publicKey58: string }) => {
        const publicKey = PublicKey.fromBase58(args.publicKey58);
        return await fetchAccount({ publicKey });
    },
    initZkappInstance: async (args: {
        committeeContract: string;
        dkgContract: string;
        round1Contract: string;
        round2Contract: string;
        responseContract: string;
        rollUpContract: string;
        requestContract: string;
        taskManagerContract: string;
        submissionContract: string;
        requesterContract: string;
    }) => {
        const committeeContractPub = PublicKey.fromBase58(args.committeeContract);
        state.CommitteeContract = new state.TypeZkApp!.Committee.CommitteeContract!(committeeContractPub as any);

        const dkgContractPub = PublicKey.fromBase58(args.dkgContract);
        state.DKGContract = new state.TypeZkApp!.DKG.DkgContract!(dkgContractPub as any);

        const round1ContractPub = PublicKey.fromBase58(args.round1Contract);
        state.Round1Contract = new state.TypeZkApp!.Round1.Round1Contract!(round1ContractPub as any);

        const round2ContractPub = PublicKey.fromBase58(args.round2Contract);
        state.Round2Contract = new state.TypeZkApp!.Round2.Round2Contract!(round2ContractPub as any);

        const responseContractPub = PublicKey.fromBase58(args.responseContract);
        state.ResponseContract = new state.TypeZkApp!.Response.ResponseContract!(responseContractPub as any);

        const requestContractPub = PublicKey.fromBase58(args.requestContract);
        state.RequestContract = new state.TypeZkApp!.Request.RequestContract!(requestContractPub);

        const rollUpContractPub = PublicKey.fromBase58(args.rollUpContract);
        state.RollupContract = new state.TypeZkApp!.Rollup.RollupContract!(rollUpContractPub);

        const taskManagerContractPub = PublicKey.fromBase58(args.taskManagerContract);
        state.TaskManagerContract = new state.TypeZkApp!.Requester.TaskManagerContract!(taskManagerContractPub);

        const submissionContractPub = PublicKey.fromBase58(args.submissionContract);
        state.SubmissionContract = new state.TypeZkApp!.Requester.SubmissionContract!(submissionContractPub);

        const requesterContractPub = PublicKey.fromBase58(args.requesterContract);
        state.RequesterContract = new state.TypeZkApp!.Requester.RequesterContract!(requesterContractPub);
    },

    createCommittee: async (args: { sender: string; action: { addresses: string[]; threshold: number; ipfsHash: string } }) => {
        const sender = PublicKey.fromBase58(args.sender);

        await fetchAccount({ publicKey: sender });
        await fetchAccount({ publicKey: state.CommitteeContract!.address });

        const transaction = await Mina.transaction(sender, async () => {
            return await state.CommitteeContract!.create(
                new CommitteeAction({
                    addresses: MemberArray.from(args.action.addresses.map((member) => PublicKey.fromBase58(member))),
                    threshold: new Field(args.action.threshold),
                    ipfsHash: IpfsHash.fromString(args.action.ipfsHash),
                })
            );
        });
        state.transaction = transaction;
    },

    genNewKeyContributions: async (args: { sender: string; memberId: string; dataBackend: TResponseGetGenNewKey }) => {
        const sender = PublicKey.fromBase58(args.sender);
        await fetchAccount({ publicKey: sender });

        await fetchAccount({ publicKey: state.DKGContract!.address });
        await fetchAccount({ publicKey: state.CommitteeContract!.address });
        await fetchAccount({ publicKey: state.RollupContract!.address });

        const transaction = await Mina.transaction(sender, async () => {
            await state.DKGContract!.committeeAction(
                new Field(-1),
                new Field(0),
                CommitteeWitness.fromJSON(args.dataBackend.memberWitness),
                ZkAppRef.fromJSON(args.dataBackend.committeeRef),
                ZkAppRef.fromJSON(args.dataBackend.rollupRef),
                ZkAppRef.fromJSON(args.dataBackend.selfRef)
            );
        });
        state.transaction = transaction;
    },

    submitContributionRound1: async (args: {
        sender: string;
        keyId: string;
        t: number;
        n: number;
        committeeId: string;
        memberId: string;
        dataBackend: TResponseGetRount1Contribution;
        networkName: NetworkName;
    }) => {
        const sender = PublicKey.fromBase58(args.sender);
        await fetchAccount({ publicKey: sender });
        await fetchAccount({ publicKey: state.Round1Contract!.address });
        await fetchAccount({ publicKey: state.CommitteeContract!.address });
        await fetchAccount({ publicKey: state.RollupContract!.address });

        const secret = generateRandomPolynomial(args.t, args.n);
        const contribution = getRound1Contribution(secret);

        const transaction = await Mina.transaction(sender, async () => {
            await state.Round1Contract!.contribute(
                new Field(args.keyId),
                contribution.C,
                CommitteeWitness.fromJSON(args.dataBackend.memberWitness),
                ZkAppRef.fromJSON(args.dataBackend.committeeRef),
                ZkAppRef.fromJSON(args.dataBackend.rollupRef),
                ZkAppRef.fromJSON(args.dataBackend.selfRef)
            );
        });
        state.transaction = transaction;
        return {
            key: getLocalStorageKeySecret(args.committeeId, args.memberId, args.keyId, args.networkName),
            value: JSON.stringify(secret),
        };
    },

    submitContributionRound2: async (args: {
        sender: string;
        keyId: string;
        secret: string;
        memberId: string;
        round1Contributions: TRound1Data['contribution'][];
        dataBackend: TResponseGetRount2Contribution;
    }) => {
        const sender = PublicKey.fromBase58(args.sender);
        await fetchAccount({ publicKey: sender });
        await fetchAccount({ publicKey: state.Round1Contract!.address });
        await fetchAccount({ publicKey: state.Round2Contract!.address });
        await fetchAccount({ publicKey: state.CommitteeContract!.address });
        await fetchAccount({ publicKey: state.RollupContract!.address });

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
            Number(args.memberId),
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
                memberId: new Field(args.memberId),
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

        const transaction = await Mina.transaction(sender, async () => {
            await state.Round2Contract!.contribute(
                new Field(args.keyId),
                proof,
                CommitteeWitness.fromJSON(args.dataBackend.memberWitness),
                DkgLevel1Witness.fromJSON(args.dataBackend.publicKeysWitness),
                ZkAppRef.fromJSON(args.dataBackend.committeeRef),
                ZkAppRef.fromJSON(args.dataBackend.round1Ref),
                ZkAppRef.fromJSON(args.dataBackend.rollupRef),
                ZkAppRef.fromJSON(args.dataBackend.selfRef)
            );
        });
        state.transaction = transaction;
    },

    deprecateKey: async (args: { sender: string; keyId: string; dataBackend: TResponseGetGenNewKey }) => {
        const sender = PublicKey.fromBase58(args.sender);
        await fetchAccount({ publicKey: sender });
        await fetchAccount({ publicKey: state.DKGContract!.address });
        await fetchAccount({ publicKey: state.CommitteeContract!.address });
        await fetchAccount({ publicKey: state.RollupContract!.address });

        const transaction = await Mina.transaction(sender, async () => {
            await state.DKGContract?.committeeAction(
                new Field(args.keyId),
                new Field(3),
                CommitteeWitness.fromJSON(args.dataBackend.memberWitness),
                ZkAppRef.fromJSON(args.dataBackend.committeeRef),
                ZkAppRef.fromJSON(args.dataBackend.rollupRef),
                ZkAppRef.fromJSON(args.dataBackend.selfRef)
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
        committeeId: string;
        keyDetail: TCommitteeKey;
        requestDetail: TRequest;
        responseContribution: TResponseGetResponseContribution;
        fReceive: string[] | null;
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
        const memberId = Number(args.memberId);

        const round2Datas = args.keyDetail.round2.map((item, index) => {
            if (index == memberId) return { c: Bit255.fromBigInt(BigInt(0)), U: Group.zero };
            return {
                c: Bit255.fromBigInt(BigInt(item.contribution.c[memberId])),
                U: new Group(item.contribution.u[memberId]),
            };
        });

        const responseContribution = getResponseContribution(
            secret,
            memberId,
            round2Datas,
            args.requestDetail.R.map((item) => {
                return new Group({ x: item.x, y: item.y });
            })
        );

        let fReceive: string[] =
            args.fReceive == null
                ? round2Datas.map((item, index) => {
                      if (index == memberId) return secret.f[memberId].toJSON();
                      const decryptData = decrypt(item.c, item.U, Scalar.from(secret.a[0]));
                      return decryptData.m.toBigInt().toString();
                  })
                : args.fReceive;

        const decryptionProof = await BatchDecryption.decrypt(
            new BatchDecryptionInput({
                c: new cArray(round2Datas.map((item) => item.c)),
                memberId: new Field(args.memberId),
                publicKey: secret.C[0],
                U: new UArray(round2Datas.map((item) => item.U)),
            }),
            new PlainArray(fReceive.map((item) => CustomScalar.fromScalar(Scalar.from(BigInt(item))))),
            secret.a[0]
        );

        let responseStorageD = new GroupVectorStorage();
        let responseProof = await ComputeResponse.init(Field.from(args.responseContribution.accumulationRootR), CustomScalar.fromScalar(responseContribution[1]));
        for (let i = 0; i < Constants.ENCRYPTION_LIMITS.FULL_DIMENSION - 1; i++) {
            const RGroup = new Group(args.requestDetail.R[i]);
            responseProof = await ComputeResponse.compute(
                responseProof,
                CustomScalar.fromScalar(responseContribution[1]),
                RGroup,
                RequestLevel2Witness.fromJSON(args.responseContribution.accumulationWitnessesR[i]),
                responseStorageD.getWitness(Field(i))
            );
            responseStorageD.updateRawLeaf({ level1Index: Field(i) }, RGroup.add(Group.generator).scale(responseContribution[1]).sub(Group.generator.scale(responseContribution[1])));
        }

        const transaction = await Mina.transaction(sender, async () => {
            await state.ResponseContract!.contribute(
                decryptionProof,
                responseProof,
                new Field(args.keyId),
                new Field(args.requestId),
                Field.from(args.responseContribution.accumulationRootM),
                CommitteeWitness.fromJSON(args.responseContribution.memberWitness),
                DKGWitness.fromJSON(args.responseContribution.publicKeyWitness),
                DKGWitness.fromJSON(args.responseContribution.encryptionWitness),
                RequestLevel1Witness.fromJSON(args.responseContribution.accumulationWitness),
                ZkAppRef.fromJSON(args.responseContribution.committeeRef),
                ZkAppRef.fromJSON(args.responseContribution.round1Ref),
                ZkAppRef.fromJSON(args.responseContribution.round2Ref),
                ZkAppRef.fromJSON(args.responseContribution.requestRef),
                ZkAppRef.fromJSON(args.responseContribution.rollupRef),
                ZkAppRef.fromJSON(args.responseContribution.selfRef)
            );
        });
        state.transaction = transaction;
        return fReceive;
    },

    createTask: async (args: { sender: string; dataBackend: TResponseGetDataCreateTask; keyIndex: string; timestamp: number }) => {
        const sender = PublicKey.fromBase58(args.sender);
        await fetchAccount({ publicKey: sender });
        await fetchAccount({ publicKey: state.TaskManagerContract!.address });
        await fetchAccount({ publicKey: state.RequesterContract!.address });

        const transaction = await Mina.transaction(sender, async () => {
            await state.TaskManagerContract!.createTask(new Field(args.keyIndex), UInt64.from(args.timestamp), ZkAppRef.fromJSON(args.dataBackend.taskManagerRef));
        });
        state.transaction = transaction;
    },

    finalizeTask: async (args: { sender: string; dataBackend: TResponseDataFinalizeTask; taskId: string; keyIndex: string }) => {
        const sender = PublicKey.fromBase58(args.sender);
        await fetchAccount({ publicKey: sender });

        await fetchAccount({ publicKey: state.RequesterContract!.address });
        await fetchAccount({ publicKey: state.RequestContract!.address });

        const transaction = await Mina.transaction(sender, async () => {
            await state.RequesterContract!.finalizeTask(
                UInt32.from(args.taskId),
                UInt8.from(Constants.ENCRYPTION_LIMITS.FULL_DIMENSION),
                new Field(args.keyIndex),
                new Field(args.dataBackend.accumulationRootR),
                new Field(args.dataBackend.accumulationRootM),
                RequesterLevel1Witness.fromJSON(args.dataBackend.keyIndexWitness),
                RequesterLevel1Witness.fromJSON(args.dataBackend.accumulationWitness),
                ZkAppRef.fromJSON(args.dataBackend.requestRef)
            );
        });
        state.transaction = transaction;
    },

    submitEncryption: async (args: {
        sender: string;
        dataBackend: TResponseDataSubmitEncryptionTask;
        taskId: string;
        keyIndex: string;
        submitData: { index: string; value: string }[];
        committeePubLickey: string;
    }) => {
        const sender = PublicKey.fromBase58(args.sender);
        await fetchAccount({ publicKey: sender });

        await fetchAccount({ publicKey: state.SubmissionContract!.address });
        await fetchAccount({ publicKey: state.DKGContract!.address });
        await fetchAccount({ publicKey: state.RequesterContract!.address });

        const vector: { [k: string]: bigint } = {};

        for (let item of args.submitData) {
            vector[item.index] = BigInt(Constants.SECRET_UNIT) * BigInt(item.value);
        }

        await sleep(100);

        const publicKey = PublicKey.fromBase58(args.committeePubLickey).toGroup();
        const encryption = generateEncryption(Number(args.taskId), publicKey, vector);

        const transaction = await Mina.transaction(sender, async () => {
            await state.SubmissionContract!.submitEncryption(
                UInt32.from(args.taskId),
                new Field(args.keyIndex),
                encryption.secrets,
                encryption.randoms,
                encryption.packedIndices,
                encryption.nullifiers,
                publicKey,
                DkgLevel1Witness.fromJSON(args.dataBackend.keyWitness),
                RequesterLevel1Witness.fromJSON(args.dataBackend.keyIndexWitness),
                ZkAppRef.fromJSON(args.dataBackend.submissionRef),
                ZkAppRef.fromJSON(args.dataBackend.dkgRef)
            );
        });
        state.transaction = transaction;
        return encryption.notes;
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
