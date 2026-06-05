const fs = require('fs');
const path = require('path');

const dir = 'd:/Hospital_Website_HTML';

function walk(currentDir) {
  const files = fs.readdirSync(currentDir);
  files.forEach(file => {
    const fullPath = path.join(currentDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
        walk(fullPath);
      }
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('custom-confirm-modal') || content.includes('custom-confirm-yes-btn')) {
        console.log(`Found references in ${fullPath}`);
      }
    }
  });
}

walk(dir);
console.log('Search complete.');
