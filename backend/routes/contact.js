const express    = require('express');
const router     = express.Router();
const db         = require('../config/db');
const nodemailer = require('nodemailer');

// Validation simple
function valider(data) {
  const errors = [];
  if (!data.nom    || data.nom.trim().length < 2)    errors.push('Nom invalide (min 2 caractères)');
  if (!data.email  || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Email invalide');
  if (!data.sujet  || data.sujet.trim().length < 3)  errors.push('Sujet invalide (min 3 caractères)');
  if (!data.message|| data.message.trim().length < 10) errors.push('Message trop court (min 10 caractères)');
  return errors;
}

// POST /api/contact
router.post('/', async (req, res) => {
  const { nom, email, sujet, message } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Validation
  const errors = valider({ nom, email, sujet, message });
  if (errors.length) {
    return res.status(400).json({ success: false, errors });
  }

  try {
    // 1. Sauvegarder en base
    await db.query(
      'INSERT INTO messages (nom, email, sujet, message, ip_address) VALUES (?, ?, ?, ?, ?)',
      [nom.trim(), email.trim().toLowerCase(), sujet.trim(), message.trim(), ip]
    );

    // 2. Envoyer un email (optionnel — ne bloque pas si SMTP non configuré)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: process.env.SMTP_PORT || 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        await transporter.sendMail({
          from:    `"Portfolio" <${process.env.SMTP_USER}>`,
          to:      process.env.MAIL_TO,
          subject: `[Portfolio] ${sujet}`,
          html: `
            <h2>Nouveau message de ${nom}</h2>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Sujet :</strong> ${sujet}</p>
            <hr/>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `
        });
      } catch (mailErr) {
        console.warn('⚠️ Email non envoyé (SMTP) :', mailErr.message);
      }
    }

    res.json({ success: true, message: 'Message envoyé avec succès !' });

  } catch (err) {
    console.error('Erreur POST /contact :', err);
    res.status(500).json({ success: false, message: 'Erreur serveur, réessaie plus tard.' });
  }
});

// GET /api/contact/messages — voir les messages reçus (protégé par clé simple)
router.get('/messages', async (req, res) => {
  const key = req.headers['x-admin-key'];
  if (key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ success: false, message: 'Non autorisé' });
  }
  try {
    const [rows] = await db.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;
