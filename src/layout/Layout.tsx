import { Box } from '@mui/material';
import Head from 'next/head';
import React from 'react';
import ToastNotifier from 'src/components/ToastNotifier/ToastNotifier';
import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';
import InitStateAll from 'src/states';
import ModalCustom from 'src/components/ModalCustom/ModalCustom';
import ThemeProviderCustom from 'src/components/ThemeProviderCustom/ThemeProviderCustom';

export const sibarWidth = '202px';
export const headerHeight = '65px';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Head>
                <title>Auxo App</title>
                <meta name="description" content="auxo app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <InitStateAll />
            <ThemeProviderCustom>
                <Box sx={{ overflow: 'hidden', position: 'relative' }}>
                    <Sidebar />
                    <Box
                        sx={{
                            ml: { xs: 0, lg: sibarWidth },
                            position: 'relative',
                            zIndex: 1,
                            height: '100svh',
                            overflow: 'auto',
                            backgroundImage: `url(/images/bgheader1.png)`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'top center',
                            backgroundSize: '975px auto',
                        }}
                    >
                        <Header />
                        {children}
                    </Box>
                    <ToastNotifier />
                    <ModalCustom />
                </Box>
            </ThemeProviderCustom>
        </>
    );
}
