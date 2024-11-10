import React, { useState, useEffect } from 'react';     
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import logo from "../img/avatar.jpg"; // Importez le logo depuis avatar.jpg
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Menu, MenuItem } from '@mui/material'; 
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssignmentIcon from '@mui/icons-material/Assignment'; 
import PersonIcon from '@mui/icons-material/Person'; 
import ReportProblemIcon from '@mui/icons-material/ReportProblem'; 
import LogoutIcon from '@mui/icons-material/Logout'; // Icône pour la déconnexion
import AccountCircle from '@mui/icons-material/AccountCircle'; // Icône pour le profil
import StorefrontIcon from '@mui/icons-material/Storefront';
import PowerSettingsNewSharpIcon from '@mui/icons-material/PowerSettingsNewSharp';

const primaryColor = "#336791"; // Couleur principale
const whiteColor = "#FFFFFF"; // Blanc

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: primaryColor,
}));

const Navbar1 = ({ order = [] }) => { // Recevez `order` comme prop, avec une valeur par défaut
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [client, setClient] = useState({}); // État pour les informations du client
  const [anchorEl, setAnchorEl] = useState(null); // État pour le menu
  const navigate = useNavigate();

  useEffect(() => {
    const id_client = localStorage.getItem('id_client');
    setIsLoggedIn(!!id_client); // Vérifie si l'ID du client est présent

    if (id_client) {
      // Récupérer les informations du client si connecté
      fetchClientInfo(id_client);
    }
  }, []);

  const fetchClientInfo = async (clientId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/client/${clientId}`); // Assurez-vous que cette API existe
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des informations du client");
      }
      const data = await response.json();
      setClient(data); // Met à jour les informations du client
    } catch (error) {
      console.error("Erreur lors de la récupération des informations du client:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('id_client'); // Supprime l'ID du client du localStorage
    localStorage.removeItem('client_name'); // Supprime le nom du client du localStorage
    setIsLoggedIn(false); // Met à jour l'état de connexion
    setClient({}); // Réinitialise les informations du client
    navigate('/'); // Redirige vers la page de connexion
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" elevation={0}>
        <Toolbar sx={{ minHeight: 64, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="logo"
              sx={{ mr: 1 }}
            >
              <img src={logo} alt="Logo" style={{ width: 40, height: 'auto' }} />
            </IconButton>
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{ color: whiteColor }}
            >
              VENTE DE PIÈCES DÉTACHÉES DE VOITURE
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link to="/home" style={{ color: whiteColor, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <HomeIcon />
              Accueil
            </Link>
            <Link to="/boutique" style={{ color: whiteColor, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <StorefrontIcon />
              Boutique
            </Link>
            <Link to="/panier" style={{ color: whiteColor, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Badge color="error" badgeContent={order.length}> {/* Affiche le nombre d'articles dans le panier */}
                <ShoppingCartIcon />
              </Badge>
              Votre Panier
            </Link>
            <Link to="/lignecommande" style={{ color: whiteColor, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <AssignmentIcon />
              Vos Lignes de Commandes
            </Link>
            <Link to="/mescommandes" style={{ color: whiteColor, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <PersonIcon />
              Vos Commandes
            </Link>
            <Link 
              to="/mesreclamations" style={{ color: whiteColor, textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            >
              <ReportProblemIcon />
              Vos Réclamations
            </Link>

            {isLoggedIn ? (
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenuClick}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>
                    <Link to="/profil" style={{ textDecoration: 'none', color: 'inherit' }}>Profil</Link>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Link to="/moncompte" style={{ textDecoration: 'none', color: 'inherit' }}>Mon Compte</Link>
                  </MenuItem>
                </Menu>
                <IconButton onClick={handleLogout} color="inherit">
                  <PowerSettingsNewSharpIcon /> {/* Icône de déconnexion */}
                </IconButton>
              </>
            ) : (
              <Link to="/Login" style={{ color: whiteColor, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                Se connecter
              </Link>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar1;
