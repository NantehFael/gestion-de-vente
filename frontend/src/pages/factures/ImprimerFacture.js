import React from 'react'; 
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ImprimerFacture = ({ facture, lignesFacture, client }) => {
  if (!facture || !client || !lignesFacture) {
    return <Typography variant="h6" color="error">Données de la facture manquantes ou incorrectes</Typography>;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0
    }).format(amount) + " Ar";
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Facture N°{facture.id_facture}
      </Typography>
      <Typography variant="body1">Date de facturation : {facture.date_facturation}</Typography>
      <Typography variant="body1">Nom du client : {client.nom}</Typography>
      <Typography variant="body1">Prénom du client : {client.prenom}</Typography>
      <Typography variant="body1">Email du client : {client.email}</Typography>
      <Typography variant="body1">Contact : {client.contact}</Typography>
      <Typography variant="body1">Adresse : {client.adresse}</Typography>

      <Box sx={{ marginTop: 2 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Désignation</TableCell>
                <TableCell>Quantité</TableCell>
                <TableCell>Prix Unitaire</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lignesFacture.map((ligne) => (
                <TableRow key={ligne.id_ligne_facture}>
                  <TableCell>{ligne.nom_piece}</TableCell>   
                  <TableCell>{ligne.qt_commande}</TableCell> {/* Utilisation de qt_commande ici */}
                  <TableCell>{formatCurrency(ligne.prix_unitaire)} Ar</TableCell>
                  <TableCell>{formatCurrency(ligne.total)} Ar</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>Total :</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{formatCurrency(facture.montant_total)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ImprimerFacture;
