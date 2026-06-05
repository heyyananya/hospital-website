const fs = require('fs');
const path = require('path');

function searchDist(dir, query) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchDist(fullPath, query);
    } else {
      if (file.endsWith('.js') || file.endsWith('.html') || file.endsWith('.jsx')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.toLowerCase().includes(query.toLowerCase())) {
          console.log(`Found '${query}' in dist file: ${fullPath}`);
        }
      }
    }
  }
}

console.log("Searching in dist/ for 'faq-1-q'...");
searchDist('d:/Hospital_Website_HTML/dist', 'faq-1-q');

console.log("Searching in dist/ for 'Smart Token Queue'...");
searchDist('d:/Hospital_Website_HTML/dist', 'Smart Token Queue');
searchDist('d:/Hospital_Website_HTML/dist', 'Smart Token');
