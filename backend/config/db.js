const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:               process.env.DB_HOST,
  port:               process.env.DB_PORT     || 4000,
  user:               process.env.DB_USER,
  password:           process.env.DB_PASSWORD,
  database:           process.env.DB_NAME     || 'portfolio_db',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  charset:            'utf8mb4',
  ssl:                { rejectUnauthorized: true }
});

// Test de connexion au démarrage
pool.getConnection()
  .then(conn => {
    console.log('✅ TiDB Cloud connecté avec succès');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Erreur connexion TiDB :', err.message);
  });

module.exports = pool;