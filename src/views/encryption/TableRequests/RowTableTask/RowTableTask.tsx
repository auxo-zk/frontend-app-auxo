import { Button, Typography } from '@mui/material';
import React from 'react';
import TableCell from 'src/components/Table/TableCell';
import TableRow from 'src/components/Table/TableRow';
import { TTask } from 'src/services/services';
import { formatAddress, formatDate } from 'src/utils/format';
import TaskStatus from './components/TaskStatus/TaskStatus';
import ButtonSubmission from './components/Button/ButtonSubmission';
import ButtonFinalization from './components/Button/ButtonFinalization';

export default function RowTableTask({ data, tableCellRatio, keyPub }: { data: TTask; tableCellRatio: number[]; keyPub: string }) {
    return (
        <TableRow>
            <TableCell xs={tableCellRatio[0]}>
                <Typography color={'text.secondary'}>{data.requestId}</Typography>
            </TableCell>
            <TableCell xs={tableCellRatio[1]}>
                <Typography color={'text.secondary'}>{formatAddress(data.requester, 6, 6)}</Typography>
            </TableCell>
            <TableCell xs={tableCellRatio[2]}>
                <TaskStatus timestamp={data.submissionTimestamp} />
            </TableCell>
            <TableCell xs={tableCellRatio[3]}>
                <Typography color={'text.secondary'}>{formatDate(data.submissionTimestamp, 'MMM dd yyyy, h:mm a')}</Typography>
            </TableCell>
            <TableCell xs={tableCellRatio[4]} sx={{ textAlign: 'right' }}>
                {data.submissionTimestamp > Date.now() ? <ButtonSubmission dataTask={data} keyPub={keyPub} /> : <ButtonFinalization dataTask={data} />}
                {/* <ButtonSubmission dataTask={data} /> */}
            </TableCell>
        </TableRow>
    );
}
