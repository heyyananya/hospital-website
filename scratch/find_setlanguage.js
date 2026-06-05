const fs = require('fs');
const content = fs.readFileSync('d:/Hospital_Website_HTML/js/script.js', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('setLanguage')) {
    console.log(`Line ${i+1}: ${lines[i].trim()}`);
  }
}
