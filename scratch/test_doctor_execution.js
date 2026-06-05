const fs = require('fs');
const path = require('path');

// Mock localStorage
const localStorageMock = (function() {
  let store = {
    "phh_current_user": JSON.stringify({
      id: "doc-123",
      name: "Dr. Prisha Patel",
      role: "doctor"
    }),
    "phh_doctors": JSON.stringify([
      { id: "doc-123", name: "Dr. Prisha Patel", status: "Available" }
    ]),
    "phh_appointments": JSON.stringify([]),
    "phh_queue": JSON.stringify({ runningToken: 0, nextIssuedToken: 1 }),
    "phh_slots": JSON.stringify([])
  };
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    removeItem: function(key) {
      delete store[key];
    },
    clear: function() {
      store = {};
    }
  };
})();

// Mock document and window
const mockElement = {
  classList: {
    add: () => {},
    remove: () => {},
    toggle: () => {},
    contains: () => false
  },
  addEventListener: () => {},
  querySelectorAll: () => [],
  style: {},
  reset: () => {},
  appendChild: () => {}
};

global.window = {
  location: { href: '', search: '', port: '3000', replace: () => {} },
  localStorage: localStorageMock,
  dispatchEvent: () => {},
  Event: class {}
};
global.document = {
  getElementById: (id) => {
    // console.log('document.getElementById called for:', id);
    return mockElement;
  },
  querySelectorAll: (selector) => {
    // console.log('document.querySelectorAll called for:', selector);
    return [];
  },
  addEventListener: () => {}
};
global.localStorage = localStorageMock;
global.alert = (msg) => console.log('ALERT:', msg);

console.log('Loading js/doctor.js...');
const code = fs.readFileSync(path.join(__dirname, '../js/doctor.js'), 'utf8');
try {
  eval(code);
  console.log('Script parsed and loaded successfully!');
} catch (err) {
  console.error('CRASH DETECTED:', err);
  process.exit(1);
}
