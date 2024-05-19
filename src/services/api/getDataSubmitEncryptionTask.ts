import axios from 'axios';
import { TRef, TWitness } from '../types';
import { apiUrl } from '../url';

export type TResponseDataSubmitEncryptionTask = {
    keyWitness: TWitness;
    keyIndexWitness: TWitness;
    submissionRef: TRef;
    dkgRef: TRef;
};

export async function getDataSubmitEncryptionTask(taskId: string): Promise<TResponseDataSubmitEncryptionTask> {
    const response = await axios.get(apiUrl.getDataSubmitEncryptionTask(taskId));
    console.log(response);
    return response.data as TResponseDataSubmitEncryptionTask;
}
