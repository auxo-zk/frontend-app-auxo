import axios from 'axios';
import { apiUrl } from './url';
import { KeyStatus } from '@auxo-dev/dkg';

export type TCommitteeData = {
    id: string;
    idCommittee: string;
    name: string;
    status: 'Active' | 'Pending';
    threshold: number;
    numberOfMembers: number;
    creator: string;
    members: { publicKey: string; alias: string; lastActive: string }[];
};
export async function getListCommittees(userAddress?: string): Promise<TCommitteeData[]> {
    const response = await axios.get(`${apiUrl.listCommittee}?member=${userAddress || ''}`);
    console.log('List committee', response.data);

    return response.data.map((item: any) => {
        return {
            id: item['_id'],
            idCommittee: (item.committeeId + '').padStart(2, '0') || '---',
            name: item.ipfsData?.name || 'Unknown',
            status: item.active ? 'Active' : 'Pending',
            threshold: item.threshold || 0,
            numberOfMembers: item.numberOfMembers || 0,
            creator: item.ipfsData?.creator || 'Unknown',
            members: item.members || [],
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
export type TCommitteeKey = {
    keyId: string;
    status: KeyStatus;
};
export async function getCommitteeKeys(committeeId: string) {
    const response = await axios.get(apiUrl.committeeKeys(committeeId));
    console.log('get Committee Keys', response.data);
    return {};
}
