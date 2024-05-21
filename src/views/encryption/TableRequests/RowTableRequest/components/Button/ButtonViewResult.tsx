import { SECRET_UNIT } from '@auxo-dev/dkg/build/esm/src/constants';
import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { IconSpinLoading } from 'src/assets/svg/icon';
import ButtonLoading from 'src/components/ButtonLoading/ButtonLoading';
import TableCell from 'src/components/Table/TableCell';
import TableHeader from 'src/components/Table/TableHeader';
import TableRow from 'src/components/Table/TableRow';
import TableWrapper from 'src/components/Table/TableWrapper';
import { TRequest, getRequestByRequestId } from 'src/services/services';
import { useModalFunction } from 'src/states/modal';
import { convertToScientificNotation } from 'src/utils';

export default function ButtonViewResult({ dataRequest }: { dataRequest: TRequest }) {
    const { openModal } = useModalFunction();
    async function view() {
        openModal({ title: 'Decryption Result', content: <ModalViewResult dataRequest={dataRequest} /> });
    }
    return (
        <ButtonLoading isLoading={false} muiProps={{ onClick: view, variant: 'outlined', size: 'small' }}>
            View Result
        </ButtonLoading>
    );
}

function ModalViewResult({ dataRequest }: { dataRequest: TRequest }) {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<TRequest | null>(null);
    const [error, setError] = useState<Error | null>(null);

    async function getDetailRequest() {
        setLoading(true);
        setError(null);
        try {
            const request = await getRequestByRequestId(dataRequest.requestId);
            setData(request);
        } catch (error) {
            console.log(error);
            setError(error as Error);
        }
        setLoading(false);
    }

    useEffect(() => {
        getDetailRequest();
    }, []);

    if (loading) {
        return (
            <Box py={4}>
                <IconSpinLoading sx={{ fontSize: '100px' }} />
            </Box>
        );
    }
    if (error) {
        return (
            <Box textAlign={'center'} py={3}>
                <Typography color={'error'}>Fail to fetch!</Typography>
                <Button variant="contained" onClick={getDetailRequest}>
                    Refetch
                </Button>
            </Box>
        );
    }
    return (
        <Box>
            <Typography variant="h6" mb={2}>
                Total Submission: {data?.encryptions?.length}
            </Typography>
            <Typography mb={2}>Result Vector:</Typography>
            <TableWrapper>
                <TableHeader>
                    <TableCell xs={5}>
                        <Typography>Index</Typography>
                    </TableCell>
                    <TableCell xs={7}>
                        <Typography>Decrypted Value</Typography>
                    </TableCell>
                </TableHeader>
                {data?.results?.map((item, index) => {
                    return (
                        <TableRow activeHover key={item + 'decryp' + index} gridSx={{ height: '40px' }}>
                            <TableCell xs={5}>
                                <Typography>{index}</Typography>
                            </TableCell>
                            <TableCell xs={7}>
                                <Typography>
                                    {Number(item) / SECRET_UNIT} ({convertToScientificNotation(SECRET_UNIT)})
                                </Typography>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableWrapper>
        </Box>
    );
}
