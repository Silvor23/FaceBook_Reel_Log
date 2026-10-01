const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;
const pool = require('./db');
//main page
app.get('/', (req, res) => {
  res.send('FRL');
});
//test page get
app.get('/api/test', async (req, res) => {
  try{
     const result = await pool.query('SELECT * FROM test');
     res.json(result.rows);
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//test page post
app.post('/api/test', async (req, res) => {
try{
  const { id, name, num } = req.body;
  const result = await pool.query(
      'INSERT INTO test (id, name, num) VALUES ($1, $2, $3) RETURNING *',
      [id, name, num]
    );
    res.status(201).json(result.rows[0]);
  }
catch (err) {
    res.status(500).json({ error: err.message });
  }
}
);
  //confirm working server
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});