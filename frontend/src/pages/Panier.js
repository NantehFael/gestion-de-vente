import React, { useEffect, useState } from 'react'; 
import Navbar1 from '../components/Navbar1';
import Box from '@mui/material/Box';
import PanierList from './panier/PanierList';
import '../Dash.css';

const Panier = () => {
  const [order, setOrder] = useState([]);
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const id_client = localStorage.getItem('id_client'); // Récupérer l'ID du client

  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem('order')) || [];
    setOrder(storedOrder);

    const fetchPieces = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/pieces");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des pièces");
        }
        const data = await response.json();
        setPieces(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPieces();
  }, []);

  const handleQuantityChange = (id, quantity) => {
    const updatedOrder = order.map(item => 
      (item.id === id ? { ...item, quantity: Math.max(quantity, 1) } : item)
    );
    setOrder(updatedOrder);
    localStorage.setItem('order', JSON.stringify(updatedOrder)); // Mettez à jour localStorage
  };

  const handleSubmitOrder = async () => {
    const lignes = order.map(item => ({
      qt_commande: item.quantity,
      id_piece: item.id
    }));

    const orderData = {
      date_commande: new Date().toISOString(),
      montant: order.reduce((total, item) => total + (item.quantity * pieces.find(piece => piece.id_piece === item.id)?.prix_vente || 0), 0),
      id_facture: null,
      id_client: id_client, // Inclure l'id_client ici
      lignes: lignes
    };

    // Log des données de la commande
    console.log("Données de commande :", orderData);

    try {
      const response = await fetch("http://localhost:8080/api/addcommandes", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Erreur lors de la soumission de la commande");
      }
      
      setOrder([]); // Réinitialiser la commande après soumission
      localStorage.removeItem('order'); // Supprimer l'ordre de localStorage
      alert("Commande soumise avec succès !");
    } catch (error) {
      console.error("Erreur lors de la soumission de la commande:", error);
      alert("Erreur lors de la soumission de la commande: " + error.message); // Alerter l'utilisateur en cas d'erreur
    }
  };

  const handleClearOrder = () => {
    setOrder([]); // Vider la commande
    localStorage.removeItem('order'); // Supprimer l'ordre de localStorage
  };

  return (
    <div className="bgcolor">
      <Navbar1 />
      <Box height={50} />
      <Box sx={{ display: 'flex' }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <PanierList 
            order={order}
            pieces={pieces}
            onQuantityChange={handleQuantityChange}
            onSubmitOrder={handleSubmitOrder}
            onClearOrder={handleClearOrder}
            loading={loading}
            error={error}
          />
        </Box>
      </Box>
    </div>
  );
};

export default Panier;
