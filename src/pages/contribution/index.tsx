import { Box, Container, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import React from 'react';
import BoxPrivateData from 'src/components/BoxPrivateData/BoxPrivateData';
import { imagePath } from 'src/constants/imagePath';
import AutocompleteSearchCommittee from 'src/views/contribution/AutocompleteSearchCommittee/AutocompleteSearchCommittee';
import CommitteSelectedInfo from 'src/views/contribution/CommitteSelectedInfo/CommitteSelectedInfo';
import TableKeyContribution from 'src/views/contribution/TableKeyContribution/TableKeyContribution';
import TableKeysUsage from 'src/views/contribution/TableKeysUsage/TableKeysUsage';
import InitStateDistributionPage, { useContributionPageData } from 'src/views/contribution/state';

export default function Contribution() {
    const { selectedCommittee } = useContributionPageData();
    return (
        <Container sx={{ pt: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Box sx={{ width: '100%' }}>
                    <Typography variant="h1" textTransform={'uppercase'} maxWidth={'614px'}>
                        Contribution
                    </Typography>
                    <AutocompleteSearchCommittee />
                </Box>

                <Box sx={{ display: { xs: 'none', xsm: 'block' } }}>
                    <Image src={imagePath.THUMBNAIL4} alt="auxo thumbnail" style={{ maxWidth: '256px', height: 'auto', width: '100%' }} />
                </Box>
            </Box>
            <BoxPrivateData>
                <InitStateDistributionPage />
                {selectedCommittee ? (
                    <>
                        <CommitteSelectedInfo />
                        {selectedCommittee.status == 'Active' ? (
                            <>
                                <TableKeyContribution />
                                <TableKeysUsage />
                            </>
                        ) : (
                            <></>
                        )}
                    </>
                ) : (
                    <Box>
                        <Typography textAlign={'center'} variant="h5">
                            Select a committee to continute!
                        </Typography>
                    </Box>
                )}
            </BoxPrivateData>
        </Container>
    );
}
