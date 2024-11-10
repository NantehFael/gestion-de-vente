import React, { useState, useEffect } from 'react';           
import { Box, Button, Typography, Grid, Card, CardContent, CardMedia, MenuItem, Select } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; 
import Footer from '../../components/Footer'; 
import Navbar1 from '../../components/Navbar1'; // Importez le composant Navbar1

const CommandesList = () => {
  const id_client = localStorage.getItem('id_client') || ''; // Récupérer l'ID du client
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pieces, setPieces] = useState([]);
  const [filteredPieces, setFilteredPieces] = useState([]);
  const [order, setOrder] = useState([]); // État pour les produits commandés
  const [client, setClient] = useState({}); // État pour les informations du client

  useEffect(() => {
    fetchCategories();
    fetchAllPieces();
    fetchClientInfo(id_client); // Récupérer les informations du client

    // Charger l'état du panier à partir de localStorage
    const storedOrder = JSON.parse(localStorage.getItem('order')) || [];
    setOrder(storedOrder);
  }, [id_client]); // Ajout de id_client comme dépendance

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/categories");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des catégories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
    }
  };

  const fetchAllPieces = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/pieces");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des pièces");
      }
      const data = await response.json();
      setPieces(data);
      setFilteredPieces(data); // Afficher toutes les pièces initialement
    } catch (error) {
      console.error("Erreur lors de la récupération des pièces:", error);
    }
  };

  const fetchClientInfo = async (clientId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/client/${clientId}`); // Assurez-vous que cette API existe
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des informations du client");
      }
      const data = await response.json();
      setClient(data); // En supposant que `data` contient les informations du client
    } catch (error) {
      console.error("Erreur lors de la récupération des informations du client:", error);
    }
  };

  const fetchPiecesByCategory = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/pieces?categoryId=${categoryId}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des pièces détachées");
      }
      const data = await response.json();
      setFilteredPieces(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des pièces:", error);
    }
  };

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    if (categoryId) {
      fetchPiecesByCategory(categoryId);
    } else {
      setFilteredPieces(pieces); // Réinitialiser pour afficher toutes les pièces
    }
  };

  const handleAddToOrder = (piece) => {
    const existingProduct = order.find(item => item.id === piece.id_piece);
    if (existingProduct) {
      existingProduct.quantity += 1; // Augmenter la quantité
    } else {
      setOrder(prevOrder => {
        const newOrder = [...prevOrder, { id: piece.id_piece, name: piece.nom_piece, quantity: 1 }];
        localStorage.setItem('order', JSON.stringify(newOrder)); // Mettez à jour localStorage
        return newOrder;
      });
    }
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f5f5f5' }}>
      <Navbar1 order={order} /> {/* Passez l'état de commande ici */}

      <Typography variant="h4" gutterBottom textAlign="center">
        Bonjour {client.prenom}!
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          displayEmpty
          sx={{ width: '40%', borderRadius: 2 }}
        >
          <MenuItem value="">
            <em>Recherchez une catégorie</em>
          </MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id_categorie} value={category.id_categorie}>
              {category.nom}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={0.5}>
          {filteredPieces.map((piece) => (
            <Grid key={piece.id_piece} item xs={20} sm={10} md={4} lg={2}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardMedia
                  component="img"
                  alt={piece.nom_piece}
                  height="90"
                  image={`http://localhost:8080/uploads/${piece.image}`}
                  sx={{ objectFit: 'contain' }}
                />
                <CardContent>
                  <center><Typography variant="h6">{piece.nom_piece}</Typography></center>
                  <Typography variant="body2">{piece.description}</Typography>
                  <center><Typography variant="body2">Prix : {piece.prix_vente} Ar</Typography></center>
                  <center><Typography variant="body2">Quantité de Stock : {piece.stock}</Typography></center>
                  <center>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<ShoppingCartIcon />} 
                      onClick={() => handleAddToOrder(piece)}
                      sx={{ marginTop: 2 }}
                    >
                      Ajouter au panier
                    </Button>
                  </center>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Footer />
    </Box>
  );
};

export default CommandesList;
