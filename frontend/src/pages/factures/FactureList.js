import React, { useState, useEffect } from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, TextField, Button, Stack, Divider, IconButton, TablePagination, MenuItem, Select
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ImprimerFacture from "./ImprimerFacture";
import SuppFacture from "./SuppFacture";

const columns = [
  { id: "id_facture", label: "ID Facture", minWidth: 50 },
  { id: "nom_client", label: "Nom Client", minWidth: 160 },
  { id: "prenom_client", label: "Prénom Client", minWidth: 160 },
  { id: "date_facturation", label: "Date Facture", minWidth: 160 },
  { id: "montant", label: "Montant", minWidth: 160 },
  { id: "actions", label: "Actions", minWidth: 120, align: "center" },
];

const FactureList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedClient, setSelectedClient] = useState("");
  const [openEditFacture, setOpenEditFacture] = useState(false);
  const [openSuppFacture, setOpenSuppFacture] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [factures, setFactures] = useState([]);
  const [clients, setClients] = useState([]);
  
  // Récupération de l'ID client du localStorage
  const id_client = parseInt(localStorage.getItem("id_client"), 10);

  useEffect(() => {
    fetchFactures();
    fetchClients();
  }, [id_client, page, rowsPerPage]);

  const fetchFactures = async () => {
    if (isNaN(id_client) || id_client <= 0) {
      console.error("ID client est invalide ou absent. Assurez-vous qu'il est stocké dans le localStorage.");
      return;
    }

    const offset = page * rowsPerPage;
    const limit = rowsPerPage;

    try {
      const response = await fetch(`http://localhost:8080/api/factures/clients/${id_client}?limit=${limit}&offset=${offset}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setFactures(data);
      } else {
        console.error("Données de factures reçues invalides:", data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des factures:", error);
    }
  };

  // Récupération de la liste des clients pour la liste déroulante
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

  const handleOpenEditFacture = (facture) => {
    setSelectedFacture(facture);
    setOpenEditFacture(true);
  };
  const handleCloseEditFacture = () => setOpenEditFacture(false);

  const handleOpenSuppFacture = (facture) => {
    setSelectedFacture(facture);
    setOpenSuppFacture(true);
  };
  const handleCloseSuppFacture = () => setOpenSuppFacture(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Filtrage des factures par le nom du client sélectionné
  const filteredFactures = factures.filter((facture) =>
    selectedClient ? facture.nom_client === selectedClient : true
  );

  // Calcul du montant total des factures filtrées
  const totalMontant = filteredFactures.reduce((sum, facture) => sum + parseFloat(facture.montant), 0);

  return (
    <Paper sx={{ height: "87vh", overflow: 'hidden', border: '1px solid #ccc', padding: 1, borderRadius: 1, boxShadow: 1 }}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
          <Typography variant="h3" component="div">
            Liste des Factures
          </Typography>
        </Box>
        <Box sx={{ padding: "0 20px 20px 20px" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              displayEmpty
              sx={{ width: 200 }}
            >
              <MenuItem value="">Tous les clients</MenuItem>
              {clients.map((client) => (
                <MenuItem key={client.id_client} value={client.nom}>
                  {client.nom} {client.prenom}
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={() => setSelectedClient("")}
              sx={{ backgroundColor: '#FFA500', '&:hover': { backgroundColor: '#FFD700' } }}
            >
              Réinitialiser
            </Button>
          </Stack>
        </Box>
        <Divider />
        <TableContainer sx={{ maxHeight: "calc(100vh - 180px)" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFactures.map((facture) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={facture.id_facture}>
                  {columns.map((column) => {
                    if (column.id === "actions") {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <IconButton onClick={() => handleOpenEditFacture(facture)} color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleOpenSuppFacture(facture)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      );
                    } else {
                      const value = facture[column.id];
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
          count={filteredFactures.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Box sx={{ padding: "20px" }}>
          <Typography variant="h6" align="right">
            Montant total : {totalMontant.toFixed(2)} Ar
          </Typography>
        </Box>
      </Box>

      {/* Modals */}
      <ImprimerFacture open={openEditFacture} handleClose={handleCloseEditFacture} facture={selectedFacture} fetchFactures={fetchFactures} />
      <SuppFacture open={openSuppFacture} handleClose={handleCloseSuppFacture} factureId={selectedFacture?.id_facture} fetchFactures={fetchFactures} />
    </Paper>
  );
};

export default FactureList;
