const fs = require('fs');
const content = fs.readFileSync('d:/Hospital_Website_HTML/index.html', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].toLowerCase().includes('fee')) {
    console.log(`Line ${i+1}: ${lines[i].trim()}`);
  }
}
