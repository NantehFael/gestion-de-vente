import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import axios from 'axios';
import logo from "../img/avatar.jpg"; // Importez le logo depuis avatar.jpg

const primaryColor = "#336791";
const whiteColor = "#FFFFFF";

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: primaryColor,
}));

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [orderAnchorEl, setOrderAnchorEl] = useState(null);
  const [reclamationAnchorEl, setReclamationAnchorEl] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [ligneCommandes, setLigneCommandes] = useState([]);
  const [reclamations, setReclamations] = useState([]); // État pour les réclamations

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
    fetchAlerts();
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleOrderPopoverOpen = (event) => {
    setOrderAnchorEl(event.currentTarget);
    fetchLigneCommandes();
  };

  const handleOrderPopoverClose = () => {
    setOrderAnchorEl(null);
  };

  const handleReclamationPopoverOpen = (event) => {
    setReclamationAnchorEl(event.currentTarget);
    fetchReclamations(); // Mettre à jour les réclamations à chaque ouverture
  };

  const handleReclamationPopoverClose = () => {
    setReclamationAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const openOrders = Boolean(orderAnchorEl);
  const openReclamations = Boolean(reclamationAnchorEl);

  // Fonction pour récupérer les alertes
  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/alertes');
      setAlerts(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des alertes:", error);
    }
  };

  // Fonction pour récupérer les lignes de commande
  const fetchLigneCommandes = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/lignes_commande`);
      setLigneCommandes(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des lignes de commande:", error);
    }
  };

  // Fonction pour récupérer les réclamations
  const fetchReclamations = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/reclamations');
      setReclamations(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des réclamations:", error);
    }
  };

  useEffect(() => {
    fetchAlerts(); // Appeler la fonction pour récupérer les alertes au chargement
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" elevation={0}>
        <Toolbar sx={{ minHeight: 80 }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 1 }}
          >
            <img src={logo} alt="Logo" style={{ width: 40, height: 'auto' }} />
          </IconButton>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ flexGrow: 1, color: whiteColor, textAlign: 'center' }}
          >
            GESTION DE VENTE DE PIÈCES DÉTACHÉES DE VOITURE
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton 
              size="large" 
              aria-label="show reclamations" 
              color="inherit"
              onClick={handleReclamationPopoverOpen}
            >
              <Badge badgeContent={reclamations.length} color="error">
                <MailIcon />
              </Badge>
            </IconButton>

            <IconButton 
              size="large" 
              aria-label="show orders" 
              color="inherit"
              onClick={handleOrderPopoverOpen}
            >
              <Badge badgeContent={ligneCommandes.length} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            <IconButton 
              size="large" 
              aria-label="show notifications" 
              color="inherit"
              onClick={handlePopoverOpen}
            >
              <Badge badgeContent={alerts.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Popover pour les réclamations */}
      <Popover
        open={openReclamations}
        anchorEl={reclamationAnchorEl}
        onClose={handleReclamationPopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ width: 300 }}>
          <Typography variant="h6" sx={{ padding: 2 }}>Réclamations</Typography>
          <Divider />
          <List>
            {reclamations.length > 0 ? (
              reclamations.map((reclamation) => (
                <ListItem key={reclamation.id_reclamation} button>
                  <Typography variant="subtitle1">Piece : {reclamation.nom_piece}</Typography>
                  <Typography variant="body2" color="textSecondary">{reclamation.message}</Typography>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <Typography variant="subtitle1">Aucune réclamation.</Typography>
              </ListItem>
            )}
          </List>
          <Divider />
          <Button onClick={handleReclamationPopoverClose} color="primary" sx={{ margin: 1 }}>
            Voir toutes les réclamations
          </Button>
        </Box>
      </Popover>

      {/* Popover pour les lignes de commande */}
      <Popover
        open={openOrders}
        anchorEl={orderAnchorEl}
        onClose={handleOrderPopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ width: 300 }}>
          <Typography variant="h6" sx={{ padding: 2 }}>Ligne de Commande</Typography>
          <Divider />
          <List>
            {ligneCommandes.map((ligne) => (
              <ListItem key={ligne.id_ligne_commande} button>
                <Typography variant="subtitle1">Nom de Pièce : {ligne.nom_piece} - Qté : {ligne.qt_commande}</Typography>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Button onClick={handleOrderPopoverClose} color="primary" sx={{ margin: 1 }}>
            Voir toutes les commandes
          </Button>
        </Box>
      </Popover>

      {/* Popover pour les alertes */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ width: 300 }}>
          <Typography variant="h6" sx={{ padding: 2 }}>Articles en alerte</Typography>
          <Divider />
          <List>
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <ListItem key={alert.id_piece} sx={{ backgroundColor: 'yellow', marginBottom: 1 }}>
                  <Typography variant="subtitle1">{alert.nom_piece}</Typography>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <Typography variant="subtitle1">Aucune alerte.</Typography>
              </ListItem>
            )}
          </List>
          <Divider />
          <Button onClick={handlePopoverClose} color="primary" sx={{ margin: 1 }}>
            Voir toutes les alertes
          </Button>
        </Box>
      </Popover>
    </Box>
  );
}
