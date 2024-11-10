import React, { useState, useEffect } from 'react';       
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const CommandeList = () => {
  const [clients, setClients] = useState([]); // État pour les clients
  const [selectedClient, setSelectedClient] = useState(null); // Client sélectionné
  const [commandes, setCommandes] = useState([]); // Commandes du client sélectionné

  useEffect(() => {
    fetchClients(); // Charger la liste des clients au montage du composant
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/clients");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des clients");
      }
      const data = await response.json();

      // Filtrer les clients en fonction de l'état de leurs commandes
      const filteredClients = await Promise.all(data.map(async (client) => {
        const commandesResponse = await fetch(`http://localhost:8080/api/lignes_commande/${client.id_client}`);
        if (!commandesResponse.ok) {
          throw new Error("Erreur lors de la récupération des commandes");
        }
        const commandesData = await commandesResponse.json();

        // Vérifier si le client a au moins une commande en attente
        const hasPendingCommande = commandesData.some(commande => commande.etat === 'en attente');
        return hasPendingCommande ? client : null; // Conserver le client s'il a une commande en attente
      }));

      // Met à jour l'état avec les clients filtrés
      setClients(filteredClients.filter(client => client !== null));
    } catch (error) {
      console.error("Erreur lors de la récupération des clients:", error);
    }
  };

  const fetchCommandesByClient = async (id_client) => {
    try {
      const response = await fetch(`http://localhost:8080/api/lignes_commande/${id_client}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des commandes");
      }
      const data = await response.json();
      setCommandes(data); // Met à jour les commandes du client
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
    }
  };

  const handleClientClick = (client) => {
    setSelectedClient(client);
    fetchCommandesByClient(client.id_client); // Charger les commandes pour le client sélectionné
  };

  const handleValidate = async (ligneCommandeId) => {
    try {
      console.log("ID de ligne de commande à valider :", ligneCommandeId); // Debug
      const response = await fetch(`http://localhost:8080/api/lignes_commande/${ligneCommandeId}/valider`, {
        method: 'PUT',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la validation de la ligne de commande");
      }
      // Rafraîchir les commandes après validation
      fetchCommandesByClient(selectedClient.id_client);
      alert('Ligne de commande validée avec succès !');
      fetchClients(); // Mettre à jour la liste des clients après la validation
    } catch (error) {
      console.error("Erreur lors de la validation de la ligne de commande:", error);
      alert(error.message); // Affichez le message d'erreur
    }
  };

  const handleReject = async (ligneCommandeId) => {
    try {
      console.log("ID de ligne de commande à rejeter :", ligneCommandeId); // Debug
      const response = await fetch(`http://localhost:8080/api/lignes_commande/${ligneCommandeId}/rejeter`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error("Erreur lors du rejet de la ligne de commande");
      }
      // Rafraîchir les commandes après rejet
      fetchCommandesByClient(selectedClient.id_client);
      alert('Ligne de commande rejetée avec succès !');
      fetchClients(); // Mettre à jour la liste des clients après le rejet
    } catch (error) {
      console.error("Erreur lors du rejet de la ligne de commande:", error);
      alert(error.message); // Affichez le message d'erreur
    }
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f5f5f5' }}>
      {/* Affichage des clients */}
      {!selectedClient ? (
        <TableContainer component={Paper}>
          <Typography variant="h4" gutterBottom textAlign="center">
            Les commandes d'achat
          </Typography>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#336791' }}>
                <TableCell sx={{ color: 'white', minWidth: 60 }}>Nom</TableCell>
                <TableCell sx={{ color: 'white', minWidth: 60 }}>Prénom</TableCell>
                <TableCell sx={{ color: 'white', minWidth: 60 }}>Email</TableCell>
                <TableCell sx={{ color: 'white', minWidth: 60 }}>Adresse</TableCell>
                <TableCell sx={{ color: 'white', minWidth: 60 }}>Téléphone</TableCell>
                <TableCell sx={{ color: 'white', minWidth: 60 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id_client}>
                  <TableCell>{client.nom}</TableCell>
                  <TableCell>{client.prenom}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.adresse}</TableCell>
                  <TableCell>{client.telephone}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleClientClick(client)}>
                      <ArrowForwardIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box>
          <TableContainer component={Paper}>
            <Typography variant="h4" sx={{ marginBottom: 2, textAlign: 'center' }}>
              Commandes de {selectedClient.prenom}
            </Typography>
            
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID Article</TableCell>
                  <TableCell>Articles</TableCell>
                  <TableCell>État</TableCell>
                  <TableCell>Quantité Demandée</TableCell>
                  <TableCell>Quantité en Stock</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {commandes.map((commande) => (
                  <TableRow key={commande.id_ligne_commande}>
                    <TableCell>{commande.id_piece}</TableCell>
                    <TableCell>{commande.nom_piece}</TableCell>
                    <TableCell sx={{ color: commande.etat === 'validée' ? 'green' : commande.etat === 'rejettée' ? 'red' : 'black' }}>
                      {commande.etat}
                    </TableCell>
                    <TableCell>{commande.qt_commande}</TableCell>
                    <TableCell>{commande.stock}</TableCell>
                    <TableCell>
                      {commande.etat === 'validée' || commande.etat === 'rejettée' ? (
                        <Typography variant="body2" color="text.secondary">Déjà traité</Typography>
                      ) : (
                        <div>
                          <Button variant="contained" color="success" onClick={() => handleValidate(commande.id_ligne_commande)}>Valider</Button>
                          <Button variant="contained" color="error" onClick={() => handleReject(commande.id_ligne_commande)}>Rejeter</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <center>
              <Button variant="contained" onClick={() => setSelectedClient(null)} sx={{ marginBottom: 2 }}>
                Fermer
              </Button>
            </center>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default CommandeList;
