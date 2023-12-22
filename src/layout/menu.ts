import { Dashboard } from '@mui/icons-material';
import { IconCommittee, IconInvestor, IconMenuExplorer, IconOrganizer, IconUser } from 'src/assets/svg/icon';

export const menu = [
    {
        icon: Dashboard,
        title: 'Dashboard',
        url: '/dashboard',
        children: [] as { title: string; url: string }[],
    },
    {
        icon: IconCommittee,
        title: 'Contribution',
        url: '/contribution',
        children: [] as { title: string; url: string }[],
    },
];
