import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import Navbar from "../components/Navbar";
import Sidenav from "../components/Sidenav";
import { Box, Button, TextField } from '@mui/material';

export default function Reclamations() {
  const [clientsWithReclamations, setClientsWithReclamations] = useState([]);
  const [reclamations, setReclamations] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState(""); // Message de réponse de l'admin

  const fetchClientsWithReclamations = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/clients/reclamations');
      setClientsWithReclamations(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des clients avec réclamations:", error);
    }
  };

  const fetchReclamationsByClient = async (clientId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/reclamations/clients/${clientId}`);
      setReclamations(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des réclamations du client:", error);
    }
  };

  useEffect(() => {
    fetchClientsWithReclamations();
  }, []);

  const handleShowReclamationTable = (client) => {
    setSelectedClient(client);
    fetchReclamationsByClient(client.id_client);
  };

  const handleShowMessage = (message) => {
    setSelectedMessage(message);
    setShowMessage(true);
  };

  const handleResponseChange = (event) => {
    setResponseMessage(event.target.value);
  };

  const handleSendResponse = async () => {
    const clientId = selectedClient?.id_client;
  
    if (!clientId || !responseMessage) {
      console.error("L'ID du client ou le message de réponse est manquant.");
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8080/api/reclamations/reponse', {
        clientId: clientId,
        response: responseMessage
      });
  
      if (response.status === 201) {
        alert("Réponse envoyée avec succès !");
        
        // Supprimer la réclamation traitée
        const updatedReclamations = reclamations.filter(reclamation => reclamation.message !== selectedMessage);
        setReclamations(updatedReclamations);

        // Masquer la section de réponse
        setShowMessage(false);
        setResponseMessage(""); 

        // Si toutes les réclamations du client ont été traitées, retirer le client de la liste
        if (updatedReclamations.length === 0) {
          const updatedClients = clientsWithReclamations.filter(client => client.id_client !== clientId);
          setClientsWithReclamations(updatedClients);
          setSelectedClient(null); // Réinitialiser le client sélectionné
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la réponse:", error);
    }
  };

  return (
    <div className="reclamations-container">
      <Navbar />
      <Box height={75} />
      <Box sx={{ display: 'flex' }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <h2 style={styles.title}>Mes Réclamations</h2>

          <div style={styles.clientInfo}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Client</th>
                  <th style={styles.tableHeader}>Téléphone</th>
                </tr>
              </thead>
              <tbody>
                {clientsWithReclamations.map(client => (
                  <tr key={client.id_client} style={styles.tableRow} onClick={() => handleShowReclamationTable(client)}>
                    <td style={styles.tableCell}>{client.nom} {client.prenom}</td>
                    <td style={styles.tableCell}>{client.telephone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedClient && (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>IdRec</th>
                  <th style={styles.tableHeader}>Message</th>
                  <th style={styles.tableHeader}>Pièce</th>
                  <th style={styles.tableHeader}>Date Commande</th>
                </tr>
              </thead>
              <tbody>
                {reclamations.map(reclamation => (
                  <tr key={reclamation.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>{reclamation.id}</td>
                    <td style={styles.tableCell}>
                      <a href="#" onClick={() => handleShowMessage(reclamation.message)} style={styles.link}>Voir message</a>
                    </td>
                    <td style={styles.tableCell}>{reclamation.nom_piece}</td>
                    <td style={styles.tableCell}>{new Date(reclamation.date_commande).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {showMessage && (
            <div style={styles.messageBox}>
              <h3>Réclamation</h3>
              <p>{selectedMessage}</p>
              <TextField
                variant="outlined"
                label="Répondre"
                multiline
                rows={3}
                fullWidth
                style={{ marginTop: '10px' }}
                value={responseMessage}
                onChange={handleResponseChange}
              />
              <Button variant="contained" color="success" style={{ marginTop: '10px' }} onClick={handleSendResponse}>Envoyer</Button>
            </div>
          )}
        </Box>
      </Box>
    </div>
  );
}

const styles = {
  title: {
    color: '#2c3e50',
    marginBottom: '20px',
  },
  clientInfo: {
    marginBottom: '20px',
    cursor: 'pointer',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    marginBottom: '20px',
  },
  tableHeader: {
    padding: '12px',
    border: '1px solid #ddd',
    textAlign: 'center',
    backgroundColor: '#336791',
    color: 'white',
  },
  tableCell: {
    padding: '12px',
    border: '1px solid #ddd',
    textAlign: 'center',
  },
  tableRow: {
    backgroundColor: '#f9f9f9',
  },
  link: {
    color: '#3498db',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  messageBox: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f0f8ff',
    borderLeft: '5px solid #3498db',
  },
};
