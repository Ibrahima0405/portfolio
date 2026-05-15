const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// POST /api/stats/visite — enregistre une visite
router.post('/visite', async (req, res) => {
  const ip        = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'] || '';
  const page      = req.body.page || '/';

  try {
    await db.query(
      'INSERT INTO visites (page, ip_address, user_agent) VALUES (?, ?, ?)',
      [page, ip, userAgent]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// GET /api/stats — résumé (protégé)
router.get('/', async (req, res) => {
  const key = req.headers['x-admin-key'];
  if (key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ success: false, message: 'Non autorisé' });
  }
  try {
    const [[{ total }]]   = await db.query('SELECT COUNT(*) as total FROM visites');
    const [[{ messages }]]= await db.query('SELECT COUNT(*) as messages FROM messages');
    const [[{ non_lus }]] = await db.query('SELECT COUNT(*) as non_lus FROM messages WHERE lu = FALSE');
    res.json({ success: true, data: { total_visites: total, total_messages: messages, messages_non_lus: non_lus } });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
