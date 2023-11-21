import { Box, Container, Typography } from '@mui/material';
import { useThemeData } from 'src/states/theme';
import ViewHome from 'src/views/Home/Home';

export default function Home() {
    const { mode } = useThemeData();
    return (
        <Container>
            <Typography variant="h1">Hello world</Typography>
            <Typography>Theme: {mode}</Typography>
        </Container>
    );
}
