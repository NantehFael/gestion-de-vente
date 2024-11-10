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

export default function EditPiece({ open, handleClose, piece, fetchPieces }) {
  const [categoriesData, setCategoriesData] = React.useState([]);
  const [fournisseursData, setFournisseursData] = React.useState([]);
  const [error, setError] = React.useState(null);

  const [pieceData, setPieceData] = React.useState({
    id_piece: piece?.id_piece || "",
    reference: piece?.reference || "",
    nom_piece: piece?.nom_piece || "",
    description: piece?.description || "",
    stock: piece?.stock || "",
    type_article: piece?.type_article || "",
    prix_unitaire: piece?.prix_unitaire || "",
    prix_vente: piece?.prix_vente || "",
    id_fournisseur: piece?.id_fournisseur || "",
    id_categorie: piece?.id_categorie || "",
  });

  // Charger les catégories et fournisseurs
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
    if (piece) {
      setPieceData({
        id_piece: piece.id_piece,
        reference: piece.reference,
        nom_piece: piece.nom_piece,
        description: piece.description,
        stock: piece.stock,
        type_article: piece.type_article,
        prix_unitaire: piece.prix_unitaire,
        prix_vente: piece.prix_vente,
        id_fournisseur: piece.id_fournisseur,
        id_categorie: piece.id_categorie,
      });
    }
  }, [piece]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPieceData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`http://localhost:8080/api/editpieces/${piece.id_piece}`, pieceData);
      console.log("Réponse du serveur:", response.data);
      fetchPieces(); 
      handleClose(); 
      setError(null); 
    } catch (error) {
      console.error("Erreur lors de la modification de la pièce:", error.response ? error.response.data : error.message);
      setError("Erreur lors de la modification de la pièce."); 
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog>
        <DialogTitle>Modifier une Pièce</DialogTitle>
        <DialogContent>Veuillez remplir tous les champs</DialogContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} direction="column">
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <Stack direction="row" spacing={3}>
              <FormControl>
                <FormLabel>ID de la pièce</FormLabel>
                <Input
                  name="id_piece"
                  value={pieceData.id_piece}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel>Référence</FormLabel>
                <Input
                  name="reference"
                  value={pieceData.reference}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Nom de la pièce</FormLabel>
                <Input
                  name="nom_piece"
                  value={pieceData.nom_piece}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  name="description"
                  value={pieceData.description}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={3}>
              <FormControl>
                <FormLabel>Stock</FormLabel>
                <Input
                  type="number"
                  name="stock"
                  value={pieceData.stock}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Type d'article</FormLabel>
                <Input
                  name="type_article"
                  value={pieceData.type_article}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Prix unitaire</FormLabel>
                <Input
                  type="number"
                  name="prix_unitaire"
                  value={pieceData.prix_unitaire}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Prix de vente</FormLabel>
                <Input
                  type="number"
                  name="prix_vente"
                  value={pieceData.prix_vente}
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
                />
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ marginTop: "5%" }}>
              <Button type="submit">Modifier</Button>
              <Button variant="outlined" color="danger" onClick={handleClose}>Annuler</Button>
            </Stack>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
}
