import { IconCommittee, IconInvestor, IconOrganizer, IconUser } from 'src/assets/svg/icon';

export const menu = [
    {
        icon: IconUser,
        title: 'Builders',
        url: '/builders',
        children: [],
    },
    {
        icon: IconInvestor,
        title: 'Investors',
        url: '/investors',
        children: [],
    },
    {
        icon: IconOrganizer,
        title: 'Organizers',
        url: '/organizers',
        children: [],
    },
    {
        icon: IconCommittee,
        title: 'Committee',
        url: '/committee',
        children: [
            { title: 'Dashboard', url: '/committee/dashboard' },
            { title: 'Contribution', url: '/committee/contribution' },
        ],
    },
];
