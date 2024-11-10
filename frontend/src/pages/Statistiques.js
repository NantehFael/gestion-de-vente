import React from 'react';
import Sidenav from '../components/Sidenav';
import Navbar from '../components/Navbar';
import Box from '@mui/material/Box';
import Statistique from './Statistique'; // Assurez-vous que le chemin est correct
import '../Dash.css';

const Home = () => {
  return (
    <>
      <div className="bgcolor">
        <Navbar />
        <Box height={50} />
        <Box sx={{ display: 'flex' }}>
          <Sidenav />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            
            <Statistique />
          </Box>
        </Box>
      </div>
    </>
  );
};

export default Home;
