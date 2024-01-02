import { Box, Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import TableCell from 'src/components/Table/TableCell';
import TableRow from 'src/components/Table/TableRow';
import { TCommitteeData } from 'src/services/services';
import { formatAddress } from 'src/utils/format';

const tableCellRatio = [2, 4, 3, 3];

export default function TableMember({ data }: { data: TCommitteeData['members'] }) {
    useEffect(() => {
        console.log(data);
    }, []);
    return (
        <Box>
            <TableRow>
                <TableCell item xs={tableCellRatio[0]}>
                    <Typography variant="body2" color={'text.secondary'}>
                        Member ID
                    </Typography>
                </TableCell>
                <TableCell item xs={tableCellRatio[1]}>
                    <Typography variant="body2" color={'text.secondary'}>
                        Alias
                    </Typography>
                </TableCell>
                <TableCell item xs={tableCellRatio[2]}>
                    <Typography variant="body2" color={'text.secondary'}>
                        Last Active
                    </Typography>
                </TableCell>
                <TableCell item xs={tableCellRatio[3]}>
                    <Typography variant="body2" color={'text.secondary'}>
                        Public Key
                    </Typography>
                </TableCell>
            </TableRow>
            {data.length == 0 ? (
                <TableRow>
                    <Typography py={3} fontWeight={600} textAlign={'center'}>
                        No member
                    </Typography>
                </TableRow>
            ) : (
                <>
                    {data.map((mem, i) => {
                        return (
                            <TableRow key={mem.publicKey + i}>
                                <TableCell xs={tableCellRatio[0]}>
                                    <Typography>{i + 1}</Typography>
                                </TableCell>
                                <TableCell xs={tableCellRatio[1]}>
                                    <Typography color={'primary.main'} fontWeight={500} sx={{ textTransform: 'capitalize' }}>
                                        {mem.alias}
                                    </Typography>
                                </TableCell>
                                <TableCell xs={tableCellRatio[2]}>
                                    <Typography>{new Date(mem.lastActive).toLocaleDateString()}</Typography>
                                </TableCell>
                                <TableCell xs={tableCellRatio[3]}>
                                    <Typography>{formatAddress(mem.publicKey)}</Typography>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </>
            )}
        </Box>
    );
}
