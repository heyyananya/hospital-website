const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '24062006',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_DATABASE || 'hospital_management',
});

async function checkSchedules() {
  console.log('--- Current Schedules (Slots) Table Content ---');
  const res = await pool.query('SELECT * FROM schedules');
  console.log(res.rows);
  
  console.log('\n--- Current Appointments Table Content ---');
  const appts = await pool.query('SELECT id, doctor_id, doctor_name, date, time, status FROM appointments');
  console.log(appts.rows);

  await pool.end();
}

checkSchedules().catch(err => {
  console.error(err);
  process.exit(1);
});
