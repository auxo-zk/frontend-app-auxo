import axios from 'axios';
import { TRef, TWitness } from '../types';
import { apiUrl } from '../url';

export type TResponseDataFinalizeTask = {
    accumulationRootR: string;
    accumulationRootM: string;
    keyIndexWitness: TWitness;
    accumulationWitness: TWitness;
    requestRef: TRef;
};

export async function getDataFinalizeTask(taskId: string): Promise<TResponseDataFinalizeTask> {
    const response = await axios.get(apiUrl.getDataFinalizeTask(taskId));
    console.log(response);
    return response.data as TResponseDataFinalizeTask;
}
