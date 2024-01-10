import { generateRandomPolynomial, getRound1Contribution } from '@auxo-dev/dkg';
import { Box, Button } from '@mui/material';
import React from 'react';
import ButtonLoading from 'src/components/ButtonLoading/ButtonLoading';
import { LocalStorageKey } from 'src/constants';
import { KeyStatus } from 'src/services/const';
import { TCommitteeKey, TDataMemberInCommittee, TRound1Data, TRound2Data } from 'src/services/services';

type Props = { dataKey: TCommitteeKey; dataUserInCommittee: TDataMemberInCommittee | null | undefined; T: number; N: number };
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

function KeysRound1Action({ dataKey, dataUserInCommittee, T, N }: Props) {
    function generateContribution() {
        if (T == 0 || N == 0) return;

        const secret = generateRandomPolynomial(T, N);
        const contribution = getRound1Contribution(secret);
        console.log(secret);
        localStorage.setItem(LocalStorageKey.secretRound1Contribution, JSON.stringify(secret));
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
        <Box sx={{ display: checkMemberIdInRound1(dataKey.round1, dataUserInCommittee?.memberId || '') ? 'flex' : 'none' }}>
            <ButtonLoading muiProps={{ size: 'small', onClick: () => generateContribution() }} isLoading={false}>
                Submit Contribution
            </ButtonLoading>
        </Box>
    );
}

function KeysRound2Action({ dataKey, dataUserInCommittee }: Props) {
    function checkMemberIdInRound2(round1: TRound2Data[], memberId: string) {
        if (memberId == '') return false;
        for (let i of round1) {
            if (i.memberId + '' == memberId) {
                return true;
            }
        }
        return false;
    }
    return (
        <Box sx={{ display: checkMemberIdInRound2(dataKey.round2, dataUserInCommittee?.memberId || '') ? 'flex' : 'none' }}>
            <ButtonLoading muiProps={{ size: 'small' }} isLoading={false}>
                Submit Contribution
            </ButtonLoading>
        </Box>
    );
}

function KeyActiveAction({ dataKey, dataUserInCommittee }: Props) {
    return (
        <Box sx={{ display: dataUserInCommittee?.publicKey ? 'flex' : 'none' }}>
            <ButtonLoading muiProps={{ size: 'small' }} isLoading={false}>
                Deprecate
            </ButtonLoading>
        </Box>
    );
}
