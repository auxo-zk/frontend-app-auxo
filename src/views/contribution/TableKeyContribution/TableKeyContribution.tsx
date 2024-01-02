import { Box, Typography } from '@mui/material';
import React from 'react';
import { IconFolder } from 'src/assets/svg/icon';
import TableCell from 'src/components/Table/TableCell';
import TableHeader from 'src/components/Table/TableHeader';
import TableWrapper from 'src/components/Table/TableWrapper';

const tableCellRatio = [1.2, 2.5, 1.4, 1.3, 2, 3.6];

export default function TableKeyContribution() {
    return (
        <Box mt={3}>
            <TableWrapper>
                <TableHeader>
                    <TableCell xs={tableCellRatio[0]}>
                        <Typography variant="body2" color={'text.secondary'}>
                            Key ID
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[1]}>
                        <Typography variant="body2" color={'text.secondary'}>
                            Public Key
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[2]}>
                        <Typography variant="body2" color={'text.secondary'}>
                            Status
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[3]}>
                        <Typography variant="body2" color={'text.secondary'}>
                            Requests
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[4]}>
                        <Typography variant="body2" color={'text.secondary'}>
                            Creator
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[5]}>
                        <Box sx={{ display: 'flex', placeItems: 'center', justifyContent: 'end', cursor: 'pointer' }}>
                            <Typography variant="body3" color={'primary.main'} mr={1}>
                                Download All
                            </Typography>
                            <IconFolder fontSize="small" color={'primary'} />
                        </Box>
                    </TableCell>
                </TableHeader>
            </TableWrapper>
        </Box>
    );
}
