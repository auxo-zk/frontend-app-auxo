import { CssBaseline, Theme, ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material';
import { deepmerge } from '@mui/utils';
import React, { ReactNode, useMemo } from 'react';
import { getThemeConfig, getThemedComponent, useThemeData } from 'src/states/theme';

export default function ThemeProviderCustom({ children }: { children: ReactNode }) {
    const { mode } = useThemeData();
    const theme = useMemo<Theme>(() => {
        const _t = createTheme(getThemeConfig(mode));
        return responsiveFontSizes(deepmerge(_t, getThemedComponent(_t)));
    }, [mode]);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}
