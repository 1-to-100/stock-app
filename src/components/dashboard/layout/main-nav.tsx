'use client';

import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Badge from '@mui/joy/Badge';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import {Bell as BellIcon} from '@phosphor-icons/react/dist/ssr/Bell';
import {List as ListIcon} from '@phosphor-icons/react/dist/ssr/List';

import type {NavItemConfig} from '@/types/nav';
import {usePopover} from '@/hooks/use-popover';

import {MobileNav} from './mobile-nav';
import {NotificationsPopover} from './notifications-popover';
import {UserPopover} from './user-popover/user-popover';
import Typography from '@mui/joy/Typography';
import {useAuth} from '@/contexts/auth/user-context';

export interface MainNavProps {
    items: NavItemConfig[];
}

export function MainNav({items}: MainNavProps): React.JSX.Element {
    const [openNav, setOpenNav] = React.useState<boolean>(false);
    const notificationsPopover = usePopover<HTMLButtonElement>();
    const userPopover = usePopover<HTMLButtonElement>();
    const {user} = useAuth();


    return (
        <React.Fragment>
            <Box
                component="header"
                sx={{
                    bgcolor: 'var(--Layout-bg)',
                    left: 0,
                    position: 'sticky',
                    pt: {lg: 'var(--Layout-gap)'},
                    top: 0,
                    zIndex: 'var(--MainNav-zIndex)',
                }}
            >
                <Box
                    sx={{
                        bgcolor: 'var(--Content-background)',
                        borderRadius: {lg: 'var(--Content-radius) var(--Content-radius) 0 0'},
                        display: 'flex',
                        flex: '1 1 auto',
                        minHeight: 'var(--MainNav-height, 72px)',
                        px: {xs: 2, lg: 3},
                    }}
                >
                    <Stack direction="row" spacing={2} sx={{alignItems: 'center', flex: '1 1 auto'}}>
                        <IconButton
                            color="neutral"
                            onClick={(): void => {
                                setOpenNav(true);
                            }}
                            sx={{display: {lg: 'none'}}}
                            variant="plain"
                        >
                            <ListIcon fontSize="var(--Icon-fontSize)" weight="bold"/>
                        </IconButton>
                        {/* <Input
              startDecorator={<SearchIcon />}
              placeholder="Search"
              sx={{
                width: { xs: '100%', sm: '300px' },
                display: { xs: 'none', sm: 'flex' },
                bgcolor: '#F5F7FA',
                borderRadius: '20px',
                border: 'none',
                '&:hover': {
                  bgcolor: '#EDEFF2',
                },
                '& .MuiInput-input': {
                  padding: '8px 0px',
                  fontSize: '16px',
                  color: '#636B74',
                },
                '& .MuiInput-startDecorator': {
                  color: '#636B74',
                  marginLeft: '2px',
                },
              }}
            /> */}
                    </Stack>
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{alignItems: 'center', flex: '1 1 auto', justifyContent: 'flex-end'}}
                    >
                        <Badge color="danger" sx={{'& .MuiBadge-badge': {top: '6px', right: '6px'}}}>
                            <IconButton
                                color="neutral"
                                onClick={notificationsPopover.handleOpen}
                                ref={notificationsPopover.anchorRef}
                                variant="plain"
                            >
                                <BellIcon fontSize="var(--Icon-fontSize)" weight="bold"/>
                            </IconButton>
                        </Badge>
                        <Badge
                            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                            color="success"
                            onClick={userPopover.handleOpen}
                            ref={userPopover.anchorRef}
                            sx={{cursor: 'pointer', '& .MuiBadge-badge': {bottom: '4px', right: '4px'}}}
                        >
                            <Avatar src={user?.avatar}/>
                        </Badge>
                        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                            <Typography fontWeight="lg" textColor="inherit">
                                {user?.name}
                            </Typography>
                            <Typography level="body-xs" textColor="neutral.500">
                                {user?.email}
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            </Box>
            <MobileNav
                items={items}
                onClose={(): void => {
                    setOpenNav(false);
                }}
                open={openNav}
            />
            <NotificationsPopover
                anchorEl={notificationsPopover.anchorRef.current}
                onClose={notificationsPopover.handleClose}
                open={notificationsPopover.open}
            />
            <UserPopover
                anchorEl={userPopover.anchorRef.current}
                onClose={userPopover.handleClose}
                open={userPopover.open}
            />
        </React.Fragment>
    );
}
