const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: JSON.parse(responseBody)
        });
      });
    });

    req.on('error', (err) => reject(err));
    req.write(data);
    req.end();
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:5000${path}`, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: JSON.parse(responseBody)
        });
      });
    });

    req.on('error', (err) => reject(err));
  });
}

async function runTests() {
  console.log('--- STARTING PROGRAMMATIC INTEGRATION TESTS ---');

  try {
    // Test 1: Save Doctors Sync (with undefined properties)
    console.log('\n[Test 1] Saving Doctors Sync...');
    const docResponse = await post('/api/sync/save-item', {
      key: 'phh_doctors',
      data: [{
        id: 'doc-test-1',
        name: 'Dr. Test Doctor',
        specialty: 'Cardiology',
        // exp, days, time, fee, rating, username, password, email are undefined/missing
        status: 'Available'
      }]
    });
    console.log('Response Status:', docResponse.status);
    console.log('Response Body:', docResponse.body);
    if (docResponse.status !== 200 || !docResponse.body.success) {
      throw new Error('Doctors sync failed');
    }

    // Test 2: Save Doctor Requests Sync
    console.log('\n[Test 2] Saving Doctor Requests Sync...');
    const reqResponse = await post('/api/sync/save-item', {
      key: 'phh_doctor_requests',
      data: [{
        id: 'doc-req-test-1',
        name: 'Dr. Pending Request',
        specialty: 'Neurology',
        status: 'Pending'
      }]
    });
    console.log('Response Status:', reqResponse.status);
    console.log('Response Body:', reqResponse.body);
    if (reqResponse.status !== 200 || !reqResponse.body.success) {
      throw new Error('Doctor requests sync failed');
    }

    // Test 3: Save Appointments Sync
    console.log('\n[Test 3] Saving Appointments Sync...');
    const appResponse = await post('/api/sync/save-item', {
      key: 'phh_appointments',
      data: [{
        id: 'appt-test-1',
        doctorId: 'doc-test-1',
        doctorName: 'Dr. Test Doctor',
        patientName: 'Test Patient',
        patientPhone: '9876543210',
        date: '2026-05-26',
        slot: '10:00 AM',
        status: 'Upcoming'
        // patientEmail, symptoms, payId, fee are missing/undefined
      }]
    });
    console.log('Response Status:', appResponse.status);
    console.log('Response Body:', appResponse.body);
    if (appResponse.status !== 200 || !appResponse.body.success) {
      throw new Error('Appointments sync failed');
    }

    // Test 4: Save Slots/Schedules Sync
    console.log('\n[Test 4] Saving Slots/Schedules Sync...');
    const slotResponse = await post('/api/sync/save-item', {
      key: 'phh_slots',
      data: [{
        id: 'slot-test-1',
        doctorId: 'doc-test-1',
        doctorName: 'Dr. Test Doctor',
        date: '2026-05-26',
        time: '10:00 AM',
        status: 'Available'
        // bookingId is undefined/missing
      }]
    });
    console.log('Response Status:', slotResponse.status);
    console.log('Response Body:', slotResponse.body);
    if (slotResponse.status !== 200 || !slotResponse.body.success) {
      throw new Error('Slots sync failed');
    }

    // Test 5: Save Notifications Sync
    console.log('\n[Test 5] Saving Notifications Sync...');
    const notifResponse = await post('/api/sync/save-item', {
      key: 'phh_notifications',
      data: [{
        id: 9999,
        userId: 'doc-test-1',
        message: 'Your schedule has been successfully updated by receptionist.',
        timestamp: new Date().toISOString()
      }]
    });
    console.log('Response Status:', notifResponse.status);
    console.log('Response Body:', notifResponse.body);
    if (notifResponse.status !== 200 || !notifResponse.body.success) {
      throw new Error('Notifications sync failed');
    }

    // Test 6: Fetch State to verify sync persisted to PostgreSQL
    console.log('\n[Test 6] Fetching State from DB to verify syncs...');
    const stateResponse = await get('/api/sync/get-state');
    console.log('Response Status:', stateResponse.status);
    const state = stateResponse.body;
    console.log('Doctors count:', state.doctors.length);
    console.log('Doctor requests count:', state.doctorRequests.length);
    console.log('Appointments count:', state.appointments.length);
    console.log('Slots count:', state.slots.length);
    console.log('Notifications count:', state.notifications.length);

    // Verify if our saved items exist in the returned DB state
    const foundDoc = state.doctors.find(d => d.id === 'doc-test-1');
    const foundReq = state.doctorRequests.find(r => r.id === 'doc-req-test-1');
    const foundAppt = state.appointments.find(a => a.id === 'appt-test-1');
    const foundSlot = state.slots.find(s => s.id === 'slot-test-1');
    const foundNotif = state.notifications.find(n => n.id === 9999);

    if (!foundDoc || !foundReq || !foundAppt || !foundSlot || !foundNotif) {
      console.error('Verification failed. Some sync records were not retrieved properly from DB.');
      console.log('Details:', { foundDoc, foundReq, foundAppt, foundSlot, foundNotif });
      throw new Error('DB verification failed');
    }
    console.log('✅ Sync verification successful! All tables synced safely with PG.');

    // Test 7: Add new Department by Admin ID
    console.log('\n[Test 7] Adding Department as Chief Admin (ID 1)...');
    const addDeptResponse1 = await post('/api/admin/add-department', {
      adminId: '1', // ajit's ID
      name: 'Urology',
      description: 'Urinary tract and male reproductive system specialty'
    });
    console.log('Response Status:', addDeptResponse1.status);
    console.log('Response Body:', addDeptResponse1.body);
    if (addDeptResponse1.status !== 200 || !addDeptResponse1.body.success) {
      throw new Error('Add department by Chief Admin failed');
    }

    // Test 8: Verify unauthorized adding (ID 2 - Ananya)
    console.log('\n[Test 8] Adding Department as Normal Admin (ID 2)...');
    const addDeptResponse2 = await post('/api/admin/add-department', {
      adminId: '2', // ananya's ID
      name: 'Oncology',
      description: 'Cancer diagnosis and treatment'
    });
    console.log('Response Status:', addDeptResponse2.status);
    console.log('Response Body:', addDeptResponse2.body);
    if (addDeptResponse2.status !== 403) {
      throw new Error('Authorization check failed. Normal admin should not be able to add department.');
    }
    console.log('✅ Authorization check successful! Unauthorized additions rejected.');

    // Test 9: Register Doctor via /api/doctor-request
    console.log('\n[Test 9] Registering Doctor Request via REST endpoint...');
    const registerResponse = await post('/api/doctor-request', {
      name: 'Dr. John Doe',
      specialty: 'Neurology',
      exp: '8 Years',
      days: 'Mon, Tue',
      time: '2 PM - 5 PM',
      fee: 700,
      username: 'john_doe',
      email: 'john.doe@hospital.com',
      password: 'securePassword123'
    });
    console.log('Response Status:', registerResponse.status);
    console.log('Response Body:', registerResponse.body);
    if (registerResponse.status !== 200 || !registerResponse.body.success) {
      throw new Error('Doctor registration via /api/doctor-request failed');
    }
    console.log('✅ Doctor registration successful.');

    // Test 10: Fetch REST collections
    console.log('\n[Test 10] Testing GET REST Endpoints...');
    const apptsRes = await get('/api/appointments');
    const schedulesRes = await get('/api/schedules');
    const notifsRes = await get('/api/notifications');
    const docsRes = await get('/api/doctors');
    const deptsRes = await get('/api/departments');
    const reqsRes = await get('/api/doctor-requests');

    console.log('Appointments Status:', apptsRes.status, 'Count:', apptsRes.body.appointments.length);
    console.log('Schedules Status:', schedulesRes.status, 'Count:', schedulesRes.body.schedules.length);
    console.log('Notifications Status:', notifsRes.status, 'Count:', notifsRes.body.notifications.length);
    console.log('Doctors Status:', docsRes.status, 'Count:', docsRes.body.doctors.length);
    console.log('Departments Status:', deptsRes.status, 'Count:', deptsRes.body.departments.length);
    console.log('Doctor Requests Status:', reqsRes.status, 'Count:', reqsRes.body.doctorRequests.length);

    if (apptsRes.status !== 200 || schedulesRes.status !== 200 || notifsRes.status !== 200 ||
        docsRes.status !== 200 || deptsRes.status !== 200 || reqsRes.status !== 200) {
      throw new Error('Some GET REST Endpoints returned non-200 status');
    }
    console.log('✅ All REST collection endpoints work perfectly.');

    // Test 11: Register Staff User via /api/auth/register
    console.log('\n[Test 11] Registering Staff User via REST endpoint...');
    const userRegResponse = await post('/api/auth/register', {
      username: 'new_receptionist',
      password: 'receptionistPass',
      role: 'receptionist',
      name: 'Palanpur Receptionist'
    });
    console.log('Response Status:', userRegResponse.status);
    console.log('Response Body:', userRegResponse.body);
    if (userRegResponse.status !== 200 || !userRegResponse.body.success) {
      throw new Error('Staff user registration failed');
    }
    console.log('✅ Staff user registration successful.');

    console.log('\n=============================================');
    console.log('🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY 🎉');
    console.log('=============================================');

  } catch (err) {
    console.error('\n❌ TEST SUITE FAILED:', err.message);
  }
}

runTests();
