import axios from 'axios';
import { apiUrl } from './url';
import { KeyStatus } from './const';
import { RequestStatus } from '@auxo-dev/dkg';

export type TDataMemberInCommittee = { publicKey: string; alias: string; lastActive: string; memberId: string };
export type TCommitteeData = {
    id: string;
    idCommittee: string;
    name: string;
    status: 'Active' | 'Pending';
    threshold: number;
    numberOfMembers: number;
    creator: string;
    members: TDataMemberInCommittee[];
    publicKeys: string[];
    numOfkeys: number;
};
export async function getListCommittees(userAddress?: string): Promise<TCommitteeData[]> {
    const response = await axios.get(`${apiUrl.listCommittee}${userAddress ? `?member=${userAddress}` : ''}`);
    console.log('List committee', response.data);

    return response.data.map((item: any) => {
        return {
            id: item['_id'],
            idCommittee: item.committeeId + '',
            name: item.ipfsData?.name || 'Unknown',
            status: 'Active',
            threshold: item.threshold || 0,
            numberOfMembers: item.numberOfMembers || 0,
            creator: item.ipfsData?.creator || 'Unknown',
            members: item.ipfsData?.members || [],
            publicKeys: item.publicKeys || [],
            numOfkeys: item?.keys?.length || 0,
        };
    });
}

//TODO ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export type TPostCreateCommittee = {
    name: string;
    creator: string;
    threshold: number;
    members: {
        memberId: number;
        alias: string;
        publicKey: string;
    }[];
};
export async function postCreateCommittee(data: TPostCreateCommittee) {
    const response = await axios.post(apiUrl.createCommittee, data);
    console.log('post new committee', response.data);
    return response.data;
}

//TODO ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export type TRound1Data = {
    id: string;
    contribution: { x: string; y: string }[];
    memberId: string;
};
export type TRound2Data = {
    id: string;
    contribution: {
        c: string[];
        u: { x: string; y: string }[];
    };
    memberId: string;
};
export type TCommitteeKey = {
    id: string;
    committeeId: string;
    keyId: string;
    status: KeyStatus;
    publicKey: string | null;
    round1: TRound1Data[];
    round2: TRound2Data[];
    requests: any[];
};
export async function getCommitteeKeys(committeeId: string): Promise<TCommitteeKey[]> {
    const response = await axios.get(apiUrl.committeeKeys(committeeId));
    console.log('get Committee Keys', response.data);

    return response.data?.map((item: any) => {
        return {
            id: item['_id'] || '---',
            committeeId: item.committeeId + '',
            keyId: item.keyId + '' || '',
            status: item.status as KeyStatus,
            round1: item.round1s || [],
            round2: item.round2s || [],
            requests: item.requests,
            publicKey: item.publicKey || null,
        };
    });
}

export async function getCommitteeKeyDetail(committeeId: string, keyId: string): Promise<TCommitteeKey> {
    const response = await axios.get(apiUrl.committeeKeyDetail(committeeId, keyId));
    console.log('get Key', response.data);
    const item = response.data;
    return {
        id: item['_id'] || '---',
        committeeId: item.committeeId + '',
        keyId: item.keyId + '' || '',
        status: item.status as KeyStatus,
        round1: item.round1s || [],
        round2: item.round2s || [],
        requests: item.requests,
        publicKey: item.publicKey || null,
    };
}

//TODO ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export type TWitness = {
    path: string[];
    isLeft: boolean[];
};

export async function getStorageDkgZApps(): Promise<TWitness[]> {
    const response = await axios.get(apiUrl.getStorageDkgZkapp);
    // console.log('get dkg zkapp', response.data);
    return response.data || [];
}

export async function getStorageRound1Zkapp(): Promise<TWitness[]> {
    const response = await axios.get(apiUrl.getStorageRound1Zkapp);
    return response.data || [];
}

export async function getStorageRound2Zkapp(): Promise<TWitness[]> {
    const response = await axios.get(apiUrl.getStorageRound2Zkapp);
    return response.data || [];
}

export async function getCommitteeMemberLv1(): Promise<TWitness[]> {
    const response = await axios.get(apiUrl.getCommitteeMemberLv1);
    // console.log('getCommitteeMemberLv1', response.data);
    return response.data || [];
}

export async function getCommitteeMemberLv2(committeeId: string): Promise<TWitness[]> {
    const response = await axios.get(apiUrl.getCommitteeMemberLv2(committeeId));
    // console.log('getCommitteeMemberLv2', response.data);
    return response.data || [];
}

export async function getStorageRound1PubkeyLv1(): Promise<TWitness[]> {
    const response = await axios.get(apiUrl.getStorageRound1PubkeyLv1);
    return response.data || [];
}

export async function getStorageResponseZkapp(): Promise<TWitness[]> {
    const response = await axios.get(apiUrl.getStorageResponseZkapp);
    return response.data || [];
}

export async function getStorageRound1PubkeyLv2(lv1Index: string): Promise<TWitness[]> {
    const response = await axios.get(apiUrl.getStorageRound1PubkeyLv2(lv1Index));
    return response.data || [];
}

export async function getStorageRound2EncryptionLv1(): Promise<TWitness[]> {
    const response = await axios.get(apiUrl.getStorageRound2EncryptionLv1);
    return response.data || [];
}
export async function getStorageRound2EncryptionLv2(lv1Index: string): Promise<TWitness[]> {
    const response = await axios.get(apiUrl.getStorageRound2EncryptionLv2(lv1Index));
    return response.data || [];
}

//TODO ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export type TRequest = {
    requestId: string;
    committeeId: string;
    keyId: string;
    requester: string;
    R: { x: string; y: string }[];
    D: { x: string; y: string }[];
    status: number;
    responses: any[];
};
export async function getCommitteeRequests(committeeId: string): Promise<TRequest[]> {
    const response = await axios.get(apiUrl.committeeRequests(committeeId));
    console.log('getCommitteeRequests', response.data);
    return response.data.map((item: any) => {
        return {
            requestId: item.requestId,
            committeeId: item.committeeId,
            status: item.status,
            R: item.R || [],
            D: item.D || [],
            responses: item.responses,
            keyId: item.keyId,
            requester: item.requester,
        } as TRequest;
    });
}
