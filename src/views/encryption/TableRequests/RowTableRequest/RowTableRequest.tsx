import { Button, Typography } from '@mui/material';
import React from 'react';
import TableCell from 'src/components/Table/TableCell';
import TableRow from 'src/components/Table/TableRow';
import { TRequest } from 'src/services/services';
import { formatAddress, formatDate } from 'src/utils/format';
import { RequestStatus as EnumRequestStatus } from 'src/services/const';
import RequestStatus from 'src/views/contribution/TableKeysUsage/components/RequestStatus';
import ButtonViewResult from './components/Button/ButtonViewResult';

export default function RowTableRequest({ data, tableCellRatio }: { data: TRequest; tableCellRatio: number[] }) {
    return (
        <TableRow>
            <TableCell xs={tableCellRatio[0]}>
                <Typography color={'text.secondary'}>{data.requestId}</Typography>
            </TableCell>
            <TableCell xs={tableCellRatio[1]}>
                <Typography color={'text.secondary'}>{formatAddress(data.requester, 6, 6)}</Typography>
            </TableCell>
            <TableCell xs={tableCellRatio[2]}>
                <RequestStatus status={data.status} />
            </TableCell>
            <TableCell xs={tableCellRatio[3]}>
                <Typography color={'text.secondary'}>{formatDate(data.expirationTimestamp, 'MMM dd yyyy, h:mm a')}</Typography>
            </TableCell>
            <TableCell xs={tableCellRatio[4]} sx={{ textAlign: 'right' }}>
                {data.status === EnumRequestStatus.RESOLVED ? <ButtonViewResult dataRequest={data} /> : <></>}
            </TableCell>
        </TableRow>
    );
}
