import React, { useState } from "react";   
import { Box, Button, TextField, Typography, Link, Snackbar, Alert, InputAdornment } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../img/avatar.jpg"; // Assurez-vous que le chemin du logo est correct
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Icônes pour montrer/cacher le mot de passe

const containerStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f6f8fa",
};

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

const linkStyle = {
  display: "block",
  marginTop: "10px",
  textDecoration: "none",
  color: "#0366d6",
};

const Signup = () => {
  const [signup, setSignup] = useState({
    email: "",
    password: "",
    nom: "",
    prenom: "",
    adresse: "",
    telephone: "",
    confirme_password: "", // Ajouté pour la confirmation du mot de passe
  });
  
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // État pour afficher/cacher le mot de passe
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSignup((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword); // Inverse l'état pour afficher/cacher le mot de passe
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifiez que tous les champs sont remplis
    if (!signup.nom || !signup.prenom || !signup.email || !signup.password || !signup.adresse || !signup.telephone || !signup.confirme_password) {
      setAlert({ type: 'error', message: "Tous les champs sont requis." });
      return;
    }

    // Vérifiez que le mot de passe et la confirmation correspondent
    if (signup.password !== signup.confirme_password) {
      setAlert({ type: 'error', message: "Les mots de passe ne correspondent pas." });
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signup),
      });

      if (response.ok) {
        setAlert({ type: 'success', message: "Inscription réussie ! Vous pouvez maintenant vous connecter." });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const error = await response.json();
        setAlert({ type: 'error', message: error.message });
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      setAlert({ type: 'error', message: "Erreur lors de l'inscription." });
    }
  };

  return (
    <Box style={containerStyle}>
      <Box style={paperStyle}>
        <img src={logo} alt="Logo" style={{ width: 100, height: 'auto', marginBottom: '20px' }} />
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          S'inscrire
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            sx={{ marginBottom: "20px" }}
            fullWidth
            variant="outlined"
            label="Nom"
            name="nom"
            value={signup.nom}
            onChange={handleChange}
            required
          />
          <TextField
            sx={{ marginBottom: "20px" }}
            fullWidth
            variant="outlined"
            label="Prénom"
            name="prenom"
            value={signup.prenom}
            onChange={handleChange}
            required
          />
          <TextField
            sx={{ marginBottom: "20px" }}
            fullWidth
            variant="outlined"
            label="Email"
            name="email"
            type="email"
            value={signup.email}
            onChange={handleChange}
            required
          />
          <TextField
            sx={{ marginBottom: "20px" }}
            fullWidth
            variant="outlined"
            label="Mot de passe"
            name="password"
            type={showPassword ? "text" : "password"} // Affiche ou cache le mot de passe
            value={signup.password}
            onChange={handleChange}
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
            type={showPassword ? "text" : "password"} // Affiche ou cache le mot de passe
            value={signup.confirme_password}
            onChange={handleChange}
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
            value={signup.adresse}
            onChange={handleChange}
            required
          />
          <TextField
            sx={{ marginBottom: "20px" }}
            fullWidth
            variant="outlined"
            label="Téléphone"
            name="telephone"
            value={signup.telephone}
            onChange={handleChange}
            required
          />
          <Button variant="contained" style={buttonStyle} type="submit">
            S'inscrire
          </Button>
          <Link href="/login" style={linkStyle}>
            Déjà un compte ? Se connecter
          </Link>
        </form>
        {alert && (
          <Snackbar
            open={true}
            autoHideDuration={5000}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            onClose={() => setAlert(null)}
          >
            <Alert onClose={() => setAlert(null)} severity={alert.type} sx={{ width: '100%', backgroundColor: '#4caf50', color: '#fff' }}>
              {alert.message}
            </Alert>
          </Snackbar>
        )}
      </Box>
    </Box>
  );
};

export default Signup;
