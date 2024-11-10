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
import AddFournisseur from "./AddFournisseur";
import EditFournisseur from "./EditFournisseur";
import SuppFournisseur from "./SuppFournisseur";
import SearchIcon from "@mui/icons-material/Search";

const columns = [
  { id: "id_fournisseur", label: "ID Fournisseur", minWidth: 70 },
  { id: "nom", label: "Nom Fournisseur", minWidth: 150 },
  { id: "prenom", label: "Prénom Fournisseur", minWidth: 150 },
  { id: "email", label: "Email", minWidth: 150 },
  { id: "telephone", label: "Téléphone", minWidth: 150 },
  { id: "actions", label: "Actions", minWidth: 120, align: "center" },
];

const FournisseurList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddFournisseur, setOpenAddFournisseur] = useState(false);
  const [openEditFournisseur, setOpenEditFournisseur] = useState(false);
  const [openSuppFournisseur, setOpenSuppFournisseur] = useState(false);
  const [selectedFournisseur, setSelectedFournisseur] = useState(null);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const fetchFournisseurs = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/fournisseurs");
      const data = await response.json();
      if (Array.isArray(data)) {
        setFournisseurs(data);
      } else {
        console.error("Données invalides reçues:", data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des fournisseurs:", error);
    }
  };

  const handleOpenAddFournisseur = () => setOpenAddFournisseur(true);
  const handleCloseAddFournisseur = () => setOpenAddFournisseur(false);

  const handleOpenEditFournisseur = (fournisseur) => {
    setSelectedFournisseur(fournisseur);
    setOpenEditFournisseur(true);
  };
  const handleCloseEditFournisseur = () => setOpenEditFournisseur(false);

  const handleOpenSuppFournisseur = (fournisseur) => {
    setSelectedFournisseur(fournisseur);
    setOpenSuppFournisseur(true);
  };
  const handleCloseSuppFournisseur = () => setOpenSuppFournisseur(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredFournisseurs = fournisseurs.filter((fournisseur) =>
    fournisseur.nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper sx={{ height: "88vh", overflow: 'hidden', border: '1px solid #ccc', padding: 1, borderRadius: 1, boxShadow: 1 }}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
          <Typography variant="h3" component="div">
            Liste des Fournisseurs
          </Typography>
        </Box>
        <Box sx={{ padding: "0 20px 20px 20px" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Bouton Ajouter un Client */}
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={handleOpenAddFournisseur} // Corrigé pour ouvrir le modal d'ajout de client
              sx={{ backgroundColor: '#336791', '&:hover': { backgroundColor: '#274b75' } }}
            >
              Ajouter
            </Button>
            {/* Bouton Filtrer */}
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={() => setShowSearchBar(!showSearchBar)} // Affiche ou cache la barre de recherche
              sx={{ backgroundColor: '#FFA500', '&:hover': { backgroundColor: '#FFD700' } }}
            >
              Filter
            </Button>
            {/* Barre de recherche visible uniquement si showSearchBar est true */}
            {showSearchBar && (
              <TextField
                label="Recherche Fournisseurs"
                variant="outlined"
                size="small"
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ marginTop: 2, width: 300 }}
              />
            )}
          </Stack>
        </Box>
        <Divider />
        <TableContainer sx={{ maxHeight: "calc(100vh - 180px)" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFournisseurs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((fournisseur) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={fournisseur.id_fournisseur}>
                    {columns.map((column) => {
                      if (column.id === "actions") {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <IconButton
                              onClick={() => handleOpenEditFournisseur(fournisseur)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleOpenSuppFournisseur(fournisseur)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        );
                      } else {
                        const value = fournisseur[column.id];
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
          count={filteredFournisseurs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      {/* AddFournisseur Modal */}
      <AddFournisseur
        open={openAddFournisseur}
        handleClose={handleCloseAddFournisseur}
        fetchFournisseurs={fetchFournisseurs}
      />
      {/* EditFournisseur Modal */}
      <EditFournisseur
        open={openEditFournisseur}
        handleClose={handleCloseEditFournisseur}
        fournisseur={selectedFournisseur}
        fetchFournisseurs={fetchFournisseurs}
      />
      {/* SuppFournisseur Modal */}
      <SuppFournisseur
        open={openSuppFournisseur}
        handleClose={handleCloseSuppFournisseur}
        fournisseurId={selectedFournisseur?.id_fournisseur}
        fetchFournisseurs={fetchFournisseurs}
      />
    </Paper>
  );
};

export default FournisseurList;
