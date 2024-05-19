import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ButtonLoading from 'src/components/ButtonLoading/ButtonLoading';
import { getDataFinalizeTask } from 'src/services/api/getDataFinalizeTask';
import { TTask } from 'src/services/services';
import { useContractData } from 'src/states/contracts';
import { useWalletData } from 'src/states/wallet';

export default function ButtonFinalization({ dataTask }: { dataTask: TTask }) {
    const [loading, setLoading] = useState<boolean>(false);
    const { userAddress } = useWalletData();
    const { workerClient } = useContractData();

    async function finalize() {
        setLoading(true);
        const idtoast = toast.loading('Create transaction and proving...', { position: 'top-center', type: 'info' });
        try {
            if (!userAddress) throw Error('Please connect your wallet first!');
            if (!workerClient) throw Error('Worker client is dead, reload page again!');

            const dataBackend = await getDataFinalizeTask(dataTask.taskId);
            await workerClient.finalizeTask({ sender: userAddress, dataBackend: dataBackend, keyIndex: dataTask.keyIndex, taskId: dataTask.taskId });
            await workerClient.proveTransaction();

            toast.update(idtoast, { render: 'Prove successfull! Sending the transaction...' });
            const transactionJSON = await workerClient.getTransactionJSON();
            console.log(transactionJSON);

            const { transactionLink } = await workerClient.sendTransaction(transactionJSON);
            console.log(transactionLink);

            toast.update(idtoast, { render: 'Send transaction successfull!', isLoading: false, type: 'success', autoClose: 3000, hideProgressBar: false });
        } catch (err) {
            console.log(err);
            toast.update(idtoast, { render: (err as Error).message, type: 'error', position: 'top-center', isLoading: false, autoClose: 3000, hideProgressBar: false });
        }
        setLoading(false);
    }

    return (
        <ButtonLoading isLoading={loading} muiProps={{ onClick: finalize, variant: 'outlined', size: 'small' }}>
            Finalize
        </ButtonLoading>
    );
}
