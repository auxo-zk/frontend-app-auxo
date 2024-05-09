import axios from 'axios';
import { apiUrl } from '../url';

export type TResponseGetRount1Contribution = {
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

export async function getRound1Contribution(memberId: string, committeeId: string) {
    const response = await axios.get(apiUrl.getRound1Contribution(memberId, committeeId));
    console.log(response);
    return response.data as TResponseGetRount1Contribution;
}
