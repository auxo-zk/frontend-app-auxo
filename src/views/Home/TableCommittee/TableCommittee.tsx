import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TableCell from 'src/components/Table/TableCell';
import TableHeader from 'src/components/Table/TableHeader';
import TableRow from 'src/components/Table/TableRow';
import TableWrapper from 'src/components/Table/TableWrapper';
import { TCommitteeData, getListCommittees } from 'src/services/services';
import { useModalFunction } from 'src/states/modal';
import { formatAddress } from 'src/utils/format';
import ModalViewDetailCommitee from '../ModalViewDetailCommittee/ModalViewDetailCommittee';

const tableCellRatio = [1.5, 2.5, 1.2, 1.2, 1, 1, 2, 1.6];

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
                        <Typography variant="body2" fontWeight={600}>
                            Commitee ID
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[1]}>
                        <Typography variant="body2" fontWeight={600}>
                            Name
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[2]}>
                        <Typography variant="body2" fontWeight={600}>
                            Status
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[3]}>
                        <Typography variant="body2" fontWeight={600}>
                            Threshold
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[4]}>
                        <Typography variant="body2" fontWeight={600}>
                            Keys
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[5]}>
                        <Typography variant="body2" fontWeight={600}>
                            Requests
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[6]}>
                        <Typography variant="body2" fontWeight={600}>
                            Creator
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[7]}>
                        <Typography variant="body2" fontWeight={600}>
                            #
                        </Typography>
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
                                        return (
                                            <TableRow key={'commiite' + data.id + index} activeHover>
                                                <TableCell xs={tableCellRatio[0]}>
                                                    <Typography fontWeight={600}>{data.idCommittee}</Typography>
                                                </TableCell>
                                                <TableCell xs={tableCellRatio[1]}>
                                                    <Typography>{data.name}</Typography>
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
                                                    <Typography>0</Typography>
                                                </TableCell>
                                                <TableCell xs={tableCellRatio[5]}>
                                                    <Typography>0</Typography>
                                                </TableCell>
                                                <TableCell xs={tableCellRatio[6]}>
                                                    <Typography>{formatAddress(data.creator)}</Typography>
                                                </TableCell>
                                                <TableCell xs={tableCellRatio[7]}>
                                                    <Button onClick={() => openModal({ title: 'Committee Members', content: <ModalViewDetailCommitee data={data.members} /> })}>View Members</Button>
                                                </TableCell>
                                            </TableRow>
                                        );
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
