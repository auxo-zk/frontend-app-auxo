import { Box, Container, Typography } from '@mui/material';
import ButtonCreateCommittee from 'src/views/Home/ButtonCreateCommittee';
import TableCommittee from 'src/views/Home/TableCommittee/TableCommittee';

export default function Dashboard() {
    return (
        <Container sx={{ pt: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h1">Explore Committees</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
                <ButtonCreateCommittee />
            </Box>
            <TableCommittee />
        </Container>
    );
}
