const fs = require('fs');

// Mock global window, document, localStorage
global.window = {
  location: { href: '', port: '' },
  API_BASE: 'http://localhost:5000'
};
global.localStorage = {
  getItem: (key) => {
    if (key === 'phh_lang') return 'en';
    if (key === 'phh_current_user') return null;
    return null;
  },
  setItem: () => {}
};
global.document = {
  addEventListener: (event, cb) => {
    console.log(`Registered event listener for: ${event}`);
    // Run the DOMContentLoaded immediately
    if (event === 'DOMContentLoaded') {
      try {
        cb();
      } catch (err) {
        console.error('CRITICAL RUNTIME ERROR IN DOMContentLoaded:', err);
      }
    }
  },
  getElementById: (id) => {
    console.log(`document.getElementById called for: ${id}`);
    return {
      addEventListener: (event, cb) => {
        console.log(`  Registered listener for ${event} on element #${id}`);
      },
      classList: {
        add: (cls) => console.log(`  classList.add on #${id}: ${cls}`),
        remove: (cls) => console.log(`  classList.remove on #${id}: ${cls}`),
        toggle: (cls) => console.log(`  classList.toggle on #${id}: ${cls}`)
      },
      style: {},
      options: [ { textContent: 'General' } ],
      selectedIndex: 0,
      value: ''
    };
  },
  querySelectorAll: (selector) => {
    console.log(`document.querySelectorAll called for: ${selector}`);
    return [
      {
        getAttribute: (attr) => 'test-key',
        parentElement: {
          classList: {
            add: (cls) => console.log(`  parentElement.classList.add: ${cls}`),
            remove: (cls) => console.log(`  parentElement.classList.remove: ${cls}`)
          }
        },
        addEventListener: () => {}
      }
    ];
  }
};

try {
  const authCode = fs.readFileSync('js/auth.js', 'utf8');
  eval(authCode);
  console.log('SUCCESS: auth.js loaded and executed successfully under mock context!');
} catch (err) {
  console.error('ERROR: auth.js execution failed:', err);
}
