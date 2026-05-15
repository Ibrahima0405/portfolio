-- ============================================
-- PORTFOLIO IBRAHIMA DIALLO — Schéma MySQL
-- ============================================

CREATE DATABASE IF NOT EXISTS portfolio_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE portfolio_db;

-- Table des messages de contact
CREATE TABLE IF NOT EXISTS messages (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nom         VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  NOT NULL,
  sujet       VARCHAR(200)  NOT NULL,
  message     TEXT          NOT NULL,
  lu          BOOLEAN       DEFAULT FALSE,
  ip_address  VARCHAR(45)   NULL,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Table des projets (gestion dynamique)
CREATE TABLE IF NOT EXISTS projets (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  titre         VARCHAR(150)  NOT NULL,
  description   TEXT          NOT NULL,
  image_url     VARCHAR(300)  NULL,
  github_url    VARCHAR(300)  NULL,
  demo_url      VARCHAR(300)  NULL,
  tags          JSON          NOT NULL,
  featured      BOOLEAN       DEFAULT FALSE,
  ordre         INT           DEFAULT 0,
  actif         BOOLEAN       DEFAULT TRUE,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Table des stats de visites
CREATE TABLE IF NOT EXISTS visites (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  page        VARCHAR(100)  DEFAULT '/',
  ip_address  VARCHAR(45)   NULL,
  user_agent  TEXT          NULL,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Données initiales : projets
-- ============================================

INSERT INTO projets (titre, description, image_url, github_url, tags, featured, ordre) VALUES
(
  'LetsGo',
  'Application mobile de transport combinant covoiturage, VTC et transports en commun pour le marché sénégalais. Interface chauffeur et client, paiement Orange Money / Wave, suivi GPS en temps réel.',
  '/assets/letsgo.png',
  'https://github.com/ibrahima-diallo/letsgo',
  '["React Native", "Expo", "Node.js", "MySQL", "Google Maps", "JWT"]',
  TRUE,
  1
),
(
  'Transport API',
  'Backend RESTful complet gérant les trajets, réservations, utilisateurs et notifications. Authentification JWT, déployé sur Render avec base MySQL en production.',
  '/assets/api.png',
  'https://github.com/ibrahima-diallo/transport-api',
  '["Express.js", "MySQL", "JWT", "Render"]',
  FALSE,
  2
);
