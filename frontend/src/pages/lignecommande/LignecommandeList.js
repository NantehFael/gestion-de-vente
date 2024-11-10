import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SuppLigneCommande from './SuppLigneCommande';
import ReclamationCommande from './ReclamationCommande'; // Assurez-vous que le chemin est correct

const LignecommandeList = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openReclamationModal, setOpenReclamationModal] = useState(false);
  const [ligneCommandeId, setLigneCommandeId] = useState(null);
  const [selectedCommande, setSelectedCommande] = useState(null); // Stocker les informations de la commande pour la réclamation
  const navigate = useNavigate();

  useEffect(() => {
    fetchLigneCommandes();
  }, []);

  const fetchLigneCommandes = async () => {
    setLoading(true);
    try {
      const id_client = localStorage.getItem('id_client'); 
      const response = await fetch(`http://localhost:8080/api/lignes_commande/${id_client}`);
      if (!response.ok) {
        throw new Error("");
      }
      const data = await response.json();
      setCommandes(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = (id) => {
    setLigneCommandeId(id);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  // Ouvrir le modal de réclamation avec les informations de la commande
  const handleOpenReclamationModal = (commande) => {
    setSelectedCommande(commande);
    setOpenReclamationModal(true);
  };

  const handleCloseReclamationModal = () => {
    setOpenReclamationModal(false);
    setSelectedCommande(null);
  };

  const fetchReclamations = () => {
    // Implémentez cette fonction si nécessaire pour rafraîchir les réclamations
  };

  return (
    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2, textAlign: 'center' }}>
        Vos lignes de commandes
      </Typography>

      {loading ? (
        <Typography align="center">Chargement des lignes de commande...</Typography>
      ) : error ? (
        <Typography align="center" color="error">{error}</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#336791' }}>
              <TableCell sx={{ color: 'white' }}>État</TableCell>
              <TableCell sx={{ color: 'white' }}>Image</TableCell>
              <TableCell sx={{ color: 'white' }}>Quantité</TableCell>
              <TableCell sx={{ color: 'white' }}>Pièce</TableCell>
              <TableCell sx={{ color: 'white' }}>Commande</TableCell>
              <center><TableCell sx={{ color: 'white' }}>Actions</TableCell></center>
            </TableRow>
          </TableHead>
          <TableBody>
            {commandes.map((commande) => (
              <TableRow key={commande.id_ligne_commande} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell sx={{
                  backgroundColor: 
                    commande.etat === 'validée' ? '#4caf50' : 
                    commande.etat === 'rejettée' ? '#f44336' : 
                    'lightgrey', 
                  color: 'white',
                  padding: 2
                }}>
                  {commande.etat}
                </TableCell>
                <TableCell>
                  <img 
                    src={`http://localhost:8080/uploads/${commande.image}`} 
                    alt={commande.nom_piece} 
                    style={{ width: '30px', height: 'auto' }} 
                  />
                </TableCell>
                <TableCell sx={{ padding: 2 }}>{commande.qt_commande}</TableCell>
                <TableCell sx={{ padding: 2 }}>{commande.nom_piece}</TableCell>
                <TableCell sx={{ padding: 2 }}>{commande.id_commande}</TableCell>
                <TableCell>
                  <center><Button 
                    variant="contained" 
                    sx={{ backgroundColor: '#2196f3', color: 'white', marginRight: 1 }} 
                    onClick={() => handleOpenReclamationModal(commande)} // Ouvre le modal de réclamation
                  >
                    Réclamer
                  </Button>
                  <Button 
                    variant="contained" 
                    sx={{ backgroundColor: '#f44336', color: 'white' }} 
                    onClick={() => handleOpenDeleteModal(commande.id_ligne_commande)} // Ouvre le modal de suppression
                  >
                    Supprimer
                  </Button></center>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
        <Button 
          variant="contained" 
          sx={{ backgroundColor: '#00bcd4', color: 'white', marginRight: 1 }} 
          onClick={() => navigate('/boutique')}
        >
          Nouveau
        </Button>
      </Box>

      {/* Modal de Suppression */}
      <SuppLigneCommande 
        open={openDeleteModal} 
        handleClose={handleCloseDeleteModal} 
        ligneCommandeId={ligneCommandeId} 
        fetchLigneCommandes={fetchLigneCommandes} 
      />

      {/* Modal de Réclamation */}
      {selectedCommande && (
        <ReclamationCommande
          open={openReclamationModal}
          handleClose={handleCloseReclamationModal}
          clientId={localStorage.getItem('id_client')}
          commandeId={selectedCommande.id_commande}
          pieceId={selectedCommande.id_piece}
          fetchReclamations={fetchReclamations}
        />
      )}
    </TableContainer>
  );
};

export default LignecommandeList;
