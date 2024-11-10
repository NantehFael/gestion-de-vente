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

export default function AddFournisseur({ open, handleClose, fetchFournisseurs }) {
  const [fournisseurData, setFournisseurData] = React.useState({
    id_fournisseur: "",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
  });

  const handleAllInput = (e) => {
    const { name, value } = e.target;
    setFournisseurData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id_fournisseur, nom, prenom, email, telephone } = fournisseurData;

    // Validation of inputs
    if (!id_fournisseur || !nom || !prenom || !email || !telephone) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/addfournisseurs", fournisseurData);
      console.log('Fournisseur ajouté:', response.data);
      fetchFournisseurs(); // Refresh the supplier list
      handleClose(); // Close the modal
    } catch (error) {
      console.error("Erreur lors de l'ajout du fournisseur:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog>
        <DialogTitle>Ajouter un Fournisseur</DialogTitle>
        <DialogContent>Veuillez remplir tous les champs</DialogContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={3}>
              <FormControl>
                <FormLabel>ID Fournisseur</FormLabel>
                <Input
                  name="id_fournisseur"
                  required
                  placeholder="ID Fournisseur"
                  sx={{ width: 250 }}
                  onChange={handleAllInput}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Nom</FormLabel>
                <Input
                  name="nom"
                  required
                  placeholder="Nom"
                  sx={{ width: 250 }}
                  onChange={handleAllInput}
                />
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={3}>
              <FormControl>
                <FormLabel>Prénom</FormLabel>
                <Input
                  name="prenom"
                  required
                  placeholder="Prénom"
                  sx={{ width: 250 }}
                  onChange={handleAllInput}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                  sx={{ width: 250 }}
                  onChange={handleAllInput}
                />
              </FormControl>
            </Stack>
            <FormControl>
              <FormLabel>Téléphone</FormLabel>
              <Input
                name="telephone"
                required
                placeholder="Téléphone"
                sx={{ width: 250 }}
                onChange={handleAllInput}
              />
            </FormControl>
          </Stack>
          <Stack  direction="row"
              spacing={2}
              sx={{
                flex: 1,
                textAlign: "center",
                alignContent: "center",
                marginTop: "5%",
              }}
            >
             
            <Button type="submit">Ajouter</Button>
            <Button variant="outlined" color="danger" onClick={handleClose}>Annuler</Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
}
