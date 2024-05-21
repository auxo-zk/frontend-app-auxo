import { Typography } from '@mui/material';
import React from 'react';

export default function TaskStatus({ timestamp }: { timestamp: number }) {
    const now = Date.now();
    if (timestamp > now) {
        return (
            <Typography fontWeight={600} color={'secondary.main'}>
                Submission
            </Typography>
        );
    }
    return (
        <Typography fontWeight={600} color={'primary.main'}>
            Finalization
        </Typography>
    );
}
