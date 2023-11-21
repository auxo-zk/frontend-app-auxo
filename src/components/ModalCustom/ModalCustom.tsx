import { ClearRounded } from '@mui/icons-material';
import { Box, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import React from 'react';
import { useModalData, useModalFunction } from 'src/states/modal';

export default function ModalCustom() {
    const modal = useModalData();
    const { closeModal } = useModalFunction();
    return (
        <Dialog fullWidth maxWidth={modal.modalProps?.maxWidth || 'xsm'} open={modal.open} {...modal.modalProps}>
            <DialogTitle>
                <Box sx={{ display: 'flex' }}>
                    {typeof modal.title == 'string' ? <Typography variant="h5">{modal.title}</Typography> : modal.title}
                    <ClearRounded sx={{ ml: 'auto', cursor: 'pointer', fontSize: '25px' }} onClick={closeModal} />
                </Box>
            </DialogTitle>
            <DialogContent>{modal.content}</DialogContent>
        </Dialog>
    );
}
