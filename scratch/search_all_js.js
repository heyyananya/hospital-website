const fs = require('fs');
const path = require('path');

function searchAllJs(dir, query) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        searchAllJs(fullPath, query);
      }
    } else if (file.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.toLowerCase().includes(query.toLowerCase())) {
        console.log(`Found '${query}' in JS: ${fullPath}`);
      }
    }
  }
}

searchAllJs('d:/Hospital_Website_HTML', 'token');
searchAllJs('d:/Hospital_Website_HTML', 'faq');
