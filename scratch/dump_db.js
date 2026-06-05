const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '24062006',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_DATABASE || 'postgres',
});

async function dump() {
  try {
    const docs = await pool.query('SELECT * FROM doctors');
    console.log('=== DOCTORS ===');
    console.log(JSON.stringify(docs.rows, null, 2));

    const slts = await pool.query('SELECT * FROM slots');
    console.log('=== SLOTS ===');
    console.log(JSON.stringify(slts.rows, null, 2));

    const users = await pool.query('SELECT * FROM users');
    console.log('=== USERS ===');
    console.log(JSON.stringify(users.rows, null, 2));

    const reqs = await pool.query('SELECT * FROM doctor_requests');
    console.log('=== DOCTOR REQUESTS ===');
    console.log(JSON.stringify(reqs.rows, null, 2));
  } catch (err) {
    console.error('Error dumping db:', err);
  } finally {
    await pool.end();
  }
}

dump();
