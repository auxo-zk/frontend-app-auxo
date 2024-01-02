import { Menu } from '@mui/icons-material';
import { Box, Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ButtonConnectWallet from 'src/components/ButtonConnectWallet/ButtonConnectWallet';

export default function Header({ headerHeight }: { headerHeight: string }) {
    const [isScrollDown, setIsScrollDown] = useState<boolean>(false);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScroll = () => {
        if (window.scrollY > 10) {
            setIsScrollDown(true);
        } else {
            setIsScrollDown(false);
        }
    };

    return (
        <Box
            sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                background: isScrollDown ? '#fff' : '',
                transition: 'background-color 0.1s',
                height: headerHeight,
                position: 'sticky',
                top: '0',
                left: 0,
                width: '100%',
                zIndex: '900',
            }}
        >
            <Container sx={{ height: headerHeight, display: 'flex', placeItems: 'center' }}>
                <Box component={'label'} htmlFor="control-sidebar" sx={{ display: { xs: 'flex', md: 'none' }, cursor: 'pointer', ml: 1 }}>
                    <Menu sx={{ fontSize: '28px' }} />
                </Box>
                <ButtonConnectWallet />
            </Container>
        </Box>
    );
}
