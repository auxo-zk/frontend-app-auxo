import { useEffect } from 'react';
import { useCacheContractData } from '../cache';
import { useCommitteeContract, useCommitteeContractFunction } from './committee';
import { Box, Typography } from '@mui/material';

export function InitContracts() {
    const { isFetching, filesCache } = useCacheContractData();
    const { isLoading } = useCommitteeContract();
    const { complie } = useCommitteeContractFunction();
    useEffect(() => {
        if (!isFetching && filesCache) {
            complie(filesCache);
        }
    }, [isFetching, filesCache]);
    if (isFetching || isLoading) {
        return (
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 2000,
                    background: 'rgb(16 107 96 / 18%)',
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
                <Typography variant="h5">Loading client...</Typography>
                <Typography mt={2} fontWeight={600}>
                    {isFetching ? 'Fetching cache...' : ''}
                </Typography>
                <Typography mt={2} fontWeight={600}>
                    {isLoading ? 'Compiling contract...' : ''}
                </Typography>
            </Box>
        );
    }
    return <Box></Box>;
}
