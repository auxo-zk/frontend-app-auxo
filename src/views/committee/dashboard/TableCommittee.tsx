import { Box, Grid, Typography } from '@mui/material';
import React from 'react';

export default function TableCommittee() {
    return (
        <Box sx={{ border: '1px solid #37A9A2', borderRadius: '12px' }}>
            <Box sx={{ bgcolor: 'background.table', py: 2, borderRadius: '12px 12px 0px 0px', px: 1 }}>
                <Grid container columnSpacing={2}>
                    <Grid item xs={1.5}>
                        <Typography variant="body2" fontWeight={600}>
                            Commitee ID
                        </Typography>
                    </Grid>
                    <Grid item xs={2.5}>
                        <Typography variant="body2" fontWeight={600}>
                            Name
                        </Typography>
                    </Grid>
                    <Grid item xs={1.2}>
                        <Typography variant="body2" fontWeight={600}>
                            Status
                        </Typography>
                    </Grid>
                    <Grid item xs={1.2}>
                        <Typography variant="body2" fontWeight={600}>
                            Threshold
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <Typography variant="body2" fontWeight={600}>
                            Keys
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <Typography variant="body2" fontWeight={600}>
                            Requests
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant="body2" fontWeight={600}>
                            Creator
                        </Typography>
                    </Grid>
                    <Grid item xs={1.6}>
                        <Typography variant="body2" fontWeight={600}>
                            #
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            <TableRow />
            <TableRow />
            <TableRow />
        </Box>
    );
}

function TableRow() {
    return (
        <Box sx={{ py: 1.5, px: 1 }}>
            <Grid container columnSpacing={2}>
                <Grid item xs={1.5}>
                    <Typography fontWeight={600}>1</Typography>
                </Grid>
                <Grid item xs={2.5}>
                    <Typography>{"Auxo's public committee"}</Typography>
                </Grid>
                <Grid item xs={1.2}>
                    <Typography>Pending</Typography>
                </Grid>
                <Grid item xs={1.2}>
                    <Typography>6 out of 9</Typography>
                </Grid>
                <Grid item xs={1}>
                    <Typography>0</Typography>
                </Grid>
                <Grid item xs={1}>
                    <Typography>0</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography>B62q...1z2Z3JFurd</Typography>
                </Grid>
                <Grid item xs={1.6}>
                    <Typography>#</Typography>
                </Grid>
            </Grid>
        </Box>
    );
}
