const fs = require('fs');
const path = require('path');

function searchAllHtml(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        searchAllHtml(fullPath);
      }
    } else if (file.endsWith('.html')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.toLowerCase().includes('faq')) {
        console.log(`Found 'faq' in HTML: ${fullPath}`);
      }
      if (content.toLowerCase().includes('token')) {
        console.log(`Found 'token' in HTML: ${fullPath}`);
      }
    }
  }
}

searchAllHtml('d:/Hospital_Website_HTML');
