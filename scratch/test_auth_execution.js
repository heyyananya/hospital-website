const fs = require('fs');
const path = require('path');

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
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
const listeners = {};
const mockElement = {
  classList: {
    add: () => {},
    remove: () => {},
    toggle: () => {},
    contains: () => false
  },
  parentElement: {
    classList: {
      add: () => {},
      remove: () => {}
    }
  },
  addEventListener: (event, cb) => {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(cb);
  },
  querySelectorAll: () => [],
  options: [{ textContent: 'Cardiology' }],
  selectedIndex: 0,
  tagName: 'INPUT',
  type: 'text',
  value: '',
  placeholder: '',
  style: {},
  reset: () => {}
};

global.window = {
  location: { href: '', search: '', port: '3000' },
  localStorage: localStorageMock,
  dispatchEvent: () => {},
  Event: class {}
};
global.document = {
  getElementById: (id) => {
    console.log('document.getElementById called for:', id);
    return mockElement;
  },
  querySelectorAll: (selector) => {
    console.log('document.querySelectorAll called for:', selector);
    return [];
  },
  addEventListener: (event, cb) => {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(cb);
  }
};
global.localStorage = localStorageMock;
global.navigator = {};
global.fetch = () => Promise.resolve({
  json: () => Promise.resolve({ success: true })
});
global.alert = (msg) => console.log('ALERT:', msg);

console.log('Loading js/auth.js...');
const authCode = fs.readFileSync(path.join(__dirname, '../js/auth.js'), 'utf8');
try {
  eval(authCode);
  console.log('Script parsed successfully.');
  if (listeners['DOMContentLoaded']) {
    console.log('Triggering DOMContentLoaded...');
    listeners['DOMContentLoaded'].forEach(cb => cb());
    console.log('DOMContentLoaded triggered successfully without throwing errors.');
  } else {
    console.log('No DOMContentLoaded listener registered.');
  }
} catch (err) {
  console.error('CRASH DETECTED:', err);
}
