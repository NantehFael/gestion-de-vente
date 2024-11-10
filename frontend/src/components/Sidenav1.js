import * as React from 'react';  
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Icône pour les commandes
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../appStore';

const drawerWidth = 240;
const postgresBlue = '#336791'; // Couleur du logo PostgreSQL

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
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    elevation: 0,
    backgroundColor: postgresBlue,
    color: 'white',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': {
        ...openedMixin(theme),
        elevation: 0,
        backgroundColor: postgresBlue,
        color: 'white',
      },
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': {
        ...closedMixin(theme),
        elevation: 0,
        backgroundColor: postgresBlue,
        color: 'white',
      },
    }),
  }),
);

export default function Sidenav1() { 
  const theme = useTheme(); 
  const navigate = useNavigate(); 
  const open = useAppStore((state) => state.dopen); 

  return ( 
    <Box sx={{ display: 'flex' }}> 
      <CssBaseline /> 
      <Drawer variant="permanent" open={open}> 
        <DrawerHeader> 
          <IconButton> 
            {theme.direction === 'rtl' ? <ChevronRightIcon sx={{ color: 'white' }} /> : <ChevronLeftIcon sx={{ color: 'white' }} />} 
          </IconButton> 
        </DrawerHeader> 
        <List> 
          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate("/home") }}>   
          </ListItem>

          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate("/Commande") }}> 
            <ListItemButton 
              sx={{ 
                minHeight: 48, 
                justifyContent: open ? 'initial' : 'center', 
                px: 2.5, 
              }} 
            > 
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', color: 'white' }}> 
                <ShoppingCartIcon /> {/* Nouvelle icône pour Commandes */} 
              </ListItemIcon> 
              <ListItemText primary="Commande" sx={{ opacity: open ? 1 : 0 }} /> 
            </ListItemButton> 
          </ListItem>

          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate("/lignecommande") }}> 
            <ListItemButton 
              sx={{ 
                minHeight: 48, 
                justifyContent: open ? 'initial' : 'center', 
                px: 2.5, 
              }} 
            > 
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', color: 'white' }}> 
                <BusinessIcon /> {/* Icône pour Ligne de commande */} 
              </ListItemIcon> 
              <ListItemText primary="Ligne de commande" sx={{ opacity: open ? 1 : 0 }} /> 
            </ListItemButton> 
          </ListItem>

          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate("/mescommandes") }}> 
            <ListItemButton 
              sx={{ 
                minHeight: 48, 
                justifyContent: open ? 'initial' : 'center', 
                px: 2.5, 
              }} 
            > 
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', color: 'white' }}> 
                <PeopleIcon /> {/* Icône pour Mes commandes */} 
              </ListItemIcon> 
              <ListItemText primary="Mes commandes" sx={{ opacity: open ? 1 : 0 }} /> 
            </ListItemButton> 
          </ListItem>

          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate("/mesreclamations") }}> 
            <ListItemButton 
              sx={{ 
                minHeight: 48, 
                justifyContent: open ? 'initial' : 'center', 
                px: 2.5, 
              }} 
            > 
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', color: 'white' }}> 
                <ReportProblemIcon /> 
              </ListItemIcon> 
              <ListItemText primary="Mes Réclamations" sx={{ opacity: open ? 1 : 0 }} /> 
            </ListItemButton> 
          </ListItem>

          <Divider sx={{ backgroundColor: 'black' }} /> 
        </List> 
        <Divider /> 
        {/* Section de déconnexion en bas */} 
        <Box sx={{ mt: 'auto' }}> 
          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate("/") }}> 
            <ListItemButton 
              sx={{ 
                minHeight: 48, 
                justifyContent: open ? 'initial' : 'center', 
                px: 2.5, 
              }} 
            > 
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', color: 'white' }}> 
                <ExitToAppIcon /> 
              </ListItemIcon> 
              <ListItemText primary="Déconnexion" sx={{ opacity: open ? 1 : 0 }} /> 
            </ListItemButton> 
          </ListItem> 
        </Box> 
      </Drawer> 
    </Box> 
  ); 
}
