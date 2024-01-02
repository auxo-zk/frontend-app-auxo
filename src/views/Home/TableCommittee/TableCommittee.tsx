import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TableCell from 'src/components/Table/TableCell';
import TableHeader from 'src/components/Table/TableHeader';
import TableWrapper from 'src/components/Table/TableWrapper';
import { TCommitteeData, getListCommittees } from 'src/services/services';
import { useModalFunction } from 'src/states/modal';
import RowTableView from './RowTableView';

const tableCellRatio = [1.2, 2.5, 1.35, 1.65, 1.35, 1.35, 2.1, 0.5];

export default function TableCommittee() {
    const { openModal } = useModalFunction();
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
        <Box mt={3}>
            <TableWrapper>
                <TableHeader>
                    <TableCell xs={tableCellRatio[0]}>
                        <Typography variant="body2" color={'text.secondary'}>
                            ID
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[1]}>
                        <Typography variant="body2" color={'text.secondary'}>
                            Name
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[2]}>
                        <Typography variant="body2" color={'text.secondary'}>
                            Status
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[3]}>
                        <Typography variant="body2" color={'text.secondary'}>
                            Threshold
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[4]}>
                        <Typography variant="body2" color={'text.secondary'}>
                            Keys
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[5]}>
                        <Typography variant="body2" color={'text.secondary'}>
                            Requests
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[6]}>
                        <Typography variant="body2" color={'text.secondary'}>
                            Creator
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[7]}>
                        <Typography variant="body2" color={'text.secondary'}></Typography>
                    </TableCell>
                </TableHeader>
                <Box sx={{}}>
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
                                    {dataList.map((data, index) => {
                                        return <RowTableView key={'commiite' + data.id + index} data={data} tableCellRatio={tableCellRatio} />;
                                    })}
                                </>
                            )}
                        </>
                    )}
                </Box>
            </TableWrapper>
        </Box>
    );
}
