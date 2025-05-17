// server.js
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { customAlphabet } = require('nanoid');

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from frontend
app.use(cors());
app.use(express.json());

// nanoid generator: 6-character alphanumeric
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 6);

// Initialize SQLite database
const db = new sqlite3.Database('./urls.db', err => {
  if (err) console.error('DB opening error:', err);
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE,
      url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Create short URL
app.post('/api/shorten', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const code = nanoid();
  const shortUrl = `${req.protocol}://${req.get('host')}/${code}`;

  db.run(`INSERT INTO urls (code, url) VALUES (?, ?)`, [code, url], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ shortUrl, code });
  });
});

// Redirect
app.get('/:code', (req, res) => {
  const { code } = req.params;
  db.get(`SELECT url FROM urls WHERE code = ?`, [code], (err, row) => {
    if (err) return res.status(500).send('Server error');
    if (row) return res.redirect(row.url);
    res.status(404).send('Not found');
  });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));