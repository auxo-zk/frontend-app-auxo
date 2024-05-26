import { Constants } from '@auxo-dev/dkg';
import { FileDownloadOutlined } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ButtonLoading from 'src/components/ButtonLoading/ButtonLoading';
import { getGenerateNewKeyData } from 'src/services/api/generateNewKey';
import { getRound1Contribution } from 'src/services/api/getRound1Contribution';
import { getRound2Contribution } from 'src/services/api/getRound2Contribution';
import { KeyStatus } from 'src/services/const';
import {
    TCommitteeKey,
    TDataMemberInCommittee,
    TRound1Data,
    TRound2Data,
    getCommitteeMemberLv1,
    getCommitteeMemberLv2,
    getStorageRound1PubkeyLv1,
    getStorageRound1Zkapp,
    getStorageRound2Zkapp,
} from 'src/services/services';
import { useContractData } from 'src/states/contracts';
import { useWalletData } from 'src/states/wallet';
import { downloadTextFile, getLocalStorageKeySecret, getLocalStorageSecretValue } from 'src/utils';

type Props = { dataKey: TCommitteeKey; dataUserInCommittee: { memberId: number; userAddress: string }; T: number; N: number };
export default function KeysContributionAction(props: Props) {
    // console.log('status', props.dataKey.status == KeyStatus.ACTIVE);
    if (props.dataKey.status == KeyStatus.ROUND_1_CONTRIBUTION) {
        return <KeysRound1Action {...props} />;
    }
    if (props.dataKey.status == KeyStatus.ROUND_2_CONTRIBUTION) {
        return <KeysRound2Action {...props} />;
    }
    if (props.dataKey.status == KeyStatus.ACTIVE) {
        return <KeyActiveAction {...props} />;
    }
    return <div></div>;
}

// TODO: Action Round1 ================================================================================================================================
function KeysRound1Action({ dataKey, dataUserInCommittee, T, N }: Props) {
    const { userAddress } = useWalletData();
    const { workerClient, networkName } = useContractData();
    const [submiting, setSubmiting] = useState<boolean>(false);

    async function generateContribution() {
        setSubmiting(true);
        const idtoast = toast.loading('Create transaction and proving...', { position: 'top-center', type: 'info' });
        try {
            if (T == 0 || N == 0) throw Error('Threshold or member list invalid!');
            if (!userAddress) throw Error('Please connect your wallet first!');
            if (!workerClient) throw Error('Worker client is dead, reload page again!');
            const committeeId = dataKey.committeeId;
            const _memberId = dataUserInCommittee.memberId + '';
            if (_memberId == '-1') throw Error('You are not a member of this committee');

            const dataBackend = await getRound1Contribution(_memberId, committeeId);

            const secret = await workerClient.submitContributionRound1({
                n: N,
                t: T,
                sender: userAddress,
                keyId: dataKey.keyId,
                committeeId: dataKey.committeeId,
                memberId: _memberId,
                dataBackend: dataBackend,
                networkName: networkName,
            });
            await workerClient.proveTransaction();

            toast.update(idtoast, { render: 'Prove successfull! Sending the transaction...' });
            const transactionJSON = await workerClient.getTransactionJSON();
            console.log(transactionJSON);

            const { transactionLink } = await workerClient.sendTransaction(transactionJSON);
            console.log(transactionLink);

            toast.update(idtoast, { render: 'Send transaction successfull!', isLoading: false, type: 'success', autoClose: 3000, hideProgressBar: false });
            localStorage.setItem(secret.key, secret.value);
        } catch (err) {
            console.log(err);
            toast.update(idtoast, { render: (err as Error).message, type: 'error', position: 'top-center', isLoading: false, autoClose: 3000, hideProgressBar: false });
        }

        setSubmiting(false);
    }

    function downloadSecret() {
        const secret = getLocalStorageSecretValue(dataKey.committeeId, dataUserInCommittee.memberId + '', dataKey.keyId, networkName);
        downloadTextFile(secret || '', `${getLocalStorageKeySecret(dataKey.committeeId, dataUserInCommittee.memberId + '', dataKey.keyId, networkName)}.txt`);
    }

    function checkMemberIdInRound1(round1: TRound1Data[], memberId: string) {
        if (memberId == '') return false;
        for (let i of round1) {
            if (i.memberId + '' == memberId) {
                return true;
            }
        }
        return false;
    }
    return (
        <Box sx={{ display: 'flex', justifyContent: 'end', placeItems: 'center', gap: 1 }}>
            {checkMemberIdInRound1(dataKey.round1, dataUserInCommittee.memberId + '') ? (
                <></>
            ) : (
                <ButtonLoading muiProps={{ variant: 'outlined', size: 'small', onClick: () => generateContribution() }} isLoading={submiting}>
                    Submit Contribution
                </ButtonLoading>
            )}

            <IconButton color="primary" onClick={downloadSecret}>
                <FileDownloadOutlined />
            </IconButton>
        </Box>
    );
}

// TODO: Action Round2 ================================================================================================================================
function KeysRound2Action({ dataKey, dataUserInCommittee, N, T }: Props) {
    const { userAddress } = useWalletData();
    const { workerClient, networkName } = useContractData();
    const [submiting, setSubmiting] = useState<boolean>(false);

    function checkMemberIdInRound2(round1: TRound2Data[], memberId: string) {
        if (memberId == '') return false;
        for (let i of round1) {
            if (i.memberId + '' == memberId) {
                return true;
            }
        }
        return false;
    }
    function downloadSecret() {
        const secret = getLocalStorageSecretValue(dataKey.committeeId, dataUserInCommittee.memberId + '', dataKey.keyId, networkName);
        downloadTextFile(secret || '', `${getLocalStorageKeySecret(dataKey.committeeId, dataUserInCommittee.memberId + '', dataKey.keyId, networkName)}.txt`);
    }

    async function generateContribution() {
        setSubmiting(true);
        const idtoast = toast.loading('Create transaction and proving...', { position: 'top-center', type: 'info' });
        try {
            if (T == 0 || N == 0) throw Error('Threshold or member list invalid!');
            if (!userAddress) throw Error('Please connect your wallet first!');
            if (!workerClient) throw Error('Worker client is dead, reload page again!');
            const committeeId = dataKey.committeeId;
            const _memberId = dataUserInCommittee.memberId + '';
            if (_memberId == '-1') throw Error('You are not a member of this committee');

            const secret = getLocalStorageSecretValue(dataKey.committeeId, _memberId, dataKey.keyId, networkName);
            if (!secret) throw Error('Secret key missing!');

            const dataBackend = await getRound2Contribution(_memberId, committeeId, dataKey.keyId);

            await workerClient.submitContributionRound2({
                sender: userAddress,
                keyId: dataKey.keyId,
                memberId: _memberId,
                secret: secret,
                round1Contributions: dataKey.round1.map((item) => item.contribution),
                dataBackend: dataBackend,
            });
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

        setSubmiting(false);
    }
    return (
        <Box sx={{ display: 'flex', justifyContent: 'end', placeItems: 'center', gap: 1 }}>
            {checkMemberIdInRound2(dataKey.round2, dataUserInCommittee.memberId + '' || '') ? (
                <></>
            ) : (
                <ButtonLoading muiProps={{ variant: 'outlined', size: 'small', onClick: generateContribution }} isLoading={submiting}>
                    Submit Contribution
                </ButtonLoading>
            )}
            <IconButton color="primary" onClick={downloadSecret}>
                <FileDownloadOutlined />
            </IconButton>
        </Box>
    );
}

// TODO: Action Active ================================================================================================================================
function KeyActiveAction({ dataKey, dataUserInCommittee, N, T }: Props) {
    const { userAddress } = useWalletData();
    const { workerClient, networkName } = useContractData();
    const [submiting, setSubmiting] = useState<boolean>(false);

    function downloadSecret() {
        const secret = getLocalStorageSecretValue(dataKey.committeeId, dataUserInCommittee.memberId + '', dataKey.keyId, networkName);
        downloadTextFile(secret || '', `${getLocalStorageKeySecret(dataKey.committeeId, dataUserInCommittee.memberId + '', dataKey.keyId, networkName)}.txt`);
    }

    async function deprecate() {
        setSubmiting(true);
        const idtoast = toast.loading('Create transaction and proving...', { position: 'top-center', type: 'info' });
        try {
            if (T == 0 || N == 0) throw Error('Threshold or member list invalid!');
            if (!userAddress) throw Error('Please connect your wallet first!');
            if (!workerClient) throw Error('Worker client is dead, reload page again!');
            const committeeId = dataKey.committeeId;
            const _memberId = dataUserInCommittee.memberId + '';
            if (_memberId == '-1') throw Error('You are not a member of this committee');

            const secret = getLocalStorageSecretValue(dataKey.committeeId, _memberId, dataKey.keyId, networkName);
            if (!secret) throw Error('Secret key missing!');
            const dataBackend = await getGenerateNewKeyData(_memberId, committeeId);

            await workerClient.deprecateKey({
                sender: userAddress,
                keyId: dataKey.keyId,
                dataBackend: dataBackend,
            });
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

        setSubmiting(false);
    }

    return (
        <Box sx={{ display: dataUserInCommittee.userAddress ? 'flex' : 'none', justifyContent: 'end', placeItems: 'center', gap: 1 }}>
            <ButtonLoading muiProps={{ variant: 'outlined', size: 'small', onClick: deprecate }} isLoading={submiting}>
                Deprecate
            </ButtonLoading>
            <IconButton color="primary" onClick={downloadSecret}>
                <FileDownloadOutlined />
            </IconButton>
        </Box>
    );
}
