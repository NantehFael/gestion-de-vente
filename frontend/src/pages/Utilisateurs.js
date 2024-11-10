import React from 'react';
import Sidenav from '../components/Sidenav';
import Navbar from '../components/Navbar';
import Box from '@mui/material/Box';
import '../Dash.css';
import UtilisateurList from './utilisateur/UtilisateurList';



const Utilisateurs = () => {
  return (
    <>
    <div  className="bgcolor">

    <Navbar />
        <Box height={60} />
        <Box sx={{ display: 'flex' }}>
  
    <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <UtilisateurList />
      
      </Box>
      </Box>

    </div>
    
    
      </>
  );
};

export default Utilisateurs;
