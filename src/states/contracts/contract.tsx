import { useEffect } from 'react';
import { useCacheContractData } from '../cache';
import { useCommitteeContract, useCommitteeContractFunction } from './committee';
import { Box, Typography } from '@mui/material';
import { IconSpinLoading } from 'src/assets/svg/icon';

export function InitContracts() {
    const { isFetching, filesCache } = useCacheContractData();
    const { isInitWorker, workerClient } = useCommitteeContract();
    const { complie, initClient } = useCommitteeContractFunction();
    useEffect(() => {
        initClient();
    }, []);
    // useEffect(() => {
    //     if (!isFetching && filesCache) {
    //         complie(filesCache);
    //     }
    // }, [isFetching, filesCache, workerClient]);
    // if (isFetching || isInitWorker) {
    //     return (
    //         <Box
    //             sx={{
    //                 position: 'fixed',
    //                 top: 0,
    //                 left: 0,
    //                 zIndex: 2000,
    //                 bgcolor: 'background.primary',
    //                 backdropFilter: 'blur(7px)',
    //                 width: '100%',
    //                 height: '100svh',
    //                 display: 'flex',
    //                 justifyContent: 'center',
    //                 placeItems: 'center',
    //                 alignItems: 'center',
    //                 flexDirection: 'column',
    //             }}
    //         >
    //             <IconSpinLoading sx={{ fontSize: '120px', color: '#2C978F' }} />
    //             <Typography mt={2} fontWeight={600} color={'#2C978F'}>
    //                 {isFetching ? 'Fetching cache...' : ''}
    //             </Typography>
    //             <Typography mt={2} fontWeight={600} color={'#2C978F'}>
    //                 {isInitWorker ? 'Loading web worker...' : ''}
    //             </Typography>
    //         </Box>
    //     );
    // }
    return <Box></Box>;
}
