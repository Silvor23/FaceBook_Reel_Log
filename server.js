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
//edit log path
app.get('/editlog', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'editlog.html'));
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
//reels page delete
app.delete('/api/reels/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM reels WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Reel not found' });
    res.json({ deleted: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//one reel get
app.get('/api/reels/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reels WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Reel not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//update one reel
app.put('/api/reels/:id', async (req, res) => {
  try {
    const { date_added, year, media_origin, music, artist, reactions, view, follows, comments, subject } = req.body;

    const result = await pool.query(
      `UPDATE reels
       SET date_added=$1, year=$2, media_origin=$3, music=$4, artist=$5,
           reactions=$6, view=$7, follows=$8, comments=$9, subject=$10
       WHERE id=$11
       RETURNING *`,
      [date_added, year, media_origin, music, artist, reactions, view, follows, comments, subject, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Reel not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
//confirm working server
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});