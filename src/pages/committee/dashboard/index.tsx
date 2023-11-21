import { Box, Button, Container, Typography } from '@mui/material';
import React from 'react';
import { useModalFunction } from 'src/states/modal';
import ModalCreateCommittee from 'src/views/committee/dashboard/ModalCreateCommittee';
import TableCommittee from 'src/views/committee/dashboard/TableCommittee';

export default function Dashboard() {
    const { openModal } = useModalFunction();
    return (
        <Container sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', placeItems: 'center', mb: 3 }}>
                <Typography variant="h4">Explore Committees</Typography>
                <Button variant="contained" startIcon={'+'} sx={{ ml: 'auto' }} onClick={() => openModal({ title: 'Create Committee', content: <ModalCreateCommittee /> })}>
                    Committee
                </Button>
            </Box>
            <TableCommittee />
        </Container>
    );
}
