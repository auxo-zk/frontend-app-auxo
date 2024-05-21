import { Constants } from '@auxo-dev/dkg';
import { Box } from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ButtonLoading from 'src/components/ButtonLoading/ButtonLoading';
import { getResponseContribution } from 'src/services/api/getResponseContribution';
import {
    TDataMemberInCommittee,
    TRequest,
    getCommitteeKeyDetail,
    getCommitteeMemberLv1,
    getCommitteeMemberLv2,
    getStorageResponseZkapp,
    getStorageRound1PubkeyLv1,
    getStorageRound1PubkeyLv2,
    getStorageRound2EncryptionLv1,
    getStorageRound2EncryptionLv2,
} from 'src/services/services';
import { useContractData } from 'src/states/contracts';
import { useWalletData } from 'src/states/wallet';
import { getLocalStorageKeySecret, getLocalStorageSecretValue } from 'src/utils';

type Props = { dataUserInCommittee: { memberId: number; userAddress: string }; status: number; resquestData: TRequest };

export default function RequestAction(props: Props) {
    if (props.status != 1) return <></>;
    return <SubmitContribution {...props} />;
}

function SubmitContribution({ dataUserInCommittee, resquestData }: Props) {
    const { userAddress } = useWalletData();
    const { workerClient } = useContractData();
    const [submiting, setSubmiting] = useState<boolean>(false);

    async function generateContribution() {
        setSubmiting(true);
        const idtoast = toast.loading('Create transaction and proving...', { position: 'top-center', type: 'info' });
        try {
            if (!userAddress) throw Error('Please connect your wallet first!');
            if (!workerClient) throw Error('Worker client is dead, reload page again!');

            const memberId = dataUserInCommittee?.memberId + '' || '-1';
            if (memberId == '-1') throw Error('You are not a member of this committee');

            const secret = getLocalStorageSecretValue(resquestData.committeeId, memberId, resquestData.keyId, 'Berkeley');
            if (!secret) throw Error('Secret key missing!');

            const [keyDetail, responseContribution] = await Promise.all([
                getCommitteeKeyDetail(resquestData.committeeId, resquestData.keyId),
                getResponseContribution(resquestData.committeeId, resquestData.keyId, dataUserInCommittee.memberId + '', resquestData.requestId),
            ]);

            const fReceive = await workerClient.submitContributionRequest({
                sender: userAddress,
                keyId: resquestData.keyId,
                memberId: memberId,
                committeeId: resquestData.committeeId,
                requestId: resquestData.requestId,
                secret: secret,
                fReceive: JSON.parse(secret)?.fReceive || null,
                keyDetail: keyDetail,
                requestDetail: resquestData,
                responseContribution: responseContribution,
            });

            await workerClient.proveTransaction();

            toast.update(idtoast, { render: 'Prove successfull! Sending the transaction...' });
            const transactionJSON = await workerClient.getTransactionJSON();
            console.log(transactionJSON);

            const { transactionLink } = await workerClient.sendTransaction(transactionJSON);
            console.log(transactionLink);

            toast.update(idtoast, { render: 'Send transaction successfull!', isLoading: false, type: 'success', autoClose: 3000, hideProgressBar: false });

            // console.log(fReceive);
            const newSecret = {
                ...JSON.parse(secret),
                fReceive: fReceive,
            };
            localStorage.setItem(getLocalStorageKeySecret(resquestData.committeeId, memberId, resquestData.keyId, 'Berkeley'), JSON.stringify(newSecret));
        } catch (err) {
            console.log(err);
            toast.update(idtoast, { render: (err as Error).message, type: 'error', position: 'top-center', isLoading: false, autoClose: 3000, hideProgressBar: false });
        }
        setSubmiting(false);
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'end', placeItems: 'center', gap: 1 }}>
            <ButtonLoading muiProps={{ variant: 'outlined', size: 'small', onClick: generateContribution }} isLoading={submiting}>
                Submit Contribution
            </ButtonLoading>
        </Box>
    );
}
