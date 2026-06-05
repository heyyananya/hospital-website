/* Palanpur Health Hub - Relational Database Synchronization Adapter */

(function() {
  // Determine the API base dynamically and robustly:
  let API_BASE = '';
  const hostname = window.location.hostname;
  const port = window.location.port;

  // If we are running locally and the port is not 5000, redirect requests to port 5000
  const isLocal = hostname === 'localhost' || 
                  hostname === '127.0.0.1' || 
                  hostname.startsWith('192.168.') || 
                  hostname.startsWith('10.') || 
                  hostname.startsWith('172.') || 
                  hostname.endsWith('.local');

  if (isLocal && port !== '5000') {
    API_BASE = `http://${hostname}:5000`;
  } else {
    API_BASE = '';
  }
  window.API_BASE = API_BASE;

  const syncKeys = ['phh_doctors', 'phh_doctor_requests', 'phh_appointments', 'phh_slots', 'phh_notifications', 'phh_departments'];
  let lastWriteTime = 0;

  // 1. Intercept Storage.prototype.setItem to automatically write changes to PostgreSQL
  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function(key, value) {
    originalSetItem.apply(this, arguments);

    if (this === localStorage && syncKeys.includes(key)) {
      lastWriteTime = Date.now();
      let parsedValue;
      try {
        parsedValue = JSON.parse(value);
      } catch (e) {
        parsedValue = value;
      }

      // Send update to server in background
      fetch(`${API_BASE}/api/sync/save-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: key,
          data: parsedValue
        })
      })
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          console.error('Failed to sync to database:', data.error);
        }
      })
      .catch(err => console.error('Database write sync error:', err));
    }
  };

  // Helper to compare two objects or arrays to check if they have changed
  function hasChanged(oldVal, newVal) {
    return JSON.stringify(oldVal) !== JSON.stringify(newVal);
  }

  // 2. Load the state from database and update localStorage
  async function loadStateFromDatabase() {
    const fetchStartTime = Date.now();
    if (fetchStartTime - lastWriteTime < 3000) {
      return; // Skip loading if we recently wrote locally to avoid overwriting modifications before server saves them
    }
    try {
      const res = await fetch(`${API_BASE}/api/sync/get-state`);
      const data = await res.json();

      // Discard state if a local write occurred during/after the fetch started, or if we wrote recently
      if (lastWriteTime > fetchStartTime || (Date.now() - lastWriteTime < 3000)) {
        return;
      }

      if (res.ok && data.success) {
        let changed = false;

        const keysToUpdate = {
          'phh_doctors': data.doctors,
          'phh_doctor_requests': data.doctorRequests,
          'phh_appointments': data.appointments,
          'phh_slots': data.slots,
          'phh_notifications': data.notifications,
          'phh_departments': data.departments
        };

        for (const [key, value] of Object.entries(keysToUpdate)) {
          const currentLocalStr = localStorage.getItem(key);
          const currentLocal = currentLocalStr ? JSON.parse(currentLocalStr) : null;

          if (hasChanged(currentLocal, value)) {
            // Write directly using originalSetItem to avoid circular loops
            originalSetItem.call(localStorage, key, JSON.stringify(value));
            changed = true;
          }
        }

        // If any data changed, trigger storage_local event to update UI immediately
        if (changed) {
          window.dispatchEvent(new Event("storage_local"));
        }
      }
    } catch (err) {
      console.error('Error loading state from PostgreSQL database:', err);
      if (window.location.port !== '3000') {
        console.log(`[Palanpur Health Hub] Running on port "${window.location.port || 'default'}". Attempted database sync redirection to http://localhost:3000`);
      }
    }
  }

  // Run initial state loading immediately when script parses (so localStorage is primed)
  loadStateFromDatabase();

  // Run periodic background sync polling every 4 seconds to sync other sessions/clients
  setInterval(loadStateFromDatabase, 4000);

  // Expose loadStateFromDatabase globally
  window.syncDatabaseToLocal = loadStateFromDatabase;
})();
