import { Box, Container, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import { imagePath } from 'src/constants/imagePath';
import AutocompleteSearchCommittee from 'src/views/contribution/AutocompleteSearchCommittee/AutocompleteSearchCommittee';
import TableKeyContribution from 'src/views/contribution/TableKeyContribution/TableKeyContribution';

export default function Contribution() {
    return (
        <Container sx={{ pt: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Box sx={{ width: '100%' }}>
                    <Typography variant="h1" textTransform={'uppercase'} maxWidth={'614px'}>
                        Keys Contribution
                    </Typography>
                </Box>

                <Box sx={{ display: { xs: 'none', xsm: 'block' } }}>
                    <Image src={imagePath.THUMBNAIL4} alt="auxo thumbnail" style={{ maxWidth: '256px', height: 'auto', width: '100%' }} />
                </Box>
            </Box>
            <Box>
                <AutocompleteSearchCommittee />

                <TableKeyContribution />
            </Box>
        </Container>
    );
}
