import React from 'react';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { imagePath } from 'src/constants/imagePath';
import { headerHeight, sibarWidth } from '../Layout';
import { useRouter } from 'next/router';
import { menu } from '../menu';
import Link from 'next/link';

export default function Sidebar() {
    return (
        <Box sx={{ position: 'fixed', top: 0, left: 0, zIndex: 999 }}>
            <Box className="sidebar_bg" sx={{ position: 'absolute', top: 0, left: 0 }}></Box>
            <Box
                className="sidebar_main"
                sx={{
                    width: sibarWidth,
                    height: '100svh',
                    overflow: 'auto',
                    bgcolor: '#F1F6F5',
                    background: 'linear-gradient(65deg, #EEF5F5 13.9%, rgba(255, 255, 255, 0.00) 49.05%)',
                    boxShadow: '2px 0px 4px 0px rgba(0, 0, 0, 0.16)',
                }}
            >
                <Box sx={{ height: headerHeight, display: 'flex', placeItems: 'center', justifyContent: 'center' }}>
                    <Image src={imagePath.LOGO_FULLLL_GREEN} alt="logo auxo" />
                </Box>

                <Box className="menu" mt={1}>
                    {menu.map((item, index) => {
                        return <MenuItem index={index} key={'menu' + item.title + index}></MenuItem>;
                    })}
                </Box>
            </Box>
        </Box>
    );
}

function MenuItem({ index }: { index: number }) {
    const route = useRouter();
    // console.log(route);
    const menuItem = menu[index];
    const IconItem = menuItem.icon;
    const activeItem = route.pathname.indexOf(menuItem.url) == 0;
    return (
        // <Box sx={{ background: activeItem ? '#043E35' : '' }}>
        <Box>
            <Link href={menuItem.url} passHref style={{ textDecoration: 'none', color: 'unset' }}>
                <Box sx={{ display: 'flex', placeItems: 'center', cursor: 'pointer', background: activeItem ? '#043E35' : '', '&:hover': { background: activeItem ? '' : '#F1F6F5' } }}>
                    <Box sx={{ width: '60px', height: '50px', display: 'flex', justifyContent: 'center', placeItems: 'center' }}>
                        <IconItem sx={{ fontSize: '26px', color: activeItem ? '#F1F6F5' : '#043E35' }} />
                    </Box>
                    <Box sx={{ pl: 1 }}>
                        <Typography fontWeight={600} sx={{ color: activeItem ? '#F1F6F5' : 'text.secondary' }}>
                            {menuItem.title}
                        </Typography>
                    </Box>
                </Box>
            </Link>

            {menuItem.children.map((item, j) => {
                return <SubMenuItem key={j + item.title + index} indexParent={index} indexSubmenu={j} />;
            })}
        </Box>
    );
}

function SubMenuItem({ indexParent, indexSubmenu }: { indexParent: number; indexSubmenu: number }) {
    const route = useRouter();
    // console.log(route);
    const subMenu = menu[indexParent].children[indexSubmenu];
    const activeItem = route.pathname.indexOf(subMenu.url) == 0;

    return (
        <Box>
            <Link href={subMenu.url} passHref style={{ textDecoration: 'none', color: 'unset' }}>
                <Box sx={{ display: 'flex', placeItems: 'center', cursor: 'pointer', '&:hover': { background: activeItem ? '' : '#F1F6F5' } }}>
                    <Box sx={{ width: '60px', height: '50px', display: 'flex', justifyContent: 'center', placeItems: 'center' }}></Box>
                    <Box sx={{ pl: 1 }}>
                        <Typography fontWeight={600} sx={{ color: activeItem ? '#043E35' : 'text.secondary' }}>
                            {subMenu.title}
                        </Typography>
                    </Box>
                </Box>
            </Link>
        </Box>
    );
}
