import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar1 from '../components/Navbar1';
import { Box } from '@mui/material';

export default function Mesreclamations() {
  const [showMessage, setShowMessage] = useState(false);
  const [reclamations, setReclamations] = useState([]); // Liste des réclamations du client
  const [selectedMessage, setSelectedMessage] = useState(""); // Message de la réclamation sélectionnée
  const [adminResponse, setAdminResponse] = useState(""); // Réponse de l'administrateur

  // Récupérer les réclamations depuis l'API
  useEffect(() => {
    const fetchReclamations = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/reclamations/clients/${localStorage.getItem('id_client')}`);
        setReclamations(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des réclamations:", error);
      }
    };
    fetchReclamations();
  }, []);

  // Afficher le message de la réclamation sélectionnée
  const handleShowMessage = (message, response) => {
    setSelectedMessage(message);
    setAdminResponse(response || "Pas de réponse pour l'instant"); // Afficher "Pas de réponse pour l'instant" si la réponse est vide
    setShowMessage(true);
  };

  return (
    <div style={styles.tableContainer}>
      <div className="bgcolor">
        <Navbar1 />
        <Box height={40} />
        <Box sx={{ display: 'flex' }}>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <h2 style={styles.title}>Vos Réclamations</h2>
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
                {reclamations.map((reclamation) => (
                  <tr key={reclamation.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>{reclamation.id}</td>
                    <td style={styles.tableCell}>
                      <a
                        href="#"
                        onClick={() => handleShowMessage(reclamation.message, reclamation.reponse)}
                        style={styles.link}
                      >
                        Voir message
                      </a>
                    </td>
                    <td style={styles.tableCell}>
                    <img 
                    src={`http://localhost:8080/uploads/${reclamation.image}`} 
                    alt={reclamation.nom_piece} 
                    style={{ width: '30px', height: 'auto' }} 
                  />
                    </td>
                    <td style={styles.tableCell}>{new Date(reclamation.date_commande).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

             {showMessage && (
              <div style={styles.messageBox}>
                <h3>Réclamation</h3>
                <p><strong>Message :</strong> {selectedMessage}</p>
                <p><strong>Réponse de l'administrateur :</strong> {adminResponse}</p>
              </div>
            )}
          </Box>
        </Box>
      </div>
    </div>
  );
}

const styles = {
  tableContainer: {
    padding: '20px',
    backgroundColor: '#f0f2f5',
  },
  title: {
    color: '#2c3e50',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
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
  pieceIcon: {
    width: '24px',
    height: '24px',
  },
  messageBox: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f0f8ff',
    borderLeft: '5px solid #3498db',
  },
};
