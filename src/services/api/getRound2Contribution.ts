import axios from 'axios';
import { apiUrl } from '../url';

export type TResponseGetRount2Contribution = {
    memberWitness: {
        level1: {
            path: string[];
            isLeft: boolean[];
        };
        level2: {
            path: string[];
            isLeft: boolean[];
        };
    };
    committeeRef: {
        address: string;
        witness: {
            path: string[];
            isLeft: boolean[];
        };
    };
    round1Ref: {
        address: string;
        witness: {
            path: string[];
            isLeft: boolean[];
        };
    };
    rollupRef: {
        address: string;
        witness: {
            path: string[];
            isLeft: boolean[];
        };
    };
    selfRef: {
        address: string;
        witness: {
            path: string[];
            isLeft: boolean[];
        };
    };
    publicKeysWitness: {
        path: string[];
        isLeft: boolean[];
    };
};

export async function getRound2Contribution(memberId: string, committeeId: string, keyId: string) {
    const response = await axios.get(apiUrl.getRound2Contribution(memberId, committeeId, keyId));
    console.log(response);
    return response.data as TResponseGetRount2Contribution;
}
