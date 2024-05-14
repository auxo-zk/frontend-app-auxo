import { Typography } from '@mui/material';
import React from 'react';
import { RequestStatus as EnumRequestStatus } from 'src/services/const';

export default function RequestStatus({ status }: { status: number }) {
    if (status == EnumRequestStatus.INTIALIZED) {
        return <Typography color={'secondary.main'}>Intialized</Typography>;
    }
    if (status == EnumRequestStatus.RESOLVED) {
        return <Typography color={'secondary.main'}>Resolved</Typography>;
    }
    return <Typography color={'primary.light'}>Expired</Typography>;
}
