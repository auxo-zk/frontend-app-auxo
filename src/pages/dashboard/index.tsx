import { Box, Container, MenuItem, Select, Typography } from '@mui/material';
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

            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <Select defaultValue={'Berkery'} color="secondary">
                <MenuItem value={'Berkery'}>Berkery</MenuItem>
                <MenuItem value={'Devnet'}>Devnet</MenuItem>
                <MenuItem value={'Mainnet'}>Mainnet</MenuItem>
            </Select>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
        </Container>
    );
}
