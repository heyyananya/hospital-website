const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '24062006',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_DATABASE || 'hospital_management',
});

async function check() {
  try {
    const resReq = await pool.query('SELECT * FROM doctor_requests');
    console.log('doctor_requests count:', resReq.rows.length);
    console.log('doctor_requests rows:', resReq.rows);

    const resDoc = await pool.query('SELECT * FROM doctors');
    console.log('doctors count:', resDoc.rows.length);
    console.log('doctors rows:', resDoc.rows.map(d => ({ id: d.id, name: d.name, specialty: d.specialty })));

    await pool.end();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
