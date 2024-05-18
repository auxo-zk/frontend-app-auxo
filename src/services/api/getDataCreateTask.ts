import axios from 'axios';
import { TRef } from '../types';
import { apiUrl } from '../url';

export type TResponseGetDataCreateTask = {
    taskManagerRef: TRef;
};

export async function getDataCreateTask(): Promise<TResponseGetDataCreateTask> {
    const response = await axios.get(apiUrl.getDataCreateTask);
    console.log(response);
    return response.data as TResponseGetDataCreateTask;
}
