import React from 'react';

const Footer = () => {
    const footerStyle = {
        backgroundColor: '#336791',
        color: 'white',
        textAlign: 'center',
        padding: '20px',
        position: 'relative',
        bottom: 0,
        width: '100%',
        boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.2)',
        marginTop: '20px',
    };

    return (
        <footer style={footerStyle}>
            <p>© 2024 Gestion de Vente de Pièces. Tous droits réservés.</p>
        </footer>
    );
};

export default Footer;
