const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '24062006',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_DATABASE || 'hospital_management',
});

async function run() {
  try {
    const doc = {
      id: 'doc-3872',
      name: 'Dr. Ananya',
      specialty: 'Pulmonology',
      exp: '18',
      days: 'Monday , Friday',
      time: '10 AM - 1 AM',
      fee: 1000,
      status: 'Available',
      rating: 4.8,
      username: 'Ananya_123',
      password: '$2b$10$F48eOsuzdW8l6SLvvta9K.w3awCo5ofQhqdxLDoSLcaKIqnfZR/nq',
      email: 'patelananya1810@gmail.com'
    };

    await pool.query(`
      INSERT INTO doctors (id, name, specialty, exp, days, time, fee, status, rating, username, password, email)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (id) DO NOTHING
    `, [
      doc.id,
      doc.name,
      doc.specialty,
      doc.exp,
      doc.days,
      doc.time,
      doc.fee,
      doc.status,
      doc.rating,
      doc.username,
      doc.password,
      doc.email
    ]);
    console.log('SUCCESS: Dr. Ananya profile restored successfully!');
  } catch (err) {
    console.error('Error during restore:', err);
  } finally {
    await pool.end();
  }
}

run();
