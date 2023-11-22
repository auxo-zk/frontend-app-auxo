import { IconCommittee, IconInvestor, IconOrganizer, IconUser } from 'src/assets/svg/icon';

export const menu = [
    {
        icon: IconUser,
        title: 'Builders',
        url: '/#',
        children: [],
    },
    {
        icon: IconInvestor,
        title: 'Investors',
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
