import { Typography } from '@mui/material';
import React from 'react';

export default function RequestStatus({ status }: { status: number }) {
    if (status == 0) {
        return <Typography color={'secondary.main'}>...</Typography>;
    }
    if (status == 1) {
        return <Typography color={'secondary.main'}>Waiting</Typography>;
    }
    return <Typography color={'primary.light'}>Completed</Typography>;
}
