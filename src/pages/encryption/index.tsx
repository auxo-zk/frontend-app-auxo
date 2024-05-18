import { Box, Container, Typography } from '@mui/material';
import Image from 'next/image';
import BoxPrivateData from 'src/components/BoxPrivateData/BoxPrivateData';
import { imagePath } from 'src/constants/imagePath';
import AutocompleteSearchCommittee from 'src/views/encryption/AutocompleteSearchCommittee/AutocompleteSearchCommittee';
import CommitteSelectedInfo from 'src/views/encryption/CommitteSelectedInfo/CommitteSelectedInfo';
import TableKeys from 'src/views/encryption/TableKeys/TableKeys';
import InitStateEncrytionPage, { useEncrytionPageData } from 'src/views/encryption/state';

export default function Encryption() {
    const { selectedCommittee } = useEncrytionPageData();
    return (
        <Container sx={{ pt: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 3 }}>
                <Box sx={{ width: '100%' }}>
                    <Typography variant="h1" textTransform={'uppercase'} maxWidth={'614px'}>
                        Threshold Homomorphic Encryption
                    </Typography>
                    <AutocompleteSearchCommittee />
                </Box>

                <Box sx={{ display: { xs: 'none', xsm: 'block' } }}>
                    <Image src={imagePath.THUMBNAIL4} alt="auxo thumbnail" style={{ maxWidth: '256px', height: 'auto', width: '100%' }} />
                </Box>
            </Box>
            <BoxPrivateData>
                <InitStateEncrytionPage />
                {selectedCommittee ? (
                    <>
                        <CommitteSelectedInfo />
                        {selectedCommittee.status == 'Active' ? (
                            <>
                                <TableKeys />
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
