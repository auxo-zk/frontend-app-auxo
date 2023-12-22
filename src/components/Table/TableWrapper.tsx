import { Box, SxProps } from '@mui/material';
import React, { ReactNode } from 'react';

export default function TableWrapper({ children, sx }: { children: ReactNode; sx?: SxProps }) {
    return <Box sx={{ borderRadius: '12px', border: '1px solid #CFE9E4', position: 'relative', minHeight: '75px', ...sx }}>{children}</Box>;
}
