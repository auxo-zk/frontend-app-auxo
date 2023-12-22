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
    //                 background: 'rgb(16 107 96 / 18%)',
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
    //             <Typography variant="h5">Loading client...</Typography>
    //             <IconSpinLoading sx={{ fontSize: '120px' }} />
    //             <Typography mt={2} fontWeight={600}>
    //                 {isFetching ? 'Fetching cache...' : ''}
    //             </Typography>
    //             <Typography mt={2} fontWeight={600}>
    //                 {isInitWorker ? 'Loading web worker...' : ''}
    //             </Typography>
    //         </Box>
    //     );
    // }
    return <Box></Box>;
}
