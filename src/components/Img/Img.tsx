import { Box, SxProps } from '@mui/material';
import Image from 'next/image';
import React from 'react';

export default function Img({ sx, alt, src }: { sx?: SxProps; src: string; alt: string }) {
    return (
        <Box sx={{ position: 'relative', ...sx }}>
            <Image fill src={src} alt={alt} style={{ objectFit: 'inherit', borderRadius: 'inherit' }} />
        </Box>
    );
}
