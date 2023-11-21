import { Box, Button, Container } from '@mui/material';
import React from 'react';
import { headerHeight } from '../Layout';
import ButtonConnectWallet from 'src/components/ButtonConnectWallet/ButtonConnectWallet';

export default function Header() {
    return (
        <Box sx={{ position: 'sticky', top: 0, left: 0 }}>
            <Container sx={{ borderBottom: '1px solid #37A9A2', height: headerHeight, display: 'flex', placeItems: 'center' }}>
                <ButtonConnectWallet />
            </Container>
        </Box>
    );
}
