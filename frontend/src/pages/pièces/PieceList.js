import React, { useState, useEffect } from "react";   
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddPiece from "./AddPiece";
import EditPiece from "./EditPiece"; 
import SuppPiece from "./SuppPiece";
import SearchIcon from "@mui/icons-material/Search"; 

const columns = [
  { id: "id_piece", label: "ID Pièce", minWidth: 10 },
  { id: "reference", label: "Référence", minWidth: 90 },
  { id: "nom_piece", label: "Nom Pièce", minWidth: 90 },
  { id: "image", label: "Image", minWidth: 90 },
  { id: "stock", label: "QtStock", minWidth: 90 },
  { id: "type_article", label: "Type", minWidth: 90 },
  { id: "prix_unitaire", label: "Prix Unitaire", minWidth: 90 },
  { id: "prix_vente", label: "Prix Vente", minWidth: 90 },
  { id: "fournisseur", label: "Fournisseur", minWidth: 90 },
  { id: "categorie", label: "Catégorie", minWidth: 90 },
  { id: "actions", label: "Actions", minWidth: 50, align: "center" },
];

const PieceList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddPiece, setOpenAddPiece] = useState(false);
  const [openEditPiece, setOpenEditPiece] = useState(false);
  const [openSuppPiece, setOpenSuppPiece] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false); 
  const [categories, setCategories] = useState([]); 
  const [fournisseurs, setFournisseurs] = useState([]); 
  
  useEffect(() => {
    fetchPieces();
    fetchCategories(); 
    fetchFournisseur();
  }, []);

  const fetchPieces = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8080/api/pieces");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des pièces");
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setPieces(data);
      } else {
        throw new Error("Données invalides reçues");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/categories");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des catégories");
      }
      const data = await response.json();
      setCategories(data); 
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
    }
  };

  const fetchFournisseur = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/fournisseurs");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des fournisseurs");
      }
      const data = await response.json();
      setFournisseurs(data); 
    } catch (error) {
      console.error("Erreur lors de la récupération des fournisseurs:", error);
    }
  };

  const handleOpenAddPiece = () => setOpenAddPiece(true);
  const handleCloseAddPiece = () => setOpenAddPiece(false);

  const handleOpenEditPiece = (piece) => {
    setSelectedPiece(piece);
    setOpenEditPiece(true);
  };
  const handleCloseEditPiece = () => setOpenEditPiece(false);

  const handleOpenSuppPiece = (piece) => {
    setSelectedPiece(piece);
    setOpenSuppPiece(true);
  };
  const handleCloseSuppPiece = () => setOpenSuppPiece(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredPieces = pieces.filter((piece) =>
    piece.nom_piece.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper sx={{ height: "88vh", overflow: 'hidden', border: '1px solid #ccc', padding: 1, borderRadius: 1, boxShadow: 1 }}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
          <Typography variant="h3" component="div">
            <center>Liste des Pièces</center>
          </Typography>
        </Box>
        <Box sx={{ padding: "0 20px 20px 20px" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={handleOpenAddPiece}
              sx={{ backgroundColor: '#336791', '&:hover': { backgroundColor: '#274b75' } }}
            >
              Ajouter
            </Button>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={() => setShowSearchBar(!showSearchBar)}
              sx={{ backgroundColor: '#FFA500', '&:hover': { backgroundColor: '#FFD700' } }}
            >
              Filtrer
            </Button>
            {showSearchBar && (
              <TextField
                label="Nom Pièce"
                variant="outlined"
                size="small"
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ marginTop: 2, width: 300 }}
              />
            )}
          </Stack>
        </Box>
        <Divider />
        {loading ? (
          <Typography align="center" variant="h6">
            Chargement des pièces...
          </Typography>
        ) : error ? (
          <Typography align="center" variant="h6" color="error">
            {error}
          </Typography>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: "calc(100vh - 180px)", overflowY: 'auto' }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth, borderBottom: '1px solid #ccc' }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPieces
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((piece) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={piece.id_piece}>
                        {columns.map((column) => {
                          if (column.id === "actions") {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <IconButton
                                  onClick={() => handleOpenEditPiece(piece)}
                                  color="primary"
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleOpenSuppPiece(piece)}
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            );
                          } else if (column.id === "image") {
                            const imageUrl = `http://localhost:8080/uploads/${piece.image}`;
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <img 
                                  src={imageUrl} 
                                  alt={piece.nom_piece} 
                                  onError={(e) => { 
                                    e.target.onerror = null; 
                                    e.target.src = 'path/to/default-image.jpg'; // Chemin vers l'image par défaut
                                  }} 
                                  style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                                />
                              </TableCell>
                            );
                          } else if (column.id === "fournisseur") {
                            // Ici nous extrayons le nom et le prénom du fournisseur
                            const fournisseurName = `${piece.fournisseur_nom || "N/A"} ${piece.fournisseur_prenom || ""}`.trim();
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {fournisseurName}
                              </TableCell>
                            );
                          } else if (column.id === "categorie") {
                            const categorie = categories.find(c => c.id_categorie === piece.id_categorie);
                            const categorieName = categorie ? categorie.nom : "N/A";
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {categorieName}
                              </TableCell>
                            );
                          } else {
                            const value = piece[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {value}
                              </TableCell>
                            );
                          }
                        })}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={filteredPieces.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
        {/* Composant pour ajouter une nouvelle pièce */}
        <AddPiece open={openAddPiece} onOpen={handleCloseAddPiece} fetchPieces={fetchPieces} />
        {/* Composant pour modifier une pièce */}
        <EditPiece
          open={openEditPiece}
          onClose={handleCloseEditPiece}
          piece={selectedPiece}
          fetchPieces={fetchPieces}
        />
        {/* Composant pour supprimer une pièce */}
        <SuppPiece
          open={openSuppPiece}
          onClose={handleCloseSuppPiece}
          piece={selectedPiece}
          fetchPieces={fetchPieces}
        />
      </Box>
    </Paper>
  );
};

export default PieceList;
