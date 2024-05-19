import { ENCRYPTION_LIMITS, SECRET_UNIT } from '@auxo-dev/dkg/build/esm/src/constants';
import { Add, PlusOneRounded, Remove, RemoveCircleOutlineRounded, RemoveCircleRounded } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import ButtonLoading from 'src/components/ButtonLoading/ButtonLoading';
import TableCell from 'src/components/Table/TableCell';
import TableHeader from 'src/components/Table/TableHeader';
import TableRow from 'src/components/Table/TableRow';
import TableWrapper from 'src/components/Table/TableWrapper';
import { TTask } from 'src/services/services';
import { useModalFunction } from 'src/states/modal';
import { convertToScientificNotation, isNaturalNumber } from 'src/utils';
import { v4 as uuidv4 } from 'uuid';

export default function ButtonSubmission({ dataTask }: { dataTask: TTask }) {
    const { openModal } = useModalFunction();
    return (
        <Button variant="outlined" size="small" onClick={() => openModal({ title: 'Submit Encryption', content: <ModalSubitEncryption dataTask={dataTask} /> })}>
            Submit Encryption
        </Button>
    );
}

function ModalSubitEncryption({ dataTask }: { dataTask: TTask }) {
    const [listDataVector, setListDataVector] = useState<{ index: string; id: string; value: string }[]>([{ id: uuidv4(), value: '', index: '' }]);

    const updateItem = (itemIndex: number, key: 'value' | 'index', newValue: string) => {
        if (newValue == '') return setListDataVector((prevListDataVector) => prevListDataVector.map((item, index) => (index === itemIndex ? { ...item, [key]: '' } : item)));

        if (isNaturalNumber(newValue)) {
            if (key === 'index' && Number(newValue) >= ENCRYPTION_LIMITS.FULL_DIMENSION) return;
            setListDataVector((prevListDataVector) => prevListDataVector.map((item, index) => (index === itemIndex ? { ...item, [key]: newValue } : item)));
        }
    };
    const addValue = () => {
        const newItem = { id: uuidv4(), value: '', index: '' };
        setListDataVector((prevListDataVector) => [...prevListDataVector, newItem]);
    };
    const removeItem = (itemIndex: number) => {
        setListDataVector((prevListDataVector) => prevListDataVector.filter((_, index) => index !== itemIndex));
    };
    return (
        <Box>
            <Typography variant="h5" mb={2}>
                Plain Vector (input {listDataVector.length} / {ENCRYPTION_LIMITS.DIMENSION})
            </Typography>

            <Box>
                <TableWrapper>
                    <TableHeader>
                        <TableCell xs={5}>
                            <Typography textAlign={'center'}>Index (i)</Typography>
                            <Typography textAlign={'center'} variant="body2" color={'text.secondary'}>
                                i &#8712; N; i {'<'} {ENCRYPTION_LIMITS.FULL_DIMENSION}{' '}
                            </Typography>
                        </TableCell>
                        <TableCell xs={7}>
                            <Typography textAlign={'center'}>Secret Value (v)</Typography>
                            <Typography textAlign={'center'} variant="body2" color={'text.secondary'}>
                                v &#8712; N;
                            </Typography>
                        </TableCell>
                    </TableHeader>
                    {listDataVector.map((item, index) => {
                        return (
                            <TableRow key={item.id} spacing={2} wrapperSx={{ py: 1 }}>
                                <TableCell xs={5}>
                                    <TextField
                                        sx={{ textAlign: 'center' }}
                                        type="number"
                                        name="index"
                                        variant="standard"
                                        value={item.index}
                                        onChange={(e) => updateItem(index, 'index', e.target.value)}
                                        InputProps={{
                                            style: { textAlign: 'center' },
                                        }}
                                    />
                                </TableCell>
                                <TableCell xs={7}>
                                    <Box sx={{ display: 'flex', gap: 2, placeItems: 'center' }}>
                                        <TextField
                                            variant="standard"
                                            type="number"
                                            name="secret-value"
                                            value={item.value}
                                            onChange={(e) => updateItem(index, 'value', e.target.value)}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="start">({convertToScientificNotation(SECRET_UNIT)})</InputAdornment>,
                                                style: { textAlign: 'center' },
                                            }}
                                        />
                                        {listDataVector.length > 1 ? (
                                            <IconButton onClick={() => removeItem(index)} color="default" title="Remove">
                                                <RemoveCircleOutlineRounded />
                                            </IconButton>
                                        ) : (
                                            <></>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableWrapper>
            </Box>
            <Box textAlign={'center'}>
                <Button startIcon={<Add />} variant="outlined" size="small" sx={{ mt: 1 }} onClick={addValue}>
                    Add Value
                </Button>
            </Box>
            <ButtonSubmit />
        </Box>
    );
}

function ButtonSubmit() {
    async function submit() {}
    return (
        <Box textAlign={'right'}>
            <ButtonLoading isLoading={false} muiProps={{ onClick: submit, variant: 'contained', sx: { mt: 3 } }}>
                Submit Encryption
            </ButtonLoading>
        </Box>
    );
}
