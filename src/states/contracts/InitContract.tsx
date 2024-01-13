import { useEffect, useState } from 'react';
import { useCacheContractData } from '../cache';
import { useContractData, useContractFunction } from '.';
import { Box, Typography } from '@mui/material';
import { IconSpinLoading } from 'src/assets/svg/icon';

export default function InitContracts() {
    const { isFetching, filesCache } = useCacheContractData();
    const { isInitWorker, workerClient } = useContractData();
    const { complie, initClient } = useContractFunction();
    const [isCanCallComplie, setCanCallComplie] = useState<boolean>(false);
    useEffect(() => {
        initClient();
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (workerClient) {
                await workerClient.setActiveInstanceToBerkeley();
                setCanCallComplie(true);
                clearInterval(interval);
            }
        }, 1500);
        return () => {
            clearInterval(interval);
        };
    }, [workerClient]);

    useEffect(() => {
        if (!isFetching && filesCache && isCanCallComplie) {
            complie(filesCache);
        }
    }, [isFetching, filesCache, isCanCallComplie]);

    if (isFetching || isInitWorker) {
        return (
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 2000,
                    bgcolor: 'background.primary',
                    backdropFilter: 'blur(7px)',
                    width: '100%',
                    height: '100svh',
                    display: 'flex',
                    justifyContent: 'center',
                    placeItems: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                <IconSpinLoading sx={{ fontSize: '120px', color: '#2C978F' }} />
                <Typography mt={2} fontWeight={600} color={'#2C978F'}>
                    {isFetching ? 'Fetching cache...' : ''}
                </Typography>
                <Typography mt={2} fontWeight={600} color={'#2C978F'}>
                    {isInitWorker ? 'Loading web worker...' : ''}
                </Typography>
            </Box>
        );
    }
    return <Box></Box>;
}
