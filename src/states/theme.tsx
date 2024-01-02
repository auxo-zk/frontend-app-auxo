import { ExpandMore, ExpandMoreRounded } from '@mui/icons-material';
import { PaletteOptions, Theme, ThemeOptions, darken, lighten, outlinedInputClasses } from '@mui/material';
import { atom, useAtom, useAtomValue } from 'jotai';
import { FontInter, FontRaleway } from 'src/assets/fonts';

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

    const palette = {
        mode,
        divider: '#D3E8E7',
        background: {
            paper: '#FFFFFF',
            default: '#FFFFFF', // ? body background
            primary: '#CFE9E4',
            secondary: '#F1F6F5', // ? color sidebar
            table: '#F1F6F5',
        },

        primary: {
            main: '#043E35', // mau xanh button theme light
            light: '#2C978F',
            dark: '#37A9A2',
        },
        secondary: {
            main: '#FC8C69',
            light: '#FFF2EE',
        },

        text: {
            primary: '#001714',
            secondary: '#707070',
        },
    };

    return {
        breakpoints: {
            keys: ['xs', 'xsm', 'sm', 'md', 'lg', 'xl', 'xxl'],
            values: { xs: 0, xsm: 600, sm: 760, md: 960, lg: 1280, xl: 1440, xxl: 1800 },
        },
        shadows: [
            'none', // 0
            '0px 4px 8px 0px rgba(4, 62, 53, 0.25)', // 1
            '0px 4px 8px 0px rgba(44, 151, 143, 0.48)', // 2
            '1px 1px 3px 0px rgba(0, 0, 0, 0.20)', // 3
            '0px 2px 6px 0px rgba(0, 0, 0, 0.20)', // 4
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
        ],
        palette,
        typography: {
            fontFamily: `${FontInter.style.fontFamily}, sans-serif`,
            h1: { ...buildVariant(800, 44, 57.5), color: palette.primary.main, fontFamily: FontRaleway.style.fontFamily },
            h2: { ...buildVariant(700, 38, 56), color: palette.primary.main },
            h3: { ...buildVariant(700, 36, 44), color: palette.primary.main },
            h4: { ...buildVariant(700, 28, 34), color: palette.primary.main },
            h5: buildVariant(700, 24, 27),
            h6: { ...buildVariant(700, 20, 24), color: palette.primary.main },
            body1: buildVariant(400, 16, 23),
            body2: buildVariant(400, 14, 16),
            body3: buildVariant(400, 12, 15),
            subtitle1: buildVariant(600, 20, 27, 0),
            subtitle2: buildVariant(400, 16, 22, 0),
            caption: buildVariant(400, 14, 19, 0.15),
            caption2: buildVariant(500, 12, 15),
            button: {
                ...buildVariant(700, 14, 16),
                textTransform: 'none',
                fontFamily: FontRaleway.style.fontFamily,
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
                            height: '6px' /* height of horizontal scrollbar ← You're missing this */,
                            width: '6px' /* width of vertical scrollbar */,
                        },
                        '::-webkit-scrollbar-track': {
                            borderRadius: 0,
                            background: 'transparent',
                        },

                        '::-webkit-scrollbar-thumb': {
                            // borderRadius: 10,
                            background: '#D9D9D9',
                            cursor: 'pointer',
                            '&:hover': {
                                background: '#d3d3d3',
                            },
                        },
                    },
                },
            },
            MuiContainer: {
                defaultProps: {
                    maxWidth: false,
                },
                styleOverrides: {
                    root: {
                        maxWidth: '1078px',
                    },
                },
            },

            MuiFormControl: {
                styleOverrides: {
                    root: {
                        '--outlineInputBorderColor': theme.palette.background.primary,
                        '--hoverOutlineInputBorderColor': theme.palette.primary.light,
                        '--focusedOutlineInputBorderColor': theme.palette.primary.light,
                        '--iconOpenSelectMenuColor': theme.palette.primary.light,
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

            MuiTextField: {
                defaultProps: { size: 'small' },
                styleOverrides: {
                    root: {},
                },
            },
            MuiSelect: {
                defaultProps: {
                    IconComponent: ExpandMoreRounded,
                },
                styleOverrides: {
                    root: {},
                    icon: {
                        color: 'var(--iconOpenSelectMenuColor)',
                    },
                    select: {},
                },
            },
            MuiFormLabel: {
                //* Label of item like TextField_Outlined
                styleOverrides: {
                    root: {
                        color: theme.palette.primary.main,
                    },
                    colorSecondary: {
                        color: theme.palette.secondary.main,
                    },
                },
            },
            MuiInputLabel: {
                //* title of text field outline
                defaultProps: {},
                styleOverrides: {
                    root: {
                        marginLeft: '6px',
                    },
                },
            },
            MuiInputBase: {
                //* input of text field
                styleOverrides: {
                    root: {
                        paddingRight: '6px',
                        paddingLeft: '6px',
                        '--outlineInputBorderColor': theme.palette.background.primary,
                        '--hoverOutlineInputBorderColor': theme.palette.primary.light,
                        '--focusedOutlineInputBorderColor': theme.palette.primary.light,
                        color: theme.palette.primary.main,
                    },

                    colorSecondary: {
                        '--outlineInputBorderColor': theme.palette.secondary.main,
                        '--hoverOutlineInputBorderColor': theme.palette.secondary.main,
                        '--focusedOutlineInputBorderColor': theme.palette.secondary.main,
                        color: theme.palette.secondary.main,
                        '--iconOpenSelectMenuColor': theme.palette.secondary.main,
                    },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        borderRadius: '8px',
                        //* border of text fields
                        [`.${outlinedInputClasses.notchedOutline}`]: {
                            //* background of text title of text field
                            ['& > legend']: {
                                marginLeft: '6px',
                            },
                            borderColor: 'var(--outlineInputBorderColor)',
                        },
                        [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                            borderColor: 'var(--hoverOutlineInputBorderColor)',
                        },
                        [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                            borderColor: 'var(--focusedOutlineInputBorderColor)',
                        },
                    },
                },
            },
            MuiAutocomplete: {
                defaultProps: {
                    popupIcon: <ExpandMore />,
                },
                styleOverrides: {
                    root: {
                        '& > .MuiFormControl-root > .MuiOutlinedInput-root': {
                            paddingLeft: '12px',
                        },
                    },
                },
            },
            MuiButtonBase: {
                styleOverrides: {
                    root: {
                        '&.MuiMenuItem-root.Mui-selected': {
                            color: '#2C978F',
                            backgroundColor: '#CFE9E4',
                            fontWeight: 600,
                        },
                    },
                },
            },
            MuiButton: {
                defaultProps: {},
                styleOverrides: {
                    root: {
                        textTransform: 'capitalize',
                        borderRadius: '12px',
                        height: '44px',
                        boxShadow: 'none',
                    },
                    sizeMedium: {
                        ...theme.typography.button,
                        lineHeight: 1,
                        padding: '10px 16px',
                    },
                    sizeLarge: {
                        padding: '12px 24px',
                    },
                    sizeSmall: {
                        padding: '4px 8px',
                        minWidth: '55px',
                        height: '30px',
                    },

                    containedPrimary: {
                        backgroundColor: theme.palette.primary.main,
                        color: '#FFFFFF',
                        '&:hover, &.Mui-focusVisible': {
                            backgroundColor: darken(theme.palette.primary.main, 0.1),
                            boxShadow: ' 0px 2px 5px 0px ' + theme.palette.primary.main,
                        },
                    },
                    containedSecondary: {
                        backgroundColor: theme.palette.secondary.main,
                        color: '#FFFFFF',
                        '&:hover, &.Mui-focusVisible': {
                            backgroundColor: darken(theme.palette.secondary.main, 0.2),
                        },
                    },
                    containedSuccess: {
                        backgroundColor: theme.palette.background.primary,
                        color: theme.palette.primary.main,
                        '&:hover, &.Mui-focusVisible': {
                            backgroundColor: darken(theme.palette.background.primary, 0.01),
                            boxShadow: '0px 2px 5px 0px ' + theme.palette.background.primary,
                        },
                    },
                    outlinedPrimary: {
                        borderColor: theme.palette.primary.light,
                        color: theme.palette.primary.main,
                        '&:hover, &.Mui-focusVisible': {
                            boxShadow: ' 0px 2px 5px 0px ' + theme.palette.primary.light,
                        },
                    },
                    textSecondary: {
                        backgroundColor: theme.palette.background.secondary,
                        color: theme.palette.primary.main,
                        fontWeight: 500,
                    },
                    textPrimary: {
                        '&:hover': {
                            backgroundColor: lighten(theme.palette.primary.main, 0.85),
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
                    elevation: 2,
                },
                styleOverrides: {
                    root: {
                        borderRadius: '8px',
                        boxShadow: theme.shadows[4],
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
                        backgroundColor: '#ffffff',
                    },
                },
            },
            MuiDialogTitle: {
                styleOverrides: {
                    root: {
                        padding: theme.spacing(2, 2.5),
                        backgroundColor: '#ffffff',
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
                        backgroundColor: theme.palette.background.secondary,
                        borderRadius: 12,
                        boxShadow: theme.shadows[3],
                        overflow: 'hidden',
                        '.MuiButtonBase-root': {
                            paddingRight: '16px',
                            paddingLeft: '16px',
                        },
                    },
                    lastButton: {
                        borderTopRightRadius: 12,
                        borderBottomRightRadius: 12,
                        borderRightColor: 'inherit',
                    },
                    firstButton: {
                        borderTopLeftRadius: 12,
                        borderBottomLeftRadius: 12,
                    },
                    grouped: {
                        borderRadius: 12,
                        minWidth: '85px',
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
                    paper: {
                        color: '#043E35',
                        background: '#F1F6F5',
                    },
                },
            },
            MuiMenuItem: {
                styleOverrides: {
                    selected: {
                        color: theme.palette.primary.light,
                        background: '#CFE9E4',
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
