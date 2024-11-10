import * as React from "react";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Divider from '@mui/material/Divider';

const ReclamationCommande = ({ open, handleClose, clientId, commandeId, pieceId, fetchReclamations }) => {
  const [message, setMessage] = React.useState("");
  const [notificationOpen, setNotificationOpen] = React.useState(false);

  const handleSubmit = async () => {
    console.log("Client ID:", clientId);
    console.log("Commande ID:", commandeId);
    console.log("Piece ID:", pieceId);
    console.log("Message:", message);

    if (!clientId || !commandeId || !pieceId || !message) {
      alert("Tous les champs sont requis.");
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/addreclamations', {
        id_client: clientId,
        id_commande: commandeId,
        id_piece: pieceId,
        message: message,
      });
      fetchReclamations(); // Rafraîchir les réclamations dans le Navbar
      setMessage("");
      handleClose(); // Fermer le modal avant de montrer la notification
      setNotificationOpen(true); // Afficher la notification après la fermeture du modal
    } catch (error) {
      console.error("Erreur lors de la soumission de la réclamation:", error.response ? error.response.data : error.message);
    }
  };

  const handleNotificationClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotificationOpen(false);
  };

  return (
    <React.Fragment>
      <Modal open={open} onClose={handleClose}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>Créer une réclamation</DialogTitle>
          <Divider />
          <DialogContent>
            <TextField
              label="Message de réclamation"
              placeholder="Décrivez votre problème ici"
              multiline
              rows={4}
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button variant="solid" color="primary" onClick={handleSubmit}>
              Envoyer
            </Button>
            <Button variant="plain" color="neutral" onClick={handleClose}>
              Annuler
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>

      {/* Notification Snackbar */}
      <Snackbar
        open={notificationOpen}
        autoHideDuration={5000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity="success"
          sx={{ width: '100%', backgroundColor: '#4caf50', color: '#fff' }}
          variant="filled"
        >
          Votre réclamation a été envoyée avec succès !
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default ReclamationCommande;
