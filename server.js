require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { exec } = require('child_process');
const crypto = require('crypto');
const Razorpay = require('razorpay');

const distPath = path.join(__dirname, 'dist');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Razorpay SDK instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

// PostgreSQL Connection Pool Setup
let pool;

async function initDatabasePool() {
  if (pool) return;

  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (connectionString) {
    console.log('Connecting to PostgreSQL database via Connection String...');
    pool = new Pool({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false // Required for serverless hosting providers like Neon/Vercel Postgres
      }
    });

    try {
      const client = await pool.connect();
      client.release();
      console.log('Database Connected Successfully via Connection String');
    } catch (err) {
      console.error('Database connection test failed:', err.message);
      pool = null; // Reset pool so it can retry
      throw err;
    }
    return;
  }

  const dbUser = process.env.DB_USER || 'postgres';
  const dbPassword = process.env.DB_PASSWORD || '24062006';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || 5432;
  let dbName = process.env.DB_DATABASE || 'hospital_management';

  // 1. Try to connect to the target database
  const tempPool = new Pool({
    user: dbUser,
    password: dbPassword,
    host: dbHost,
    port: dbPort,
    database: dbName,
  });

  try {
    const client = await tempPool.connect();
    client.release();
    await tempPool.end();
    
    // Set active pool to target database
    pool = new Pool({
      user: dbUser,
      password: dbPassword,
      host: dbHost,
      port: dbPort,
      database: dbName,
    });
    console.log('Database Connected Successfully');
  } catch (err) {
    await tempPool.end();
    if (err.code === '3D000') {
      console.log(`Database "${dbName}" does not exist. Attempting to create it...`);
      const adminPool = new Pool({
        user: dbUser,
        password: dbPassword,
        host: dbHost,
        port: dbPort,
        database: 'postgres', // connect to default postgres db
      });
      try {
        const client = await adminPool.connect();
        await client.query(`CREATE DATABASE "${dbName.replace(/"/g, '""')}"`);
        client.release();
        await adminPool.end();
        console.log(`Database "${dbName}" created successfully.`);
        
        pool = new Pool({
          user: dbUser,
          password: dbPassword,
          host: dbHost,
          port: dbPort,
          database: dbName,
        });
        console.log('Database Connected Successfully');
      } catch (createErr) {
        console.error(`Failed to create database "${dbName}", falling back to "postgres" database:`, createErr.message);
        await adminPool.end();
        dbName = 'postgres';
        pool = new Pool({
          user: dbUser,
          password: dbPassword,
          host: dbHost,
          port: dbPort,
          database: dbName,
        });
        console.log('Database Connected Successfully');
      }
    } else {
      console.error('Database Connection Error:', err);
      // Fallback in case of other errors
      console.log('Falling back to "postgres" database connection...');
      pool = new Pool({
        user: dbUser,
        password: dbPassword,
        host: dbHost,
        port: dbPort,
        database: 'postgres',
      });
      console.log('Database Connected Successfully');
    }
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// Enable CORS for frontend clients running on different ports (e.g. Live Server)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Doctor-ID');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  
  // Disable browser caching for static assets and APIs to prevent caching stale client scripts
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Database connection middleware (critical for serverless environments like Vercel)
app.use(async (req, res, next) => {
  try {
    await initDatabasePool();
    await initDbSchema();
  } catch (err) {
    console.error('Database lazy-init failed inside middleware:', err.message);
  }
  next();
});

const JWT_SECRET = process.env.JWT_SECRET || 'palanpur_health_hub_secret_key_123';

function signToken(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${base64Header}.${base64Payload}`)
    .digest('base64url');
  return `${base64Header}.${base64Payload}.${signature}`;
}

function verifyToken(token) {
  try {
    const [base64Header, base64Payload, signature] = token.split('.');
    if (!base64Header || !base64Payload || !signature) return null;
    
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${base64Header}.${base64Payload}`)
      .digest('base64url');
    
    if (signature !== expectedSignature) return null;
    
    const payload = JSON.parse(Buffer.from(base64Payload, 'base64url').toString('utf8'));
    return payload;
  } catch (err) {
    return null;
  }
}

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized access. Authorization header is missing or invalid.' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  
  if (!payload || payload.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden. Access is restricted to system administrators.' });
  }

  req.admin = payload;
  next();
}

const getRandomAge = () => Math.floor(Math.random() * 58) + 18; // 18 to 75
const getRandomGender = () => {
  const rand = Math.random();
  if (rand < 0.48) return 'Male';
  if (rand < 0.96) return 'Female';
  return 'Other';
};

// Serve static frontend files
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
} else {
  app.use(express.static(__dirname));
}

// Test database connection endpoint (useful for debugging)
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, message: 'Database connected successfully!', time: result.rows[0].now });
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Staff & User Registration API Route
app.post('/api/auth/register', async (req, res) => {
  const { username, password, role, name } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ success: false, message: 'Username, Password, and Role are required.' });
  }

  try {
    const checkUsername = username.trim().toLowerCase();
    
    // Check if user credentials exist in users table
    const userCheck = await pool.query('SELECT id FROM users WHERE LOWER(username) = $1 LIMIT 1', [checkUsername]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Username is already taken.' });
    }

    // Hash the password with bcrypt for security
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`SQL Query Execution: Inserting new user in users for ${username}`);

    const result = await pool.query(
      `INSERT INTO users (username, password, role, name, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, username, role, name, status`,
      [checkUsername, hashedPassword, role, name ? name.trim() : null, 'active']
    );

    console.log("Database insertion result (users):", result.rows[0]);

    res.json({
      success: true,
      message: 'Registration successful!',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Database registration error:', err);
    res.status(500).json({ success: false, message: 'Database connection failed. Please ensure your PostgreSQL server is active.' });
  }
});

// Unified Staff Login API Route
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and Password are required.' });
  }

  try {
    const inputVal = username.trim().toLowerCase();

    // 1. Check users table (Admins, Receptionist)
    const userResult = await pool.query(
      'SELECT id, username, password, role, name FROM users WHERE LOWER(username) = $1 LIMIT 1',
      [inputVal]
    );

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      const dbPassword = user.password;
      let isMatch = false;

      // Check password (tries bcrypt first, then falls back to plain-text check)
      try {
        isMatch = await bcrypt.compare(password, dbPassword);
      } catch (bcryptErr) {
        isMatch = (password === dbPassword);
      }

      if (!isMatch && password === dbPassword) {
        isMatch = true;
      }

      if (isMatch) {
        const token = signToken({ id: user.id, username: user.username, role: user.role });
        return res.json({
          success: true,
          message: 'Staff authentication successful.',
          token: token,
          user: {
            id: user.id.toString(),
            name: user.name || user.username || 'Staff Member',
            email: `${user.username}@hub.com`,
            role: user.role
          }
        });
      }
    }

    // 2. Check doctors table (if not found in users table or password mismatch)
    const docResult = await pool.query(
      'SELECT id, name, username, password, email, status FROM doctors WHERE LOWER(username) = $1 OR LOWER(email) = $1 LIMIT 1',
      [inputVal]
    );

    if (docResult.rows.length > 0) {
      const doc = docResult.rows[0];
      const dbPassword = doc.password;
      let isMatch = false;

      try {
        isMatch = await bcrypt.compare(password, dbPassword);
      } catch (bcryptErr) {
        isMatch = (password === dbPassword);
      }

      if (!isMatch && password === dbPassword) {
        isMatch = true;
      }

      if (isMatch) {
        // Check if registration is pending admin approval
        if (doc.status === 'Pending') {
          return res.status(403).json({ 
            success: false, 
            message: 'Your profile registration is currently pending Chief Admin Doctor approval.' 
          });
        }

        const token = signToken({ id: doc.id, username: doc.username, role: 'doctor' });
        return res.json({
          success: true,
          message: 'Doctor authentication successful.',
          token: token,
          user: {
            id: doc.id,
            name: doc.name,
            email: doc.email || `${doc.username}@hub.com`,
            role: 'doctor',
            docId: doc.id
          }
        });
      }
    }

    // 3. Check doctor_requests table (if not found in users or doctors)
    const reqResult = await pool.query(
      'SELECT id, name, username, password, email, status FROM doctor_requests WHERE LOWER(username) = $1 OR LOWER(email) = $1 LIMIT 1',
      [inputVal]
    );

    if (reqResult.rows.length > 0) {
      const docReq = reqResult.rows[0];
      const dbPassword = docReq.password;
      let isMatch = false;

      try {
        isMatch = await bcrypt.compare(password, dbPassword);
      } catch (bcryptErr) {
        isMatch = (password === dbPassword);
      }

      if (!isMatch && password === dbPassword) {
        isMatch = true;
      }

      if (isMatch) {
        return res.status(403).json({ 
          success: false, 
          message: 'Your profile registration is currently pending Chief Admin Doctor approval.' 
        });
      }
    }

    // If we reach here, authentication failed
    return res.status(401).json({ success: false, message: 'Invalid username/email or password.' });

  } catch (err) {
    console.error('Database server login error:', err);
    res.status(500).json({ success: false, message: 'Database connection failed. Please ensure your PostgreSQL server is active.' });
  }
});

// Patient Gateway Login & Auto-Registration API Route
app.post('/api/auth/patient-login', async (req, res) => {
  const { loginVal } = req.body;
  if (!loginVal) {
    return res.status(400).json({ success: false, message: 'Email or mobile number is required.' });
  }

  try {
    const inputVal = loginVal.trim().toLowerCase();
    const isEmail = inputVal.includes('@');
    const normPhone = inputVal.replace(/\D/g, '').slice(-10);

    let patient = null;

    // 1. Check if patient already exists in patients table
    if (isEmail) {
      const result = await pool.query('SELECT * FROM patients WHERE LOWER(email) = $1 LIMIT 1', [inputVal]);
      if (result.rows.length > 0) {
        patient = result.rows[0];
      }
    } else if (normPhone) {
      const result = await pool.query('SELECT * FROM patients WHERE phone LIKE $1 LIMIT 1', [`%${normPhone}`]);
      if (result.rows.length > 0) {
        patient = result.rows[0];
      }
    }

    if (patient) {
      return res.json({
        success: true,
        message: 'Patient profile retrieved.',
        user: {
          id: patient.id.toString(),
          name: patient.name || 'Guest Patient',
          email: patient.email || '',
          phone: patient.phone || '',
          role: 'patient'
        }
      });
    }

    // 2. Not found in patients table. Check appointments table to see if they've booked before
    let matchedApp = null;
    if (isEmail) {
      const appResult = await pool.query('SELECT * FROM appointments WHERE LOWER(patient_email) = $1 ORDER BY date DESC, time DESC LIMIT 1', [inputVal]);
      if (appResult.rows.length > 0) {
        matchedApp = appResult.rows[0];
      }
    } else if (normPhone) {
      const appResult = await pool.query('SELECT * FROM appointments WHERE patient_phone LIKE $1 ORDER BY date DESC, time DESC LIMIT 1', [`%${normPhone}`]);
      if (appResult.rows.length > 0) {
        matchedApp = appResult.rows[0];
      }
    }

    let patientName = 'Guest Patient';
    let patientEmail = isEmail ? inputVal : '';
    let patientPhone = !isEmail ? loginVal : '';

    if (matchedApp) {
      patientName = matchedApp.patient_name || 'Guest Patient';
      if (matchedApp.patient_email && matchedApp.patient_email !== 'N/A') {
        patientEmail = matchedApp.patient_email;
      }
      if (matchedApp.patient_phone) {
        patientPhone = matchedApp.patient_phone;
      }
    }

    // 3. Register/Insert the patient in the patients table
    let newPatient;
    try {
      const insertResult = await pool.query(
        `INSERT INTO patients (name, email, phone)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [patientName, patientEmail || null, patientPhone || null]
      );
      newPatient = insertResult.rows[0];
    } catch (dbErr) {
      // In case of conflict, fetch again
      if (isEmail) {
        const result = await pool.query('SELECT * FROM patients WHERE LOWER(email) = $1 LIMIT 1', [inputVal]);
        newPatient = result.rows[0];
      } else if (normPhone) {
        const result = await pool.query('SELECT * FROM patients WHERE phone LIKE $1 LIMIT 1', [`%${normPhone}`]);
        newPatient = result.rows[0];
      }
    }

    if (!newPatient) {
      newPatient = { name: patientName, email: patientEmail, phone: patientPhone, id: 'temp' };
    }

    res.json({
      success: true,
      message: 'Patient profile registered and logged in successfully.',
      user: {
        id: newPatient.id.toString(),
        name: newPatient.name || 'Guest Patient',
        email: newPatient.email || '',
        phone: newPatient.phone || '',
        role: 'patient'
      }
    });

  } catch (err) {
    console.error('Patient login error:', err);
    res.status(500).json({ success: false, message: 'Database query failed.', error: err.message });
  }
});

// Patient Gateway Register API Route
app.post('/api/auth/patient-register', async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Full Name is required.' });
  }
  if (!email && !phone) {
    return res.status(400).json({ success: false, message: 'Email ID or Mobile Number is required.' });
  }

  try {
    const emailVal = email ? email.trim().toLowerCase() : null;
    const phoneVal = phone ? phone.trim() : null;
    const normPhone = phoneVal ? phoneVal.replace(/\D/g, '').slice(-10) : "";

    // 1. Check if patient with this email already exists
    if (emailVal) {
      const emailCheck = await pool.query('SELECT * FROM patients WHERE LOWER(email) = $1 LIMIT 1', [emailVal]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'A patient with this email is already registered.' });
      }
    }

    // 2. Check if patient with this phone already exists
    if (normPhone) {
      const phoneCheck = await pool.query('SELECT * FROM patients WHERE phone LIKE $1 LIMIT 1', [`%${normPhone}`]);
      if (phoneCheck.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'A patient with this mobile number is already registered.' });
      }
    }

    // 3. Register/Insert the patient in the patients table
    const insertResult = await pool.query(
      `INSERT INTO patients (name, email, phone)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name.trim(), emailVal || null, phoneVal || null]
    );

    const newPatient = insertResult.rows[0];

    res.json({
      success: true,
      message: 'Patient registered and logged in successfully.',
      user: {
        id: newPatient.id.toString(),
        name: newPatient.name,
        email: newPatient.email || '',
        phone: newPatient.phone || '',
        role: 'patient'
      }
    });

  } catch (err) {
    console.error('Patient registration error:', err);
    res.status(500).json({ success: false, message: 'Database registration query failed.', error: err.message });
  }
});

const handleDoctorRegistration = async (req, res) => {
  const { name, specialty, exp, days, time, fee, username, email, password } = req.body;

  if (!name || !specialty || !username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Required fields (Name, Specialty, Username, Email, Password) are missing.' });
  }

  try {
    const checkUsername = username.trim().toLowerCase();
    const checkEmail = email.trim().toLowerCase();

    console.log("SQL Query Execution: Checking unique credentials for doctor registration:", checkUsername);

    // 1. Check if user credentials exist in users table
    const userCheck = await pool.query(
      'SELECT id FROM users WHERE LOWER(username) = $1 LIMIT 1',
      [checkUsername]
    );
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Username is already taken by a staff member.' });
    }

    // 2. Check if user credentials exist in doctors or doctor_requests table
    const docCheck = await pool.query(
      'SELECT id FROM doctors WHERE LOWER(username) = $1 OR LOWER(email) = $2 LIMIT 1',
      [checkUsername, checkEmail]
    );
    if (docCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Username or Email is already registered.' });
    }

    const reqCheck = await pool.query(
      'SELECT id FROM doctor_requests WHERE LOWER(username) = $1 OR LOWER(email) = $2 LIMIT 1',
      [checkUsername, checkEmail]
    );
    if (reqCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'A registration request with this Username or Email is already pending approval.' });
    }

    // 3. Generate a unique doctor ID
    let isUnique = false;
    let generatedDocId = '';
    while (!isUnique) {
      const randNum = Math.floor(1000 + Math.random() * 9000);
      generatedDocId = `doc-${randNum}`;
      const idCheck1 = await pool.query('SELECT id FROM doctors WHERE id = $1', [generatedDocId]);
      const idCheck2 = await pool.query('SELECT id FROM doctor_requests WHERE id = $1', [generatedDocId]);
      if (idCheck1.rows.length === 0 && idCheck2.rows.length === 0) {
        isUnique = true;
      }
    }

    // Hash the password with bcrypt for security
    const hashedPassword = await bcrypt.hash(password, 10);
    const numericFee = parseInt(fee, 10) || 0;

    console.log("SQL Query Execution: Inserting new request in doctor_requests for", name);

    // 4. Insert doctor profile with 'Pending' status into doctor_requests table
    const insertResult = await pool.query(
      `INSERT INTO doctor_requests (id, name, specialty, exp, days, time, fee, status, rating, username, password, email)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [
        generatedDocId,
        name.trim(),
        specialty,
        exp ? exp.trim() : '1 Year',
        days ? days.trim() : 'Monday to Friday',
        time ? time.trim() : '9 AM - 5 PM',
        numericFee,
        'Pending', // Set status to Pending
        4.8,       // Default initial rating
        username.trim(),
        hashedPassword, // Hashed password
        email.trim()
      ]
    );

    console.log("Database insertion result (doctor_requests):", insertResult.rows[0]);

    res.json({
      success: true,
      message: 'Registration successful! Your profile is pending Chief Admin approval.',
      docId: generatedDocId
    });

  } catch (err) {
    console.error('Database server doctor registration error:', err);
    res.status(500).json({ success: false, message: 'Database connection failed. Please ensure your PostgreSQL server is active.' });
  }
};

app.post('/api/auth/register-doctor', handleDoctorRegistration);
app.post('/api/doctor-request', handleDoctorRegistration);

// Database Schema Verification
let schemaInitialized = false;
async function initDbSchema() {
  if (schemaInitialized) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        specialty VARCHAR(100) NOT NULL,
        exp VARCHAR(50),
        days VARCHAR(100),
        time VARCHAR(100),
        fee INT,
        status VARCHAR(50),
        rating NUMERIC(3,2),
        username VARCHAR(100),
        password VARCHAR(100),
        email VARCHAR(255)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS doctor_requests (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        specialty VARCHAR(100) NOT NULL,
        exp VARCHAR(50),
        days VARCHAR(100),
        time VARCHAR(100),
        fee INT,
        status VARCHAR(50),
        rating NUMERIC(3,2),
        username VARCHAR(100),
        password VARCHAR(100),
        email VARCHAR(255)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id VARCHAR(100) PRIMARY KEY,
        doctor_id VARCHAR(50),
        doctor_name VARCHAR(255),
        patient_name VARCHAR(255),
        patient_phone VARCHAR(50),
        patient_email VARCHAR(255),
        symptom VARCHAR(255),
        date VARCHAR(50),
        time VARCHAR(50),
        pay_id VARCHAR(100),
        fee_paid INT,
        status VARCHAR(50),
        reschedule_reason TEXT,
        old_slot VARCHAR(255),
        new_slot VARCHAR(255),
        rescheduled_by VARCHAR(255),
        rescheduled_at VARCHAR(100)
      );
    `);

    await pool.query(`ALTER TABLE appointments DROP COLUMN IF EXISTS prescription;`);
    await pool.query(`ALTER TABLE appointments DROP COLUMN IF EXISTS diagnosis;`);
    await pool.query(`ALTER TABLE appointments DROP COLUMN IF EXISTS token_number;`);
    await pool.query(`ALTER TABLE appointments DROP COLUMN IF EXISTS patient_age;`);
    await pool.query(`ALTER TABLE appointments DROP COLUMN IF EXISTS patient_gender;`);

    await pool.query(`DROP TABLE IF EXISTS slots CASCADE;`);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id VARCHAR(100) PRIMARY KEY,
        doctor_id VARCHAR(50),
        doctor_name VARCHAR(255),
        date VARCHAR(50),
        time VARCHAR(50),
        status VARCHAR(50),
        booking_id VARCHAR(100)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT
      );
    `);

    const deptCheck = await pool.query("SELECT COUNT(*) FROM departments");
    if (parseInt(deptCheck.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO departments (name, description) VALUES
        ('General Medicine', 'General primary care and physical checkups'),
        ('Cardiology', 'Heart health and blood pressure monitoring'),
        ('Neurology', 'Brain and nervous system diagnostic care'),
        ('Pulmonology', 'Lungs, asthma, and breathing issues specialist'),
        ('Orthopedics', 'Bone, joint, and fracture treatments'),
        ('Gynecology', 'Womens health and maternity services'),
        ('Pediatrics', 'Children health, vaccinations and development'),
        ('Dermatology', 'Skin conditions and cosmetic checks'),
        ('ENT', 'Ear, nose, throat and hearing support'),
        ('Psychology', 'Mental health counseling and therapy support')
      `);
      console.log('Seeded default departments.');
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(100),
        message TEXT,
        timestamp VARCHAR(100),
        read_status BOOLEAN DEFAULT FALSE
      );
    `);

    await pool.query(`DROP TABLE IF EXISTS queue_state CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS disease_map CASCADE;`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        name VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active'
      );
    `);

    // Seed default users if table is empty
    const userCheck = await pool.query("SELECT COUNT(*) FROM users");
    if (parseInt(userCheck.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO users (username, password, role, name, status) VALUES
        ('ajit', 'ajit123', 'admin', 'Dr. Ajit B. Patel', 'active'),
        ('ananya', 'ananya123', 'admin', 'Ananya Patel', 'active'),
        ('receptionist', 'pass123', 'receptionist', 'Front Desk Receptionist', 'active')
      `);
      console.log('Seeded default admin and receptionist users.');
    } else {
      // Check if receptionist role is present, if not seed it
      const recepCheck = await pool.query("SELECT * FROM users WHERE role = 'receptionist' LIMIT 1");
      if (recepCheck.rows.length === 0) {
        await pool.query(`
          INSERT INTO users (username, password, role, name, status)
          VALUES ('receptionist', 'pass123', 'receptionist', 'Front Desk Receptionist', 'active')
        `);
        console.log('Seeded receptionist user.');
      }
    }

    // Default doctor and schedule seeding removed per request.

    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create patients table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(50) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database tables successfully verified and initialized.');
    schemaInitialized = true;
  } catch (err) {
    console.error('Error initializing database tables:', err);
  }
}

// Sync GET State API
app.get('/api/sync/get-state', async (req, res) => {
  try {
    const doctorsResult = await pool.query('SELECT * FROM doctors');
    const doctorRequestsResult = await pool.query('SELECT * FROM doctor_requests');
    const appointmentsResult = await pool.query(`
      SELECT a.*, d.specialty AS doc_specialty
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
    `);
    const schedulesResult = await pool.query('SELECT * FROM schedules');
    const departmentsResult = await pool.query('SELECT * FROM departments');
    const notificationsResult = await pool.query('SELECT * FROM notifications');

    res.json({
      success: true,
      doctors: doctorsResult.rows,
      doctorRequests: doctorRequestsResult.rows,
      appointments: appointmentsResult.rows.map(app => {
        return {
          id: app.id,
          doctorId: app.doctor_id,
          doctorName: app.doctor_name,
          patientName: app.patient_name,
          patientPhone: app.patient_phone,
          patientEmail: app.patient_email,
          symptoms: app.symptom,
          date: app.date,
          slot: app.time,
          payId: app.pay_id,
          fee: app.fee_paid,
          status: app.status,
          rescheduleReason: app.reschedule_reason,
          oldSlot: app.old_slot,
          newSlot: app.new_slot,
          rescheduledBy: app.rescheduled_by,
          rescheduledAt: app.rescheduled_at,
          dept: app.doc_specialty || 'General Medicine',
          appointment_date: app.date,
          appointment_time: app.time
        };
      }),
      slots: schedulesResult.rows.map(slot => ({
        id: slot.id,
        doctorId: slot.doctor_id,
        doctorName: slot.doctor_name,
        date: slot.date,
        time: slot.time,
        status: slot.status,
        bookingId: slot.booking_id
      })),
      departments: departmentsResult.rows,
      notifications: notificationsResult.rows
    });
  } catch (err) {
    console.error('Error fetching state from database:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fetch all appointments (REST)
app.get('/api/appointments', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, d.specialty AS doc_specialty
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.date DESC, a.time DESC
    `);
    res.json({
      success: true,
      appointments: result.rows.map(app => {
        return {
          id: app.id,
          doctorId: app.doctor_id,
          doctorName: app.doctor_name,
          patientName: app.patient_name,
          patientPhone: app.patient_phone,
          patientEmail: app.patient_email,
          symptoms: app.symptom,
          date: app.date,
          slot: app.time,
          payId: app.pay_id,
          fee: app.fee_paid,
          status: app.status,
          rescheduleReason: app.reschedule_reason,
          oldSlot: app.old_slot,
          newSlot: app.new_slot,
          rescheduledBy: app.rescheduled_by,
          rescheduledAt: app.rescheduled_at,
          dept: app.doc_specialty || 'General Medicine',
          appointment_date: app.date,
          appointment_time: app.time
        };
      })
    });
  } catch (err) {
    console.error('Error fetching appointments REST:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fetch all schedules (REST)
app.get('/api/schedules', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM schedules ORDER BY date ASC, time ASC');
    res.json({
      success: true,
      schedules: result.rows.map(slot => ({
        id: slot.id,
        doctorId: slot.doctor_id,
        doctorName: slot.doctor_name,
        date: slot.date,
        time: slot.time,
        status: slot.status,
        bookingId: slot.booking_id
      }))
    });
  } catch (err) {
    console.error('Error fetching schedules REST:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fetch all notifications (REST)
app.get('/api/notifications', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notifications ORDER BY timestamp DESC');
    res.json({
      success: true,
      notifications: result.rows
    });
  } catch (err) {
    console.error('Error fetching notifications REST:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fetch all doctors (REST)
app.get('/api/doctors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM doctors ORDER BY name ASC');
    res.json({
      success: true,
      doctors: result.rows
    });
  } catch (err) {
    console.error('Error fetching doctors REST:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fetch all departments (REST)
app.get('/api/departments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM departments ORDER BY name ASC');
    res.json({
      success: true,
      departments: result.rows
    });
  } catch (err) {
    console.error('Error fetching departments REST:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fetch all doctor requests (REST)
app.get('/api/doctor-requests', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM doctor_requests ORDER BY name ASC');
    res.json({
      success: true,
      doctorRequests: result.rows
    });
  } catch (err) {
    console.error('Error fetching doctor requests REST:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Sync SAVE Item API
app.post('/api/sync/save-item', async (req, res) => {
  const { key, data } = req.body;

  if (!key) {
    return res.status(400).json({ success: false, message: 'Key is required.' });
  }

  try {
    if (key === 'phh_doctors') {
      await pool.query('BEGIN');
      await pool.query('DELETE FROM doctors');
      for (const doc of data) {
        await pool.query(`
          INSERT INTO doctors (id, name, specialty, exp, days, time, fee, status, rating, username, password, email)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [
          doc.id || null,
          doc.name || null,
          doc.specialty || doc.speciality || doc.dept || null,
          doc.exp || null,
          doc.days || null,
          doc.time || null,
          doc.fee !== undefined && doc.fee !== null ? Number(doc.fee) : null,
          doc.status || null,
          doc.rating !== undefined && doc.rating !== null ? Number(doc.rating) : null,
          doc.username || null,
          doc.password || null,
          doc.email || null
        ]);
      }
      await pool.query('COMMIT');
    } else if (key === 'phh_doctor_requests') {
      await pool.query('BEGIN');
      await pool.query('DELETE FROM doctor_requests');
      for (const reqDoc of data) {
        await pool.query(`
          INSERT INTO doctor_requests (id, name, specialty, exp, days, time, fee, status, rating, username, password, email)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [
          reqDoc.id || null,
          reqDoc.name || null,
          reqDoc.specialty || reqDoc.speciality || reqDoc.dept || null,
          reqDoc.exp || null,
          reqDoc.days || null,
          reqDoc.time || null,
          reqDoc.fee !== undefined && reqDoc.fee !== null ? Number(reqDoc.fee) : null,
          reqDoc.status || null,
          reqDoc.rating !== undefined && reqDoc.rating !== null ? Number(reqDoc.rating) : null,
          reqDoc.username || null,
          reqDoc.password || null,
          reqDoc.email || null
        ]);
      }
      await pool.query('COMMIT');
    } else if (key === 'phh_appointments') {
      await pool.query('BEGIN');
      
      // Get existing appointments to compare and trigger notifications automatically
      const existingResult = await pool.query('SELECT id, status, date, time FROM appointments');
      const existingMap = new Map(existingResult.rows.map(a => [a.id, a]));

      await pool.query('DELETE FROM appointments');
      for (const app of data) {
        const appId = app.id;
        const incomingStatus = app.status || null;
        const incomingDate = app.date || null;
        const incomingTime = app.slot || app.time || null;
        const docId = app.doctorId || app.doctor_id || null;

        // Check if there was an existing record
        const existing = existingMap.get(appId);
        if (!existing) {
          // 1. New appointment notification
          await pool.query(
            'INSERT INTO notifications (user_id, message, timestamp, read_status) VALUES ($1, $2, $3, $4)',
            [docId || 'admin', `New appointment ${appId} booked for patient ${app.patientName || app.patient_name || 'Patient'} on ${incomingDate} at ${incomingTime}.`, new Date().toISOString(), false]
          );
        } else {
          // 2. Status changed to Cancelled
          if (incomingStatus === 'Cancelled' && existing.status !== 'Cancelled') {
            await pool.query(
              'INSERT INTO notifications (user_id, message, timestamp, read_status) VALUES ($1, $2, $3, $4)',
              [docId || 'admin', `Appointment ${appId} has been cancelled by patient or receptionist.`, new Date().toISOString(), false]
            );
          }
          // 3. Rescheduled notification (date or time changed)
          if ((incomingDate !== existing.date || incomingTime !== existing.time) && incomingStatus !== 'Cancelled') {
            await pool.query(
              'INSERT INTO notifications (user_id, message, timestamp, read_status) VALUES ($1, $2, $3, $4)',
              [docId || 'admin', `Appointment ${appId} has been rescheduled to ${incomingDate} (${incomingTime}).`, new Date().toISOString(), false]
            );
          }
        }
        await pool.query(`
          INSERT INTO appointments (id, doctor_id, doctor_name, patient_name, patient_phone, patient_email, symptom, date, time, pay_id, fee_paid, status, reschedule_reason, old_slot, new_slot, rescheduled_by, rescheduled_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        `, [
          appId || null,
          docId,
          app.doctorName || app.doctor_name || null,
          app.patientName || app.patient_name || null,
          app.patientPhone || app.patient_phone || null,
          app.patientEmail || app.patient_email || null,
          app.symptoms || app.symptom || null,
          incomingDate,
          incomingTime,
          app.payId || app.pay_id || null,
          app.fee !== undefined && app.fee !== null ? Number(app.fee) : (app.fee_paid !== undefined && app.fee_paid !== null ? Number(app.fee_paid) : null),
          incomingStatus,
          app.rescheduleReason || app.reschedule_reason || null,
          app.oldSlot || app.old_slot || null,
          app.newSlot || app.new_slot || null,
          app.rescheduledBy || app.rescheduled_by || null,
          app.rescheduledAt || app.rescheduled_at || null
        ]);
      }
      await pool.query('COMMIT');
    } else if (key === 'phh_slots') {
      await pool.query('BEGIN');
      await pool.query('DELETE FROM schedules');
      for (const slot of data) {
        await pool.query(`
          INSERT INTO schedules (id, doctor_id, doctor_name, date, time, status, booking_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          slot.id || null,
          slot.doctorId || slot.doctor_id || null,
          slot.doctorName || slot.doctor_name || null,
          slot.date || null,
          slot.time || null,
          slot.status || null,
          slot.bookingId || slot.booking_id || null
        ]);
      }
      await pool.query('COMMIT');
    } else if (key === 'phh_notifications') {
      await pool.query('BEGIN');
      await pool.query('DELETE FROM notifications');
      for (const notif of data) {
        const notifId = notif.id ? parseInt(notif.id, 10) : null;
        if (notifId && !isNaN(notifId)) {
          await pool.query(`
            INSERT INTO notifications (id, user_id, message, timestamp, read_status)
            VALUES ($1, $2, $3, $4, $5)
          `, [
            notifId,
            notif.userId || notif.user_id || null,
            notif.message || null,
            notif.timestamp || null,
            notif.readStatus !== undefined && notif.readStatus !== null ? notif.readStatus : (notif.read_status !== undefined && notif.read_status !== null ? notif.read_status : false)
          ]);
        } else {
          await pool.query(`
            INSERT INTO notifications (user_id, message, timestamp, read_status)
            VALUES ($1, $2, $3, $4)
          `, [
            notif.userId || notif.user_id || null,
            notif.message || null,
            notif.timestamp || null,
            notif.readStatus !== undefined && notif.readStatus !== null ? notif.readStatus : (notif.read_status !== undefined && notif.read_status !== null ? notif.read_status : false)
          ]);
        }
      }
      await pool.query('COMMIT');
    }

    res.json({ success: true, message: `State for ${key} saved successfully.` });
  } catch (err) {
    console.error(`Error saving ${key} to database:`, err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Chief Admin Add Department API Route
app.post('/api/admin/add-department', async (req, res) => {
  const { adminId, name, description } = req.body;

  if (!adminId || !name) {
    return res.status(400).json({ success: false, message: 'Admin ID and Department Name are required.' });
  }

  try {
    // Verify if the adminId belongs to the Chief Admin (username 'ajit')
    const userResult = await pool.query(
      'SELECT id, username, role FROM users WHERE id = $1 LIMIT 1',
      [parseInt(adminId, 10)]
    );

    if (userResult.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Invalid Admin credentials.' });
    }

    const user = userResult.rows[0];
    if (user.role !== 'admin' || user.username !== 'ajit') {
      return res.status(403).json({ success: false, message: 'Unauthorized. Only the Chief Admin can add departments.' });
    }

    // Insert department
    await pool.query(
      'INSERT INTO departments (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
      [name.trim(), description ? description.trim() : '']
    );

    // Get all departments to return
    const deptsResult = await pool.query('SELECT * FROM departments');

    res.json({
      success: true,
      message: `Department "${name}" added successfully.`,
      departments: deptsResult.rows
    });
  } catch (err) {
    console.error('Error adding department:', err);
    res.status(500).json({ success: false, message: 'Failed to add department.', error: err.message });
  }
});

// GET /api/doctor/appointments-by-date?date=YYYY-MM-DD
app.get('/api/doctor/appointments-by-date', async (req, res) => {
  try {
    const { date } = req.query;
    let doctorId = req.query.doctorId;

    // Fallback to headers if not in query
    if (!doctorId) {
      const authHeader = req.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        doctorId = authHeader.substring(7);
      }
    }
    if (!doctorId) {
      doctorId = req.headers['x-doctor-id'];
    }

    // Debug logging
    console.log(`[DEBUG] Incoming appointments-by-date request:`);
    console.log(`  - Selected Date: ${date}`);
    console.log(`  - Doctor ID: ${doctorId}`);

    if (!date || !doctorId) {
      console.warn(`[DEBUG] Missing required parameters. Date: ${date}, Doctor ID: ${doctorId}`);
      return res.status(400).json({
        success: false,
        message: 'Date and Doctor ID parameters are required.'
      });
    }

    const result = await pool.query(
      `
      SELECT *
      FROM appointments
      WHERE date = $1
      AND doctor_id = $2
      ORDER BY time ASC
      `,
      [date, doctorId]
    );

    console.log(`[DEBUG] Query completed successfully. Result count: ${result.rows.length}`);

    // Map database columns to standard client fields
    const appointments = result.rows.map(app => ({
      id: app.id,
      doctorId: app.doctor_id,
      doctorName: app.doctor_name,
      patientName: app.patient_name,
      patientPhone: app.patient_phone || '',
      patientEmail: app.patient_email || '',
      symptoms: app.symptom || 'No Symptoms Mentioned',
      date: app.date,
      slot: app.time,
      payId: app.pay_id,
      fee: app.fee_paid,
      status: app.status,
      appointment_date: app.date,
      appointment_time: app.time
    }));

    res.json({
      success: true,
      totalPatients: appointments.length,
      appointments: appointments,
      patients: appointments
    });

  } catch (error) {
    console.error(`[ERROR] Database error in appointments-by-date:`, error.stack);
    res.status(500).json({
      success: false,
      message: 'Database error',
      error: error.message
    });
  }
});

// Admin Doctor Approval Endpoint
app.post('/api/admin/approve-doctor', async (req, res) => {
  const { docId } = req.body;

  if (!docId) {
    return res.status(400).json({ success: false, message: 'Doctor request ID is required.' });
  }

  try {
    await pool.query('BEGIN');

    // 1. Find request details
    const reqResult = await pool.query('SELECT * FROM doctor_requests WHERE id = $1', [docId]);
    if (reqResult.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Doctor request not found.' });
    }

    const doc = reqResult.rows[0];

    // 2. Insert into doctors table with status 'Available'
    await pool.query(`
      INSERT INTO doctors (id, name, specialty, exp, days, time, fee, status, rating, username, password, email)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `, [doc.id, doc.name, doc.specialty, doc.exp, doc.days, doc.time, doc.fee, 'Available', doc.rating, doc.username, doc.password, doc.email]);

    // Create notification for approved doctor request
    await pool.query(
      'INSERT INTO notifications (user_id, message, timestamp, read_status) VALUES ($1, $2, $3, $4)',
      [doc.id, `Congratulations Dr. ${doc.name}! Your specialist profile has been approved and is now active.`, new Date().toISOString(), false]
    );

    // 3. Delete from doctor_requests table
    await pool.query('DELETE FROM doctor_requests WHERE id = $1', [docId]);

    await pool.query('COMMIT');

    // 4. Retrieve updated collections to return to client for direct localStorage update
    const doctorsResult = await pool.query('SELECT * FROM doctors');
    const doctorRequestsResult = await pool.query('SELECT * FROM doctor_requests');

    res.json({
      success: true,
      message: `Doctor ${doc.name} has been successfully approved and marked as Available.`,
      doctors: doctorsResult.rows,
      doctorRequests: doctorRequestsResult.rows
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Database server doctor approval error:', err);
    res.status(500).json({ success: false, message: 'Failed to approve doctor request.', error: err.message });
  }
});

// Admin Doctor Rejection Endpoint
app.post('/api/admin/reject-doctor', async (req, res) => {
  const { docId } = req.body;

  if (!docId) {
    return res.status(400).json({ success: false, message: 'Doctor request ID is required.' });
  }

  try {
    await pool.query('BEGIN');

    // 1. Delete from doctor_requests table
    const deleteResult = await pool.query('DELETE FROM doctor_requests WHERE id = $1 RETURNING name', [docId]);
    if (deleteResult.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Doctor request not found.' });
    }

    const docName = deleteResult.rows[0].name;

    // Create notification for rejected doctor request
    await pool.query(
      'INSERT INTO notifications (user_id, message, timestamp, read_status) VALUES ($1, $2, $3, $4)',
      [docId, `Your specialist profile registration request has been rejected.`, new Date().toISOString(), false]
    );

    await pool.query('COMMIT');

    // 2. Retrieve updated collections
    const doctorsResult = await pool.query('SELECT * FROM doctors');
    const doctorRequestsResult = await pool.query('SELECT * FROM doctor_requests');

    res.json({
      success: true,
      message: `Doctor request for ${docName} has been rejected and deleted.`,
      doctors: doctorsResult.rows,
      doctorRequests: doctorRequestsResult.rows
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Database server doctor rejection error:', err);
    res.status(500).json({ success: false, message: 'Failed to reject doctor request.', error: err.message });
  }
});

// Book Appointment API Endpoint
app.post('/api/book-appointment', async (req, res) => {
  console.log('Incoming appointment booking request payload:', req.body);
  try {
    const {
      patient_name,
      patient_phone,
      patient_email,
      doctor_id,
      doctor_name,
      symptom,
      appointment_date,
      appointment_time,
      payment_status,
      appointment_status
    } = req.body;

    // Validation
    if (!patient_name || !patient_phone || !doctor_id || !doctor_name || !appointment_date || !appointment_time) {
      return res.status(400).json({
        success: false,
        message: "Required booking fields (Patient Name, Phone, Doctor ID, Doctor Name, Date, Time) are missing."
      });
    }

    // Generate unique ID and pay_id
    const bookingId = "PHH-" + Math.floor(100000 + Math.random() * 900000);
    const payId = "pay_PHH_" + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Fetch doctor fee and specialty
    let fee = 600;
    let specialty = 'General Medicine';
    try {
      const docResult = await pool.query('SELECT fee, specialty FROM doctors WHERE id = $1', [doctor_id]);
      if (docResult.rows.length > 0) {
        fee = docResult.rows[0].fee;
        specialty = docResult.rows[0].specialty;
      }
    } catch (err) {
      console.error("Error fetching doctor fee and specialty from DB:", err);
    }

    // Insert into PostgreSQL database
    console.log(`SQL Query Execution: Inserting appointment ${bookingId} for patient ${patient_name}`);

    const result = await pool.query(
      `
      INSERT INTO appointments (
        id,
        doctor_id,
        doctor_name,
        patient_name,
        patient_phone,
        patient_email,
        symptom,
        date,
        time,
        pay_id,
        fee_paid,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
      `,
      [
        bookingId,
        doctor_id,
        doctor_name,
        patient_name,
        patient_phone,
        patient_email || 'N/A',
        symptom || 'No clinical symptoms specified.',
        appointment_date,
        appointment_time,
        payId,
        fee,
        appointment_status || 'Upcoming'
      ]
    );

    console.log("Database insertion result (appointments):", result.rows[0]);

    // Save patient profile in patients table if they don't exist yet
    try {
      const emailVal = (patient_email && patient_email !== 'N/A') ? patient_email.trim().toLowerCase() : null;
      const phoneVal = patient_phone ? patient_phone.trim() : null;
      const normPhone = phoneVal ? phoneVal.replace(/\D/g, "").slice(-10) : "";

      let existingPatient = null;
      if (emailVal) {
        const checkEmail = await pool.query('SELECT * FROM patients WHERE LOWER(email) = $1 LIMIT 1', [emailVal]);
        if (checkEmail.rows.length > 0) {
          existingPatient = checkEmail.rows[0];
        }
      }
      if (!existingPatient && normPhone) {
        const checkPhone = await pool.query('SELECT * FROM patients WHERE phone LIKE $1 LIMIT 1', [`%${normPhone}`]);
        if (checkPhone.rows.length > 0) {
          existingPatient = checkPhone.rows[0];
        }
      }

      if (existingPatient) {
        // If the patient exists but their name is default 'Guest Patient' and we have a real name, update it.
        const nameVal = patient_name ? patient_name.trim() : "";
        const dbName = existingPatient.name ? existingPatient.name.trim() : "";
        if ((dbName === "Guest Patient" || dbName === "") && nameVal && nameVal !== "Guest Patient") {
          await pool.query('UPDATE patients SET name = $1 WHERE id = $2', [nameVal, existingPatient.id]);
        }
        // If email or phone was missing, update it
        if (!existingPatient.email && emailVal) {
          await pool.query('UPDATE patients SET email = $1 WHERE id = $2', [emailVal, existingPatient.id]);
        }
        if (!existingPatient.phone && phoneVal) {
          await pool.query('UPDATE patients SET phone = $1 WHERE id = $2', [phoneVal, existingPatient.id]);
        }
      } else {
        // Insert new patient record
        await pool.query(
          'INSERT INTO patients (name, email, phone) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
          [patient_name ? patient_name.trim() : 'Guest Patient', emailVal, phoneVal]
        );
      }
    } catch (patErr) {
      console.error("Error creating/updating patient record on booking:", patErr);
    }

    // Update schedules/slots table status to Confirmed and booking_id to bookingId
    try {
      console.log(`SQL Query Execution: Updating schedule slot status on appointment booking for doctor ${doctor_id} on ${appointment_date}`);
      const slotUpdateResult = await pool.query(
        `
        UPDATE schedules
        SET status = 'Confirmed', booking_id = $1
        WHERE doctor_id = $2 AND date = $3 AND (time = $4 OR time LIKE $5)
        RETURNING *
        `,
        [bookingId, doctor_id, appointment_date, appointment_time, `${appointment_time}%`]
      );
      console.log("Database update result (schedules):", slotUpdateResult.rows);
    } catch (slotErr) {
      console.error("Error updating schedule status on booking:", slotErr);
    }

    // Auto-create notification for new appointment booking
    try {
      await pool.query(
        'INSERT INTO notifications (user_id, message, timestamp, read_status) VALUES ($1, $2, $3, $4)',
        [doctor_id, `New appointment ${bookingId} booked by patient ${patient_name} for ${appointment_date} (${appointment_time}).`, new Date().toISOString(), false]
      );
    } catch (notifErr) {
      console.error("Error creating notification on booking:", notifErr);
    }

    res.status(201).json({
      success: true,
      message: "Appointment booked and stored in database successfully",
      appointment: {
        id: result.rows[0].id,
        doctorId: result.rows[0].doctor_id,
        doctorName: result.rows[0].doctor_name,
        patientName: result.rows[0].patient_name,
        patientPhone: result.rows[0].patient_phone,
        patientEmail: result.rows[0].patient_email,
        symptoms: result.rows[0].symptom,
        date: result.rows[0].date,
        slot: result.rows[0].time,
        payId: result.rows[0].pay_id,
        fee: result.rows[0].fee_paid,
        status: result.rows[0].status,
        dept: specialty,
        appointment_date: result.rows[0].date,
        appointment_time: result.rows[0].time
      }
    });

  } catch (error) {
    console.error("PostgreSQL appointment insert error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to store appointment in PostgreSQL database.",
      error: error.message
    });
  }
});

// Submit Contact/Support Message
app.post('/api/contact-message', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'Required fields (Name, Subject, Message) are missing.'
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        name.trim(),
        email ? email.trim() : null,
        subject.trim(),
        message.trim()
      ]
    );

    console.log("Database insertion result (contact_messages):", result.rows[0]);

    res.status(201).json({
      success: true,
      message: 'Message stored in database successfully!',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('PostgreSQL contact message insert error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to store contact message in database.',
      error: err.message
    });
  }
});

// 1. GET /api/reports/date/:date - retrieves all appointments for the specified date
app.get('/api/reports/date/:date', requireAdmin, async (req, res) => {
  const { date } = req.params;
  try {
    const isAll = date === 'all';
    const queryStr = isAll
      ? `
        SELECT a.*, d.specialty AS doc_specialty
        FROM appointments a
        LEFT JOIN doctors d ON a.doctor_id = d.id
        ORDER BY a.date ASC, a.time ASC
        `
      : `
        SELECT a.*, d.specialty AS doc_specialty
        FROM appointments a
        LEFT JOIN doctors d ON a.doctor_id = d.id
        WHERE a.date = $1
        ORDER BY a.time ASC
        `;
    const queryParams = isAll ? [] : [date];
    const result = await pool.query(queryStr, queryParams);

    // Self-healing database check removed (patient_age / patient_gender deleted)
    const appointments = [];
    for (const row of result.rows) {
      appointments.push({
        id: row.id,
        doctorId: row.doctor_id,
        doctorName: row.doctor_name,
        patientName: row.patient_name,
        patientPhone: row.patient_phone,
        patientEmail: row.patient_email,
        symptoms: row.symptom,
        date: row.date,
        slot: row.time,
        payId: row.pay_id,
        fee: row.fee_paid,
        status: row.status,
        rescheduleReason: row.reschedule_reason,
        oldSlot: row.old_slot,
        newSlot: row.new_slot,
        rescheduledBy: row.rescheduled_by,
        rescheduledAt: row.rescheduled_at,
        dept: row.doc_specialty || 'General Medicine',
        appointment_date: row.date,
        appointment_time: row.time
      });
    }

    res.json({
      success: true,
      appointments: appointments
    });
  } catch (err) {
    console.error('Error fetching daily report appointments:', err);
    res.status(500).json({ success: false, message: 'Server error. Failed to retrieve patient records.' });
  }
});

// 2. GET /api/reports/statistics/:date - retrieves daily statistics summary
app.get('/api/reports/statistics/:date', requireAdmin, async (req, res) => {
  const { date } = req.params;
  try {
    const isAll = date === 'all';
    const queryStr = isAll
      ? `
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'Confirmed' THEN 1 END) as confirmed,
          COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) as cancelled,
          COUNT(CASE WHEN status = 'Pending' OR status IS NULL OR status = '' THEN 1 END) as pending
        FROM appointments
        `
      : `
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'Confirmed' THEN 1 END) as confirmed,
          COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) as cancelled,
          COUNT(CASE WHEN status = 'Pending' OR status IS NULL OR status = '' THEN 1 END) as pending
        FROM appointments
        WHERE date = $1
        `;
    const queryParams = isAll ? [] : [date];
    const result = await pool.query(queryStr, queryParams);

    const stats = result.rows[0];
    res.json({
      success: true,
      statistics: {
        total: parseInt(stats.total, 10) || 0,
        confirmed: parseInt(stats.confirmed, 10) || 0,
        cancelled: parseInt(stats.cancelled, 10) || 0,
        pending: parseInt(stats.pending, 10) || 0
      }
    });
  } catch (err) {
    console.error('Error fetching report statistics:', err);
    res.status(500).json({ success: false, message: 'Server error. Failed to retrieve statistics.' });
  }
});

// 3. GET /api/reports/export/:date - retrieves export details along with hospital metadata
app.get('/api/reports/export/:date', requireAdmin, async (req, res) => {
  const { date } = req.params;
  try {
    const isAll = date === 'all';
    // 1. Fetch appointments
    const appQueryStr = isAll
      ? `
        SELECT a.*, d.specialty AS doc_specialty
        FROM appointments a
        LEFT JOIN doctors d ON a.doctor_id = d.id
        ORDER BY a.date ASC, a.time ASC
        `
      : `
        SELECT a.*, d.specialty AS doc_specialty
        FROM appointments a
        LEFT JOIN doctors d ON a.doctor_id = d.id
        WHERE a.date = $1
        ORDER BY a.time ASC
        `;
    const appQueryParams = isAll ? [] : [date];
    const appResult = await pool.query(appQueryStr, appQueryParams);

    const appointments = [];
    for (const row of appResult.rows) {
      appointments.push({
        id: row.id,
        doctorId: row.doctor_id,
        doctorName: row.doctor_name,
        patientName: row.patient_name,
        patientPhone: row.patient_phone,
        patientEmail: row.patient_email,
        symptoms: row.symptom,
        date: row.date,
        slot: row.time,
        payId: row.pay_id,
        fee: row.fee_paid,
        status: row.status,
        rescheduleReason: row.reschedule_reason,
        oldSlot: row.old_slot,
        newSlot: row.new_slot,
        rescheduledBy: row.rescheduled_by,
        rescheduledAt: row.rescheduled_at,
        dept: row.doc_specialty || 'General Medicine',
        appointment_date: row.date,
        appointment_time: row.time
      });
    }

    // 2. Fetch statistics
    const statsQueryStr = isAll
      ? `
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'Confirmed' THEN 1 END) as confirmed,
          COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) as cancelled,
          COUNT(CASE WHEN status = 'Pending' OR status IS NULL OR status = '' THEN 1 END) as pending
        FROM appointments
        `
      : `
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'Confirmed' THEN 1 END) as confirmed,
          COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) as cancelled,
          COUNT(CASE WHEN status = 'Pending' OR status IS NULL OR status = '' THEN 1 END) as pending
        FROM appointments
        WHERE date = $1
        `;
    const statsQueryParams = isAll ? [] : [date];
    const statsResult = await pool.query(statsQueryStr, statsQueryParams);

    const stats = statsResult.rows[0];

    // Find the admin user to get the full name
    const adminUserResult = await pool.query('SELECT name FROM users WHERE username = $1 LIMIT 1', [req.admin.username]);
    const adminName = adminUserResult.rows.length > 0 ? adminUserResult.rows[0].name : 'System Admin';

    // 3. Hospital Metadata
    const hospital = {
      name: 'Superspeciality Doctors Consultation',
      address: 'Deesa Highway Crossroads, Palanpur, Gujarat - 385001',
      contact: '+91 2742 250001',
      email: 'info@superspecialitydoctors.com',
      website: 'www.superspecialitydoctors.com'
    };

    res.json({
      success: true,
      hospital: hospital,
      generatedBy: adminName || req.admin.username || 'System Admin',
      statistics: {
        total: parseInt(stats.total, 10) || 0,
        confirmed: parseInt(stats.confirmed, 10) || 0,
        cancelled: parseInt(stats.cancelled, 10) || 0,
        pending: parseInt(stats.pending, 10) || 0
      },
      appointments: appointments
    });

  } catch (err) {
    console.error('Error retrieving export details:', err);
    res.status(500).json({ success: false, message: 'Server error. Failed to retrieve export details.' });
  }
});

// Reset State API
app.post('/api/sync/reset', async (req, res) => {
  try {
    await pool.query('BEGIN');
    await pool.query('DELETE FROM doctors');
    await pool.query('DELETE FROM doctor_requests');
    await pool.query('DELETE FROM appointments');
    await pool.query('DELETE FROM schedules');
    await pool.query('DELETE FROM notifications');
    await pool.query('COMMIT');
    res.json({ success: true, message: 'Database state reset successfully.' });
  } catch (err) {
    console.error('Error resetting database:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create Razorpay payment order
app.post('/api/payments/create-order', async (req, res) => {
  const { amount } = req.body;
  if (!amount) {
    return res.status(400).json({ success: false, message: 'Amount is required.' });
  }

  // Fallback check if keys are not set yet
  if (process.env.RAZORPAY_KEY_ID === 'dummy_id' || !process.env.RAZORPAY_KEY_ID) {
    return res.status(400).json({
      success: false,
      message: 'Razorpay keys not configured in backend environment (.env). Please add your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
    });
  }

  try {
    const options = {
      amount: Math.round(Number(amount) * 100), // convert rupees to paise
      currency: 'INR',
      receipt: 'rcpt_' + Math.floor(100000 + Math.random() * 900000)
    };
    
    const order = await razorpay.orders.create(options);
    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    res.status(500).json({ success: false, message: 'Failed to generate Razorpay payment order.', error: err.message });
  }
});

// Verify signature of Razorpay payment transaction
app.post('/api/payments/verify-signature', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Required verification parameters missing.' });
  }

  try {
    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      res.json({ success: true, message: 'Payment verified successfully.' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature. Payment verification failed.' });
    }
  } catch (err) {
    console.error('Signature verification error:', err);
    res.status(500).json({ success: false, message: 'Error verifying payment signature.', error: err.message });
  }
});

// Fallback routing: redirect clean routes to the homepage
app.get('/*splat', (req, res) => {
  const indexPath = fs.existsSync(distPath)
    ? path.join(distPath, 'index.html')
    : path.join(__dirname, 'index.html');
  res.sendFile(indexPath);
});

// Export app for serverless deployment (Vercel)
module.exports = app;

// Listen on configured port only if run directly (local development)
if (require.main === module) {
  app.listen(PORT, async () => {
    const url = `http://localhost:${PORT}`;
    console.log('Server Running on Port ' + PORT);
    console.log('==================================================');
    console.log('  Superspeciality Doctors Consultation Smart Web Server Active     ');
    console.log('  Connected via PostgreSQL database client pool   ');
    console.log('  Running locally at: ' + url);
    console.log('  Press Ctrl+C to terminate the server.           ');
    console.log('==================================================');

    // Initialize database connection pool (and create database if missing)
    await initDatabasePool();

    // Verify and initialize tables in the database
    await initDbSchema();

    // Automatically open browser on start
    const startCmd = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
    exec(startCmd + ' ' + url + '/portal-login.html');
  });
}
