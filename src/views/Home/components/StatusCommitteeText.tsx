import { Typography, TypographyProps } from '@mui/material';
import React from 'react';
import { TCommitteeData } from 'src/services/services';

export default function StatusCommitteeText({ status, typoProps }: { status: TCommitteeData['status']; typoProps?: TypographyProps }) {
    if (status == 'Active') {
        return (
            <Typography {...typoProps} color={'primary.light'}>
                Active
            </Typography>
        );
    }

    return (
        <Typography {...typoProps} color={'text.secondary'}>
            {status}
        </Typography>
    );
}
