const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' }); // load from workspace root

const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || '24062006';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;
const dbName = process.env.DB_DATABASE || 'hospital_management';

const pool = new Pool({
  user: dbUser,
  password: dbPassword,
  host: dbHost,
  port: dbPort,
  database: dbName,
});

async function runTest() {
  console.log('--- Starting Patient Registration Integration Test ---');
  
  const testEmail = 'test-patient-reg@example.com';
  const testPhone = '9999900000';
  const testName = 'Test Patient Registration';

  // 1. Cleanup existing test user from database if exists
  console.log('Cleaning up existing test data...');
  await pool.query('DELETE FROM patients WHERE LOWER(email) = $1 OR phone = $2', [testEmail, testPhone]);
  console.log('Cleanup complete.');

  // 2. Perform register POST request
  console.log('Sending registration request...');
  const response = await fetch('http://localhost:5000/api/auth/patient-register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: testName,
      email: testEmail,
      phone: testPhone
    })
  });

  const data = await response.json();
  console.log('API Response status:', response.status);
  console.log('API Response data:', data);

  if (response.status !== 200 || !data.success) {
    throw new Error('Registration API call failed.');
  }

  // 3. Query DB to verify the patient row was inserted
  console.log('Checking database table for inserted patient...');
  const dbCheck = await pool.query('SELECT * FROM patients WHERE LOWER(email) = $1 LIMIT 1', [testEmail]);
  if (dbCheck.rows.length === 0) {
    throw new Error('Patient row was not found in the patients database table.');
  }

  const registeredPatient = dbCheck.rows[0];
  console.log('Database Record Found:', registeredPatient);
  if (registeredPatient.name !== testName || registeredPatient.phone !== testPhone) {
    throw new Error('Database record columns do not match requested registration parameters.');
  }
  console.log('SUCCESS: Patient record verified in patients table.');

  // 4. Test duplicate email verification (should return 400)
  console.log('Testing duplicate email checks...');
  const duplicateEmailRes = await fetch('http://localhost:5000/api/auth/patient-register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Another Name',
      email: testEmail,
      phone: '9999911111'
    })
  });

  const duplicateEmailData = await duplicateEmailRes.json();
  console.log('Duplicate Email Response status (expected 400):', duplicateEmailRes.status);
  console.log('Duplicate Email Response data:', duplicateEmailData);
  if (duplicateEmailRes.status !== 400 || duplicateEmailData.success !== false) {
    throw new Error('Duplicate email registration should have failed with status 400.');
  }
  console.log('SUCCESS: Duplicate email check blocks registration.');

  // 5. Test duplicate phone verification (should return 400)
  console.log('Testing duplicate phone checks...');
  const duplicatePhoneRes = await fetch('http://localhost:5000/api/auth/patient-register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Another Name',
      email: 'another-email@example.com',
      phone: testPhone
    })
  });

  const duplicatePhoneData = await duplicatePhoneRes.json();
  console.log('Duplicate Phone Response status (expected 400):', duplicatePhoneRes.status);
  console.log('Duplicate Phone Response data:', duplicatePhoneData);
  if (duplicatePhoneRes.status !== 400 || duplicatePhoneData.success !== false) {
    throw new Error('Duplicate phone registration should have failed with status 400.');
  }
  console.log('SUCCESS: Duplicate phone check blocks registration.');

  // 6. Cleanup test user
  console.log('Cleaning up test data...');
  await pool.query('DELETE FROM patients WHERE id = $1', [registeredPatient.id]);
  console.log('Cleanup complete.');
  
  console.log('--- ALL INTEGRATION TESTS PASSED SUCCESSFULLY! ---');
  await pool.end();
}

runTest().catch(async (err) => {
  console.error('TEST FAILED:', err.message);
  await pool.end();
  process.exit(1);
});
