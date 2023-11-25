import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { TCommitteeData } from 'src/services/services';
import { formatAddress } from 'src/utils/format';

export default function ModalViewDetailCommitee({ data }: { data: TCommitteeData['members'] }) {
    return (
        <Box>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={1}>
                        <Typography variant="body2" fontWeight={600}>
                            #
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="body2" fontWeight={600}>
                            Alias
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="body2" fontWeight={600}>
                            Last Active
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="body2" fontWeight={600}>
                            Public Key
                        </Typography>
                    </Grid>
                </Grid>
                {data.length == 0 ? (
                    <Typography py={3} fontWeight={600} textAlign={'center'}>
                        No member
                    </Typography>
                ) : (
                    <>
                        {data.map((mem, i) => {
                            return (
                                <Grid key={mem.publicKey + i} container spacing={2} pt={2}>
                                    <Grid item xs={1}>
                                        <Typography>{i + 1}</Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography sx={{ textTransform: 'capitalize' }}>{mem.alias}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography>{new Date(mem.lastActive).toLocaleDateString()}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography>{formatAddress(mem.publicKey)}</Typography>
                                    </Grid>
                                </Grid>
                            );
                        })}
                    </>
                )}
            </Box>
        </Box>
    );
}
