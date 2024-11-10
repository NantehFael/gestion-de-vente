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

export default function AddCategorie({ open, handleOpen, fetchCategories }) {
  const [categorieData, setCategorieData] = React.useState({
    id: "",
    nom: "",
  });

  const handleAllInput = (e) => {
    setCategorieData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categorieData.id || !categorieData.nom ) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8080/api/addcategories", categorieData);
      console.log('Catégorie ajoutée:', response.data);
      fetchCategories(); // Rafraîchir la liste des catégories
      handleOpen(); // Fermer le modal
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <React.Fragment>
      <Modal open={open} onClose={handleOpen}>
        <ModalDialog>
          <DialogTitle>Ajouter une Catégorie</DialogTitle>
          <DialogContent>Veuillez remplir tous les champs</DialogContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2} direction="column">
              <Stack direction="row" spacing={3}>
                <FormControl>
                  <FormLabel>ID Catégorie</FormLabel>
                  <Input
                    name="id"
                    required
                    placeholder="ID Catégorie"
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
              <Button type="submit">
                Ajouter</Button>
              <Button variant="outlined" color="danger" onClick={handleOpen}>
                Annuler
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
