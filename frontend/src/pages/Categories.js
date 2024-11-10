import React from 'react';
import Sidenav from '../components/Sidenav';
import Navbar from '../components/Navbar';
import Box from '@mui/material/Box';
import '../Dash.css';
import CategorieList from './categories/CategorieList';



const Categories = () => {
  return (
    <>
    <div  className="bgcolor">

    <Navbar />
        <Box height={60} />
        <Box sx={{ display: 'flex' }}>
  
    <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <CategorieList />
      
      </Box>
      </Box>

    </div>
    
    
      </>
  );
};

export default Categories;
