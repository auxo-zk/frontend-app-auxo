import { Box, CssBaseline, Theme, ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material';
import Head from 'next/head';
import React, { useMemo } from 'react';
import ToastNotifier from 'src/components/ToastNotifier/ToastNotifier';
import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';
import InitStateAll from 'src/states';
import { getThemeConfig, getThemedComponent, useThemeData } from 'src/states/theme';
import { deepmerge } from '@mui/utils';
import ModalCustom from 'src/components/ModalCustom/ModalCustom';

export const sibarWidth = '260px';
export const headerHeight = '68px';

export default function Layout({ children }: { children: React.ReactNode }) {
    const { mode } = useThemeData();
    const theme = useMemo<Theme>(() => {
        const _t = createTheme(getThemeConfig(mode));
        return responsiveFontSizes(deepmerge(_t, getThemedComponent(_t)));
    }, [mode]);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <InitStateAll />

            <Head>
                <title>Auxo App</title>
                <meta name="description" content="auxo app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Box sx={{ overflow: 'hidden', position: 'relative' }}>
                <Sidebar />
                <Box sx={{ ml: sibarWidth, position: 'relative' }}>
                    <Header />
                    {children}
                </Box>
                <ToastNotifier />
                <ModalCustom />
            </Box>
        </ThemeProvider>
    );
}
