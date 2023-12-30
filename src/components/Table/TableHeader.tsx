import { Box, Grid, GridProps, SxProps } from '@mui/material';
import React, { ReactNode } from 'react';

export default function TableHeader(props: { gridProps?: GridProps; wrapperSx?: SxProps; children?: ReactNode }) {
    return (
        <Box sx={{ borderRadius: '12px 12px 0px 0px', bgcolor: '#F8F8F8', px: { xs: 1, xsm: 2, sm: 3 }, position: 'sticky', top: 0, ...props.wrapperSx }}>
            <Grid {...props.gridProps} container sx={{ height: '56px', placeItems: 'center', ...props.gridProps?.sx }}>
                {props.children}
            </Grid>
        </Box>
    );
}
