const fs = require('fs');
const path = require('path');

const dir = 'd:/Hospital_Website_HTML/css';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.css')) {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    let idx = 0;
    while ((idx = content.indexOf('modal-overlay', idx)) !== -1) {
      const start = Math.max(0, idx - 100);
      const end = Math.min(content.length, idx + 100);
      console.log(`Found in ${file}:\n...${content.substring(start, end)}...\n`);
      idx += 'modal-overlay'.length;
    }
  }
});
console.log('Search complete.');
