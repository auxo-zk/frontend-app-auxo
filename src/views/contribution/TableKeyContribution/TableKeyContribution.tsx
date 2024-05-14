import { Box, IconButton, Typography } from '@mui/material';
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
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
import { Download, FileDownload, FileUpload, RefreshRounded, UploadFile } from '@mui/icons-material';
import { downloadTextFile, getLocalStorageKeySecret, getLocalStorageKeySecretValue } from 'src/utils';
import { toast } from 'react-toastify';

const tableCellRatio = [1, 3, 1.25, 1.25, 2.5, 3];

export default function TableKeyContribution() {
    const { userAddress } = useWalletData();
    const { selectedCommittee } = useContributionPageData();
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

    async function uploadFileSecrets(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target) {
                    const result = e.target.result;
                    console.log(result);
                    try {
                        const listSecrets: { key: string; value: string }[] = JSON.parse(result as string) as { key: string; value: string }[];
                        for (let item of listSecrets) {
                            if (item.key === undefined || item.value === undefined) {
                                console.log(item.key, item.value);
                                throw Error('Invalid File!');
                            }
                            localStorage.setItem(item.key, item.value);
                        }
                        toast.success('Upload and Save data done!');
                    } catch (e) {
                        toast.error('Data file is invalid!', { autoClose: 4000 });
                    }
                }
            };
            reader.readAsText(file);
        }
    }

    async function downloadAllSecret() {
        const listData = data.map((committee) => {
            const k = getLocalStorageKeySecret(committee.committeeId, dataUserInCommittee.memberId + '', committee.keyId, 'Berkeley');
            return {
                key: k,
                value: getLocalStorageKeySecretValue(committee.committeeId, dataUserInCommittee.memberId + '', committee.keyId, 'Berkeley'),
            };
        });

        downloadTextFile(JSON.stringify(listData) || '', `all-key-contribution-secret-memberid${dataUserInCommittee.memberId}-Berkeley.txt`);
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
                            {/* <Box sx={{ display: 'flex', placeItems: 'center', justifyContent: 'end', cursor: 'pointer' }}>
                                <Typography variant="body3" color={'primary.main'} mr={1}>
                                    Download All
                                </Typography>
                                <IconFolder fontSize="small" color={'primary'} />
                            </Box> */}
                            <input ref={refUploadFileBtn} type="file" onChange={uploadFileSecrets} style={{ display: 'none' }} />

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
                                        <Typography color={'text.secondary'}>{item?.numRequest || 0}</Typography>
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
