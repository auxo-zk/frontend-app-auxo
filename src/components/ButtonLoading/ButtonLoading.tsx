import { Button, ButtonProps } from '@mui/material';
import React, { ReactNode } from 'react';
import { IconSpinLoading } from 'src/assets/svg/icon';

type Props = { muiProps: ButtonProps; isLoading?: boolean; textLoading?: string; children: ReactNode };
export default function ButtonLoading({ muiProps, isLoading, textLoading, children }: Props) {
    return (
        <Button variant="contained" {...muiProps} disabled={isLoading}>
            {isLoading ? (
                <>
                    <IconSpinLoading sx={{ mr: 0.5 }} /> {textLoading || 'Loading...'}
                </>
            ) : (
                children
            )}
        </Button>
    );
}
