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

async function verifyReschedule() {
  console.log('--- STARTING RESCHEDULE SLOT SYNCHRONIZATION VERIFICATION ---');

  // Step 1: Add a new available slot for Dr. Ananya (doc-8595) on 2026-06-04
  console.log('\n[Step 1] Initializing slots in DB to have an available target slot...');
  const originalStateRes = await get('/api/sync/get-state');
  const originalSlots = originalStateRes.body.slots;
  
  // Make sure we have the original confirmed slot plus a new available slot on 2026-06-04
  const targetDate = '2026-06-04';
  const targetTime = '10:00 AM - 5:00 PM';
  
  // Keep original slots and filter out any existing slot on 2026-06-04 to avoid duplicates
  const testSlots = originalSlots.filter(s => !(s.doctorId === 'doc-8595' && s.date === targetDate));
  testSlots.push({
    id: 'slot-doc-8595-2026-06-04',
    doctorId: 'doc-8595',
    doctorName: 'Dr. Ananya',
    date: targetDate,
    time: targetTime,
    status: 'Available',
    bookingId: ''
  });

  // Sync the initialized slots list to database
  const saveSlotsInit = await post('/api/sync/save-item', {
    key: 'phh_slots',
    data: testSlots
  });
  if (!saveSlotsInit.body.success) {
    throw new Error('Failed to initialize test slots: ' + JSON.stringify(saveSlotsInit.body));
  }
  console.log('✅ Slots initialized with an available slot on 2026-06-04.');

  // Step 2: Fetch current state to find the appointment we will reschedule
  console.log('\n[Step 2] Fetching state to select appointment...');
  const stateRes = await get('/api/sync/get-state');
  const appts = stateRes.body.appointments;
  const currentSlots = stateRes.body.slots;

  const targetAppt = appts.find(a => a.id === 'PHH-552943' || a.doctorId === 'doc-8595');
  if (!targetAppt) {
    throw new Error('Could not find appointment for Dr. Ananya (doc-8595) to reschedule.');
  }
  console.log(`Found appointment: ID=${targetAppt.id}, Date=${targetAppt.date}, Slot=${targetAppt.slot}, Status=${targetAppt.status}`);

  const oldDate = targetAppt.date;
  const oldTime = targetAppt.slot;
  const apptId = targetAppt.id;

  // Step 3: Run the client-side reschedule simulation logic
  console.log('\n[Step 3] Simulating reschedule logic...');
  
  // 3a. Release old slot and occupy new slot in slots array
  const oldSlotIndex = currentSlots.findIndex(s => s.doctorId === targetAppt.doctorId && s.date === oldDate && s.time === oldTime);
  if (oldSlotIndex !== -1) {
    currentSlots[oldSlotIndex].status = 'Available';
    currentSlots[oldSlotIndex].bookingId = '';
    console.log(`- Freed old slot at index ${oldSlotIndex}: ${oldDate} (${oldTime})`);
  } else {
    console.log('⚠️ Old slot not found in slots list.');
  }

  const newSlotIndex = currentSlots.findIndex(s => s.doctorId === targetAppt.doctorId && s.date === targetDate && s.time === targetTime);
  if (newSlotIndex !== -1) {
    currentSlots[newSlotIndex].status = 'Confirmed';
    currentSlots[newSlotIndex].bookingId = apptId;
    console.log(`- Occupied new slot at index ${newSlotIndex}: ${targetDate} (${targetTime})`);
  } else {
    throw new Error('Could not find target slot in slots list to occupy.');
  }

  // 3b. Update appointment fields
  const apptIndex = appts.findIndex(a => a.id === apptId);
  if (apptIndex !== -1) {
    appts[apptIndex].date = targetDate;
    appts[apptIndex].slot = targetTime;
    appts[apptIndex].status = 'Rescheduled';
    appts[apptIndex].oldSlot = `${oldDate} (${oldTime})`;
    appts[apptIndex].newSlot = `${targetDate} (${targetTime})`;
    appts[apptIndex].rescheduledBy = 'Patient';
    appts[apptIndex].rescheduledAt = new Date().toISOString();
  }

  // Step 4: Write both collections back to DB via the sync save-item endpoints (just like patient.js does)
  console.log('\n[Step 4] Syncing updated slots and appointments back to PostgreSQL...');
  
  const saveSlotsRes = await post('/api/sync/save-item', {
    key: 'phh_slots',
    data: currentSlots
  });
  console.log('Save Slots Status:', saveSlotsRes.status, 'Body:', saveSlotsRes.body);
  if (!saveSlotsRes.body.success) {
    throw new Error('Sync slots save failed.');
  }

  const saveApptsRes = await post('/api/sync/save-item', {
    key: 'phh_appointments',
    data: appts
  });
  console.log('Save Appointments Status:', saveApptsRes.status, 'Body:', saveApptsRes.body);
  if (!saveApptsRes.body.success) {
    throw new Error('Sync appointments save failed.');
  }

  // Step 5: Fetch central state again to verify database persistence
  console.log('\n[Step 5] Fetching state from PostgreSQL to verify persistence...');
  const verifyRes = await get('/api/sync/get-state');
  const verifyAppts = verifyRes.body.appointments;
  const verifySlots = verifyRes.body.slots;

  const finalAppt = verifyAppts.find(a => a.id === apptId);
  const finalOldSlot = verifySlots.find(s => s.doctorId === targetAppt.doctorId && s.date === oldDate && s.time === oldTime);
  const finalNewSlot = verifySlots.find(s => s.doctorId === targetAppt.doctorId && s.date === targetDate && s.time === targetTime);

  console.log('\n--- VERIFICATION RESULTS ---');
  console.log('Final Appointment:', finalAppt);
  console.log('Final Old Slot Status:', finalOldSlot ? `${finalOldSlot.status} (bookingId: ${finalOldSlot.bookingId})` : 'Not Found');
  console.log('Final New Slot Status:', finalNewSlot ? `${finalNewSlot.status} (bookingId: ${finalNewSlot.bookingId})` : 'Not Found');

  if (
    finalAppt.status === 'Rescheduled' &&
    finalAppt.date === targetDate &&
    finalAppt.slot === targetTime &&
    finalOldSlot && finalOldSlot.status === 'Available' &&
    finalNewSlot && finalNewSlot.status === 'Confirmed' && finalNewSlot.bookingId === apptId
  ) {
    console.log('\n🎉 SUCCESS: All slot update and reschedule states verified successfully in PostgreSQL database! 🎉');
  } else {
    throw new Error('State verification failed. Database values do not match expected outcomes.');
  }
}

verifyReschedule().catch(err => {
  console.error('\n❌ VERIFICATION SUITE FAILED:', err.message);
  process.exit(1);
});
