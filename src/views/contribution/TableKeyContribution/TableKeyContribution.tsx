import { Box, IconButton, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { IconDownload, IconFolder, IconSpinLoading } from 'src/assets/svg/icon';

import TableCell from 'src/components/Table/TableCell';
import TableHeader from 'src/components/Table/TableHeader';
import TableWrapper from 'src/components/Table/TableWrapper';
import { useContributionPageData } from '../state';
import { TCommitteeKey, TRound1Data, getCommitteeKeys } from 'src/services/services';
import TableRow from 'src/components/Table/TableRow';
import KeyContributionPubkey from '../components/KeyContributionPubkey';
import KeyContributionStatus from '../components/KeyContributionStatus';
import KeysContributionAction from '../components/KeysContributionAction';
import { useWalletData } from 'src/states/wallet';
import Test from './Test';
import ButtonGenNewKey from '../GenerateNewKey/ButtonGenNewKey';
import { RefreshRounded } from '@mui/icons-material';

const tableCellRatio = [1, 3, 1.25, 1.25, 2.5, 3];

export default function TableKeyContribution() {
    const { userAddress } = useWalletData();
    const { selectedCommittee } = useContributionPageData();
    const [data, setData] = useState<TCommitteeKey[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const dataUserInCommittee = useMemo(() => {
        if (selectedCommittee == null) return null;
        if (!userAddress) return null;
        return selectedCommittee.members.find((member) => member.publicKey == userAddress);
    }, [selectedCommittee?.id, userAddress]);

    async function getCommitteeKeysData() {
        if (selectedCommittee?.idCommittee) {
            setLoading(true);
            try {
                const response = await getCommitteeKeys(selectedCommittee.idCommittee);
                console.log(response);
                setData(response);
            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        }
    }
    useEffect(() => {
        getCommitteeKeysData();
    }, [selectedCommittee?.id]);
    return (
        <Box mt={3}>
            <Typography variant="h6" mb={1}>
                Keys Contribution
            </Typography>
            <Box mb={2} sx={{ display: 'flex', placeItems: 'center' }}>
                <Typography color={'text.secondary'}>
                    Threshold:{' '}
                    <Typography component={'span'} fontWeight={700}>
                        {selectedCommittee?.threshold}
                    </Typography>{' '}
                    out of{' '}
                    <Typography component={'span'} fontWeight={700}>
                        {selectedCommittee?.members?.length}
                    </Typography>
                </Typography>

                <ButtonGenNewKey dataUserInCommittee={dataUserInCommittee} />
            </Box>
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
                            {/* Creator */}
                        </Typography>
                    </TableCell>

                    <TableCell xs={tableCellRatio[5]}>
                        <Box sx={{ display: 'flex', placeItems: 'center', justifyContent: 'end', gap: 1 }}>
                            <Box sx={{ display: 'flex', placeItems: 'center', justifyContent: 'end', cursor: 'pointer' }}>
                                <Typography variant="body3" color={'primary.main'} mr={1}>
                                    Download All
                                </Typography>
                                <IconFolder fontSize="small" color={'primary'} />
                            </Box>
                            <IconButton color="primary" onClick={getCommitteeKeysData} title="Refresh Data">
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
                                <TableRow key={'keycontribution' + index + item.id}>
                                    <TableCell xs={tableCellRatio[0]}>
                                        <Typography color={'text.secondary'}>{item.keyId}</Typography>
                                    </TableCell>
                                    <TableCell xs={tableCellRatio[1]}>
                                        <KeyContributionPubkey status={item.status} publicKey={item.publicKey} />
                                    </TableCell>
                                    <TableCell xs={tableCellRatio[2]}>
                                        <KeyContributionStatus status={item.status} />
                                    </TableCell>
                                    <TableCell xs={tableCellRatio[3]}>
                                        <Typography color={'text.secondary'}>{item.requests.length}</Typography>
                                    </TableCell>
                                    <TableCell xs={tableCellRatio[4]}>{/* <Typography color={'text.secondary'}>{item.}</Typography> */}</TableCell>
                                    <TableCell xs={tableCellRatio[5]}>
                                        <KeysContributionAction
                                            dataKey={item}
                                            dataUserInCommittee={dataUserInCommittee}
                                            T={selectedCommittee?.threshold || 0}
                                            N={selectedCommittee?.members?.length || 0}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </>
                )}
            </TableWrapper>

            {/* <Test /> */}
        </Box>
    );
}
