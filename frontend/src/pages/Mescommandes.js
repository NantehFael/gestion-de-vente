import React from 'react';

import Navbar1 from '../components/Navbar1';
import Box from '@mui/material/Box';
import '../Dash.css';
import MescommandeList from './mescommandes/MescommandeList';



const Mescommandes = () => {
  return (
    <>
    <div  className="bgcolor">

    <Navbar1 />
        <Box height={40} />
        <Box sx={{ display: 'flex' }}>
   
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <MescommandeList />
  
      </Box>
      </Box>
    </div>
      </>
  );
};

export default Mescommandes;
