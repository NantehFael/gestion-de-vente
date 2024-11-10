
import React from 'react';

import Box from '@mui/material/Box';
import Navbar from '../components/Navbar1';
import '../Dash.css';
import CommandesList from "./boutique/CommandesList";


const Commande = () => {
  return (
    <>
      <div  className="bgcolor">
    <Navbar />
       <Box height={60} />
       <Box sx={{ display: 'flex' }}>
   
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <CommandesList />
      
      </Box>
      </Box>
      </div>
      </>
  );
};

export default Commande;