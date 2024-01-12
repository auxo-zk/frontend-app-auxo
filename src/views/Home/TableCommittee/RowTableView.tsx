import { ExpandMoreRounded } from '@mui/icons-material';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';
import TableCell from 'src/components/Table/TableCell';
import TableRow from 'src/components/Table/TableRow';
import { TCommitteeData } from 'src/services/services';
import { formatAddress } from 'src/utils/format';
import TableMember from './TableMember';

export default function RowTableView({ data, tableCellRatio }: { data: TCommitteeData; tableCellRatio: number[] }) {
    const [openTableMember, setOpenTableMember] = useState<boolean>(false);
    return (
        <Box>
            <TableRow wrapperSx={{ background: openTableMember ? '#F1F6F5' : '' }}>
                <TableCell xs={tableCellRatio[0]}>
                    <Typography fontWeight={600} color={'primary.main'}>
                        {data.idCommittee}
                    </Typography>
                </TableCell>
                <TableCell xs={tableCellRatio[1]}>
                    <Typography color={'primary.main'} fontWeight={500}>
                        {data.name}
                    </Typography>
                </TableCell>
                <TableCell xs={tableCellRatio[2]}>
                    <Typography>{data.status}</Typography>
                </TableCell>
                <TableCell xs={tableCellRatio[3]}>
                    <Typography>
                        {data.threshold} out of {data.numberOfMembers}
                    </Typography>
                </TableCell>
                <TableCell xs={tableCellRatio[4]}>
                    <Typography>{data.numOfkeys}</Typography>
                </TableCell>
                <TableCell xs={tableCellRatio[5]}>
                    <Typography>0</Typography>
                </TableCell>
                <TableCell xs={tableCellRatio[6]}>
                    <Typography>{formatAddress(data.creator)}</Typography>
                </TableCell>
                <TableCell xs={tableCellRatio[7]}>
                    <IconButton onClick={() => setOpenTableMember((prev) => !prev)}>
                        <ExpandMoreRounded sx={{ rotate: openTableMember ? '180deg' : '' }} />
                    </IconButton>
                </TableCell>
            </TableRow>
            <Box sx={{ display: 'grid', gridTemplateRows: openTableMember ? '1fr' : '0fr', transition: 'grid-template-rows 0.3s' }}>
                <Box sx={{ overflow: 'hidden', background: '#E7EEED' }}>
                    <Grid container>
                        <Grid item xs={tableCellRatio[0]}></Grid>
                        <Grid item xs={12 - tableCellRatio[0] - tableCellRatio[7]}>
                            <TableMember data={data.members} />
                        </Grid>
                        <Grid item xs={tableCellRatio[7]}></Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
}
