import React, { useState, useEffect } from "react"; 
import { Box, Button, TextField, Typography, Snackbar, Alert, InputAdornment } from "@mui/material";
import Navbar1 from '../components/Navbar1'; // Assurez-vous que le chemin est correct
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Icônes pour montrer/cacher le mot de passe
import axios from 'axios'; // Assurez-vous d'avoir importé axios

const paperStyle = {
  padding: "40px",
  width: "360px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
  textAlign: "center",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#2ea44f",
  color: "#ffffff",
  marginTop: "20px",
};

const MonCompte = ({ client }) => {
  const [clientData, setClientData] = useState({
    nom: client?.nom || "",
    prenom: client?.prenom || "",
    email: client?.email || "",
    telephone: client?.telephone || "",
    adresse: client?.adresse || "",
    password: "",
    confirme_password: "",
  });

  const [clients, setClients] = useState([]); // Etat pour stocker la liste des clients
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // État pour afficher/cacher le mot de passe
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les données du client si disponible
    if (client && client.id_client) {
      setClientData({
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        telephone: client.telephone,
        adresse: client.adresse,
        password: "",
        confirme_password: "",
      });
      setLoading(false); // Arrêter le chargement une fois les données prêtes
    }
    // Appeler fetchClients pour récupérer la liste des clients
    fetchClients();
  }, [client]);

  const fetchClients = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/clients");
      const data = await response.json();
      if (Array.isArray(data)) {
        setClients(data);
      } else {
        console.error("Données invalides reçues:", data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des clients:", error);
    }
  };

  const handleAllInput = (e) => {
    setClientData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword); // Inverse l'état pour afficher/cacher le mot de passe
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifiez que l'ID du client est valide avant de faire la requête
    if (!client?.id_client || isNaN(client.id_client)) {
      setAlert({ type: 'error', message: "Erreur : L'ID du client est invalide." });
      return;
    }

    if (!clientData.nom || !clientData.prenom || !clientData.email || !clientData.telephone || !clientData.adresse || !clientData.password || !clientData.confirme_password) {
      setAlert({ type: 'error', message: "Veuillez remplir tous les champs." });
      return;
    }

    if (clientData.password !== clientData.confirme_password) {
      setAlert({ type: 'error', message: "Les mots de passe ne correspondent pas." });
      return;
    }

    try {
      const response = await axios.patch(`http://localhost:8080/api/editclients/${client.id_client}`, clientData);
      console.log('Client modifié:', response.data);
      setAlert({ type: 'success', message: "Modification réussie !" });
      fetchClients(); // Rafraîchir la liste des clients après la modification
    } catch (error) {
      console.error("Erreur lors de la modification du client:", error.response ? error.response.data : error.message);
      setAlert({ type: 'error', message: "Erreur lors de la modification du client." });
    }
  };

  return (
    <>
      <Navbar1 />
      <Box sx={{ marginTop: 10 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box style={paperStyle}>
            <Typography variant="h5" component="h1" align="center" gutterBottom>
              Votre Compte
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                sx={{ marginBottom: "20px" }}
                fullWidth
                variant="outlined"
                label="Nom"
                name="nom"
                value={clientData.nom}
                onChange={handleAllInput}
                required
              />
              <TextField
                sx={{ marginBottom: "20px" }}
                fullWidth
                variant="outlined"
                label="Prénom"
                name="prenom"
                value={clientData.prenom}
                onChange={handleAllInput}
                required
              />
              <TextField
                sx={{ marginBottom: "20px" }}
                fullWidth
                variant="outlined"
                label="Email"
                name="email"
                type="email"
                value={clientData.email}
                onChange={handleAllInput}
                required
              />
              <TextField
                sx={{ marginBottom: "20px" }}
                fullWidth
                variant="outlined"
                label="Mot de passe"
                name="password"
                type={showPassword ? "text" : "password"}
                value={clientData.password}
                onChange={handleAllInput}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button onClick={handleClickShowPassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                sx={{ marginBottom: "20px" }}
                fullWidth
                variant="outlined"
                label="Confirmer votre Mot de passe"
                name="confirme_password"
                type={showPassword ? "text" : "password"}
                value={clientData.confirme_password}
                onChange={handleAllInput}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button onClick={handleClickShowPassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                sx={{ marginBottom: "20px" }}
                fullWidth
                variant="outlined"
                label="Adresse"
                name="adresse"
                value={clientData.adresse}
                onChange={handleAllInput}
                required
              />
              <TextField
                sx={{ marginBottom: "20px" }}
                fullWidth
                variant="outlined"
                label="Téléphone"
                name="telephone"
                value={clientData.telephone}
                onChange={handleAllInput}
                required
              />
              <Button variant="contained" style={buttonStyle} type="submit">
                Modifier mon compte
              </Button>
            </form>
            {alert && (
              <Snackbar
                open={true}
                autoHideDuration={5000}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                onClose={() => setAlert(null)}
              >
                <Alert onClose={() => setAlert(null)} severity={alert.type} sx={{ width: '100%', backgroundColor: alert.type === 'success' ? '#4caf50' : '#f44336', color: '#fff' }}>
                  {alert.message}
                </Alert>
              </Snackbar>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MonCompte;
