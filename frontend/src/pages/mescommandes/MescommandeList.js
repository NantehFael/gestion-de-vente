import React, { useEffect, useState } from "react";       
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress, Button, Snackbar, Alert } from "@mui/material";
import Suppcommande from './Suppcommande'; // Importer le composant de suppression

const MesCommandesList = () => {
  const [commandes, setCommandes] = useState([]); // État pour stocker les commandes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [commandeIdToDelete, setCommandeIdToDelete] = useState(null);

  useEffect(() => {
    fetchCommandes(); // Récupérer les commandes lors du montage du composant
  }, []);

  const fetchCommandes = async () => {
    setLoading(true); // Début du chargement
    try {
      const id_client = localStorage.getItem('id_client'); // Récupérer l'ID du client
      const response = await fetch(`http://localhost:8080/api/commandes/${id_client}`);

      if (!response.ok) {
        throw new Error("");
      }

      const data = await response.json();
      setCommandes(data); // Met à jour l'état avec les lignes de commande
    } catch (error) {
      setError(error.message); // Enregistre l'erreur
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  const handleOpenDeleteModal = (commandeId) => {
    setCommandeIdToDelete(commandeId); // Définir l'ID de la commande à supprimer
    setOpenDeleteModal(true); // Ouvrir le modal
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false); // Fermer le modal
    setCommandeIdToDelete(null); // Réinitialiser l'ID
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f5f5f5' }}>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2, textAlign: 'center' }}>
          Vos Commandes
        </Typography>

        {loading ? (
          <Typography align="center">Chargement des commandes...</Typography>
        ) : error ? (
          <Typography align="center" color="error">{error}</Typography>
        ) : (
          <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#336791' }}>
                <TableCell sx={{ color: 'white' }}>Date</TableCell>
                <TableCell sx={{ color: 'white' }}>Observation</TableCell>
                <TableCell sx={{ color: 'white' }}>Montant Total</TableCell>
                <TableCell sx={{ color: 'white' }}>Livraison</TableCell>
                <TableCell sx={{ color: 'white' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {commandes.map((commande) => (
                <TableRow key={commande.id_commande}>
                  <TableCell sx={{ padding: 2, borderBottom: '1px solid #e0e0e0' }}>{commande.date_commande}</TableCell>
                  <TableCell sx={{ padding: 2, borderBottom: '1px solid #e0e0e0' }}>
                    Total: {commande.total_commandes} | Validés: {commande.valides} | En Attente: {commande.en_attente} | Rejetés: {commande.rejetes}
                  </TableCell>
                  <TableCell sx={{ padding: 2, borderBottom: '1px solid #e0e0e0' }}>{commande.total_montant} Ar</TableCell>
                  <TableCell sx={{ padding: 2, borderBottom: '1px solid #e0e0e0' }}>
                    <LinearProgress variant="determinate" value={0} sx={{ height: 10, borderRadius: 5 }} />
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      sx={{ backgroundColor: '#f44336', color: 'white' }} 
                      onClick={() => handleOpenDeleteModal(commande.id_commande)} // Ouvre le modal de suppression
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Modal de Suppression */}
      <Suppcommande 
        open={openDeleteModal} 
        handleClose={handleCloseDeleteModal} 
        CommandeId={commandeIdToDelete} 
        fetchLigneCommandes={fetchCommandes} 
      />
    </Box>
  );
};

export default MesCommandesList;
