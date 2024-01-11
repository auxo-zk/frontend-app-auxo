import axios from 'axios';
import { apiUrl } from './url';
import { KeyStatus } from './const';

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
};
export async function getListCommittees(userAddress?: string): Promise<TCommitteeData[]> {
    const response = await axios.get(`${apiUrl.listCommittee}${userAddress ? `?member=${userAddress}` : ''}`);
    console.log('List committee', response.data);

    return response.data.map((item: any) => {
        return {
            id: item['_id'],
            idCommittee: item.committeeId + '',
            name: item.ipfsData?.name || 'Unknown',
            status: item.active ? 'Active' : 'Pending',
            threshold: item.threshold || 0,
            numberOfMembers: item.numberOfMembers || 0,
            creator: item.ipfsData?.creator || 'Unknown',
            members: item.ipfsData?.members || [],
            publicKeys: item.publicKeys || [],
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
