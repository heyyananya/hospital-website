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
    // 1. Initial count
    let res = await pool.query('SELECT COUNT(*) FROM doctors');
    console.log('Initial doctors count:', res.rows[0].count);

    // 2. Perform a simulated save-item call for empty doctor array (all deleted)
    console.log('Simulating deletion of all doctors via API base path...');
    
    // Call server save-item endpoint directly using global fetch
    const apiResponse = await fetch('http://localhost:5000/api/sync/save-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: 'phh_doctors',
        data: [] // empty array means deleted
      })
    });
    
    const apiResult = await apiResponse.json();
    console.log('API Response:', apiResult);

    // 3. Verify database count
    res = await pool.query('SELECT COUNT(*) FROM doctors');
    console.log('Post-deletion doctors count:', res.rows[0].count);
    
    if (res.rows[0].count === '0') {
      console.log('SUCCESS: Doctor deletion verified successfully!');
    } else {
      console.error('FAILURE: Doctor count is not 0!');
    }
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    await pool.end();
  }
}

run();
