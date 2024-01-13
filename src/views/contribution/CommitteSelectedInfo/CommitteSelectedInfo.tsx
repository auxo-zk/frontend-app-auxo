import { Box, Typography } from '@mui/material';
import React from 'react';
import { useContributionPageData } from '../state';
import StatusCommitteeText from 'src/views/Home/components/StatusCommitteeText';

export default function CommitteSelectedInfo() {
    const { selectedCommittee } = useContributionPageData();
    if (selectedCommittee) {
        return (
            <Box>
                <Typography variant="h6" mb={1}>
                    {selectedCommittee.name}
                </Typography>
                <Typography variant="body2" fontWeight={500} mb={1}>
                    Creator: {selectedCommittee.creator}
                </Typography>
                <Typography variant="body2">
                    Status: <StatusCommitteeText typoProps={{ component: 'span', fontWeight: 600 }} status={selectedCommittee.status} />
                </Typography>
            </Box>
        );
    }
    return <></>;
}
