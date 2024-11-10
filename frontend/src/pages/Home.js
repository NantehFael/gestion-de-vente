import React, { useState, useEffect } from 'react';  
import Footer from '../components/Footer';

import Navbar1 from '../components/Navbar1';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import pexelsImage1 from '../img/pexels1.jpg'; // Chemin de la première image
import pexelsImage2 from '../img/pexels2.jpg'; // Chemin de la deuxième image
import pexelsImage3 from '../img/pexels3.jpg'; // Chemin de la troisième image
import pexelsImage4 from '../img/pexels4.jpg'; // Chemin de la quatrième image

const Home = () => {
  const [currentImage, setCurrentImage] = useState(pexelsImage1);
  const [email, setUsername] = useState(localStorage.getItem('email') || 'Invité');

  const images = [pexelsImage1, pexelsImage2, pexelsImage3, pexelsImage4];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prevImage => {
        const currentIndex = images.indexOf(prevImage);
        const nextIndex = (currentIndex + 1) % images.length;
        return images[nextIndex];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Fonction pour mettre à jour le nom d'utilisateur
  const updateUsername = (newUsername) => {
    localStorage.setItem('username', newUsername); // Mettre à jour dans localStorage
    setUsername(newUsername); // Mettre à jour l'état local
  };

  return (
    <div className="bgcolor">
      <Navbar1 />
      <Box height={60} />
      <Box sx={{ display: 'flex' }}>
    
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          className="main-content"
        >
          <Typography variant="h4" gutterBottom textAlign="center">
            Bienvenue!!
          </Typography>
          {/* Conteneur pour l'image */}
          <Box
            sx={{
              height: "82vh",
              overflow: 'hidden',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <img 
              src={currentImage} 
              alt="Accueil"
              style={{ 
                height: '100%',
                width: '100%',
                objectFit: 'cover',
              }} 
            />
         
          </Box>
        </Box>
      </Box>
      <Footer />
    </div>
  );
};

export default Home;
