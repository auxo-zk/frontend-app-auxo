import axios from 'axios';
import { apiUrl } from '../url';
import { TRef, TWitness, TWitnessLevel } from '../types';

export type TResponseGetRount2Contribution = {
    memberWitness: TWitnessLevel;
    committeeRef: TRef;
    round1Ref: TRef;
    rollupRef: TRef;
    selfRef: TRef;
    publicKeysWitness: TWitness;
};

export async function getRound2Contribution(memberId: string, committeeId: string, keyId: string) {
    const response = await axios.get(apiUrl.getRound2Contribution(memberId, committeeId, keyId));
    console.log(response);
    return response.data as TResponseGetRount2Contribution;
}
