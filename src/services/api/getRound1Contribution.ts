import axios from 'axios';
import { apiUrl } from '../url';
import { TRef, TWitnessLevel } from '../types';

export type TResponseGetRount1Contribution = {
    memberWitness: TWitnessLevel;
    committeeRef: TRef;
    rollupRef: TRef;
    selfRef: TRef;
};

export async function getRound1Contribution(memberId: string, committeeId: string) {
    const response = await axios.get(apiUrl.getRound1Contribution(memberId, committeeId));
    console.log(response);
    return response.data as TResponseGetRount1Contribution;
}
