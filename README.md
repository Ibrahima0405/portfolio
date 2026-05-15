# Portfolio Ibrahima Diallo — Fullstack

Portfolio professionnel complet avec frontend HTML/CSS/JS et backend Node.js + MySQL.

## Structure du projet

```
portfolio/
├── frontend/
│   ├── index.html          ← Page principale
│   ├── css/style.css       ← Styles complets
│   ├── js/main.js          ← Logique JS (API + formulaire)
│   └── assets/             ← Images des projets
├── backend/
│   ├── server.js           ← Point d'entrée Express
│   ├── config/db.js        ← Pool MySQL
│   ├── routes/
│   │   ├── projets.js      ← GET /api/projets
│   │   ├── contact.js      ← POST /api/contact
│   │   └── stats.js        ← POST /api/stats/visite
│   ├── package.json
│   └── .env.example
└── database/
    └── schema.sql          ← Schéma + données initiales
```

## Installation locale

### 1. Base de données MySQL

```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base et les tables
source /chemin/vers/portfolio/database/schema.sql
```

### 2. Backend

```bash
cd portfolio/backend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env
# Edite .env avec tes vraies valeurs (DB_PASSWORD, etc.)

# Lancer en développement
npm run dev

# Lancer en production
npm start
```

### 3. Frontend

Le frontend est servi automatiquement par le backend Express sur `http://localhost:3000`.

Pour le développement frontend seul, tu peux utiliser l'extension **Live Server** dans VS Code.

> ⚠️ Si tu utilises Live Server (port 5500), mets à jour `FRONTEND_URL=http://localhost:5500` dans ton `.env`.

## Variables d'environnement (.env)

| Variable | Description | Exemple |
|---|---|---|
| `PORT` | Port du serveur | `3000` |
| `DB_HOST` | Hôte MySQL | `localhost` |
| `DB_USER` | Utilisateur MySQL | `root` |
| `DB_PASSWORD` | Mot de passe MySQL | `monpassword` |
| `DB_NAME` | Nom de la base | `portfolio_db` |
| `FRONTEND_URL` | URL du frontend (CORS) | `http://localhost:5500` |
| `SMTP_USER` | Email Gmail (optionnel) | `toi@gmail.com` |
| `SMTP_PASS` | App Password Gmail | `xxxx xxxx xxxx xxxx` |
| `MAIL_TO` | Email de réception | `toi@gmail.com` |
| `ADMIN_KEY` | Clé secrète admin | `cle_secrete_longue` |

## API Endpoints

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/projets` | Liste tous les projets actifs |
| `GET` | `/api/projets/:id` | Un projet par ID |
| `POST` | `/api/contact` | Envoie un message de contact |
| `GET` | `/api/contact/messages` | Liste les messages (admin) |
| `POST` | `/api/stats/visite` | Enregistre une visite |
| `GET` | `/api/stats` | Stats globales (admin) |
| `GET` | `/api/health` | Vérification santé serveur |

## Déploiement sur Render (gratuit)

### Backend
1. Push le dossier `backend/` sur GitHub
2. Sur Render → **New Web Service** → connecte ton repo
3. Build command : `npm install`
4. Start command : `npm start`
5. Ajoute toutes les variables d'environnement dans l'onglet **Environment**
6. Pour MySQL, utilise **PlanetScale** ou **Railway** (gratuits)

### Frontend
1. Dans `frontend/js/main.js`, remplace :
   ```js
   const API = 'http://localhost:3000/api';
   ```
   par l'URL de ton backend Render :
   ```js
   const API = 'https://ton-service.onrender.com/api';
   ```
2. Déploie le dossier `frontend/` sur **GitHub Pages** ou **Netlify**

## Ajouter un nouveau projet

### Via MySQL directement :
```sql
USE portfolio_db;

INSERT INTO projets (titre, description, github_url, demo_url, tags, featured, ordre)
VALUES (
  'Mon Nouveau Projet',
  'Description du projet...',
  'https://github.com/ibrahima-diallo/projet',
  'https://demo.com',
  '["React", "Node.js", "MySQL"]',
  FALSE,
  3
);
```

## Voir les messages reçus

```bash
curl -H "x-admin-key: ta_cle_secrete" http://localhost:3000/api/contact/messages
```

## Voir les stats

```bash
curl -H "x-admin-key: ta_cle_secrete" http://localhost:3000/api/stats
```
