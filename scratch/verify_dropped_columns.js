const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '24062006',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_DATABASE || 'hospital_management',
});

async function runCheck() {
  console.log('Checking columns for the appointments table...');
  const res = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'appointments'
  `);
  
  const columns = res.rows.map(row => row.column_name);
  console.log('Columns currently in appointments table:', columns);
  
  const hasAge = columns.includes('patient_age');
  const hasGender = columns.includes('patient_gender');
  
  if (hasAge || hasGender) {
    console.error('ERROR: appointments table still contains patient_age or patient_gender columns!');
    process.exit(1);
  } else {
    console.log('SUCCESS: patient_age and patient_gender columns have been successfully removed!');
  }
  
  await pool.end();
}

runCheck().catch(err => {
  console.error(err);
  process.exit(1);
});
