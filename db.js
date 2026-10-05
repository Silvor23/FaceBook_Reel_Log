require('dotenv').config();
const { Pool, types } = require('pg');
types.setTypeParser(1082, (value) => value);
const pool = new Pool();
module.exports = pool;
