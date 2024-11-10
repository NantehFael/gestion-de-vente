const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');


const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware pour servir les fichiers statiques (images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuration du pool PostgreSQL
const pool = new Pool({
  user: "postgres",
  password: "fael", // Remplacez par votre mot de passe
  database: "piecevoiture",
  host: "localhost",
  port: 5433,
  max: 10,
});

// Vérifier la connexion
pool.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données:", err.stack);
  } else {
    console.log("Connecté à la base de données PostgreSQL");
  }
});

// Configuration du stockage de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "uploads"); // Chemin vers le dossier uploads
    // Vérifier si le dossier existe, sinon le créer
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom unique pour le fichier
  },
});

const upload = multer({ storage }); // Configuration de multer avec le stockage défini

// Lancer le serveur
app.listen(port, () => {
  console.log(`Le serveur fonctionne avec succès sur le port: ${port}`);
});

// ---------------------------- CRUD DES PIÈCES ------------------------

// Récupérer toutes les pièces ou par catégorie
app.get("/api/pieces", async (req, res) => { 
  const { categoryId } = req.query; // Récupérer le paramètre categoryId
  try {
    let sql;
    let params = [];
    
    if (categoryId) {
      // Récupérer les pièces par catégorie avec le fournisseur
      sql = `
        SELECT p.*, f.nom AS fournisseur_nom, f.prenom AS fournisseur_prenom
        FROM public.piece p
        LEFT JOIN public.fournisseur f ON p.id_fournisseur = f.id_fournisseur
        WHERE p.id_categorie = $1
      `;
      params = [categoryId];
    } else {
      // Récupérer toutes les pièces avec le fournisseur
      sql = `
        SELECT p.*, f.nom AS fournisseur_nom, f.prenom AS fournisseur_prenom
        FROM public.piece p
        LEFT JOIN public.fournisseur f ON p.id_fournisseur = f.id_fournisseur
        ORDER BY p.id_piece ASC
      `;
    }
    
    const result = await pool.query(sql, params);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des pièces:", err.stack);
    return res.status(500).json({ error: "Erreur lors de la récupération des pièces", details: err.message });
  }
});


// Récupérer une pièce par ID
app.get("/api/pieces/:idpiece", async (req, res) => {
  const pieceId = Number(req.params.idpiece);
  const sql = "SELECT * FROM piece WHERE id_piece = $1";
  
  try {
    const result = await pool.query(sql, [pieceId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pièce non trouvée" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(`Erreur lors de la récupération de la pièce avec id_piece ${pieceId}:`, err.stack);
    return res.status(500).json({ error: `Erreur lors de la récupération de la pièce avec id_piece ${pieceId}`, details: err.message });
  }
});

// Ajouter une nouvelle pièce
app.post("/api/addpieces", upload.single("image"), async (req, res) => {
  try {
    const {
      reference, nom_piece, description, stock, type_article, prix_unitaire, prix_vente, id_fournisseur, id_categorie,
    } = req.body;

    const image = req.file ? req.file.filename : null;

    // Vérification des champs obligatoires
    if (!reference || !nom_piece || !description || !stock || !type_article || !prix_unitaire || !prix_vente || !id_fournisseur || !id_categorie || !image) {
      return res.status(400).json({ error: "Tous les champs obligatoires sont requis." });
    }

    // Insertion dans la base de données
    const sql = `
      INSERT INTO piece (reference, nom_piece, description, image, stock, type_article, prix_unitaire, prix_vente, id_fournisseur, id_categorie)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`;

    const result = await pool.query(sql, [
      reference, nom_piece, description, image, stock, type_article, prix_unitaire, prix_vente, id_fournisseur, id_categorie,
    ]);

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erreur lors de l'ajout de la pièce:", error.stack);
    return res.status(500).json({ error: "Erreur lors de l'ajout de la pièce", details: error.message });
  }
});


// Modifier une pièce par ID
app.patch("/api/editpieces/:idpiece", async (req, res) => {
  const pieceId = Number(req.params.idpiece);
  const {
    reference, nom_piece, prix_unitaire, prix_vente, stock, description, type_article, id_fournisseur, id_categorie,
  } = req.body;

  try {
    const sql = `
      UPDATE piece 
      SET 
        nom_piece = $1, reference = $2, prix_unitaire = $3, prix_vente = $4, stock = $5, description = $6, type_article = $7, id_fournisseur = $8, id_categorie = $9
      WHERE id_piece = $10
      RETURNING *`;

    const result = await pool.query(sql, [
      nom_piece, reference, prix_unitaire, prix_vente, stock, description, type_article, id_fournisseur, id_categorie, pieceId,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Pièce non trouvée" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(`Erreur lors de la mise à jour de la pièce avec id_piece ${pieceId}:`, err.stack);
    return res.status(500).json({ error: `Erreur lors de la mise à jour de la pièce avec id_piece ${pieceId}`, details: err.message });
  }
});

// Supprimer une pièce par ID
app.delete("/api/supppieces/:idpiece", (req, res) => {
  const pieceId = parseInt(req.params.idpiece, 10); // Convertir en entier
  if (isNaN(pieceId)) {
    return res.status(400).json({ error: "ID de pièce invalide" }); // Vérification de la validité
  }

  const sql = "DELETE FROM piece WHERE id_piece = $1 RETURNING *";
  pool.query(sql, [pieceId], (err, result) => {
    if (err) {
      console.error(`Erreur lors de la suppression de la pièce avec id_piece ${pieceId}:`, err.stack);
      return res.status(500).json({ error: `Erreur lors de la suppression de la pièce avec id_piece ${pieceId}` });
    }
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Pièce non trouvée" });
    }
    return res.status(200).json({ message: `Pièce supprimée avec succès pour id_piece: ${pieceId}` });
  });
});
// ---------------------------- FIN CRUD DE PIECE ------------------------

// ---------------------------- LOGIN ------------------------------------

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifiez les informations d'identification du client dans la table client
    const clientQuery = await pool.query("SELECT id_client, password FROM public.client WHERE email = $1", [email]);

    // Vérifiez si le client existe
    if (clientQuery.rows.length === 0) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    const client = clientQuery.rows[0];

    // Comparer le mot de passe avec le mot de passe haché stocké
    const isPasswordValid = await bcrypt.compare(password, client.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    // Si l'authentification réussit, récupérez l'id_client
    const id_client = client.id_client;

    // Vous pouvez générer un token ici si nécessaire (par exemple, un JWT)

    return res.json({ id_client, email }); // Retournez l'ID client et d'autres informations si besoin
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return res.status(500).json({ message: "Erreur lors de la connexion" });
  }
});


//sinup
// Route d'inscription
app.post('/api/signup', async (req, res) => { 
  const { nom, prenom, email, password, adresse, telephone } = req.body; // Utilisez 'password' ici

  // Vérifiez que tous les champs sont fournis
  if (!nom || !prenom || !email || !password || !adresse || !telephone) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  try {
    // Vérification de l'unicité de l'email
    const existingUser = await pool.query('SELECT * FROM client WHERE email = $1', [email]);
    if (existingUser.rowCount > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hachage du mot de passe avant l'insertion
    const hashedPassword = await bcrypt.hash(password, 10); // Utilisez 'password' ici

    // Insertion dans la table client
    await pool.query(
      'INSERT INTO public.client (nom, prenom, email, password, adresse, telephone) VALUES ($1, $2, $3, $4, $5, $6)', 
      [nom, prenom, email, hashedPassword, adresse, telephone]
    );

    res.status(200).json({ message: "Inscription réussie !" });
  } catch (err) {
    console.error("Erreur lors de l'inscription:", err);
    res.status(500).json({ message: "Erreur serveur lors de l'inscription" });
  }
});


// Route pour récupérer tous les utilisateurs
app.get('/api/clients', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_client, nom, prenom, email, password, adresse, telephone FROM public.client'); // Adapter la requête selon vos colonnes
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des utilisateurs:", err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des utilisateurs' });
  }
});

// Route pour récupérer les informations d'un client par ID
app.get('/api/client/:id', async (req, res) => {
  const clientId = parseInt(req.params.id, 10); // Convertir l'ID en entier
  if (isNaN(clientId)) {
    return res.status(400).send('L\'ID du client doit être un entier'); // Gérer le cas où l'ID n'est pas un entier
  }

  try {
    const result = await pool.query('SELECT id_client, nom, prenom, email, adresse, telephone, password FROM public.client WHERE id_client = $1', [clientId]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Retourner les données du client
    } else {
      res.status(404).send('Client non trouvé'); // Gérer le cas où le client n'existe pas
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du client:', error);
    res.status(500).send('Erreur serveur');
  }
});

// Mettre à jour un client par ID
app.patch("/api/editclients/:id_client", (req, res) => {
  // Convert id_client to an integer
  const id_client = parseInt(req.params.id_client, 10);

  // Validate id_client
  if (isNaN(id_client)) {
    return res.status(400).json({ error: "Invalid client ID format" });
  }

  const { nom, prenom, email, telephone, adresse, password } = req.body;

  const sql = "UPDATE client SET nom = $1, prenom = $2, email = $3, telephone = $4, adresse = $5, password = $6 WHERE id_client = $7 RETURNING *";

  pool.query(sql, [nom, prenom, email, telephone, adresse, password, id_client], (err, result) => {
    if (err) {
      console.error(`Erreur lors de la mise à jour du client avec id_client ${id_client}:`, err.stack);
      return res.status(500).json({ error: `Erreur lors de la mise à jour du client avec id_client ${id_client}` });
    }
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Client non trouvé" });
    }
    return res.status(200).json(result.rows[0]);
  });
});


// Supprimer un client par ID
app.delete("/api/suppclients/:id_client", (req, res) => {
  const id_client = req.params.id_client;
  const sql = "DELETE FROM client WHERE id_client = $1 RETURNING *";
  pool.query(sql, [id_client], (err, result) => {
    if (err) {
      console.error(`Erreur lors de la suppression du client avec id_client ${id_client}:`, err.stack);
      return res.status(500).json({ error: `Erreur lors de la suppression du client avec id_client ${id_client}` });
    }
    if (result.rowCount === 0) {
      console.log(`Client avec id_client ${id_client} non trouvé`);
      return res.status(404).json({ error: "Client non trouvé" });
    }
    console.log(`Client supprimé avec succès pour id_client: ${id_client}`);
    return res.status(200).json({ message: `Client supprimé avec succès pour id_client: ${id_client}` });
  });
});

// ---------------------------- FIN LOGIN ------------------------

// ---------------------------- CRUD DES FOURNISSEURS ------------------------
// Récupérer tous les fournisseurs
app.get("/api/fournisseurs", (req, res) => { 
  const sql = "SELECT * FROM fournisseur ORDER BY id_fournisseur ASC";
  pool.query(sql, (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération des fournisseurs:", err.stack);
      return res.status(500).json({ error: "Erreur lors de la récupération des fournisseurs" });
    }

    const fournisseursAvecNumeros = result.rows.map((fournisseur, index) => ({
      numero: index + 1,
      ...fournisseur
    }));

    return res.status(200).json(fournisseursAvecNumeros);
  });
});

// Récupérer un fournisseur par ID
app.get("/api/fournisseurs/:id_fournisseur", (req, res) => {
  const id_fournisseur = req.params.id_fournisseur;
  const sql = "SELECT * FROM fournisseur WHERE id_fournisseur = $1";
  pool.query(sql, [id_fournisseur], (err, result) => {
    if (err) {
      console.error(`Erreur lors de la récupération du fournisseur avec id_fournisseur ${id_fournisseur}:`, err.stack);
      return res.status(500).json({ error: `Erreur lors de la récupération du fournisseur avec id_fournisseur ${id_fournisseur}` });
    }
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Fournisseur non trouvé" });
    }
    return res.status(200).json(result.rows[0]);
  });
});

// Ajouter un nouveau fournisseur
app.post("/api/addfournisseurs", (req, res) => {
  const { id_fournisseur, nom, prenom, email, telephone } = req.body;
  const sql = "INSERT INTO fournisseur (id_fournisseur, nom, prenom, email, telephone) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  
  pool.query(sql, [id_fournisseur, nom, prenom, email, telephone], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'ajout du fournisseur:", err.stack);
      return res.status(500).json({ error: "Erreur lors de l'ajout du fournisseur" });
    }
    return res.status(201).json(result.rows[0]);
  });
});

// Mettre à jour un fournisseur par ID
app.patch("/api/editfournisseurs/:id_fournisseur", (req, res) => {
  const id_fournisseur = req.params.id_fournisseur;
  const { nom, prenom, email, telephone } = req.body;
  
  const sql = "UPDATE fournisseur SET nom = $1, prenom = $2, email = $3, telephone = $4 WHERE id_fournisseur = $5 RETURNING *";
  
  pool.query(sql, [nom, prenom, email, telephone, id_fournisseur], (err, result) => {
    if (err) {
      console.error(`Erreur lors de la mise à jour du fournisseur avec id_fournisseur ${id_fournisseur}:`, err.stack);
      return res.status(500).json({ error: `Erreur lors de la mise à jour du fournisseur avec id_fournisseur ${id_fournisseur}` });
    }
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Fournisseur non trouvé" });
    }
    return res.status(200).json(result.rows[0]);
  });
});

// Supprimer un fournisseur par ID
app.delete("/api/suppfournisseurs/:id_fournisseur", (req, res) => {
  const id_fournisseur = req.params.id_fournisseur;
  const sql = "DELETE FROM fournisseur WHERE id_fournisseur = $1 RETURNING *";
  pool.query(sql, [id_fournisseur], (err, result) => {
    if (err) {
      console.error(`Erreur lors de la suppression du fournisseur avec id_fournisseur ${id_fournisseur}:`, err.stack);
      return res.status(500).json({ error: `Erreur lors de la suppression du fournisseur avec id_fournisseur ${id_fournisseur}` });
    }
    if (result.rowCount === 0) {
      console.log(`Fournisseur avec id_fournisseur ${id_fournisseur} non trouvé`);
      return res.status(404).json({ error: "Fournisseur non trouvé" });
    }
    console.log(`Fournisseur supprimé avec succès pour id_fournisseur: ${id_fournisseur}`);
    return res.status(200).json({ message: `Fournisseur supprimé avec succès pour id_fournisseur: ${id_fournisseur}` });
  });
});

// ---------------------------- CRUD DES CATEGORIES ------------------------

// Récupérer toutes les catégories
app.get("/api/categories", (req, res) => {
  const sql = "SELECT * FROM categorie ORDER BY id_categorie ASC";
  pool.query(sql, (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération des catégories:", err.stack);
      return res.status(500).json({ error: "Erreur lors de la récupération des catégories" });
    }
    return res.status(200).json(result.rows);
  });
});

// Récupérer une catégorie par ID
app.get("/api/categories/:id_categorie", (req, res) => {
  const id_categorie = req.params.id_categorie;
  const sql = "SELECT * FROM categorie WHERE id_categorie = $1";
  pool.query(sql, [id_categorie], (err, result) => {
    if (err) {
      console.error(`Erreur lors de la récupération de la catégorie avec id_categorie ${id_categorie}:`, err.stack);
      return res.status(500).json({ error: `Erreur lors de la récupération de la catégorie avec id_categorie ${id_categorie}` });
    }
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Catégorie non trouvée" });
    }
    return res.status(200).json(result.rows[0]);
  });
});

// Ajouter une nouvelle catégorie
app.post("/api/addcategories", (req, res) => {
  const { nom } = req.body;
  const sql = "INSERT INTO categorie (nom) VALUES ($1) RETURNING *";
  
  pool.query(sql, [nom], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'ajout de la catégorie:", err.stack);
      return res.status(500).json({ error: "Erreur lors de l'ajout de la catégorie" });
    }
    return res.status(201).json(result.rows[0]);
  });
});

// Mettre à jour une catégorie par ID
app.patch("/api/editcategories/:id_categorie", (req, res) => {
  const id_categorie = req.params.id_categorie;
  const { nom } = req.body;

  const sql = "UPDATE categorie SET nom = $1 WHERE id_categorie = $2 RETURNING *";
  
  pool.query(sql, [nom, id_categorie], (err, result) => {
    if (err) {
      console.error(`Erreur lors de la mise à jour de la catégorie avec id_categorie ${id_categorie}:`, err.stack);
      return res.status(500).json({ error: `Erreur lors de la mise à jour de la catégorie avec id_categorie ${id_categorie}` });
    }
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Catégorie non trouvée" });
    }
    return res.status(200).json(result.rows[0]);
  });
});

// Supprimer une catégorie par ID
app.delete("/api/suppcategories/:id_categorie", (req, res) => {
  const id_categorie = req.params.id_categorie;
  const sql = "DELETE FROM categorie WHERE id_categorie = $1 RETURNING *";
  pool.query(sql, [id_categorie], (err, result) => {
    if (err) {
      console.error(`Erreur lors de la suppression de la catégorie avec id_categorie ${id_categorie}:`, err.stack);
      return res.status(500).json({ error: `Erreur lors de la suppression de la catégorie avec id_categorie ${id_categorie}` });
    }
    if (result.rowCount === 0) {
      console.log(`Catégorie avec id_categorie ${id_categorie} non trouvée`);
      return res.status(404).json({ error: "Catégorie non trouvée" });
    }
    console.log(`Catégorie supprimée avec succès pour id_categorie: ${id_categorie}`);
    return res.status(200).json({ message: `Catégorie supprimée avec succès pour id_categorie: ${id_categorie}` });
  });
});
// ---------------------------- FIN CRUD DES CATEGORIES ------------------------

// ---------------------------- CRUD DES COMMANDES -----------------------------  
// Récupérer toutes les commandes 
app.get("/api/commandes", async (req, res) => {
  const sql = `
    SELECT 
      c.id_commande, c.date_commande, c.montant, c.id_facture, c.id_client, cl.prenom, cl.adresse, cl.telephone
    FROM 
      public.commande c
    JOIN 
      public.client cl ON c.id_client = cl.id_client
  `;

  try {
    const result = await pool.query(sql);
    return res.status(200).json(result.rows); // Retourner les commandes
  } catch (err) {
    console.error("Erreur lors de la récupération des commandes:", err.stack);
    return res.status(500).json({ error: "Erreur lors de la récupération des commandes", details: err.message });
  }
});

//id_client
app.get("/api/commandes/:id_client", async (req, res) => {
  const id_client = req.params.id_client;

  if (!id_client || isNaN(id_client)) {
    return res.status(400).json({ error: "ID client invalide." });
  }

  try {
    const result = await pool.query(`
      WITH agregats_commande AS (
        SELECT 
          c.id_commande,
          c.date_commande,
          SUM(lc.qt_commande * p.prix_vente) AS total_montant,
          COUNT(*) AS total_commandes,
          SUM(CASE WHEN lc.etat = 'en attente' THEN 1 ELSE 0 END) AS en_attente,
          SUM(CASE WHEN lc.etat = 'validée' THEN 1 ELSE 0 END) AS valides,
          SUM(CASE WHEN lc.etat = 'rejettée' THEN 1 ELSE 0 END) AS rejetes
        FROM 
          public.commande c
        LEFT JOIN 
          public.ligne_commande lc ON c.id_commande = lc.id_commande
        LEFT JOIN 
          public.piece p ON lc.id_piece = p.id_piece
        WHERE 
          c.id_client = $1
        GROUP BY 
          c.id_commande, c.date_commande
      )
      SELECT  
        id_commande, 
        date_commande,
        total_montant,
        total_commandes,
        en_attente,
        valides,
        rejetes
      FROM 
        agregats_commande
    `, [id_client]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Aucune commande trouvée pour cet ID client." });
    }

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des commandes:", err.stack);
    return res.status(500).json({ error: "Erreur lors de la récupération des commandes", details: err.message });
  }
});

 
// Ajouter une nouvelle commande avec ses lignes  
app.post("/api/addcommandes", async (req, res) => {
  const { date_commande, montant, id_facture, id_client, lignes } = req.body;

  // Validation des champs requis
  if (!date_commande || !montant || !id_client || !Array.isArray(lignes) || lignes.length === 0) {
    return res.status(400).json({ error: "Tous les champs requis doivent être fournis." });
  }

  const client = await pool.connect(); // Obtenir un client du pool
  try {
    await client.query('BEGIN'); // Démarrer une transaction

    // Insérer la commande
    const sqlCommande = `
      INSERT INTO public.commande (date_commande, montant, id_facture, id_client)
      VALUES ($1, $2, $3, $4) RETURNING id_commande
    `;

    const resultCommande = await client.query(sqlCommande, [date_commande, montant, id_facture, id_client]);
    const id_commande = resultCommande.rows[0].id_commande;

    // Insérer les lignes de commande
    const sqlLigneCommande = `
      INSERT INTO public.ligne_commande (qt_commande, etat, id_commande, id_piece)
      VALUES ($1, $2, $3, $4)
    `;

    for (const ligne of lignes) {
      if (!ligne.qt_commande || !ligne.id_piece) {
        throw new Error("Chaque ligne doit avoir une quantité et un ID de pièce.");
      }
      await client.query(sqlLigneCommande, [ligne.qt_commande, 'en attente', id_commande, ligne.id_piece]);
    }

    await client.query('COMMIT'); // Valider la transaction
    return res.status(201).json({ id_commande });
  } catch (err) {
    await client.query('ROLLBACK'); // Annuler la transaction en cas d'erreur
    console.error("Erreur lors de l'ajout de la commande:", err.stack);
    return res.status(500).json({ error: "Erreur lors de l'ajout de la commande", details: err.message });
  } finally {
    client.release(); // Libérer le client
  }
});

// Suppression d'une commande par ID
app.delete('/api/commandes/:id_commande', async (req, res) => {
  const { id_commande } = req.params;
  const commandeId = parseInt(id_commande, 10);
  if (isNaN(commandeId)) {
    return res.status(400).json({ error: "ID de commande invalide." });
  }

  try {
    const result = await pool.query(`
      DELETE FROM public.commande
      WHERE id_commande = $1
    `, [commandeId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Commande non trouvée." });
    }

    return res.status(200).json({ message: "Commande supprimée avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de la commande:", error);
    return res.status(500).json({ error: "Erreur lors de la suppression de la commande", details: error.message });
  }
});


// ---------------------------- CRUD DES LIGNES COMMANDES ------------------------ 

// Récupérer toutes les lignes de commande 
app.get("/api/ligne_commande", async (req, res) => {
  const sql = `
    SELECT lc.id_ligne_commande, lc.qt_commande, lc.etat, lc.id_commande, p.nom_piece, p.id_piece
    FROM public.ligne_commande lc
    JOIN public.piece p ON lc.id_piece = p.id_piece
  `;

  try {
    const result = await pool.query(sql);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des lignes de commande:", err.stack);
    return res.status(500).json({ error: "Erreur lors de la récupération des lignes de commande", details: err.message });
  }
});

// Récupérer les lignes de commande pour une commande spécifique
app.get("/api/ligne_commande/:id_commande", async (req, res) => {
  const id_commande = req.params.id_commande; // Récupérer l'id de la commande
  const sql = `
    SELECT lc.id_ligne_commande, lc.qt_commande, lc.etat, lc.id_piece, p.nom_piece, p.id_piece
    FROM public.ligne_commande lc
    JOIN public.piece p ON lc.id_piece = p.id_piece
    WHERE lc.id_commande = $1
  `;

  try {
    const result = await pool.query(sql, [id_commande]);
    return res.status(200).json(result.rows); // Retourne les lignes de commande en format JSON
  } catch (err) {
    console.error("Erreur lors de la récupération des lignes de commande:", err.stack);
    return res.status(500).json({ error: "Erreur lors de la récupération des lignes de commande", details: err.message });
  }
});


//client
app.get("/api/lignes_commande/:id_client", async (req, res) => {
  const id_client = req.params.id_client;

  if (!id_client || isNaN(id_client)) {
    return res.status(400).json({ error: "ID client invalide." });
  }

  try {
    const result = await pool.query(`
      SELECT 
        lc.id_ligne_commande,
        lc.etat,
        lc.qt_commande,
        p.nom_piece,
        lc.id_commande,
         p.id_piece,
          p.stock,
          p.image
      FROM 
        public.ligne_commande lc
      LEFT JOIN 
        public.piece p ON lc.id_piece = p.id_piece
      WHERE 
        lc.id_commande IN (
          SELECT id_commande 
          FROM public.commande 
          WHERE id_client = $1
        )
    `, [id_client]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Aucune ligne de commande trouvée pour cet ID client." });
    }

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des lignes de commande:", err.stack);
    return res.status(500).json({ error: "Erreur lors de la récupération des lignes de commande", details: err.message });
  }
});

// Suppression d'une ligne de commande par ID
app.delete('/api/suppligne_commande/:id', async (req, res) => {
  const { id } = req.params;

  // Vérifier si l'ID est un nombre valide
  const ligneCommandeId = parseInt(id, 10);
  if (isNaN(ligneCommandeId)) {
      return res.status(400).json({ message: "ID de ligne de commande invalide." });
  }

  const client = await pool.connect(); // Connexion à la base de données

  try {
      const result = await client.query(`
          DELETE FROM public.ligne_commande
          WHERE id_ligne_commande = $1
      `, [ligneCommandeId]);

      // Vérifiez si une ligne a été supprimée
      if (result.rowCount === 0) {
          return res.status(404).json({ message: "Ligne de commande non trouvée." });
      }

      res.json({ message: "Ligne de commande supprimée avec succès." });
  } catch (error) {
      console.error("Erreur lors de la suppression de la ligne de commande:", error);
      res.status(500).json({ message: "Erreur lors de la suppression de la ligne de commande" });
  } finally {
      client.release(); // Libérer le client
  }
});

// Validation d'une ligne de commande
app.put('/api/lignes_commande/:ligneCommandeId/valider', async (req, res) => {
  const ligneCommandeId = parseInt(req.params.ligneCommandeId, 10);

  if (isNaN(ligneCommandeId)) {
      return res.status(400).json({ message: "ID de ligne de commande invalide" });
  }

  try {
      const ligneResponse = await pool.query(`
          SELECT id_piece, qt_commande 
          FROM public.ligne_commande 
          WHERE id_ligne_commande = $1
      `, [ligneCommandeId]);

      if (ligneResponse.rowCount === 0) {
          return res.status(404).json({ message: "Ligne de commande non trouvée" });
      }

      const { id_piece, qt_commande } = ligneResponse.rows[0];

      // Vérifier la disponibilité du stock
      const stockResponse = await pool.query(`
          SELECT stock 
          FROM public.piece 
          WHERE id_piece = $1
      `, [id_piece]);

      const stock = stockResponse.rows[0].stock;

      // Si le stock est insuffisant, retourner une erreur
      if (stock < qt_commande) {
          return res.status(400).json({ message: `Stock insuffisant pour la pièce ID ${id_piece}` });
      }

      // Réduire le stock de la pièce
      await pool.query(`
          UPDATE public.piece 
          SET stock = stock - $1 
          WHERE id_piece = $2
      `, [qt_commande, id_piece]);

      // Mettre à jour l'état de la ligne de commande
      await pool.query(`
          UPDATE public.ligne_commande 
          SET etat = 'validée' 
          WHERE id_ligne_commande = $1
      `, [ligneCommandeId]);

      res.status(200).json({ message: "Ligne de commande validée avec succès !" });
  } catch (error) {
      console.error("Erreur lors de la validation de la ligne de commande:", error);
      res.status(500).json({ message: "Erreur lors de la validation de la ligne de commande" });
  }
});

// Rejet d'une ligne de commande
app.put('/api/lignes_commande/:ligneCommandeId/rejeter', async (req, res) => {
  const ligneCommandeId = parseInt(req.params.ligneCommandeId, 10);

  if (isNaN(ligneCommandeId)) {
      return res.status(400).json({ message: "ID de ligne de commande invalide" });
  }

  try {
      const result = await pool.query(`
          UPDATE public.ligne_commande 
          SET etat = 'rejettée' 
          WHERE id_ligne_commande = $1
      `, [ligneCommandeId]);

      if (result.rowCount === 0) {
          return res.status(404).json({ message: "Ligne de commande non trouvée." });
      }

      res.json({ message: "Ligne de commande rejetée avec succès." });
  } catch (error) {
      console.error("Erreur lors du rejet de la ligne de commande:", error);
      res.status(500).json({ message: "Erreur lors du rejet de la ligne de commande" });
  }
});



// ---------------------------- ACCUEIL D'ADMINISTRATEUR------------------------

// Route pour récupérer les ventes récentes 
app.get("/api/ventes-recentes", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.date_commande, cl.prenom, p.nom_piece, p.prix_vente 
      FROM commande c 
      JOIN client cl ON c.id_client = cl.id_client  
      JOIN ligne_commande lc ON c.id_commande = lc.id_commande 
      JOIN piece p ON lc.id_piece = p.id_piece 
      ORDER BY c.date_commande DESC 
      LIMIT 10
    `); 
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des ventes récentes:", err);
    res.status(500).json({ error: "Erreur lors de la récupération des ventes récentes" });
  }
});

// Route pour récupérer les pièces les plus vendues
app.get("/api/pieces-plus-vendues", async (req, res) => {
  try {
    const result = await pool.query("SELECT nom_piece, prix_vente FROM piece ORDER BY prix_vente DESC LIMIT 10"); 
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des pièces les plus vendues:", err);
    res.status(500).json({ error: "Erreur lors de la récupération des pièces les plus vendues" });
  }
});

// Route pour récupérer les recettes totales
app.get("/api/recettes-totales", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT SUM(p.prix_vente * lc.qt_commande) AS total_recette
      FROM commande c
      JOIN ligne_commande lc ON c.id_commande = lc.id_commande
      JOIN piece p ON lc.id_piece = p.id_piece
    `); 
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erreur lors de la récupération des recettes totales:", err);
    res.status(500).json({ error: "Erreur lors de la récupération des recettes totales" });
  }
});

// ---------------------------- STATISTIQUE D'ADMINISTRATEUR------------------------

// Route pour récupérer le nombre de commandes par jour
app.get("/api/statistiques/commandes", async (req, res) => {
  const sql = `
      SELECT 
          DATE(date_commande) AS date, 
          COUNT(*) AS nombre_commandes 
      FROM 
          commande 
      GROUP BY 
          DATE(date_commande) 
      ORDER BY 
          DATE(date_commande);
  `;
  try {
      const result = await pool.query(sql);
      return res.status(200).json(result.rows);
  } catch (err) {
      console.error("Erreur lors de la récupération des statistiques de commandes:", err);
      return res.status(500).json({ error: "Erreur lors de la récupération des statistiques de commandes" });
  }
});

// Route pour récupérer le nombre de pièces commandées par jour
app.get("/api/statistiques/pieces", async (req, res) => {
  const sql = `
      SELECT 
          DATE(c.date_commande) AS date, 
          SUM(lc.qt_commande) AS nombre_pieces 
      FROM 
          ligne_commande lc 
      JOIN 
          commande c ON lc.id_commande = c.id_commande 
      GROUP BY 
          DATE(c.date_commande) 
      ORDER BY 
          DATE(c.date_commande);
  `;
  try {
      const result = await pool.query(sql);
      return res.status(200).json(result.rows);
  } catch (err) {
      console.error("Erreur lors de la récupération des statistiques de pièces:", err);
      return res.status(500).json({ error: "Erreur lors de la récupération des statistiques de pièces" });
  }
});


app.get("/api/alertes", async (req, res) => {
  const query = `
    SELECT p.id_piece, p.nom_piece, p.stock, lc.qt_commande
    FROM public.piece p
    LEFT JOIN public.ligne_commande lc ON p.id_piece = lc.id_piece
    WHERE p.stock < lc.qt_commande
  `;

  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des alertes:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des alertes" });
  }
});


app.post('/api/mvola/payment', async (req, res) => {
  const { clientId, amount } = req.body;

  if (!clientId || !amount) {
      return res.status(400).json({ error: 'Client ID et montant sont requis' });
  }

  try {
      // Simuler le processus de paiement avec Mvola (remplacez ceci par l'intégration réelle de Mvola)
      const transactionSuccessful = Math.random() > 0.2; // 80% de chance de succès

      let statut = 'Échoué';
      let reference_transaction = null;

      if (transactionSuccessful) {
          statut = 'Réussi';
          reference_transaction = 'MVOLA-' + Math.floor(Math.random() * 1000000);
      }

      // Enregistrer la transaction dans PostgreSQL
      const result = await pool.query(
          `INSERT INTO transaction_mvola (id_client, montant, statut, reference_transaction)
          VALUES ($1, $2, $3, $4) RETURNING *`,
          [clientId, amount, statut, reference_transaction]
      );

      if (statut === 'Réussi') {
          res.status(200).json({ message: 'Paiement réussi', transaction: result.rows[0] });
      } else {
          res.status(500).json({ message: 'Le paiement a échoué' });
      }

  } catch (error) {
      console.error('Erreur lors du paiement Mvola:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Créer une nouvelle réclamation
app.post('/api/addreclamations', async (req, res) => {
  const { id_client, id_commande, id_piece, message } = req.body;
  console.log("Données reçues :", req.body); // Ajouter un log pour vérifier les données reçues

  if (!id_client || !id_commande || !id_piece || !message) {
    return res.status(400).send("Tous les champs sont requis.");
  }

  try {
    const newReclamation = await pool.query(
      `INSERT INTO reclamation (id_client, id_commande, id_piece, message) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id_client, id_commande, id_piece, message]
    );
    res.json(newReclamation.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur lors de la création de la réclamation.");
  }
});


// Récupérer les réclamations d'un client spécifique
app.get('/api/reclamations/clients/:id_client', async (req, res) => {
  let { id_client } = req.params;
  console.log("ID client reçu dans le backend avant conversion:", id_client); // Affiche l'ID reçu pour diagnostic
  id_client = parseInt(id_client, 10); // Conversion en entier

  // Vérifier que `id_client` est un nombre valide
  if (isNaN(id_client)) {
    console.error("ID client invalide reçu dans le backend:", id_client);
    return res.status(400).send("ID client invalide.");
  }

  try {
    const clientReclamations = await pool.query(
      `SELECT r.id_reclamation AS id, r.message AS message, p.nom_piece AS nom_piece, c.date_commande AS date_commande, p.image
       FROM reclamation r
       JOIN piece p ON r.id_piece = p.id_piece
       JOIN commande c ON r.id_commande = c.id_commande
       WHERE r.id_client = $1
       ORDER BY c.date_commande DESC`,
      [id_client]
    );
    res.json(clientReclamations.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des réclamations du client:", err);
    res.status(500).send("Erreur serveur.");
  }
});



// Endpoint pour récupérer uniquement les clients ayant des réclamations
app.get('/api/clients/reclamations', async (req, res) => {
  try {
    const clientsWithReclamations = await pool.query(`
      SELECT DISTINCT c.id_client, c.nom, c.prenom, c.telephone
      FROM client c
      JOIN reclamation r ON c.id_client = r.id_client
    `);
    res.json(clientsWithReclamations.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des clients avec réclamations:", err);
    res.status(500).send("Erreur serveur.");
  }
});


// Endpoint pour enregistrer la réponse de l'administrateur à une réclamation
app.post('/api/reclamations/reponse', async (req, res) => {
  const { clientId, response } = req.body;

  if (!clientId || !response) {
    return res.status(400).json({ error: "L'ID du client et la réponse sont requis." });
  }

  try {
    // Exemple de requête pour insérer la réponse dans la table `reponse` liée à la réclamation.
    // Modifiez cette requête en fonction de la structure de votre base de données.
    await pool.query(
      `INSERT INTO reponse (id_client, message_reponse, date_reponse) 
       VALUES ($1, $2, NOW())`,
      [clientId, response]
    );

    res.status(201).json({ message: 'Réponse enregistrée avec succès.' });
  } catch (err) {
    console.error("Erreur lors de l'enregistrement de la réponse:", err);
    res.status(500).json({ error: "Erreur serveur lors de l'enregistrement de la réponse." });
  }
});

// Route pour obtenir les factures d'un client spécifique avec pagination
// Route pour obtenir les factures d'un client spécifique avec pagination
app.get('/api/factures/clients/:id_client', async (req, res) => {
  const { id_client } = req.params;
  const clientId = parseInt(id_client, 10);

  if (isNaN(clientId) || clientId <= 0) {
    return res.status(400).json({ error: "L'identifiant du client est invalide." });
  }

  // Paramètres de pagination
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = parseInt(req.query.offset, 10) || 0;

  try {
    const result = await pool.query(
      `SELECT f.id_facture, c.nom AS nom_client, c.prenom AS prenom_client,
              f.date_facturation, f.montant_total AS montant
       FROM public.facture f
       JOIN public.client c ON f.id_client = c.id_client
       WHERE f.id_client = $1
       LIMIT $2 OFFSET $3`,
      [clientId, limit, offset]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Aucune facture trouvée pour ce client." });
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des factures:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des factures' });
  }
});


// Route pour obtenir toutes les lignes de facture
app.get('/api/lignes_facture', async (req, res) => {
  try {
    // Obtenir les informations détaillées des lignes de facture
    const query = `
      SELECT lf.id_ligne_facture, lf.id_facture, lf.id_piece, lf.quantite, 
             lf.prix_unitaire, lf.total, lf.id_commande,
             p.nom_piece AS nom_piece
      FROM ligne_facture lf
      JOIN piece p ON lf.id_piece = p.id_piece
    `;
    
    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Aucune ligne de facture trouvée." });
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des lignes de facture:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des lignes de facture' });
  }
});

app.get('/api/journal', async (req, res) => {
  // Récupérer les paramètres de la requête
  const { category, startDate, endDate } = req.query;

  try {
      // Construire la requête SQL de base avec des filtres dynamiques
      let query = `SELECT * FROM journal WHERE 1=1`;
      const params = [];

      // Ajouter la condition de catégorie si elle est fournie
      if (category) {
          query += ` AND category = $${params.length + 1}`;
          params.push(category);
      }

      // Ajouter la condition de date de début si elle est fournie
      if (startDate) {
          query += ` AND date >= $${params.length + 1}`;
          params.push(startDate);
      }

      // Ajouter la condition de date de fin si elle est fournie
      if (endDate) {
          query += ` AND date <= $${params.length + 1}`;
          params.push(endDate);
      }

      // Exécuter la requête avec les paramètres
      const result = await pool.query(query, params);
      res.json(result.rows);
  } catch (error) {
      console.error("Erreur lors de la récupération du journal:", error);
      res.status(500).json({ error: "Erreur lors de la récupération du journal" });
  }
});

