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
import Autocomplete from "@mui/material/Autocomplete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import AddCategorie from "./AddCategorie";
import EditCategorie from "./EditCategorie";
import SuppCategorie from "./SuppCategorie";

const columns = [
  { id: "id_categorie", label: "ID Catégorie", minWidth: 90 },
  { id: "nom", label: "Nom", minWidth: 170 },
  { id: "actions", label: "Actions", minWidth: 100, align: "center" },
];

const CategorieList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddCategorie, setOpenAddCategorie] = useState(false);
  const [openEditCategorie, setOpenEditCategorie] = useState(false);
  const [openSuppCategorie, setOpenSuppCategorie] = useState(false);
  const [selectedCategorie, setSelectedCategorie] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/categories");
      const data = await response.json();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.error("Données invalides reçues:", data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
    }
  };

  const handleOpenAddCategorie = () => setOpenAddCategorie(true);
  const handleCloseAddCategorie = () => setOpenAddCategorie(false);

  const handleOpenEditCategorie = (categorie) => {
    setSelectedCategorie(categorie);
    setOpenEditCategorie(true);
  };
  const handleCloseEditCategorie = () => setOpenEditCategorie(false);

  const handleOpenSuppCategorie = (categorie) => {
    setSelectedCategorie(categorie);
    setOpenSuppCategorie(true);
  };
  const handleCloseSuppCategorie = () => setOpenSuppCategorie(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredCategories = categories.filter((categorie) =>
    categorie.nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper sx={{ height: "88vh", overflow: 'hidden', border: '1px solid #ccc', padding: 1, borderRadius: 1, boxShadow: 1 }}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
          <Typography variant="h3" component="div">
            Liste des Catégories
          </Typography>
        </Box>
        <Box sx={{ padding: "0 20px 20px 20px" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Bouton Ajouter une Catégorie */}
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={handleOpenAddCategorie}
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
                label="Recherche Catégories"
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
              {filteredCategories
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((categorie) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={categorie.id}>
                    {columns.map((column) => {
                      if (column.id === "actions") {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <IconButton
                              onClick={() => handleOpenEditCategorie(categorie)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleOpenSuppCategorie(categorie)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        );
                      } else {
                        const value = categorie[column.id];
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
          count={filteredCategories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      {/* AddCategorie Modal */}
      <AddCategorie
        open={openAddCategorie}
        handleOpen={handleCloseAddCategorie}
        fetchCategories={fetchCategories}
      />
      {/* EditCategorie Modal */}
      <EditCategorie
        open={openEditCategorie}
        handleClose={handleCloseEditCategorie}
        categorie={selectedCategorie}
        fetchCategories={fetchCategories}
      />
      {/* SuppCategorie Modal */}
   {/* SuppCategorie Modal */}
<SuppCategorie 
  open={openSuppCategorie} 
  handleClose={handleCloseSuppCategorie} 
  categorieId={selectedCategorie?.id_categorie}  // Passer l'ID de la catégorie
  fetchCategories={fetchCategories} 
/>

    </Paper>
  );
};

export default CategorieList;
