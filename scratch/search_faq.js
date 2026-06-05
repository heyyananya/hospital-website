const fs = require('fs');
const path = require('path');

function searchInDir(dir, query) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        searchInDir(fullPath, query);
      }
    } else {
      if (file.endsWith('.js') || file.endsWith('.html') || file.endsWith('.jsx')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.toLowerCase().includes(query.toLowerCase())) {
          console.log(`Found in: ${fullPath}`);
        }
      }
    }
  }
}

console.log("Searching for 'DYNAMIC_TRANSLATIONS'...");
searchInDir('d:/Hospital_Website_HTML', 'DYNAMIC_TRANSLATIONS');

console.log("Searching for 'faq-1-a'...");
searchInDir('d:/Hospital_Website_HTML', 'faq-1-a');
