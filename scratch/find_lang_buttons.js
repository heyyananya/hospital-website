const fs = require('fs');
const content = fs.readFileSync('d:/Hospital_Website_HTML/index.html', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('data-lang') || lines[i].includes('Language') || lines[i].includes('EN') || lines[i].includes('gu') || lines[i].includes('hi')) {
    if (lines[i].includes('class=') || lines[i].includes('<button') || lines[i].includes('<a')) {
      console.log(`Line ${i+1}: ${lines[i].trim()}`);
    }
  }
}
