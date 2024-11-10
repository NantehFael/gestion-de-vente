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

const Suppcommande = ({ open, handleClose, CommandeId, fetchLigneCommandes }) => {
  const [notificationOpen, setNotificationOpen] = React.useState(false);
  const [errorOpen, setErrorOpen] = React.useState(false); // État pour gérer l'affichage des erreurs

  const handleDelete = async () => {
    console.log("CommandeId à supprimer:", CommandeId); // Log pour débogage
    try {
      await axios.delete(`http://localhost:8080/api/commandes/${CommandeId}`);
      fetchLigneCommandes(); // Rafraîchir la liste des lignes de commande après suppression
      setNotificationOpen(true); // Afficher la notification de succès
      handleClose(); // Fermer le modal
    } catch (error) {
      console.error("Erreur lors de la suppression de commande:", error.response ? error.response.data : error.message);
      setErrorOpen(true); // Afficher la notification d'erreur
    }
  };
  
  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  const handleErrorClose = () => {
    setErrorOpen(false);
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
            Êtes-vous sûr de vouloir supprimer cette commande ?
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

      {/* Notification Snackbar de succès */}
      <Snackbar
        open={notificationOpen}
        autoHideDuration={5000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleNotificationClose} severity="success" sx={{ width: '100%', backgroundColor: '#4caf50', color: '#fff' }}>
          La commande a été supprimée avec succès !
        </Alert>
      </Snackbar>

      {/* Notification Snackbar d'erreur */}
      <Snackbar
        open={errorOpen}
        autoHideDuration={5000}
        onClose={handleErrorClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
          Une erreur est survenue lors de la suppression de la commande.
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default Suppcommande;
