import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom'; 
import Acceuil from './pages/Accueil';
import Pieces from './pages/Pieces'; 
import Commandes from './pages/Commandes'; 
import Clients from './pages/Clients';
import Journal from './pages/Journal';
import Login from './login/Login';
import Signup from './login/Signup';
import Facture from './pages/Facture'; 
import Statistiques from './pages/Statistiques';
import Fournisseurs from './pages/Fournisseurs'; 
import Categories from './pages/Categories'
import Reclamations from './pages/Reclamations'
import Home from './pages/Home';
import Lignecommande from './pages/Lignecommande';
import Boutique from './pages/Boutique';
import Mescommandes from './pages/Mescommandes';
import Mesreclamations from './pages/Mesreclamations';
import Panier from './pages/Panier';
import MonCompte from './pages/MonCompte';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/admin" element={<Acceuil />} />
        <Route path="/home" element={<Home />} />
        <Route path="/pieces" element={<Pieces />} /> 
        <Route path="/commandes" element={<Commandes />} />
        <Route path="/client" element={<Clients />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/facture" element={<Facture />} /> 
        <Route path="/statistiques" element={<Statistiques />} />
        <Route path="/fournisseur" element={<Fournisseurs />} /> 
        <Route path="/categorie" element={<Categories />} />
        <Route path="/reclamations" element={<Reclamations />} />
        <Route path="/lignecommande" element={<Lignecommande />} />
        <Route path="/boutique" element={<Boutique />} />
        <Route path="/mescommandes" element={<Mescommandes />} />
        <Route path="/mesreclamations" element={<Mesreclamations />} />
        <Route path="/panier" element={<Panier />} />
        <Route path="/moncompte" element={<MonCompte />} />
     


      </Routes>
    </BrowserRouter>
  );
}