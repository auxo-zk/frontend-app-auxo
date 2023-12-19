import { IconCommittee, IconInvestor, IconMenuExplorer, IconOrganizer, IconUser } from 'src/assets/svg/icon';

export const menu = [
    {
        icon: IconMenuExplorer,
        title: 'Explorer',
        url: '/#',
        children: [],
    },
    {
        icon: IconUser,
        title: 'Profile',
        url: '/#',
        children: [],
    },
    {
        icon: IconOrganizer,
        title: 'Organizers',
        url: '/#',
        children: [],
    },
    {
        icon: IconCommittee,
        title: 'Committee',
        url: '/committee/dashboard',
        children: [
            { title: 'Dashboard', url: '/committee/dashboard' },
            { title: 'Contribution', url: '/committee/contribution' },
        ],
    },
];
