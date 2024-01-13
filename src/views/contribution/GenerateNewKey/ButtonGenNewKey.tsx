import React, { useState } from 'react';
import ButtonLoading from 'src/components/ButtonLoading/ButtonLoading';
import { useContributionPageData } from '../state';
import { TDataMemberInCommittee, getCommitteeMemberLv1, getCommitteeMemberLv2, getStorageDkgZApps } from 'src/services/services';
import { useContractData } from 'src/states/contracts';
import { toast } from 'react-toastify';
import { useWalletData } from 'src/states/wallet';
import { Constants } from '@auxo-dev/dkg';

export default function ButtonGenNewKey({ dataUserInCommittee }: { dataUserInCommittee: TDataMemberInCommittee | null | undefined }) {
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
                const memberId = dataUserInCommittee?.memberId + '' || '-1';
                if (memberId == '-1') throw Error('You are not a member of this committee');

                const witnessAll = await Promise.all([getStorageDkgZApps(), getCommitteeMemberLv1(), getCommitteeMemberLv2(committeeId)]);

                await workerClient.genNewKeyContributions({
                    committee: { committeeId: committeeId, witness: witnessAll[0][Constants.ZkAppEnum.COMMITTEE] },
                    memberId: memberId,
                    sender: userAddress,
                    memberWitness: {
                        level1: witnessAll[1][Number(committeeId)],
                        level2: witnessAll[2][Number(memberId)],
                    },
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
