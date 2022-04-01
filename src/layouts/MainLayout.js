import React, {useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menus from "./config/Menus";
import {useHistory, useLocation} from "react-router-dom";
import {ReactComponent as Logo} from "assets/logo2.svg";
import {AccountCircle, Logout} from "@mui/icons-material";
import {Avatar, Menu, MenuItem, Tooltip, useMediaQuery, useTheme} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {UserSelector} from "../selectors";
import {AuthActions, UserActions} from "../slices/actions";
import {push} from "connected-react-router";
import PropTypes from "prop-types";
import Can from "../utils/can";

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    background: theme.palette.common.light,
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),

    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    })
}));

const LogoBox = styled(Box)(() => ({
    width: drawerWidth,
    paddingTop: 30,
    paddingBottom: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
}));

const NavItem = styled(ListItem, { shouldForwardProp: (prop) => prop !== 'open' })(({theme, active}) => ({
    width: 220,
    margin: "10px 0",
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,

    '& .MuiTypography-root': {
        color: theme.palette.common.grey
    },

    ...(active === 'true' && {
        background: theme.palette.primary.light,

        '& .MuiTypography-root': {
            fontWeight: 700,
            color: theme.palette.primary.main
        },

        '& svg': {
            color: theme.palette.primary.main,
        }
    })
}))

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'center',
}));

MainLayout.propTypes = {
    children: PropTypes.any
};

export default function MainLayout({children}) {
    const history = useHistory();
    const dispatch = useDispatch();
    const mobile = useMediaQuery(useTheme().breakpoints.down('sm'));
    const { pathname } = useLocation();
    const profile = useSelector(UserSelector.profile());
    const [open, setOpen] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        dispatch(UserActions.profileUser());
    }, [dispatch]);

    useEffect(() => {
        if (mobile) {
            setOpen(false);
        }
    }, [mobile]);

    useEffect(() => {
        if (profile !== null && !profile._id) {
            dispatch(push('/'));
        }
    }, [profile, dispatch]);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const handleMenuToggle = (e) => {
        if (anchorEl) {
            setAnchorEl(null);
        } else {
            setAnchorEl(e.currentTarget)
        }
    };

    const handleLogout = () => {
        dispatch(AuthActions.logout());
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                elevation={4}
                open={open}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <IconButton
                        onClick={handleDrawerToggle}
                        edge="start">
                        <MenuIcon />
                    </IconButton>
                    <Tooltip title="Account settings">
                        <IconButton onClick={handleMenuToggle} size="small" sx={{ ml: 2 }}>
                            <Avatar sx={{ width: 40, height: 40 }}>
                                {profile?.name ? profile?.name?.toString().substring(0, 2).
toUpperCase() : 'D'}
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuToggle}
                onClick={handleMenuToggle}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 8px 24px rgba(149, 157, 165, 0.2))',
                        mt: 1.5,
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => dispatch(push('/app/profile'))}>
                    <ListItemIcon>
                        <AccountCircle fontSize="small" />
                    </ListItemIcon>
                    Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', borderRight: 'none' },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <LogoBox>
                    <Logo height={45}/>
                </LogoBox>
                <List>
                    {Menus.map((item, index) => {
                        if (Can(item.act, item.feat)) {
                            return (
                                <NavItem
                                    button key={index}
                                    active={pathname.includes(Menus[index].path).toString()}
                                    onClick={() => history.push(item.path)}>
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.name} />
                                </NavItem>
                            )
                        }

                        return <div key={index}/>
                    })}
                </List>
            </Drawer>
            <Main open={open}>
                <DrawerHeader />
                {children}
            </Main>
        </Box>
    );
}
