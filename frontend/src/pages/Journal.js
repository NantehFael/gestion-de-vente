import React, { useState, useEffect } from "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TextField, Button, Stack, Divider } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidenav from "../components/Sidenav";

const Journal = () => {
    const [categories, setCategories] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [journalEntries, setJournalEntries] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/categories");
            if (!response.ok) throw new Error("Échec de la récupération des catégories");
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des catégories :", error);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/journal?category=${selectedCategory}&startDate=${startDate}&endDate=${endDate}`
            );
            if (!response.ok) throw new Error("Échec de la récupération des entrées du journal");
            const data = await response.json();
            setJournalEntries(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des entrées du journal :", error);
        }
    };

    return (
        <div className="bgcolor">
            <Navbar />
            <Box height={75} />
            <Box sx={{ display: 'flex' }}>
                <Sidenav />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Paper sx={{ height: "88vh", overflow: 'hidden', border: '1px solid #ccc', padding: 4, borderRadius: 2, boxShadow: 4 }}>
                        <Typography variant="h4" sx={{ marginBottom: 2, textAlign: 'center' }}>
                            Journal du Stock
                        </Typography>
                        <Divider sx={{ marginBottom: 2 }} />
                        <Box sx={{ display: "flex", flexDirection: "column", marginBottom: 2 }}>
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    select
                                    label="Catégorie"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    variant="outlined"
                                >
                                    <option value="" />
                                    {categories.map((category) => (
                                        <option key={category.id_categorie} value={category.nom}>
                                            {category.nom}
                                        </option>
                                    ))}
                                </TextField>
                                <TextField
                                    label="Date Début"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <TextField
                                    label="Date Fin"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <Button variant="contained" onClick={handleSearch}>
                                    Rechercher
                                </Button>
                            </Stack>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID Facture</TableCell>
                                        <TableCell>Nom Client</TableCell>
                                        <TableCell>Prénom Client</TableCell>
                                        <TableCell>Date Facture</TableCell>
                                        <TableCell>Quantité</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {journalEntries.map((entry) => (
                                        <TableRow key={entry.id_facture}>
                                            <TableCell>{entry.id_facture}</TableCell>
                                            <TableCell>{entry.nom_client}</TableCell>
                                            <TableCell>{entry.prenom_client}</TableCell>
                                            <TableCell>{entry.date_facture}</TableCell>
                                            <TableCell>{entry.quantite}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            </Box>
        </div>
    );
};

export default Journal;
