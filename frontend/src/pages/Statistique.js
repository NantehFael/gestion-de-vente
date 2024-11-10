import React, { useEffect, useState } from 'react';  
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Box, Typography, Paper } from '@mui/material';

const Statistique = () => {
  const [dataCommandes, setDataCommandes] = useState([]);
  const [dataPieces, setDataPieces] = useState([]);

  useEffect(() => {
    fetchStatistiques();
  }, []);

  const fetchStatistiques = async () => {
    try {
      const responseCommandes = await fetch("http://localhost:8080/api/statistiques/commandes");
      const commandesData = await responseCommandes.json();
      if (Array.isArray(commandesData)) {
        setDataCommandes(commandesData);
      }

      const responsePieces = await fetch("http://localhost:8080/api/statistiques/pieces");
      const piecesData = await responsePieces.json();
      if (Array.isArray(piecesData)) {
        setDataPieces(piecesData);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
    }
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f5f5f5' }}>
      <Paper sx={{ padding: 2, marginBottom: 3 }}>
        <Typography variant="h3" textAlign="center" gutterBottom>
          STATISTIQUES
        </Typography>
        <Typography variant="h6" gutterBottom textAlign="center">
          Nombre de commandes par jour
        </Typography>
        <LineChart
          width={1500}
          height={300}
          data={dataCommandes}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="nombre_commandes" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </Paper>

      <Paper sx={{ padding: 2 }}>
        <Typography variant="h6" gutterBottom textAlign="center">
          Nombre de pièces commandées par jour
        </Typography>
        <LineChart
          width={1500}
          height={300}
          data={dataPieces}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="nombre_pieces" stroke="#82ca9d" />
        </LineChart>
      </Paper>
    </Box>
  );
};

export default Statistique;
