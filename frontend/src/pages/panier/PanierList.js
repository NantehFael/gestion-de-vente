import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const PanierList = ({ order = [], pieces = [], onQuantityChange, onSubmitOrder, onClearOrder, loading, error }) => {
  const navigate = useNavigate();
  const id_client = localStorage.getItem('id_client'); // Récupération de l'ID du client dans le localStorage

  const handleValidateOrder = () => {
    if (!id_client) {
      // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
      navigate('/login');
    } else {
      // Sinon, valider la commande
      onSubmitOrder();
      handleMvolaPayment();
    }
  };

  const handleMvolaPayment = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/mvola/payment', {
        clientId: id_client,
        amount: order.reduce((total, item) => total + (item.quantity * (pieces.find(piece => piece.id_piece === item.id)?.prix_vente || 0)), 0),
      });
      
      if (response.status === 200) {
        alert(`Paiement par Mvola effectué avec succès ! Référence : ${response.data.transaction.reference_transaction}`);
      } else {
        alert('Le paiement a échoué, veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors du paiement par Mvola :', error);
      alert('Erreur lors du paiement, veuillez réessayer.');
    }
  };

  return (
    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2, textAlign: 'center' }}>
        Votre Panier
      </Typography>

      {loading ? (
        <Typography align="center">Chargement des lignes de commande...</Typography>
      ) : error ? (
        <Typography align="center" color="error">{error}</Typography>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#336791' }}>
                <TableCell sx={{ color: 'white' ,minWidth: 50}}>Pièce</TableCell>
                <TableCell sx={{ color: 'white' ,minWidth: 60}}>Image</TableCell>
                <TableCell sx={{ color: 'white' ,minWidth: 50}}>Prix</TableCell>
                <TableCell sx={{ color: 'white' ,minWidth: 50}}>Quantité</TableCell>
                <TableCell sx={{ color: 'white' ,minWidth: 50}}>Observation</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {order.map(item => (
                <TableRow key={item.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <img 
                      src={`http://localhost:8080/uploads/${pieces.find(piece => piece.id_piece === item.id)?.image}`} 
                      alt={item.name} 
                      style={{ width: '140px', height: 'auto' }} 
                    />
                  </TableCell>
                  <TableCell>
                    {pieces.find(piece => piece.id_piece === item.id)?.prix_vente} Ar
                  </TableCell>
                  <TableCell>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => onQuantityChange(item.id, parseInt(e.target.value))}
                      min="1"
                      style={{ width: '100px', textAlign: 'center' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary">
                      Quantité en stock : {pieces.find(piece => piece.id_piece === item.id)?.stock }
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
            <Button variant="contained" color="primary" onClick={handleValidateOrder} sx={{ marginRight: 2 }}>Valider</Button>
            <Button variant="contained" color="secondary" onClick={onClearOrder}>Vider</Button>
          </Box>
        </>
      )}
    </TableContainer>
  );
};

export default PanierList;
