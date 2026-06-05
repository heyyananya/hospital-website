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
      
      let lines = content.split('\n');
      lines.forEach((line, i) => {
        if (line.includes('alert(') || line.includes('confirm(')) {
          if (!line.includes('window.alert =') && !line.includes('window.customConfirm =') && !line.includes('console.log')) {
            console.log(`${fullPath}:${i+1} -> ${line.trim()}`);
          }
        }
      });
    }
  });
}

walk(dir);
console.log('Search complete.');
