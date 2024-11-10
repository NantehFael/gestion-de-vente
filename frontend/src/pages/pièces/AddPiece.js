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
import Autocomplete from "@mui/joy/Autocomplete";
import axios from "axios";

export default function AddPiece({ open, handleOpen, fetchPieces }) {
  const [pieceData, setPieceData] = React.useState({
    id_piece: "",
    reference: "",
    nom_piece: "",
    description: "",
    image: null,
    stock: "",
    type_article: "",
    prix_unitaire: "",
    prix_vente: "",
    id_fournisseur: "",
    id_categorie: "",
  });

  const [categoriesData, setCategoriesData] = React.useState([]);
  const [fournisseursData, setFournisseursData] = React.useState([]);
  const [error, setError] = React.useState(null);

  // Fonction pour récupérer les données des catégories et fournisseurs
  const fetchData = async () => {
    try {
      const [categoriesResponse, fournisseursResponse] = await Promise.all([
        axios.get("http://localhost:8080/api/categories"),
        axios.get("http://localhost:8080/api/fournisseurs"),
      ]);
      setCategoriesData(categoriesResponse.data || []);
      setFournisseursData(fournisseursResponse.data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPieceData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setPieceData((prevState) => ({
      ...prevState,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    const requiredFields = Object.keys(pieceData);
    for (const field of requiredFields) {
      if (!pieceData[field]) {
        setError(`Le champ ${field.replace('_', ' ')} est requis.`);
        return; 
      }
      formData.append(field, pieceData[field]);
    }

    try {
      const response = await axios.post("http://localhost:8080/api/addpieces", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Réponse du serveur:", response.data); 
      fetchPieces(); 
      handleOpen(); // Ferme le modal après l'ajout
      setError(null); 
    } catch (error) {
      console.error("Erreur lors de l'ajout de la pièce:", error.response ? error.response.data : error.message);
      setError("Erreur lors de l'ajout de la pièce."); 
    }
  };

  return (
    <Modal open={open} onClose={handleOpen}>
      <ModalDialog>
        <DialogTitle>Ajout d'une Pièce</DialogTitle>
        <DialogContent>Veuillez remplir tous les champs</DialogContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} direction="column">
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <Stack direction="row" spacing={3}>
              <FormControl>
                <FormLabel>ID de la pièce</FormLabel>
                <Input
                  name="id_piece"
                  required
                  placeholder="ID de la pièce"
                  sx={{ width: 250 }}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Référence</FormLabel>
                <Input
                  name="reference"
                  required
                  placeholder="Référence"
                  sx={{ width: 250 }}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Nom de la pièce</FormLabel>
                <Input
                  name="nom_piece"
                  required
                  placeholder="Nom de la pièce"
                  sx={{ width: 250 }}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  name="description"
                  required
                  placeholder="Description"
                  sx={{ width: 250 }}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={3}>
              <FormControl>
                <FormLabel>Image</FormLabel>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  required
                  onChange={handleFileChange}
                  style={{ width: 250 }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Stock</FormLabel>
                <Input
                  type="number"
                  name="stock"
                  required
                  placeholder="Stock"
                  sx={{ width: 250 }}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={3}>
              <FormControl>
                <FormLabel>Type d'article</FormLabel>
                <Input
                  name="type_article"
                  required
                  placeholder="Type d'article"
                  sx={{ width: 250 }}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Prix unitaire</FormLabel>
                <Input
                  type="number"
                  name="prix_unitaire"
                  required
                  placeholder="Prix unitaire"
                  sx={{ width: 250 }}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Prix de vente</FormLabel>
                <Input
                  type="number"
                  name="prix_vente"
                  required
                  placeholder="Prix de vente"
                  sx={{ width: 250 }}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={3}>
              <FormControl>
                <FormLabel>Fournisseur</FormLabel>
                <Autocomplete
                  options={fournisseursData}
                  getOptionLabel={(option) => `${option.nom} ${option.prenom}`}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id_fournisseur}>
                      {option.nom} {option.prenom}
                    </li>
                  )}
                  onChange={(event, newValue) => {
                    setPieceData((prevState) => ({
                      ...prevState,
                      id_fournisseur: newValue ? newValue.id_fournisseur : null,
                    }));
                  }}
                  sx={{ width: 250 }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Catégorie</FormLabel>
                <Autocomplete
                  options={categoriesData}
                  getOptionLabel={(option) => option.nom}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id_categorie}>
                      {option.nom}
                    </li>
                  )}
                  onChange={(event, newValue) => {
                    setPieceData((prevState) => ({
                      ...prevState,
                      id_categorie: newValue ? newValue.id_categorie : null,
                    }));
                  }}
                  sx={{ width: 250 }}
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
              <Button type="submit">Ajouter</Button>
              <Button variant="outlined" color="danger" onClick={handleOpen}>
                Annuler
              </Button>
            </Stack>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
}
