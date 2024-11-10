import React from 'react';
import Sidenav from '../components/Sidenav';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import '../Dash.css';
import PieceList from './pièces/PieceList';

const Pieces = () => {
  return (
    <>
    <div  className="bgcolor">
    <Navbar />
    <Box height={60} />
     <Box sx={{ display: 'flex' }}>

    <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
     
       <PieceList />
      </Box>
      </Box>
      </div>
      </>
  );
};

export default Pieces;