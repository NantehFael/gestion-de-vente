import React, { useState, useEffect } from 'react'; 
import Sidenav from '../components/Sidenav';
import Navbar from '../components/Navbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import '../Dash.css'; // Pour les styles supplémentaires

const Acceuil = () => {
  const [ventesRecentes, setVentesRecentes] = useState([]);
  const [piecesPlusVendues, setPiecesPlusVendues] = useState([]);
  const [recettesTotales, setRecettesTotales] = useState(0); // État pour les recettes totales

  useEffect(() => {
    fetchVentesRecentes();
    fetchPiecesPlusVendues();
    fetchRecettesTotales(); // Appeler la fonction pour récupérer les recettes totales
  }, []);

  const fetchVentesRecentes = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/ventes-recentes");
      if (!response.ok) throw new Error("Erreur lors de la récupération des ventes récentes");
      const data = await response.json();
      setVentesRecentes(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPiecesPlusVendues = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/pieces-plus-vendues");
      if (!response.ok) throw new Error("Erreur lors de la récupération des pièces les plus vendues");
      const data = await response.json();
      setPiecesPlusVendues(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecettesTotales = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/recettes-totales");
      if (!response.ok) throw new Error("Erreur lors de la récupération des recettes totales");
      const data = await response.json();
      setRecettesTotales(data.total_recette); // Récupérer la recette totale
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="bgcolor">
        <Navbar />
        <Box height={55} />
        <Box sx={{ display: 'flex' }}>
          <Sidenav />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }} className="main-content">
            <center><h1 className="header-title">Vente de Pièces Détachées de Voitures</h1></center>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '2.5fr 1.5fr',
                gap: 3,
                mb: 3,
              }}
            >
              {/* Section Vente récentes */}
              <Box
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '12px',
                  padding: '16px',
                  backgroundColor: '#fff',
                }}
              >
                <Typography variant="h6" sx={{ marginBottom: '16px' }}>Ventes Récentes</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Client</TableCell>
                      <TableCell>Pièces</TableCell>
                      <TableCell>Prix</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ventesRecentes.map((commande, index) => (
                      <TableRow key={index}>
                        <TableCell>{commande.date_commande}</TableCell>
                        <TableCell>{commande.prenom}</TableCell>
                        <TableCell>{commande.nom_piece}</TableCell>
                        <TableCell>{commande.prix_vente} Ariary</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Button variant="contained" color="primary">Voir Tout</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>

              {/* Section Pièces les plus vendues */}
              <Box
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '12px',
                  padding: '16px',
                  backgroundColor: '#fff',
                }}
              >
                <Typography variant="h6" sx={{ marginBottom: '16px' }}>Pièces les Plus Vendues</Typography>
                <Table>
                  <TableBody>
                    {piecesPlusVendues.map((piece, index) => (
                      <TableRow key={index}>
                        <TableCell>{piece.nom_piece}</TableCell>
                        <TableCell>{piece.prix_vente} Ariary</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>

              {/* Section pour afficher les recettes totales */}
              <Box
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '12px',
                  padding: '16px',
                  backgroundColor: '#fff',
                  marginTop: 3,
                  gridColumn: 'span 2', // Prendre toute la largeur de la grille
                }}
              >
                <Typography variant="h6" sx={{ marginBottom: '16px' }}>Recettes Totales</Typography>
                <Typography variant="h5" textAlign="center">{recettesTotales} Ariary</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </div>
    </>
  );
};

export default Acceuil;
