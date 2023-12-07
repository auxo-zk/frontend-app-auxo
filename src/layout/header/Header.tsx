import { Box, Button, Container, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { headerHeight } from '../Layout';
import ButtonConnectWallet from 'src/components/ButtonConnectWallet/ButtonConnectWallet';
import { IconSpinLoading } from 'src/assets/svg/icon';
import { useCommitteeContract } from 'src/states/contracts/committee';

export default function Header() {
    const { isLoading } = useCommitteeContract();
    return (
        <Box sx={{ position: 'sticky', top: 0, left: 0 }}>
            <Container sx={{ borderBottom: '1px solid #37A9A2', height: headerHeight, display: 'flex', placeItems: 'center', gap: 1 }}>
                {isLoading ? (
                    <Box mr={'auto'} display={'flex'} gap={1}>
                        <IconSpinLoading sx={{ fontSize: '24px' }} />
                        <Typography>Compiling contract...</Typography>
                    </Box>
                ) : (
                    <></>
                )}
                <ButtonConnectWallet />
            </Container>
        </Box>
    );
}
