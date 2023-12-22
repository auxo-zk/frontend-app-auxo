import { Box, Button, Container, Typography } from '@mui/material';
import React from 'react';
import CardProject from 'src/components/CardProject/CardProject';
import TableCell from 'src/components/Table/TableCell';
import TableHeader from 'src/components/Table/TableHeader';
import TableRow from 'src/components/Table/TableRow';
import TableWrapper from 'src/components/Table/TableWrapper';
import { useModalFunction } from 'src/states/modal';
import ModalCreateCommittee from 'src/views/committee/dashboard/ModalCreateCommittee';
import TableCommittee from 'src/views/committee/dashboard/TableCommittee';

export default function Dashboard() {
    const { openModal } = useModalFunction();
    return (
        <Container sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', placeItems: 'center', mb: 3 }}>
                <Typography variant="h1">Explore Committees</Typography>
                <Button variant="contained" startIcon={'+'} sx={{ ml: 'auto' }} onClick={() => openModal({ title: 'Create Committee', content: <ModalCreateCommittee /> })}>
                    Committee
                </Button>
            </Box>
            <TableCommittee />

            <TableWrapper>
                <TableHeader>
                    <TableCell xs={3}>Category</TableCell>
                    <TableCell xs={3}>Raised Amount</TableCell>
                    <TableCell xs={3}>Timestamp</TableCell>
                    <TableCell xs={3}>Transaction detail</TableCell>
                </TableHeader>
                <Box sx={{ maxHeight: '250px', overflow: 'auto' }}>
                    <TableRow activeHover>
                        <TableCell xs={3}>Category</TableCell>
                        <TableCell xs={3}>Raised Amount</TableCell>
                        <TableCell xs={3}>Timestamp</TableCell>
                        <TableCell xs={3}>Transaction detail</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell xs={3}>Category</TableCell>
                        <TableCell xs={3}>Raised Amount</TableCell>
                        <TableCell xs={3}>Timestamp</TableCell>
                        <TableCell xs={3}>Transaction detail</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell xs={3}>Category</TableCell>
                        <TableCell xs={3}>Raised Amount</TableCell>
                        <TableCell xs={3}>Timestamp</TableCell>
                        <TableCell xs={3}>Transaction detail</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell xs={3}>Category</TableCell>
                        <TableCell xs={3}>Raised Amount</TableCell>
                        <TableCell xs={3}>Timestamp</TableCell>
                        <TableCell xs={3}>Transaction detail</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell xs={3}>Category</TableCell>
                        <TableCell xs={3}>Raised Amount</TableCell>
                        <TableCell xs={3}>Timestamp</TableCell>
                        <TableCell xs={3}>Transaction detail</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell xs={3}>Category</TableCell>
                        <TableCell xs={3}>Raised Amount</TableCell>
                        <TableCell xs={3}>Timestamp</TableCell>
                        <TableCell xs={3}>Transaction detail</TableCell>
                    </TableRow>
                </Box>
            </TableWrapper>

            <br />
            <br />
            <br />
            <CardProject sx={{ width: '306px' }}>
                <Typography>Hello</Typography>
            </CardProject>
            <br />
            <br />
            <br />
            <CardProject sx={{ width: '306px' }}>
                <Typography>Hello</Typography>
            </CardProject>
            <br />
            <br />
            <br />
            <CardProject sx={{ width: '306px' }}>
                <Typography>Hello</Typography>
            </CardProject>
            <br />
            <br />
            <br />
        </Container>
    );
}
