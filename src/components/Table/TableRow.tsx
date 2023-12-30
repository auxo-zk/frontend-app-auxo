import { Box, Grid, GridProps, SxProps } from '@mui/material';
import React, { ReactNode } from 'react';

export default function TableRow({ children, activeHover = false, gridSx, wrapperSx }: { children: ReactNode; activeHover?: boolean; gridSx?: SxProps; wrapperSx?: SxProps }) {
    return (
        <Box sx={{ px: { xs: 1, xsm: 2, sm: 3 }, '&:hover': { bgcolor: activeHover ? 'background.secondary' : '' }, ...wrapperSx }}>
            <Grid container sx={{ height: '56px', placeItems: 'center', ...gridSx }}>
                {children}
            </Grid>
        </Box>
    );
}
