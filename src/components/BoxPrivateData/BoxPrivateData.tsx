import { Box, SxProps, Typography } from '@mui/material';
import Image from 'next/image';
import React, { ReactNode } from 'react';
import { IconSpinLoading } from 'src/assets/svg/icon';
import { imagePath } from 'src/constants/imagePath';
import { useWalletData } from 'src/states/wallet';
import ButtonConnectWallet from '../ButtonConnectWallet/ButtonConnectWallet';

export default function BoxPrivateData({ children, iconLoadingProps }: { children?: ReactNode; iconLoadingProps?: SxProps }) {
    const { userAddress, isConnecting } = useWalletData();

    if (isConnecting) {
        return (
            <Box>
                <IconSpinLoading sx={{ fontSize: '80px', ...iconLoadingProps }} />
            </Box>
        );
    }
    return (
        <Box>
            {userAddress ? (
                children
            ) : (
                <Box textAlign={'center'}>
                    <Image src={imagePath.LOGO_ICON_2D} alt="logo auxo" style={{ width: '90%', maxWidth: '85px', height: 'auto' }} />
                    <Typography variant="body2" fontWeight={600} my={2}>
                        Connect wallet to continute!
                    </Typography>
                    <ButtonConnectWallet />
                </Box>
            )}
        </Box>
    );
}
