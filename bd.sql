--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2024-11-10 06:44:15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 240 (class 1255 OID 16674)
-- Name: update_stock_after_purchase(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_stock_after_purchase(qte integer, p_id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE PIECE
    SET stock = stock - qte
    WHERE id_piece = p_id AND stock >= qte;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Stock insuffisant pour la piŠce %', p_id;
    END IF;
END;
$$;


ALTER FUNCTION public.update_stock_after_purchase(qte integer, p_id integer) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 24733)
-- Name: categorie; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorie (
    id_categorie integer NOT NULL,
    nom character varying(150) NOT NULL
);


ALTER TABLE public.categorie OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 24732)
-- Name: categorie_id_categorie_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categorie_id_categorie_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorie_id_categorie_seq OWNER TO postgres;

--
-- TOC entry 4968 (class 0 OID 0)
-- Dependencies: 217
-- Name: categorie_id_categorie_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorie_id_categorie_seq OWNED BY public.categorie.id_categorie;


--
-- TOC entry 224 (class 1259 OID 25883)
-- Name: client_id_client_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.client_id_client_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.client_id_client_seq1 OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 25884)
-- Name: client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client (
    id_client integer DEFAULT nextval('public.client_id_client_seq1'::regclass) NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    adresse character varying(50) NOT NULL,
    telephone character varying(15) NOT NULL
);


ALTER TABLE public.client OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 25463)
-- Name: client_id_client_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.client_id_client_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.client_id_client_seq OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 25894)
-- Name: commande_id_commande_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.commande_id_commande_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.commande_id_commande_seq1 OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 25895)
-- Name: commande; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.commande (
    id_commande integer DEFAULT nextval('public.commande_id_commande_seq1'::regclass) NOT NULL,
    montant numeric(10,2) NOT NULL,
    id_facture integer,
    date_commande date NOT NULL,
    id_client integer NOT NULL
);


ALTER TABLE public.commande OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 25472)
-- Name: commande_id_commande_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.commande_id_commande_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.commande_id_commande_seq OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 25974)
-- Name: facture_id_facture_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.facture_id_facture_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.facture_id_facture_seq OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 25975)
-- Name: facture; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.facture (
    id_facture integer DEFAULT nextval('public.facture_id_facture_seq'::regclass) NOT NULL,
    id_client integer NOT NULL,
    id_commande integer NOT NULL,
    date_facturation date DEFAULT CURRENT_DATE,
    montant_total numeric(10,2) NOT NULL
);


ALTER TABLE public.facture OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 24724)
-- Name: fournisseur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fournisseur (
    id_fournisseur bigint NOT NULL,
    nom character varying(150) NOT NULL,
    prenom character varying(150) NOT NULL,
    email character varying(150) NOT NULL,
    telephone character varying(150) NOT NULL
);


ALTER TABLE public.fournisseur OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 24723)
-- Name: fournisseur_id_fournisseur_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fournisseur_id_fournisseur_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fournisseur_id_fournisseur_seq OWNER TO postgres;

--
-- TOC entry 4969 (class 0 OID 0)
-- Dependencies: 215
-- Name: fournisseur_id_fournisseur_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fournisseur_id_fournisseur_seq OWNED BY public.fournisseur.id_fournisseur;


--
-- TOC entry 223 (class 1259 OID 25865)
-- Name: ligne_commande_id_ligne_commande_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ligne_commande_id_ligne_commande_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ligne_commande_id_ligne_commande_seq OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 25906)
-- Name: ligne_commande; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ligne_commande (
    id_ligne_commande integer DEFAULT nextval('public.ligne_commande_id_ligne_commande_seq'::regclass) NOT NULL,
    qt_commande integer NOT NULL,
    etat character varying(50) NOT NULL,
    id_commande integer NOT NULL,
    id_piece integer NOT NULL
);


ALTER TABLE public.ligne_commande OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 32919)
-- Name: ligne_facture; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ligne_facture (
    id_ligne_facture integer NOT NULL,
    id_facture integer NOT NULL,
    id_piece integer NOT NULL,
    id_commande integer NOT NULL,
    total numeric(10,2) NOT NULL
);


ALTER TABLE public.ligne_facture OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 25992)
-- Name: ligne_facture_id_ligne_facture_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ligne_facture_id_ligne_facture_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ligne_facture_id_ligne_facture_seq OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 32918)
-- Name: ligne_facture_id_ligne_facture_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ligne_facture_id_ligne_facture_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ligne_facture_id_ligne_facture_seq1 OWNER TO postgres;

--
-- TOC entry 4970 (class 0 OID 0)
-- Dependencies: 238
-- Name: ligne_facture_id_ligne_facture_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ligne_facture_id_ligne_facture_seq1 OWNED BY public.ligne_facture.id_ligne_facture;


--
-- TOC entry 220 (class 1259 OID 24848)
-- Name: piece; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.piece (
    id_piece integer NOT NULL,
    reference character varying(255) NOT NULL,
    nom_piece character varying(255) NOT NULL,
    description text NOT NULL,
    image character varying(255),
    stock integer NOT NULL,
    type_article character varying NOT NULL,
    prix_unitaire numeric(10,2) NOT NULL,
    prix_vente numeric(10,2) NOT NULL,
    id_fournisseur integer NOT NULL,
    id_categorie integer NOT NULL
);


ALTER TABLE public.piece OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24847)
-- Name: piece_id_piece_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.piece_id_piece_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.piece_id_piece_seq OWNER TO postgres;

--
-- TOC entry 4971 (class 0 OID 0)
-- Dependencies: 219
-- Name: piece_id_piece_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.piece_id_piece_seq OWNED BY public.piece.id_piece;


--
-- TOC entry 229 (class 1259 OID 25922)
-- Name: reclamation_id_reclamation_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reclamation_id_reclamation_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reclamation_id_reclamation_seq OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 25923)
-- Name: reclamation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reclamation (
    id_reclamation integer DEFAULT nextval('public.reclamation_id_reclamation_seq'::regclass) NOT NULL,
    id_client integer NOT NULL,
    id_commande integer NOT NULL,
    id_piece integer NOT NULL,
    message text NOT NULL
);


ALTER TABLE public.reclamation OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 25959)
-- Name: reponse_id_reponse_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reponse_id_reponse_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reponse_id_reponse_seq OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 25960)
-- Name: reponse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reponse (
    id_reponse integer DEFAULT nextval('public.reponse_id_reponse_seq'::regclass) NOT NULL,
    id_client integer NOT NULL,
    message_reponse text NOT NULL,
    date_reponse timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.reponse OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 25946)
-- Name: transaction_mvola_id_transaction_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transaction_mvola_id_transaction_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transaction_mvola_id_transaction_seq OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 25947)
-- Name: transaction_mvola; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction_mvola (
    id_transaction integer DEFAULT nextval('public.transaction_mvola_id_transaction_seq'::regclass) NOT NULL,
    id_client integer NOT NULL,
    montant numeric(10,2) NOT NULL,
    statut character varying(50) NOT NULL,
    reference_transaction character varying(255),
    date_transaction timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.transaction_mvola OWNER TO postgres;

--
-- TOC entry 4743 (class 2604 OID 24736)
-- Name: categorie id_categorie; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorie ALTER COLUMN id_categorie SET DEFAULT nextval('public.categorie_id_categorie_seq'::regclass);


--
-- TOC entry 4742 (class 2604 OID 24880)
-- Name: fournisseur id_fournisseur; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fournisseur ALTER COLUMN id_fournisseur SET DEFAULT nextval('public.fournisseur_id_fournisseur_seq'::regclass);


--
-- TOC entry 4755 (class 2604 OID 32922)
-- Name: ligne_facture id_ligne_facture; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ligne_facture ALTER COLUMN id_ligne_facture SET DEFAULT nextval('public.ligne_facture_id_ligne_facture_seq1'::regclass);


--
-- TOC entry 4744 (class 2604 OID 25110)
-- Name: piece id_piece; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.piece ALTER COLUMN id_piece SET DEFAULT nextval('public.piece_id_piece_seq'::regclass);


--
-- TOC entry 4941 (class 0 OID 24733)
-- Dependencies: 218
-- Data for Name: categorie; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorie (id_categorie, nom) FROM stdin;
5	Moteur
6	Transmission
7	Suspension
8	Freinage
10	Carrosserie
11	Échappement
12	Roues et Pneus
9	Électrique
13	Climatisation
\.


--
-- TOC entry 4948 (class 0 OID 25884)
-- Dependencies: 225
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client (id_client, nom, prenom, email, password, adresse, telephone) FROM stdin;
1	Nantenaina	AUGUSTE	nantenainaratiarson@gmail.com	$2b$10$8iwpEGJYVk02HCm/NKI6ouYn.yUbFymne18hHzCDS7foh/1bXdObq	ISADA	0343382528
\.


--
-- TOC entry 4950 (class 0 OID 25895)
-- Dependencies: 227
-- Data for Name: commande; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.commande (id_commande, montant, id_facture, date_commande, id_client) FROM stdin;
1	50000.00	\N	2024-11-07	1
2	322000.00	\N	2024-11-08	1
3	80000.00	\N	2024-11-08	1
\.


--
-- TOC entry 4959 (class 0 OID 25975)
-- Dependencies: 236
-- Data for Name: facture; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.facture (id_facture, id_client, id_commande, date_facturation, montant_total) FROM stdin;
1	1	1	2024-11-08	100.00
\.


--
-- TOC entry 4939 (class 0 OID 24724)
-- Dependencies: 216
-- Data for Name: fournisseur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fournisseur (id_fournisseur, nom, prenom, email, telephone) FROM stdin;
1	Nantenaina	AUGUSTE	nantenainaratiarson@gmail.com	0343382528
2	FANDRESENA	Nomena	nomena09@gmail.com	0341234143
\.


--
-- TOC entry 4951 (class 0 OID 25906)
-- Dependencies: 228
-- Data for Name: ligne_commande; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ligne_commande (id_ligne_commande, qt_commande, etat, id_commande, id_piece) FROM stdin;
1	1	validée	1	11
2	1	validée	2	10
4	5	validée	2	11
3	1	validée	2	9
5	1	validée	3	6
\.


--
-- TOC entry 4962 (class 0 OID 32919)
-- Dependencies: 239
-- Data for Name: ligne_facture; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ligne_facture (id_ligne_facture, id_facture, id_piece, id_commande, total) FROM stdin;
3	1	6	1	50.00
4	1	7	1	50.00
\.


--
-- TOC entry 4943 (class 0 OID 24848)
-- Dependencies: 220
-- Data for Name: piece; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.piece (id_piece, reference, nom_piece, description, image, stock, type_article, prix_unitaire, prix_vente, id_fournisseur, id_categorie) FROM stdin;
7	121212121	Alternateur	Générateur électrique qui recharge la batterie de la voiture et alimente les systèmes électriques pendant que le moteur tourne.	1729247437100.jpg	0	piece	90000.00	100000.00	1	9
5	08003453043640	Filtre à huile	Équipement qui purifie l'huile moteur en éliminant les impuretés et les particules, prolongeant ainsi la durée de vie du moteur.	1729246196839.jpg	0	piece	50000.00	55000.00	1	5
13	04047024949584	Batterie	Transimission pour BMW	1730649911917.jpg	0	piece	1000.00	2000.00	2	5
10	083893939	Embrayage	Dispositif qui permet de déconnecter le moteur de la transmission pour passer les vitesses. Il comprend un disque d'embrayage, un volant moteur et un mécanisme de débrayage.	1729248094373.jpg	1	piece	17000.00	27000.00	2	6
8	04013872806232	Amortisseurs	Composants qui absorbent les chocs et les vibrations des routes, assurant une conduite confortable et stable.	1729247735569.jpg	0	piece	42000.00	52000.00	1	7
11	04013872806232	Plaquette	aaaaa	1730106428421.jpg	30	piece	40000.00	50000.00	2	8
9	04047024949584	Frein à disque	Composant essentiel du système de freinage, permettant de ralentir ou d'arrêter la voiture en appliquant une pression sur les plaquettes de frein.	1729247900806.jpg	1	piece	35000.00	45000.00	1	8
6	04047023479594	Batterie	Source d'énergie qui démarre le moteur et alimente les systèmes électriques de la voiture.	1729247089244.jpg	99	piece	70000.00	80000.00	2	9
\.


--
-- TOC entry 4953 (class 0 OID 25923)
-- Dependencies: 230
-- Data for Name: reclamation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reclamation (id_reclamation, id_client, id_commande, id_piece, message) FROM stdin;
1	1	1	11	Mbola tsy tonga
\.


--
-- TOC entry 4957 (class 0 OID 25960)
-- Dependencies: 234
-- Data for Name: reponse; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reponse (id_reponse, id_client, message_reponse, date_reponse) FROM stdin;
1	1	Efa kely sisa	2024-11-08 01:45:54.108712
2	1	fff	2024-11-08 13:11:51.777908
3	1	eka	2024-11-08 13:18:41.560221
\.


--
-- TOC entry 4955 (class 0 OID 25947)
-- Dependencies: 232
-- Data for Name: transaction_mvola; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transaction_mvola (id_transaction, id_client, montant, statut, reference_transaction, date_transaction) FROM stdin;
1	1	50000.00	Réussi	MVOLA-429646	2024-11-08 01:31:27.14203
2	1	322000.00	Réussi	MVOLA-747385	2024-11-08 08:42:56.11266
3	1	80000.00	Réussi	MVOLA-314374	2024-11-08 13:04:15.122901
\.


--
-- TOC entry 4972 (class 0 OID 0)
-- Dependencies: 217
-- Name: categorie_id_categorie_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorie_id_categorie_seq', 18, true);


--
-- TOC entry 4973 (class 0 OID 0)
-- Dependencies: 221
-- Name: client_id_client_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.client_id_client_seq', 1, true);


--
-- TOC entry 4974 (class 0 OID 0)
-- Dependencies: 224
-- Name: client_id_client_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.client_id_client_seq1', 1, true);


--
-- TOC entry 4975 (class 0 OID 0)
-- Dependencies: 222
-- Name: commande_id_commande_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.commande_id_commande_seq', 9, true);


--
-- TOC entry 4976 (class 0 OID 0)
-- Dependencies: 226
-- Name: commande_id_commande_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.commande_id_commande_seq1', 3, true);


--
-- TOC entry 4977 (class 0 OID 0)
-- Dependencies: 235
-- Name: facture_id_facture_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.facture_id_facture_seq', 1, true);


--
-- TOC entry 4978 (class 0 OID 0)
-- Dependencies: 215
-- Name: fournisseur_id_fournisseur_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fournisseur_id_fournisseur_seq', 1, false);


--
-- TOC entry 4979 (class 0 OID 0)
-- Dependencies: 223
-- Name: ligne_commande_id_ligne_commande_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ligne_commande_id_ligne_commande_seq', 5, true);


--
-- TOC entry 4980 (class 0 OID 0)
-- Dependencies: 237
-- Name: ligne_facture_id_ligne_facture_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ligne_facture_id_ligne_facture_seq', 1, false);


--
-- TOC entry 4981 (class 0 OID 0)
-- Dependencies: 238
-- Name: ligne_facture_id_ligne_facture_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ligne_facture_id_ligne_facture_seq1', 4, true);


--
-- TOC entry 4982 (class 0 OID 0)
-- Dependencies: 219
-- Name: piece_id_piece_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.piece_id_piece_seq', 15, true);


--
-- TOC entry 4983 (class 0 OID 0)
-- Dependencies: 229
-- Name: reclamation_id_reclamation_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reclamation_id_reclamation_seq', 1, true);


--
-- TOC entry 4984 (class 0 OID 0)
-- Dependencies: 233
-- Name: reponse_id_reponse_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reponse_id_reponse_seq', 3, true);


--
-- TOC entry 4985 (class 0 OID 0)
-- Dependencies: 231
-- Name: transaction_mvola_id_transaction_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transaction_mvola_id_transaction_seq', 3, true);


--
-- TOC entry 4759 (class 2606 OID 24740)
-- Name: categorie categorie_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorie
    ADD CONSTRAINT categorie_pkey PRIMARY KEY (id_categorie);


--
-- TOC entry 4763 (class 2606 OID 25893)
-- Name: client client_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_email_key UNIQUE (email);


--
-- TOC entry 4765 (class 2606 OID 25891)
-- Name: client client_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_pkey PRIMARY KEY (id_client);


--
-- TOC entry 4767 (class 2606 OID 25900)
-- Name: commande commande_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande
    ADD CONSTRAINT commande_pkey PRIMARY KEY (id_commande);


--
-- TOC entry 4777 (class 2606 OID 25981)
-- Name: facture facture_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facture
    ADD CONSTRAINT facture_pkey PRIMARY KEY (id_facture);


--
-- TOC entry 4757 (class 2606 OID 24882)
-- Name: fournisseur fournisseur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fournisseur
    ADD CONSTRAINT fournisseur_pkey PRIMARY KEY (id_fournisseur);


--
-- TOC entry 4769 (class 2606 OID 25911)
-- Name: ligne_commande ligne_commande_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ligne_commande
    ADD CONSTRAINT ligne_commande_pkey PRIMARY KEY (id_ligne_commande);


--
-- TOC entry 4779 (class 2606 OID 32924)
-- Name: ligne_facture ligne_facture_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ligne_facture
    ADD CONSTRAINT ligne_facture_pkey PRIMARY KEY (id_ligne_facture);


--
-- TOC entry 4761 (class 2606 OID 25112)
-- Name: piece piece_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.piece
    ADD CONSTRAINT piece_pkey PRIMARY KEY (id_piece);


--
-- TOC entry 4771 (class 2606 OID 25930)
-- Name: reclamation reclamation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reclamation
    ADD CONSTRAINT reclamation_pkey PRIMARY KEY (id_reclamation);


--
-- TOC entry 4775 (class 2606 OID 25968)
-- Name: reponse reponse_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reponse
    ADD CONSTRAINT reponse_pkey PRIMARY KEY (id_reponse);


--
-- TOC entry 4773 (class 2606 OID 25953)
-- Name: transaction_mvola transaction_mvola_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_mvola
    ADD CONSTRAINT transaction_mvola_pkey PRIMARY KEY (id_transaction);


--
-- TOC entry 4782 (class 2606 OID 25901)
-- Name: commande commande_id_client_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande
    ADD CONSTRAINT commande_id_client_fkey FOREIGN KEY (id_client) REFERENCES public.client(id_client) ON DELETE CASCADE;


--
-- TOC entry 4790 (class 2606 OID 25982)
-- Name: facture facture_id_client_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facture
    ADD CONSTRAINT facture_id_client_fkey FOREIGN KEY (id_client) REFERENCES public.client(id_client);


--
-- TOC entry 4791 (class 2606 OID 25987)
-- Name: facture facture_id_commande_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facture
    ADD CONSTRAINT facture_id_commande_fkey FOREIGN KEY (id_commande) REFERENCES public.commande(id_commande);


--
-- TOC entry 4783 (class 2606 OID 25912)
-- Name: ligne_commande fk_commande; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ligne_commande
    ADD CONSTRAINT fk_commande FOREIGN KEY (id_commande) REFERENCES public.commande(id_commande) ON DELETE CASCADE;


--
-- TOC entry 4792 (class 2606 OID 32935)
-- Name: ligne_facture fk_ligne_facture_commande; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ligne_facture
    ADD CONSTRAINT fk_ligne_facture_commande FOREIGN KEY (id_commande) REFERENCES public.commande(id_commande) ON DELETE CASCADE;


--
-- TOC entry 4793 (class 2606 OID 32925)
-- Name: ligne_facture fk_ligne_facture_facture; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ligne_facture
    ADD CONSTRAINT fk_ligne_facture_facture FOREIGN KEY (id_facture) REFERENCES public.facture(id_facture) ON DELETE CASCADE;


--
-- TOC entry 4794 (class 2606 OID 32930)
-- Name: ligne_facture fk_ligne_facture_piece; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ligne_facture
    ADD CONSTRAINT fk_ligne_facture_piece FOREIGN KEY (id_piece) REFERENCES public.piece(id_piece) ON DELETE CASCADE;


--
-- TOC entry 4784 (class 2606 OID 25917)
-- Name: ligne_commande fk_piece; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ligne_commande
    ADD CONSTRAINT fk_piece FOREIGN KEY (id_piece) REFERENCES public.piece(id_piece) ON DELETE CASCADE;


--
-- TOC entry 4780 (class 2606 OID 24861)
-- Name: piece piece_id_categorie_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.piece
    ADD CONSTRAINT piece_id_categorie_fkey FOREIGN KEY (id_categorie) REFERENCES public.categorie(id_categorie);


--
-- TOC entry 4781 (class 2606 OID 24883)
-- Name: piece piece_id_fournisseur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.piece
    ADD CONSTRAINT piece_id_fournisseur_fkey FOREIGN KEY (id_fournisseur) REFERENCES public.fournisseur(id_fournisseur);


--
-- TOC entry 4785 (class 2606 OID 25931)
-- Name: reclamation reclamation_id_client_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reclamation
    ADD CONSTRAINT reclamation_id_client_fkey FOREIGN KEY (id_client) REFERENCES public.client(id_client);


--
-- TOC entry 4786 (class 2606 OID 25936)
-- Name: reclamation reclamation_id_commande_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reclamation
    ADD CONSTRAINT reclamation_id_commande_fkey FOREIGN KEY (id_commande) REFERENCES public.commande(id_commande);


--
-- TOC entry 4787 (class 2606 OID 25941)
-- Name: reclamation reclamation_id_piece_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reclamation
    ADD CONSTRAINT reclamation_id_piece_fkey FOREIGN KEY (id_piece) REFERENCES public.piece(id_piece);


--
-- TOC entry 4789 (class 2606 OID 25969)
-- Name: reponse reponse_id_client_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reponse
    ADD CONSTRAINT reponse_id_client_fkey FOREIGN KEY (id_client) REFERENCES public.client(id_client);


--
-- TOC entry 4788 (class 2606 OID 25954)
-- Name: transaction_mvola transaction_mvola_id_client_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_mvola
    ADD CONSTRAINT transaction_mvola_id_client_fkey FOREIGN KEY (id_client) REFERENCES public.client(id_client);


-- Completed on 2024-11-10 06:44:15

--
-- PostgreSQL database dump complete
--

