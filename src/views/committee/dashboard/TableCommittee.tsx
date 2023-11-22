import { Box, Button, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { TCommitteeData, getListCommittees } from 'src/services/services';
import { useModalFunction } from 'src/states/modal';
import { formatAddress } from 'src/utils/format';
import ModalViewDetailCommitee from './ModalViewDetailCommitee';

export default function TableCommittee() {
    const [dataList, setDataList] = useState<TCommitteeData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    async function getDataListCommittee() {
        setLoading(true);
        try {
            const response = await getListCommittees();
            setDataList(response);
        } catch (err) {
            console.log(err);
            setDataList([]);
        }
        setLoading(false);
    }
    useEffect(() => {
        getDataListCommittee();
    }, []);
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
            {loading ? (
                <Typography textAlign={'center'} my={4} fontWeight={600}>
                    Fetching data...
                </Typography>
            ) : (
                <>
                    {dataList.length === 0 ? (
                        <Typography textAlign={'center'} my={4} fontWeight={600}>
                            No data found!
                        </Typography>
                    ) : (
                        <>
                            {dataList.map((committee, index) => {
                                return <TableRow key={'committe' + committee.id + index} data={committee} />;
                            })}
                        </>
                    )}
                </>
            )}
        </Box>
    );
}

function TableRow({ data }: { data: TCommitteeData }) {
    const { openModal } = useModalFunction();
    return (
        <Box sx={{ py: 1.5, px: 1 }}>
            <Grid container columnSpacing={2}>
                <Grid item xs={1.5}>
                    <Typography fontWeight={600}>{data.idCommittee}</Typography>
                </Grid>
                <Grid item xs={2.5}>
                    <Typography>{data.name}</Typography>
                </Grid>
                <Grid item xs={1.2}>
                    <Typography>{data.status}</Typography>
                </Grid>
                <Grid item xs={1.2}>
                    <Typography>
                        {data.threshold} out of {data.numberOfMembers}
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <Typography>0</Typography>
                </Grid>
                <Grid item xs={1}>
                    <Typography>0</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography>{formatAddress(data.creator)}</Typography>
                </Grid>
                <Grid item xs={1.6}>
                    <Button onClick={() => openModal({ title: 'Committee Members', content: <ModalViewDetailCommitee data={data.members} /> })}>View Members</Button>
                </Grid>
            </Grid>
        </Box>
    );
}
