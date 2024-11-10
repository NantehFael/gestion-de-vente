import React from 'react';
import Sidenav from '../components/Sidenav';
import Navbar from '../components/Navbar';
import Box from '@mui/material/Box';
import '../Dash.css';
import FournisseurList from './fournisseurs/FournisseurList';



const Fournisseurs = () => {
  return (
    <>
    <div  className="bgcolor">

    <Navbar />
        <Box height={60} />
        <Box sx={{ display: 'flex' }}>
  
    <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <FournisseurList />
      
      </Box>
      </Box>

    </div>
    
    
      </>
  );
};

export default Fournisseurs;
