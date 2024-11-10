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
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import SearchIcon from "@mui/icons-material/Search"; // Ajouté pour le bouton de recherche
import SuppClient from "./SuppClient"; // Laissez cette importation si nécessaire

const columns = [
  { id: "id_client", label: "ID Client", minWidth: 90 },
  { id: "nom", label: "Nom Client", minWidth: 170 },
  { id: "prenom", label: "Prénom Client", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 170 },
  { id: "telephone", label: "Téléphone", minWidth: 170 },
  { id: "adresse", label: "Adresse", minWidth: 170 },
  { id: "actions", label: "Actions", minWidth: 100, align: "center" },
];

const ClientList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openSuppClient, setOpenSuppClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false); // Ajouté pour contrôler l'affichage de la barre de recherche

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/clients");
      const data = await response.json();
      if (Array.isArray(data)) {
        setClients(data);
      } else {
        console.error("Données invalides reçues:", data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des clients:", error);
    }
  };

  const handleOpenSuppClient = (client) => {
    setSelectedClient(client);
    setOpenSuppClient(true);
  };

  const handleCloseSuppClient = () => setOpenSuppClient(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredClients = clients.filter((client) =>
    client.nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper sx={{ height: "88vh", overflow: 'hidden', border: '1px solid #ccc', padding: 1, borderRadius: 1, boxShadow: 1 }}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
          <Typography variant="h3" component="div" textAlign="center">
            Liste des Clients
          </Typography>
        </Box>
        <Box sx={{ padding: "0 20px 20px 20px" }}>
          <Stack direction="row" spacing={2} alignItems="center">
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
                label="Recherche Clients"
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
              {filteredClients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((client) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={client.id_client}>
                    {columns.map((column) => {
                      if (column.id === "actions") {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <IconButton
                              onClick={() => handleOpenSuppClient(client)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        );
                      } else {
                        const value = client[column.id];
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
          count={filteredClients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      
      {/* SuppClient Modal */}
      <SuppClient
        open={openSuppClient}
        handleClose={handleCloseSuppClient}
        clientId={selectedClient?.id_client}
        fetchClients={fetchClients}
      />
    </Paper>
  );
};

export default ClientList;
