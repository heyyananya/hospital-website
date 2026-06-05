const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: '24062006',
  host: 'localhost',
  port: 5432,
  database: 'postgres'
});

function parseSlotDateTime(dateStr, timeStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [time, ampm] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

async function run() {
  try {
    const slotsRes = await pool.query('SELECT * FROM slots');
    const slots = slotsRes.rows.map(slot => ({
      id: slot.id,
      doctorId: slot.doctor_id,
      doctorName: slot.doctor_name,
      date: slot.date,
      time: slot.time,
      status: slot.status,
      bookingId: slot.booking_id
    }));

    const now = new Date('2026-05-22T17:01:00+05:30'); // User's local time metadata
    console.log('Simulated "now":', now.toString(), 'Value:', now.getTime());

    slots.forEach(s => {
      const slotTimeObj = parseSlotDateTime(s.date, s.time);
      const isFuture = slotTimeObj > now;
      console.log(`Slot ID: ${s.id}`);
      console.log(`  Doctor: ${s.doctorName} (${s.doctorId})`);
      console.log(`  Date: ${s.date}, Time: ${s.time}, Status: ${s.status}`);
      console.log(`  Parsed Date Object: ${slotTimeObj.toString()} (Value: ${slotTimeObj.getTime()})`);
      console.log(`  Is Future (> now)? ${isFuture}`);
      console.log(`  Would display? ${s.status === 'Available' && isFuture}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
