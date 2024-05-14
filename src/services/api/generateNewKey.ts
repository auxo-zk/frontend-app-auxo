import axios from 'axios';
import { apiUrl } from '../url';
import { TRef, TWitnessLevel } from '../types';

export type TResponseGetGenNewKey = {
    memberWitness: TWitnessLevel;
    committeeRef: TRef;
    rollupRef: TRef;
    selfRef: TRef;
};

export async function getGenerateNewKeyData(memberId: string, committeeId: string): Promise<TResponseGetGenNewKey> {
    const response = await axios.get(apiUrl.getGenerateNewKeyData(memberId, committeeId));
    console.log(response);
    return response.data as TResponseGetGenNewKey;
}
