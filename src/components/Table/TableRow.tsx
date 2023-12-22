import { Box, Grid, GridProps } from '@mui/material';
import React, { ReactNode } from 'react';

export default function TableRow({ children, activeHover = false }: { children: ReactNode; activeHover?: boolean }) {
    return (
        <Box sx={{ px: { xs: 1, xsm: 2, sm: 3, md: 4 }, '&:hover': { bgcolor: activeHover ? 'background.secondary' : '' } }}>
            <Grid container sx={{ height: '56px', placeItems: 'center' }}>
                {children}
            </Grid>
        </Box>
    );
}
