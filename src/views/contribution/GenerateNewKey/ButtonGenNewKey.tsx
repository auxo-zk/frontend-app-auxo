import React, { useState } from 'react';
import ButtonLoading from 'src/components/ButtonLoading/ButtonLoading';
import { useContributionPageData } from '../state';
import { TDataMemberInCommittee, getCommitteeMemberLv1, getCommitteeMemberLv2, getStorageDkgZApps } from 'src/services/services';
import { useContractData } from 'src/states/contracts';
import { toast } from 'react-toastify';
import { useWalletData } from 'src/states/wallet';
import { Constants } from '@auxo-dev/dkg';
import { getGenerateNewKeyData } from 'src/services/api/generateNewKey';

export default function ButtonGenNewKey({ dataUserInCommittee }: { dataUserInCommittee: { memberId: number; userAddress: string } }) {
    const { workerClient } = useContractData();
    const { userAddress } = useWalletData();
    const { selectedCommittee } = useContributionPageData();
    const [loading, setLoading] = useState<boolean>(false);

    async function generateNewKey() {
        setLoading(true);
        const idtoast = toast.loading('Create transaction and proving...', { position: 'top-center', type: 'info' });
        try {
            if (selectedCommittee && workerClient && userAddress) {
                const committeeId = selectedCommittee.idCommittee;
                const _memberId = dataUserInCommittee.memberId + '';
                console.log(_memberId);
                if (_memberId == '-1') throw Error('You are not a member of this committee');

                const dataGenerator = await getGenerateNewKeyData(_memberId, committeeId);

                await workerClient.genNewKeyContributions({
                    memberId: _memberId,
                    sender: userAddress,
                    dataBackend: dataGenerator,
                });

                await workerClient.proveTransaction();

                toast.update(idtoast, { render: 'Prove successfull! Sending the transaction...' });
                const transactionJSON = await workerClient.getTransactionJSON();
                console.log(transactionJSON);

                const { transactionLink } = await workerClient.sendTransaction(transactionJSON);
                console.log(transactionLink);

                toast.update(idtoast, { render: 'Send transaction successfull!', isLoading: false, type: 'success', autoClose: 3000, hideProgressBar: false });
            } else {
                throw Error('Selected committee or worker client or user address is invalid!');
            }
        } catch (err) {
            console.log(err);
            toast.update(idtoast, { render: (err as Error).message, type: 'error', position: 'top-center', isLoading: false, autoClose: 3000, hideProgressBar: false });
        }
        setLoading(false);
    }

    return (
        <ButtonLoading muiProps={{ variant: 'contained', sx: { ml: 'auto' }, onClick: () => generateNewKey() }} isLoading={loading}>
            Generate new key
        </ButtonLoading>
    );
}
