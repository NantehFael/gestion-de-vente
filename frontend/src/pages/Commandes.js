
import React from 'react';
import Sidenav from '../components/Sidenav';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import '../Dash.css';
import CommandeList from "./commandes/CommandeList";


const Commandes = () => {
  return (
    <>
      <div  className="bgcolor">
    <Navbar />
       <Box height={60} />
       <Box sx={{ display: 'flex' }}>
    <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <CommandeList />
      
      </Box>
      </Box>
      </div>
      </>
  );
};

export default Commandes;