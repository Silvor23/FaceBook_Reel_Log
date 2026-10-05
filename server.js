const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static('public'))
const port = 3000;
const pool = require('./db');
//main page
app.get('/', (req, res) => {
  res.send('FRL');
});
//add log path
app.get('/addlog', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'addlog.html'));
});
//reels page get
app.get('/api/reels', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reels ORDER BY id');
    res.json(result.rows);
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//reels page post
app.post('/api/reels', async (req, res) => {
  console.log(req.body);
  try {
    const { date_added, year, media_origin, music, artist, reactions, view, follows,comments, subject } = req.body;
    const result = await pool.query(
      'INSERT INTO reels (date_added, year, media_origin, music, artist, reactions, view, follows, comments, subject) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 ,$10) RETURNING *',
      [date_added, year, media_origin, music, artist, reactions, view, follows, comments, subject]
    );
    res.status(201).json(result.rows[0]);
  }
  catch (err) {
    res.status(400).json({ error: err.message });
  }
}
);
//confirm working server
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});