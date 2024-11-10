import React, { useState } from "react";       
import { Box, Button, FormControl, InputLabel, InputAdornment, Input, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import logo from "../img/avatar.jpg"; 
import Snackbar from "@mui/material/Snackbar"; // Importer Snackbar
import Alert from "@mui/material/Alert"; // Importer Alert

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

const inputStyle = {
  marginBottom: "20px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#4CAF50",
  color: "#ffffff",
  marginTop: "20px",
  borderRadius: "4px",
  "&:hover": {
    backgroundColor: "#45a049",
  },
};

const linkStyle = {
  display: "block",
  marginTop: "10px",
  textDecoration: "none",
  color: "#0366d6",
};

const logoStyle = {
  marginBottom: "20px",
};

const registerBoxStyle = {
  border: "1px solid #c0c0c0",
  borderRadius: "4px",
  padding: "10px",
  marginTop: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

export default function Login() {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); // État pour gérer l'erreur
  const [notificationOpen, setNotificationOpen] = useState(false); // État pour le Snackbar
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLogin((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Réinitialiser l'erreur

    // Vérification des informations de connexion administratives
    if (login.email === "admin@gmail.com" && login.password === "admin23") {
      navigate("/admin");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("id_client", data.id_client); // Stocker l'ID client
        navigate("/home");
      } else {
        const errorData = await response.json();
         // Gérer l'erreur ici
        setNotificationOpen(true); // Ouvrir le Snackbar pour afficher l'erreur
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      setError("Erreur lors de la connexion");
      setNotificationOpen(true); // Ouvrir le Snackbar pour afficher l'erreur
    }
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false); // Fermer le Snackbar
  };

  return (
    <Box style={containerStyle}>
      <Box style={paperStyle}>
        <div style={logoStyle}>
          <img src={logo} alt="Logo" style={{ width: 100, height: 'auto' }} />
        </div>
        <Typography variant="h5" component="h1" gutterBottom style={{ marginBottom: "20px" }}>
          Connectez-vous s'il vous plaît
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <FormControl sx={inputStyle} variant="outlined" fullWidth>
            <Typography>Email</Typography>
            <Input
              required
              placeholder="Entrez votre adresse email"
              name="email"
              onChange={handleChange}
              startAdornment={
                <InputAdornment position="start">
                  <Email color="primary" />
                </InputAdornment>
              }
              style={{ borderRadius: "4px", height: "45px" }}
            />
          </FormControl>
          <FormControl sx={inputStyle} variant="outlined" fullWidth>
            <Typography>Mot de passe</Typography>
            <Input
              required
              type={showPassword ? "text" : "password"}
              placeholder="Entrez votre mot de passe"
              name="password"
              onChange={handleChange}
              startAdornment={
                <InputAdornment position="start">
                  <Lock color="primary" />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <Button onClick={handleClickShowPassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                </InputAdornment>
              }
              style={{ borderRadius: "4px", height: "45px" }}
            />
          </FormControl>
          <Button variant="contained" style={buttonStyle} type="submit">
            Se connecter
          </Button>
          <Link href="#" style={linkStyle}>
            Mot de passe oublié ?
          </Link>
          <Box style={registerBoxStyle}>
            Vous n'avez pas de compte ? 
            <Link href="/signup" style={{ ...linkStyle, marginTop: "5px" }}>
              S'inscrire
            </Link>
          </Box>
        </form>
      </Box>

      {/* Notification Snackbar d'erreur */}
      <Snackbar
        open={notificationOpen}
        autoHideDuration={5000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleNotificationClose} severity="error" sx={{ width: '100%' }}>
          {error || "Identifiants incorrects."} {/* Afficher l'erreur ici */}
        </Alert>
      </Snackbar>
    </Box>
  );
}
