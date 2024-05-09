import axios from 'axios';
import { apiUrl } from '../url';

export type TResponseGetGenNewKey = {
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
};

export async function getGenerateNewKeyData(memberId: string, committeeId: string): Promise<TResponseGetGenNewKey> {
    const response = await axios.get(apiUrl.getGenerateNewKeyData(memberId, committeeId));
    console.log(response);
    return response.data as TResponseGetGenNewKey;
}
