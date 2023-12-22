import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import React from 'react';
import { useModalFunction } from 'src/states/modal';
import ModalCreateCommittee from './ModalCreateCommittee/ModalCreateCommittee';

export default function ButtonCreateCommittee() {
    const { openModal } = useModalFunction();
    return (
        <Button variant="contained" startIcon={<Add />} sx={{ ml: 'auto' }} onClick={() => openModal({ title: 'Create Committee', content: <ModalCreateCommittee /> })}>
            Committee
        </Button>
    );
}
