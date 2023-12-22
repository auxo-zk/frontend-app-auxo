import { Box, Container, Typography } from '@mui/material';
import React from 'react';
import AutocompleteSearchCommittee from 'src/views/contribution/AutocompleteSearchCommittee/AutocompleteSearchCommittee';

export default function Contribution() {
    return (
        <Container sx={{ pt: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h1">Keys Contribution</Typography>
            </Box>
            <Box>
                <AutocompleteSearchCommittee />
            </Box>
        </Container>
    );
}
