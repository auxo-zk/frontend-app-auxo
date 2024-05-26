import { Box, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TableCell from 'src/components/Table/TableCell';
import TableHeader from 'src/components/Table/TableHeader';
import TableWrapper from 'src/components/Table/TableWrapper';
import { useWalletData } from 'src/states/wallet';
import { useEncrytionPageData } from '../state';
import { IconSpinLoading } from 'src/assets/svg/icon';
import { TCommitteeKey, TRequest, TTask, getRequestByKeyIndex, getTasksByKeyIndex } from 'src/services/services';
import RowTableRequest from './RowTableRequest/RowTableRequest';
import TableRow from 'src/components/Table/TableRow';
import RowTableTask from './RowTableTask/RowTableTask';
import { RefreshRounded } from '@mui/icons-material';
import { Field } from 'o1js';

const tableCellRatio = [1.5, 3, 2, 3.5, 2];

export default function TableRequests({ keyData }: { keyData: TCommitteeKey }) {
    const { userAddress } = useWalletData();
    const { selectedCommittee } = useEncrytionPageData();
    const [dataRequests, setDataRequests] = useState<TRequest[]>([]);
    const [dataTasks, setDataTasks] = useState<TTask[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    async function getListRequestByKeyIndex() {
        setLoading(true);
        try {
            const response = await getRequestByKeyIndex(keyData.keyIndex);
            setDataRequests(response);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }
    async function getListTasksByKeyIndex() {
        try {
            const response = await getTasksByKeyIndex(keyData.keyIndex);
            setDataTasks(response);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getListRequestByKeyIndex();
        getListTasksByKeyIndex();
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <TableRow>
                <TableCell xs={tableCellRatio[0]}>
                    <Typography variant="body2" color={'text.secondary'}>
                        Request ID
                    </Typography>
                </TableCell>
                <TableCell xs={tableCellRatio[1]}>
                    <Typography variant="body2" color={'text.secondary'}>
                        Requester
                    </Typography>
                </TableCell>
                <TableCell xs={tableCellRatio[2]}>
                    <Typography variant="body2" color={'text.secondary'}>
                        Status
                    </Typography>
                </TableCell>
                <TableCell xs={tableCellRatio[3]}>
                    <Typography variant="body2" color={'text.secondary'}>
                        Deadline
                    </Typography>
                </TableCell>
                <TableCell xs={tableCellRatio[4]} sx={{ textAlign: 'right' }}>
                    <IconButton
                        onClick={() => {
                            getListRequestByKeyIndex();
                            getListTasksByKeyIndex();
                        }}
                    >
                        <RefreshRounded />
                    </IconButton>
                </TableCell>
            </TableRow>
            {loading ? (
                <Box py={4}>
                    <IconSpinLoading sx={{ fontSize: '60px' }} />
                </Box>
            ) : (
                <>
                    {dataRequests.length == 0 && dataTasks.length == 0 ? (
                        <Typography textAlign={'center'} py={2}>
                            No requests!
                        </Typography>
                    ) : (
                        <></>
                    )}

                    {dataRequests.map((item, index) => {
                        return <RowTableRequest key={'keyrequest' + index + item.requestId} data={item} tableCellRatio={tableCellRatio} />;
                    })}

                    {dataTasks.map((item, index) => {
                        return <RowTableTask key={'keyTask' + index + item.taskId} data={item} tableCellRatio={tableCellRatio} keyPub={keyData.publicKey || ''} />;
                    })}
                </>
            )}
        </Box>
    );
}
