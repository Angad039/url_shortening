// server.js
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { customAlphabet } = require('nanoid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

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

app.post('/api/shorten', (req, res) => {
  const { url, customCode } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  // Determine code: custom or random
  const code = customCode && customCode.trim() !== '' ? customCode.trim() : nanoid();

  // Check if custom code is already taken
  db.get(`SELECT id FROM urls WHERE code = ?`, [code], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (row) return res.status(409).json({ error: 'Code already in use' });

    // Insert new mapping
    db.run(`INSERT INTO urls (code, url) VALUES (?, ?)`, [code, url], function(insertErr) {
      if (insertErr) return res.status(500).json({ error: 'Database error' });
      const shortUrl = `${req.protocol}://${req.get('host')}/${code}`;
      res.json({ shortUrl, code });
    });
  });
});

app.get('/:code', (req, res) => {
  db.get(`SELECT url FROM urls WHERE code = ?`, [req.params.code], (err, row) => {
    if (err) return res.status(500).send('Server error');
    if (row) return res.redirect(row.url);
    res.status(404).send('Not found');
  });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));