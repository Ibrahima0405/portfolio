const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// GET /api/projets — tous les projets actifs
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM projets WHERE actif = TRUE ORDER BY ordre ASC'
    );
    // Parse JSON tags
    const projets = rows.map(p => ({
      ...p,
      tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags
    }));
    res.json({ success: true, data: projets });
  } catch (err) {
    console.error('Erreur GET /projets :', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// GET /api/projets/:id — un projet par ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM projets WHERE id = ? AND actif = TRUE',
      [req.params.id]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Projet introuvable' });
    }
    const projet = { ...rows[0], tags: typeof rows[0].tags === 'string' ? JSON.parse(rows[0].tags) : rows[0].tags };
    res.json({ success: true, data: projet });
  } catch (err) {
    console.error('Erreur GET /projets/:id :', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;
