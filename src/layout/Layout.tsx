import React, { ReactNode } from 'react';
import { Provider as JotaiProvider } from 'jotai';
import { FontInter } from 'src/assets/fonts';
import { Box } from '@mui/material';
import Head from 'next/head';
import InitStateAll from 'src/states';
import ThemeProviderCustom from 'src/components/ThemeProviderCustom/ThemeProviderCustom';
import ToastNotifier from 'src/components/ToastNotifier/ToastNotifier';
import ModalCustom from 'src/components/ModalCustom/ModalCustom';
import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';

export default function Layout({ children }: { children: ReactNode }) {
    const sidebarWidth = '202px';
    const headerHeight = '64px';
    return (
        <>
            <Head>
                <title>Auxo App</title>
                <meta name="description" content="auxo app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <JotaiProvider>
                <style jsx global>
                    {`
                        html {
                            font-family: ${FontInter.style.fontFamily};
                        }
                    `}
                </style>
                <InitStateAll />
                <ThemeProviderCustom>
                    <Box sx={{ position: 'relative' }}>
                        <Sidebar sidebarWidth={sidebarWidth} headerHeight={headerHeight} />
                        <Box
                            sx={{
                                position: 'relative',
                                zIndex: 1,
                                ml: { xs: 0, lg: sidebarWidth },
                                backgroundImage: `url(/images/bgheader1.png)`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'top center',
                                backgroundSize: '975px auto',
                            }}
                        >
                            <Header headerHeight={headerHeight}></Header>
                            <Box
                                sx={{
                                    minHeight: `calc(100svh - ${headerHeight})`,
                                }}
                            >
                                {children}
                            </Box>
                        </Box>
                    </Box>
                    <ToastNotifier />
                    <ModalCustom />
                </ThemeProviderCustom>
            </JotaiProvider>
        </>
    );
}
