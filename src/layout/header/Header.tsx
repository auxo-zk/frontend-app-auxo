import { Box, Button, Container, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { headerHeight } from '../Layout';
import ButtonConnectWallet from 'src/components/ButtonConnectWallet/ButtonConnectWallet';
import { IconSpinLoading } from 'src/assets/svg/icon';
import { useCommitteeContract } from 'src/states/contracts/committee';
import { Menu } from '@mui/icons-material';

export default function Header() {
    const { isLoading } = useCommitteeContract();
    return (
        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', width: '100%', height: headerHeight, position: 'sticky', top: '0', left: '0', zIndex: '900' }}>
            <Container sx={{ height: headerHeight, display: 'flex', placeItems: 'center', gap: 1 }}>
                {isLoading ? (
                    <Box mr={'auto'} display={'flex'} gap={1}>
                        <IconSpinLoading sx={{ fontSize: '24px' }} />
                        <Typography>Compiling contract...</Typography>
                    </Box>
                ) : (
                    <></>
                )}
                <Box component={'label'} htmlFor="control-sidebar" sx={{ display: { xs: 'flex', lg: 'none' }, cursor: 'pointer', ml: 1 }}>
                    <Menu sx={{ fontSize: '28px' }} />
                </Box>
                <ButtonConnectWallet />
            </Container>
        </Box>
    );
}
