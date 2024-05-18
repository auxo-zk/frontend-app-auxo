import { ExpandMoreRounded } from '@mui/icons-material';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';
import TableCell from 'src/components/Table/TableCell';
import TableRow from 'src/components/Table/TableRow';
import { TCommitteeKey } from 'src/services/services';
import KeyContributionPubkey from 'src/views/contribution/components/KeyContributionPubkey';
import KeyContributionStatus from 'src/views/contribution/components/KeyContributionStatus';
import TableRequests from '../../TableRequests/TableRequests';
import ButtonCreateRequest from './components/ButtonCreateRequest';

export default function RowTableKey({ data, tableCellRatio }: { data: TCommitteeKey; tableCellRatio: number[] }) {
    const [openTablerequest, setOpenTableRequest] = useState<boolean>(false);

    return (
        <Box>
            <TableRow wrapperSx={{ background: openTablerequest ? '#F1F6F5' : '' }}>
                <TableCell xs={tableCellRatio[0]}>
                    <Typography color={'text.secondary'}>{data.keyId}</Typography>
                </TableCell>
                <TableCell xs={tableCellRatio[1]}>
                    <KeyContributionPubkey status={data.status} publicKey={data.publicKey} />
                </TableCell>
                <TableCell xs={tableCellRatio[2]}>
                    <KeyContributionStatus status={data.status} />
                </TableCell>
                <TableCell xs={tableCellRatio[3]}>
                    <Typography color={'text.secondary'}>{data?.numRequest || 0}</Typography>
                </TableCell>
                <TableCell xs={tableCellRatio[4]}>
                    <Typography color={'text.secondary'}>0 MINA</Typography>
                </TableCell>
                <TableCell xs={tableCellRatio[5]} sx={{ textAlign: 'right' }}>
                    <ButtonCreateRequest dataKey={data} />
                    <IconButton onClick={() => setOpenTableRequest((prev) => !prev)}>
                        <ExpandMoreRounded sx={{ rotate: openTablerequest ? '180deg' : '' }} />
                    </IconButton>
                </TableCell>
            </TableRow>
            <Box sx={{ display: 'grid', gridTemplateRows: openTablerequest ? '1fr' : '0fr', transition: 'grid-template-rows 0.3s' }}>
                <Box sx={{ overflow: 'hidden', background: '#E7EEED' }}>
                    <Grid container>
                        <Grid item xs={0.5}></Grid>
                        <Grid item xs={11}>
                            <Box sx={{ py: 2 }}>
                                <TableRequests keyData={data} />
                            </Box>
                        </Grid>
                        <Grid item xs={0.5}></Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
}
