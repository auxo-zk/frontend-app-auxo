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
                <meta name="description" content="Auxo app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="language" content="English" />
                <meta property="og:site_name" content="Auxo App" />
                <meta property="og:image" content="/thumbnail.png" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta name="twitter:image" content="/thumbnail.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
                <meta name="revisit-after" content="0 days" />
                <meta name="ROBOTS" content="index, follow, max-snippet:-1, max-image-preview:large" />
                <meta name="googlebot" content="index,follow" />
                <meta name="BingBOT" content="index,follow" />
                <meta name="yahooBOT" content="index,follow" />
                <meta name="slurp" content="index,follow" />
                <meta name="msnbot" content="index,follow" />
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
                                ml: { xs: 0, md: sidebarWidth },
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
