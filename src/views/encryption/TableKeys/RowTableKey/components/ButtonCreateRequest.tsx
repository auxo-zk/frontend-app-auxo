import { Box, Button, InputAdornment, TextField } from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ButtonLoading from 'src/components/ButtonLoading/ButtonLoading';
import { getDataCreateTask } from 'src/services/api/getDataCreateTask';
import { TCommitteeKey } from 'src/services/services';
import { useContractData } from 'src/states/contracts';
import { useModalFunction } from 'src/states/modal';
import { useWalletData } from 'src/states/wallet';

export default function ButtonCreateRequest({ dataKey }: { dataKey: TCommitteeKey }) {
    const { openModal } = useModalFunction();

    return (
        <Button variant="outlined" size="small" onClick={() => openModal({ title: 'Create Request', content: <ModalCreateRequest dataKey={dataKey} />, modalProps: { maxWidth: 'xs' } })}>
            Create Request
        </Button>
    );
}

function ModalCreateRequest({ dataKey }: { dataKey: TCommitteeKey }) {
    const [timestamp, setTimstamp] = useState<string>('10');
    const [loading, setLoading] = useState<boolean>(false);
    const { userAddress } = useWalletData();
    const { workerClient } = useContractData();

    async function createRequest() {
        setLoading(true);
        const idtoast = toast.loading('Create transaction and proving...', { position: 'top-center', type: 'info' });
        try {
            if (!userAddress) throw Error('Please connect your wallet first!');
            if (!workerClient) throw Error('Worker client is dead, reload page again!');
            if (!(Number(timestamp) > 0)) throw Error('Invalid timestamp!');

            const dataBackend = await getDataCreateTask();
            await workerClient.createTask({ sender: userAddress, dataBackend: dataBackend, keyIndex: dataKey.keyIndex, timestamp: Date.now() + Number(timestamp) * 1000 });
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
        <Box textAlign={'right'}>
            <TextField
                type="number"
                value={timestamp}
                label="Submission Period"
                fullWidth
                onChange={(e) => setTimstamp(e.target.value)}
                InputProps={{
                    endAdornment: <InputAdornment position="start">s</InputAdornment>,
                }}
            />
            <ButtonLoading isLoading={loading} muiProps={{ onClick: createRequest, variant: 'contained', sx: { mt: 3 } }}>
                Create Request
            </ButtonLoading>
        </Box>
    );
}
