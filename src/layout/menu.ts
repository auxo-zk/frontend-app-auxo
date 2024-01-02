import { Dashboard } from '@mui/icons-material';
import { IconCommittee, IconContribution, IconInvestor, IconMenuExplorer, IconOrganizer, IconUser } from 'src/assets/svg/icon';

export const menu = [
    {
        icon: Dashboard,
        title: 'Dashboard',
        url: '/dashboard',
        children: [] as { title: string; url: string }[],
    },
    {
        icon: IconContribution,
        title: 'Contribution',
        url: '/contribution',
        children: [] as { title: string; url: string }[],
    },
];
