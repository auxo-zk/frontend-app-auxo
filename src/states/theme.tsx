import { Theme, ThemeOptions, darken } from '@mui/material';
import { atom, useAtom, useAtomValue } from 'jotai';

export type THEME_MODE = 'dark' | 'light';

const round = (value: number): number => Math.round(value * 1e5) / 1e5;
const pxToRem = (size: number): string => `${size / 16}rem`;
const buildVariant = (fontWeight: number, size: number, lineHeight: number, letterSpacing?: number) => ({
    fontWeight,
    fontSize: pxToRem(size),
    lineHeight: `${round(lineHeight / size)}`,
    ...(letterSpacing !== undefined ? { letterSpacing: `${round(letterSpacing / size)}em` } : {}),
});

declare module '@mui/material/styles/createPalette' {
    interface TypeBackground {
        default: string;
        paper: string;
        primary: string;
        secondary: string;
        table: string;
    }

    interface Palette {}

    interface PaletteOptions {}
}

declare module '@mui/material/styles' {
    interface BreakpointOverrides {
        xsm: true;
        xxl: true;
    }

    interface TypographyVariants {
        body3: React.CSSProperties;
        caption2: React.CSSProperties;
    }

    // allow configuration using `createTheme`
    interface TypographyVariantsOptions {
        body3?: React.CSSProperties;
        caption2: React.CSSProperties;
    }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        body3: true;
        caption2: true;
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsVariantOverrides {
        gradient: true;
    }
}

declare module '@mui/material/Hidden' {
    interface HiddenProps {
        xsmDown?: boolean;
        xsmUp?: boolean;
    }
}

export type TThemeData = {
    mode: THEME_MODE;
};
// ***********************************************************************************************************************************************

const initData: TThemeData = {
    mode: 'light',
};

const theme = atom<TThemeData>(initData);
export const useThemeData = () => useAtomValue(theme);

// ***********************************************************************************************************************************************

export function getThemeConfig(mode: THEME_MODE): ThemeOptions {
    const getColor = (darkColor: string, lightColor: string) => {
        return mode === 'dark' ? darkColor : lightColor;
    };

    return {
        breakpoints: {
            keys: ['xs', 'xsm', 'sm', 'md', 'lg', 'xl', 'xxl'],
            values: { xs: 0, xsm: 600, sm: 760, md: 960, lg: 1280, xl: 1440, xxl: 1800 },
        },
        palette: {
            mode,
            divider: '#131c183b',
            background: {
                paper: '#FFFFFD',
                default: '#FFFFFF', // ? body background
                primary: '#111C18',
                secondary: '#F1F6F5',
                table: '#F1F6F5',
            },

            primary: {
                main: '#106B60', // mau xanh button theme light
                light: '#106B6026',
            },

            text: {
                primary: '#043E35',
                secondary: '#666D6C',
            },
            action: {
                selected: getColor('#021C39', '#6cb7d42b'),
                hover: getColor('#FFFFFF0F', '#0000000F'),
                hoverOpacity: 0.06,
            },
        },
        typography: {
            // fontFamily: "'Open Sans', sans-serif",
            h1: buildVariant(700, 40, 54),
            h2: buildVariant(400, 30, 40),
            h3: buildVariant(600, 26, 36),
            h4: buildVariant(600, 24, 33),
            h5: buildVariant(600, 20, 27),
            h6: buildVariant(600, 18, 24),
            body1: buildVariant(400, 16, 22),
            body2: buildVariant(400, 14, 19),
            body3: buildVariant(400, 12, 14),
            subtitle1: buildVariant(600, 20, 27, 0),
            subtitle2: buildVariant(400, 16, 22, 0),
            caption: buildVariant(400, 14, 19, 0.15),
            caption2: buildVariant(500, 12, 17),
            button: {
                ...buildVariant(600, 14, 19),
                textTransform: 'none',
            },
        },
    };
}
// ***********************************************************************************************************************************************
export function getThemedComponent(theme: Theme): ThemeOptions {
    return {
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    '.SnackbarItem-wrappedRoot .SnackbarItem-contentRoot .SnackbarItem-message': {
                        ...theme.typography.body3,
                    },
                    // disable arrow from input number
                    // Chrome, Safari, Edge, Opera
                    'input::-webkit-outer-spin-button,input::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0,
                    },
                    // Firefox
                    'input[type=number]': {
                        MozAppearance: 'textfield',
                    },
                    'div.MuiBox-root': {
                        '::-webkit-scrollbar': {
                            height: '4px' /* height of horizontal scrollbar ← You're missing this */,
                            width: '4px' /* width of vertical scrollbar */,
                        },
                        '::-webkit-scrollbar-track': {
                            borderRadius: 0,
                            background: '#f7f7f7',
                        },

                        '::-webkit-scrollbar-thumb': {
                            borderRadius: 10,
                            background: '#D5D5D5',
                            cursor: 'pointer',
                            '&:hover': {
                                background: '#d3d3d3',
                            },
                        },
                    },
                },
            },
            MuiBackdrop: {
                styleOverrides: {
                    root: {
                        backdropFilter: 'blur(3px)',
                    },
                },
            },
            MuiInputAdornment: {
                styleOverrides: {
                    root: {
                        '& .MuiTypography-root': {
                            color: 'white',
                            fontWeight: 600,
                        },
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        borderRadius: '16px 3px 16px 3px',
                        height: '46px',
                        '.MuiInputBase-root.MuiOutlinedInput-root': {
                            borderRadius: '16px 3px 16px 3px!important',
                            height: '46px',
                            paddingRight: '12px',
                            '.MuiInputBase-input': {
                                padding: '13px 12px',
                                '&.Mui-disabled': {
                                    WebkitTextFillColor: '#7B7B7B',
                                    opacity: 0.4,
                                },
                            },
                            '.MuiOutlinedInput-notchedOutline': {
                                borderRadius: '16px 3px 16px 3px!important',
                                borderColor: theme.palette.primary.light,
                                // border: 'none',
                                // outline: 'none',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                border: '2px solid',
                                borderColor: theme.palette.primary.main + '!important',
                            },
                        },
                    },
                },
            },
            MuiButton: {
                defaultProps: {},
                styleOverrides: {
                    root: {
                        textTransform: 'capitalize',
                        borderRadius: '12px 3px 12px 3px',
                        // font: 'normal normal normal 14px/19px Open Sans',
                        height: '36px',
                        // fontWeight: 'bold',
                        boxShadow: 'none',
                    },
                    sizeMedium: {
                        ...theme.typography.button,
                        lineHeight: 1,
                        padding: '8px 16px',
                    },
                    sizeLarge: {
                        padding: '10px 24px',
                    },
                    sizeSmall: {
                        padding: '4px 8px',
                        minWidth: '55px',
                        height: '30px',
                    },
                    containedSecondary: {
                        backgroundColor: theme.palette.secondary.dark,
                        color: '#FFFFFF',
                        '&:hover, &.Mui-focusVisible': {
                            backgroundColor: darken(theme.palette.secondary.dark, 0.2),
                        },
                    },
                    containedPrimary: {
                        fontWeight: 'bold',
                        backgroundColor: theme.palette.primary.main,
                        color: '#FFFFFF',
                        '&:hover, &.Mui-focusVisible': {
                            backgroundColor: darken(theme.palette.primary.main, 0.1),
                            boxShadow: ' 0px 2px 5px 0px ' + theme.palette.primary.main,
                        },
                    },
                    outlinedPrimary: {
                        fontWeight: 'bold',
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        '&:hover, &.Mui-focusVisible': {
                            boxShadow: ' 0px 2px 5px 0px ' + theme.palette.primary.main,
                        },
                    },
                    textSecondary: {
                        color: theme.palette.mode === 'dark' ? '#FEFEF6' : '#585F5A',
                    },
                    textPrimary: {
                        '&:hover': {
                            backgroundColor: darken(theme.palette.primary.light, 0.5),
                        },
                    },
                },
            },
            MuiTypography: {
                defaultProps: {
                    variant: 'body1',
                    variantMapping: {
                        h1: 'h1',
                        h2: 'h2',
                        h3: 'h3',
                        h4: 'h4',
                        h5: 'h5',
                        h6: 'h6',
                        body1: 'p',
                        body2: 'p',
                        body3: 'p',
                        subtitle1: 'p',
                        subtitle2: 'p',
                        button: 'p',
                        caption: 'p',
                        caption2: 'p',
                    },
                },
            },
            MuiSvgIcon: {
                styleOverrides: {
                    root: {
                        fontSize: pxToRem(20),
                    },
                    fontSizeSmall: {
                        fontSize: pxToRem(16),
                    },
                    fontSizeLarge: {
                        fontSize: pxToRem(24),
                    },
                },
            },
            MuiPaper: {
                defaultProps: {
                    elevation: 0,
                },
                styleOverrides: {
                    root: {
                        borderRadius: 16,
                    },
                },
            },
            MuiDialog: {
                defaultProps: {
                    scroll: 'body',
                    PaperProps: {
                        elevation: 0,
                    },
                },
            },
            MuiDialogContent: {
                styleOverrides: {
                    root: {
                        paddingTop: theme.spacing(2.5),
                        // paddingTop: `${theme.spacing(2.5)} !important`, // prevent override
                    },
                },
            },
            MuiDialogTitle: {
                styleOverrides: {
                    root: {
                        padding: theme.spacing(2, 2.5),
                        backgroundColor: theme.palette.mode === 'dark' ? '#585F5A' : '#EDEDED',
                        '&.MuiDialogTitle-root+.MuiDialogContent-root': {
                            paddingTop: theme.spacing(2.5),
                        },
                    },
                },
            },
            MuiUseMediaQuery: {
                defaultProps: {
                    noSsr: true,
                },
            },
            MuiTooltip: {
                defaultProps: {
                    arrow: true,
                    placement: 'top',
                },
                styleOverrides: {
                    tooltip: {
                        ...theme.typography.body3,
                        boxShadow: 'rgb(0 0 0 / 20%) 0px 0px 2px, rgb(0 0 0 / 10%) 0px 2px 10px',
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        padding: theme.spacing(1),
                        maxWidth: 400,
                        color: '#fff',
                    },
                    arrow: {
                        '&:before': {
                            boxShadow: 'rgb(0 0 0 / 20%) 0px 0px 2px, rgb(0 0 0 / 10%) 0px 2px 10px',
                            backgroundColor: 'rgba(0,0,0,0.9)',
                        },
                        color: '#fff',
                    },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        borderRadius: 10,
                        '&:not(.Mui-focused):hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.secondary.dark,
                            borderWidth: 2,
                        },
                    },
                    focused: {
                        '& .MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                        },
                    },
                    input: {
                        // padding: theme.spacing(1.5, 2),
                    },
                    notchedOutline: {
                        borderColor: theme.palette.secondary.dark,
                    },
                },
            },
            MuiAccordion: {
                styleOverrides: {
                    root: {
                        overflow: 'hidden',
                        borderRadius: 20,
                        '&:first-of-type, &:last-of-type': {
                            borderRadius: 20,
                        },
                        '&:before': {
                            display: 'none',
                        },
                        '&.Mui-expanded': {
                            backgroundColor: '#F5F5F5',
                        },
                    },
                },
            },
            MuiAccordionSummary: {
                styleOverrides: {
                    root: {
                        padding: theme.spacing(1, 2.5),
                        '&.Mui-expanded': {
                            backgroundColor: theme.palette.background.paper,
                            boxShadow: 'inset 0px 0px 6px #D5D9D985, 0px 3px 6px #00000014',
                        },
                        '& .MuiAccordionSummary-content': {
                            margin: 0,
                            '&.Mui-expanded': {
                                margin: 0,
                            },
                        },
                    },
                },
            },
            MuiAccordionDetails: {
                styleOverrides: {
                    root: {
                        padding: theme.spacing(3, 4.5),
                        [theme.breakpoints.down('xsm')]: {
                            padding: theme.spacing(3),
                        },
                    },
                },
            },
            MuiButtonGroup: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#C3C4C3',
                        // border: '1px solid #B8BEB9',
                        borderRadius: 18,
                        overflow: 'hidden',
                        '.MuiButtonBase-root': {
                            paddingRight: '16px',
                            paddingLeft: '16px',
                        },
                    },

                    grouped: {
                        minWidth: '85px',
                        '&:not(:last-of-type)': {
                            borderTopRightRadius: 18,
                            borderBottomRightRadius: 18,
                            borderRightColor: 'inherit',
                        },
                        '&:not(:first-of-type)': {
                            borderTopLeftRadius: 18,
                            borderBottomLeftRadius: 18,
                        },
                    },
                },
            },
            MuiPopover: {
                styleOverrides: {
                    root: {
                        '& .MuiBackdrop-root': {
                            backdropFilter: 'none',
                        },
                    },
                },
            },
            MuiPagination: {
                defaultProps: {
                    color: 'primary',
                    shape: 'rounded',
                },
            },
            MuiPaginationItem: {
                styleOverrides: {
                    root: {
                        '&.Mui-selected': {
                            color: '#fff',
                            boxShadow: '0px 0px 10px 1px rgba(196, 196, 196, 0.5)',
                        },
                    },
                },
            },
        },
    };
}
