import React from 'react';

import Navbar1 from '../components/Navbar1';
import Box from '@mui/material/Box';
import '../Dash.css';
import LignecommandeList from './lignecommande/LignecommandeList';



const Lignecommande = () => {
  return (
    <>
    <div  className="bgcolor">

    <Navbar1 />
        <Box height={50} />
        <Box sx={{ display: 'flex' }}>
  
   
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <LignecommandeList />
      
      </Box>
      </Box>

    </div>
    
    
      </>
  );
};

export default Lignecommande;
