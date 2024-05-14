import axios from 'axios';
import { apiUrl } from '../url';
import { TRef, TWitness, TWitnessLevel } from '../types';

export type TResponseGetResponseContribution = {
    accumulationRootR: string;
    accumulationRootM: string;
    accumulationWitnessesR: TWitness[];
    memberWitness: TWitnessLevel;
    publicKeyWitness: TWitnessLevel;
    encryptionWitness: TWitnessLevel;
    accumulationWitness: TWitness;
    committeeRef: TRef;
    round1Ref: TRef;
    round2Ref: TRef;
    requestRef: TRef;
    rollupRef: TRef;
    selfRef: TRef;
};

export async function getResponseContribution(committeeId: string, keyId: string, memberId: string, requestId: string): Promise<TResponseGetResponseContribution> {
    const response = await axios.get(apiUrl.getResponseContribution(committeeId, keyId, memberId, requestId));
    console.log(response);
    return response.data as TResponseGetResponseContribution;
}
