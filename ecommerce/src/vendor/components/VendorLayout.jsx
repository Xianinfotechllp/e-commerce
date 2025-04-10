import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  IconButton,
  CssBaseline,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Dashboard as DashboardIcon,
  LocalGroceryStore as LocalGroceryStoreIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import RedeemIcon from '@mui/icons-material/Redeem';
import { Outlet } from 'react-router-dom';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  })
);

const navArr = [
  { link: 'vendor-dashboard', component: 'Dashboard', icon: <DashboardIcon /> },
  { link: 'vendor-order', component: 'Users', icon: <GroupIcon /> },
  { link: 'vendor-product', component: 'Products', icon: <LocalGroceryStoreIcon /> },
];

export default function VendorLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleNavigation = (link) => {
    navigate(link);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };
  

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" onClick={() => setOpen(true)} edge="start" sx={{ mr: 2, ...(open && { display: 'none' }) }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Vendor Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Menu
          </Typography>
          <IconButton onClick={() => setOpen(false)}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          {navArr.map((navItem, index) => (
            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
              <ListItemButton sx={{ justifyContent: open ? 'initial' : 'center' }} onClick={() => handleNavigation(navItem.link)}>
                <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mr: open ? 3 : 'auto' }}>
                  {navItem.icon}
                </ListItemIcon>
                <ListItemText primary={navItem.component} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />

        {/* Logout Button */}
        <Box sx={{ flexGrow: 1 }} />
        <List>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton sx={{ justifyContent: open ? 'initial' : 'center', color: 'red' }} onClick={handleLogout}>
              <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mr: open ? 3 : 'auto' }}>
                <LogoutIcon sx={{ color: 'red' }} />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0, color: 'red' }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
