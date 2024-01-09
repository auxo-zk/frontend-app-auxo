import React, { useState } from 'react';
import ButtonLoading from 'src/components/ButtonLoading/ButtonLoading';
import { useContributionPageData } from '../state';
import { TDataMemberInCommittee, getStorageDkgZApps } from 'src/services/services';
import { useContractData, useContractFunction } from 'src/states/contracts/committee';
import { toast } from 'react-toastify';
import { useWalletData } from 'src/states/wallet';

export default function ButtonGenNewKey({ dataUserInCommittee }: { dataUserInCommittee: TDataMemberInCommittee | null | undefined }) {
    const { workerClient } = useContractData();
    const { userAddress } = useWalletData();
    const { selectedCommittee } = useContributionPageData();
    const [loading, setLoading] = useState<boolean>(false);
    async function generateNewKey() {
        try {
            if (selectedCommittee && workerClient && userAddress) {
                const committeeId = selectedCommittee.idCommittee;
                const memberId = dataUserInCommittee?.memberId || '-1';
                const zkapp = getStorageDkgZApps();

                await workerClient.genNewKeyContributions({
                    committee: { committeeId: committeeId, witness: '' },
                    memberId: memberId,
                    sender: userAddress,
                    memberWitness: {
                        level1: '',
                        level2: '',
                    },
                });

                toast('Create transaction and proving...', { type: 'info', position: 'top-center' });

                await workerClient?.proveTransaction();

                const transactionJSON = await workerClient.getTransactionJSON();
                console.log(transactionJSON);
                const { transactionLink } = await workerClient.sendTransaction(transactionJSON);
                console.log(transactionLink);
            }
        } catch (err) {
            console.log(err);
            toast((err as Error).message, { type: 'error', position: 'top-center' });
        }
    }
    return (
        <ButtonLoading muiProps={{ variant: 'contained', sx: { ml: 'auto' }, onClick: () => generateNewKey() }} isLoading={loading}>
            Generate new key
        </ButtonLoading>
    );
}
