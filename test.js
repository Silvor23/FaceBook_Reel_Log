const pool = require('./db');
async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    //const result = await pool.query('SELECT * FROM employees');
    console.log(result.rows);
  } catch (err) {
    console.error('Connection failed:', err.message);
  } finally {
    await pool.end();
  }
}
testConnection();