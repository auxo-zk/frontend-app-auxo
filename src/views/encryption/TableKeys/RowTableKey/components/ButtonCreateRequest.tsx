import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ButtonLoading from 'src/components/ButtonLoading/ButtonLoading';
import { getDataCreateTask } from 'src/services/api/getDataCreateTask';
import { TCommitteeKey } from 'src/services/services';
import { useContractData } from 'src/states/contracts';
import { useWalletData } from 'src/states/wallet';

export default function ButtonCreateRequest({ dataKey }: { dataKey: TCommitteeKey }) {
    const [loading, setLoading] = useState<boolean>(false);
    const { userAddress } = useWalletData();
    const { workerClient } = useContractData();

    async function createRequest() {
        setLoading(true);
        const idtoast = toast.loading('Create transaction and proving...', { position: 'top-center', type: 'info' });
        try {
            if (!userAddress) throw Error('Please connect your wallet first!');
            if (!workerClient) throw Error('Worker client is dead, reload page again!');

            const dataBackend = await getDataCreateTask();
            await workerClient.createTask({ sender: userAddress, dataBackend: dataBackend, keyIndex: dataKey.keyIndex, timestamp: 1000 });
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    }
    return (
        <ButtonLoading isLoading={false} muiProps={{ onClick: createRequest, variant: 'outlined', size: 'small' }}>
            Create Request
        </ButtonLoading>
    );
}
