CREATE TABLE public.commande (
    id_commande SERIAL PRIMARY KEY,
    montant DECIMAL(10, 2) NOT NULL,
    id_facture INTEGER,  -- Si vous avez une table des factures, sinon ajustez en conséquence
    date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_client INTEGER REFERENCES public.client(id_client) ON DELETE CASCADE
);


CREATE TABLE public.client (
    id_client SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  
    adresse VARCHAR(50) NOT NULL,  
    telephone VARCHAR(15) NOT NULL 
);



CREATE TABLE IF NOT EXISTS public.ligne_commande
(
    id_ligne_commande SERIAL PRIMARY KEY,
    qt_commande INTEGER NOT NULL,
    etat VARCHAR(50) NOT NULL,
    id_commande INTEGER NOT NULL,
    id_piece INTEGER NOT NULL,
    CONSTRAINT fk_commande FOREIGN KEY (id_commande)
        REFERENCES public.commande (id_commande) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT fk_piece FOREIGN KEY (id_piece)
        REFERENCES public.piece (id_piece) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);
