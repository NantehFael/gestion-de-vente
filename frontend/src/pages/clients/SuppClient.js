import * as React from "react";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import axios from "axios";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import Divider from '@mui/material/Divider';

export default function SuppClient({ open, handleClose, clientId, fetchClients }) {
  const [notificationOpen, setNotificationOpen] = React.useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/suppclients/${clientId}`);
      fetchClients(); // Rafraîchir la liste des clients après suppression
      setNotificationOpen(true); // Afficher la notification
      handleClose(); // Fermer le modal
    } catch (error) {
      console.error("Erreur lors de la suppression du client:", error.response ? error.response.data : error.message);
    }
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  return (
    <React.Fragment>
      <Modal open={open} onClose={handleClose}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningRoundedIcon />
            Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>
            Êtes-vous sûr de vouloir supprimer ce client ?
          </DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={handleDelete}>
              Supprimer
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
        <Alert onClose={handleNotificationClose} severity="success" sx={{ width: '100%', backgroundColor: '#4caf50', color: '#fff' }}>
          Le client a été supprimé avec succès !
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
