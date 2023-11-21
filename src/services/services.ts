import axios from 'axios';
import { apiUrl } from './url';

export async function getListCommittees() {
    const response = await axios.get(apiUrl.listCommittee);
    console.log('List committee', response.data);

    return response.data.map((item: any) => {
        return {
            id: item['_id'],
            idCommittee: item.committeeIndex,
            name: '',
            status: item.active ? 'active' : 'pending',
            threshold: item.threshold,
            members: item.publicKeys,
        };
    });
}

export async function postCreateCommittee(data: { name: string; creator: string; network: string }) {
    const response = await axios.post(apiUrl.createCommittee, data);
    console.log('post new committee', response.data);
    return response.data;
}
