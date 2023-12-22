import { Grid, GridProps } from '@mui/material';
import React from 'react';

export default function TableCell(props: GridProps) {
    return <Grid {...props} item></Grid>;
}
