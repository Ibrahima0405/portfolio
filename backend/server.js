require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const rateLimit = require('express-rate-limit');
const path      = require('path');

const app = express();

// ── Middlewares ────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-admin-key']
}));

// Rate limiting sur le formulaire contact (max 5 req / 15 min par IP)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Trop de messages envoyés, réessaie dans 15 min.' }
});

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// ── Routes API ─────────────────────────────────────────────
app.use('/api/projets', require('./routes/projets'));
app.use('/api/contact', contactLimiter, require('./routes/contact'));
app.use('/api/stats',   require('./routes/stats'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API Portfolio en ligne ✅', env: process.env.NODE_ENV });
});

// Toutes les autres routes → index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ── Démarrage ──────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📁 Environnement : ${process.env.NODE_ENV || 'development'}`);
});
