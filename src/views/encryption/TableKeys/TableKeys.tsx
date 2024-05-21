import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useWalletData } from 'src/states/wallet';
import { useEncrytionPageData } from '../state';
import { TCommitteeKey, getCommitteeKeys } from 'src/services/services';
import { Box, IconButton, Typography } from '@mui/material';
import TableWrapper from 'src/components/Table/TableWrapper';
import TableHeader from 'src/components/Table/TableHeader';
import TableCell from 'src/components/Table/TableCell';
import { FileDownload, FileUpload, RefreshRounded } from '@mui/icons-material';
import { IconSpinLoading } from 'src/assets/svg/icon';
import TableRow from 'src/components/Table/TableRow';
import KeyContributionPubkey from 'src/views/contribution/components/KeyContributionPubkey';
import KeyContributionStatus from 'src/views/contribution/components/KeyContributionStatus';
import RowTableKey from './RowTableKey/RowTableKey';

const tableCellRatio = [1, 3, 1.25, 1.25, 2.5, 3];

export default function TableKeys() {
    const { userAddress } = useWalletData();
    const { selectedCommittee } = useEncrytionPageData();
    const [data, setData] = useState<TCommitteeKey[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const refUploadFileBtn = useRef<HTMLInputElement>(null);

    const dataUserInCommittee = useMemo(() => {
        if (selectedCommittee == null) return { memberId: -1, userAddress: '' };
        if (!userAddress) return { memberId: -1, userAddress: '' };
        const memberId = selectedCommittee.publicKeys.findIndex((pubkey) => pubkey == userAddress);

        return { memberId: memberId, userAddress: userAddress };
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
    function uploadFile() {}
    function downloadAllSecret() {}
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

                {/* <ButtonGenNewKey dataUserInCommittee={dataUserInCommittee} /> */}
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
                            Fee
                        </Typography>
                    </TableCell>

                    <TableCell xs={tableCellRatio[5]}>
                        <Box sx={{ display: 'flex', placeItems: 'center', justifyContent: 'end', gap: 1 }}>
                            {/* <Box sx={{ display: 'flex', placeItems: 'center', justifyContent: 'end', cursor: 'pointer' }}>
                        <Typography variant="body3" color={'primary.main'} mr={1}>
                            Download All
                        </Typography>
                        <IconFolder fontSize="small" color={'primary'} />
                    </Box> */}
                            <input ref={refUploadFileBtn} type="file" onChange={uploadFile} style={{ display: 'none' }} />

                            <IconButton color="primary" title="Upload Secrets" onClick={() => refUploadFileBtn.current?.click()}>
                                <FileUpload />
                            </IconButton>

                            <IconButton color="primary" onClick={downloadAllSecret} title="DownLoad All Secrets">
                                <FileDownload />
                            </IconButton>
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
                            if (item.status >= 3) {
                                return <RowTableKey key={'key' + index + item.id} data={item} tableCellRatio={tableCellRatio} />;
                            }
                            return <Box key={'key' + index + item.id}></Box>;
                        })}
                    </>
                )}
            </TableWrapper>
        </Box>
    );
}
