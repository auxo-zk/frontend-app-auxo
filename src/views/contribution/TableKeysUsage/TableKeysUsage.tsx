import { Box, Typography } from '@mui/material';
import React from 'react';

const tableCellRatio = [1.2, 3, 2, 1.8, 4];
export default function TableKeysUsage() {
    return (
        <Box mt={3}>
            <Typography variant="h6" mb={1}>
                Keys Usage
            </Typography>
        </Box>
    );
}
