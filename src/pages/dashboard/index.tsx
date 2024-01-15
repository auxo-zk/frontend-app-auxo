import { Box, Container, MenuItem, Select, Typography } from '@mui/material';
import Image from 'next/image';
import { imagePath } from 'src/constants/imagePath';
import ButtonCreateCommittee from 'src/views/Home/ButtonCreateCommittee';
import TableCommittee from 'src/views/Home/TableCommittee/TableCommittee';

export default function Dashboard() {
    return (
        <Container sx={{ py: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Box sx={{ width: '100%' }}>
                    <Typography variant="h1" textTransform={'uppercase'} maxWidth={'614px'}>
                        Explore Committees
                    </Typography>
                </Box>

                <Box sx={{ display: { xs: 'none', xsm: 'block' } }}>
                    <Image src={imagePath.THUMBNAIL3} alt="auxo thumbnail" style={{ maxWidth: '256px', height: 'auto', width: '100%' }} />
                </Box>
            </Box>

            <Box sx={{ display: 'flex', placeItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6">Committees</Typography>
                <ButtonCreateCommittee />
            </Box>
            <TableCommittee />
        </Container>
    );
}
