import * as React from "react"; 
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Stack from "@mui/joy/Stack";
import axios from "axios";

export default function EditFournisseur({ open, handleClose, fournisseur, fetchFournisseurs }) {
  const [fournisseurData, setFournisseurData] = React.useState({
    nom: fournisseur?.nom || "",
    prenom: fournisseur?.prenom || "",
    email: fournisseur?.email || "",
    telephone: fournisseur?.telephone || "",
  });

  // Met à jour l'état lorsque la propriété fournisseur change
  React.useEffect(() => {
    if (fournisseur) {
      setFournisseurData({
        nom: fournisseur.nom,
        prenom: fournisseur.prenom,
        email: fournisseur.email,
        telephone: fournisseur.telephone,
      });
    }
  }, [fournisseur]);

  const handleAllInput = (e) => {
    const { name, value } = e.target;
    setFournisseurData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fournisseurData.nom || !fournisseurData.prenom || !fournisseurData.email || !fournisseurData.telephone) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    try {
      const response = await axios.patch(`http://localhost:8080/api/editfournisseurs/${fournisseur.id_fournisseur}`, fournisseurData);
      console.log('Fournisseur modifié:', response.data);
      fetchFournisseurs(); // Rafraîchir la liste des fournisseurs
      handleClose(); // Fermer le modal après la modification
    } catch (error) {
      console.error("Erreur lors de la modification du fournisseur:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog>
        <DialogTitle>Modifier le Fournisseur</DialogTitle>
        <DialogContent>Veuillez mettre à jour les informations du fournisseur</DialogContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} direction="column">
            <Stack direction="row" spacing={3}>
              <FormControl>
                <FormLabel>Nom</FormLabel>
                <Input
                  name="nom"
                  value={fournisseurData.nom}
                  required
                  placeholder="Nom"
                  sx={{ width: 250 }}
                  onChange={handleAllInput}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Prénom</FormLabel>
                <Input
                  name="prenom"
                  value={fournisseurData.prenom}
                  required
                  placeholder="Prénom"
                  sx={{ width: 250 }}
                  onChange={handleAllInput}
                />
              </FormControl>
            </Stack>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={fournisseurData.email}
                required
                placeholder="Email"
                sx={{ width: 250 }}
                onChange={handleAllInput}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Téléphone</FormLabel>
              <Input
                name="telephone"
                value={fournisseurData.telephone}
                required
                placeholder="Téléphone"
                sx={{ width: 250 }}
                onChange={handleAllInput}
              />
            </FormControl>
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              flex: 1,
              textAlign: "center",
              alignContent: "center",
              marginTop: "5%",
            }}
          >
            <Button type="submit">Modifier</Button>
            <Button variant="outlined" color="danger" onClick={handleClose}>
              Annuler
            </Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
}
