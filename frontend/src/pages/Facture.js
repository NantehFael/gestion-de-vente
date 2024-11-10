import React from 'react';
import Sidenav from '../components/Sidenav';
import Navbar from '../components/Navbar';
import Box from '@mui/material/Box';
import '../Dash.css';
import FactureList from './factures/FactureList';



const Factures = () => {
  return (
    <>
    <div  className="bgcolor">

    <Navbar />
        <Box height={75} />
        <Box sx={{ display: 'flex' }}>
  
    <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <FactureList />
      
      </Box>
      </Box>

    </div>
    
    
      </>
  );
};

export default Factures;
