import { Round1Contribution } from '@auxo-dev/dkg';
import { Libs } from '@auxo-dev/dkg';
import { Typography } from '@mui/material';
import { Group, PublicKey } from 'o1js';
import React from 'react';
import { KeyStatus } from 'src/services/const';
import { TRound1Data } from 'src/services/services';
import { formatAddress } from 'src/utils/format';

export default function KeyContributionPubkey({ status, publicKey }: { status: KeyStatus; publicKey: string | null }) {
    if (publicKey) {
        return <Typography fontWeight={500}>{formatAddress(publicKey, 5, 6)}</Typography>;
    }
    return <Typography color={'secondary.main'}>Awaiting contribution...</Typography>;
}
