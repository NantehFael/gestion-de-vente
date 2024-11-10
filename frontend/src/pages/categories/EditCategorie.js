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

export default function EditCategorie({ open, handleClose, categorie, fetchCategories }) {
  const [categorieData, setCategorieData] = React.useState({
    nom: categorie?.nom || "", 
  });

  React.useEffect(() => {
    if (categorie) {
      setCategorieData({
        nom: categorie.nom,
        
      });
    }
  }, [categorie]);

  const handleAllInput = (e) => {
    setCategorieData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categorieData.nom) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    try {
      const response = await axios.patch(`http://localhost:8080/api/editcategories/${categorie.id_categorie}`, categorieData);
      console.log('Catégorie modifiée:', response.data);
      fetchCategories(); // Rafraîchir la liste des catégories
      handleClose(); // Fermer le modal après la modification
    } catch (error) {
      console.error("Erreur lors de la modification de la catégorie:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog>
        <DialogTitle>Modifier la Catégorie</DialogTitle>
        <DialogContent>Veuillez mettre à jour les informations de la catégorie</DialogContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} direction="column">
            <FormControl>
              <FormLabel>Nom</FormLabel>
              <Input
                name="nom"
                value={categorieData.nom}
                required
                placeholder="Nom de la Catégorie"
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
