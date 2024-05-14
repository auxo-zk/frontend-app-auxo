import { Box, IconButton, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useWalletData } from 'src/states/wallet';
import { useContributionPageData } from '../state';
import { TRequest, getCommitteeRequests } from 'src/services/services';
import TableWrapper from 'src/components/Table/TableWrapper';
import TableHeader from 'src/components/Table/TableHeader';
import TableCell from 'src/components/Table/TableCell';
import { IconFolder, IconSpinLoading } from 'src/assets/svg/icon';
import { RefreshRounded } from '@mui/icons-material';
import TableRow from 'src/components/Table/TableRow';
import { formatAddress } from 'src/utils/format';
import RequestStatus from './components/RequestStatus';
import RequestAction from './components/RequestAction';

const tableCellRatio = [2, 1, 3, 2, 4];
export default function TableKeysUsage() {
    const { userAddress } = useWalletData();
    const { selectedCommittee } = useContributionPageData();
    const [data, setData] = useState<TRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const dataUserInCommittee = useMemo(() => {
        if (selectedCommittee == null) return { memberId: -1, userAddress: '' };
        if (!userAddress) return { memberId: -1, userAddress: '' };
        const memberId = selectedCommittee.publicKeys.findIndex((pubkey) => pubkey == userAddress);

        return { memberId: memberId, userAddress: userAddress };
    }, [selectedCommittee?.id, userAddress]);

    async function getCommitteeRequestsData() {
        if (selectedCommittee?.idCommittee) {
            setLoading(true);
            try {
                const response = await getCommitteeRequests(selectedCommittee.idCommittee);
                console.log(response);
                setData(response);
            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        }
    }
    useEffect(() => {
        getCommitteeRequestsData();
    }, [selectedCommittee?.id]);
    return (
        <Box mt={3}>
            <Typography variant="h6" mb={1}>
                Keys Usage
            </Typography>

            <TableWrapper>
                <TableHeader>
                    <TableCell xs={tableCellRatio[0]}>
                        <Typography variant="body2" color={'text.secondary'}>
                            Request ID
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[1]}>
                        <Typography variant="body2" color={'text.secondary'}>
                            Key ID
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[2]}>
                        <Typography variant="body2" color={'text.secondary'}>
                            Requestor
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[3]}>
                        <Typography variant="body2" color={'text.secondary'}>
                            Status
                        </Typography>
                    </TableCell>
                    <TableCell xs={tableCellRatio[4]}>
                        <Box sx={{ display: 'flex', placeItems: 'center', justifyContent: 'end', gap: 1 }}>
                            {/* <Box sx={{ display: 'flex', placeItems: 'center', justifyContent: 'end', cursor: 'pointer' }}>
                                <Typography variant="body3" color={'primary.main'} mr={1}>
                                    Download All
                                </Typography>
                                <IconFolder fontSize="small" color={'primary'} />
                            </Box> */}
                            <IconButton color="primary" onClick={getCommitteeRequestsData} title="Refresh Data">
                                <RefreshRounded />
                            </IconButton>
                        </Box>
                    </TableCell>
                </TableHeader>
                {loading ? (
                    <Box py={4}>
                        <IconSpinLoading sx={{ fontSize: '60px' }} />
                    </Box>
                ) : (
                    <>
                        {data.map((item, index) => {
                            return (
                                <TableRow key={'requestkey' + index + item.requestId}>
                                    <TableCell xs={tableCellRatio[0]}>
                                        <Typography color={'text.secondary'}>{item.requestId}</Typography>
                                    </TableCell>
                                    <TableCell xs={tableCellRatio[1]}>
                                        <Typography color={'text.secondary'}>{item.keyId}</Typography>
                                    </TableCell>
                                    <TableCell xs={tableCellRatio[2]}>{formatAddress(item.requester)}</TableCell>
                                    <TableCell xs={tableCellRatio[3]}>
                                        <RequestStatus status={item.status} />
                                    </TableCell>

                                    <TableCell xs={tableCellRatio[4]}>
                                        {/* <KeysContributionAction
                                            dataKey={item}
                                            dataUserInCommittee={dataUserInCommittee}
                                            T={selectedCommittee?.threshold || 0}
                                            N={selectedCommittee?.members?.length || 0}
                                        /> */}
                                        <RequestAction status={item.status} dataUserInCommittee={dataUserInCommittee} resquestData={item} />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </>
                )}
            </TableWrapper>
        </Box>
    );
}
