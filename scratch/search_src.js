const fs = require('fs');
const path = require('path');

function searchSrc(dir, query) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchSrc(fullPath, query);
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.toLowerCase().includes(query.toLowerCase())) {
          console.log(`Found '${query}' in src file: ${fullPath}`);
        }
      }
    }
  }
}

searchSrc('d:/Hospital_Website_HTML/src', 'token');
searchSrc('d:/Hospital_Website_HTML/src', 'faq');
searchSrc('d:/Hospital_Website_HTML/src', 'queue');
searchSrc('d:/Hospital_Website_HTML/src', 'turn');
