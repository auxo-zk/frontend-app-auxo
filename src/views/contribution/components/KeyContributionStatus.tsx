import { Typography } from '@mui/material';
import React from 'react';
import { KeyStatus } from 'src/services/const';

export default function KeyContributionStatus({ status }: { status: KeyStatus }) {
    if (status == KeyStatus.EMPTY) {
        return <Typography sx={{ color: 'text.secondary' }}>Empty</Typography>;
    }
    if (status == KeyStatus.ROUND_1_CONTRIBUTION) {
        return <Typography sx={{ color: 'text.secondary' }}>Round 1</Typography>;
    }
    if (status == KeyStatus.ROUND_2_CONTRIBUTION) {
        return <Typography sx={{ color: 'text.secondary' }}>Round 2</Typography>;
    }
    return <Typography sx={{ color: 'primary.light' }}>Active</Typography>;
}
