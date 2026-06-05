const fs = require('fs');
const content = fs.readFileSync('d:/Hospital_Website_HTML/js/script.js', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('lang-option')) {
    console.log(`Line ${i+1}: ${lines[i].trim()}`);
    // Print 10 lines around
    for (let j = Math.max(0, i-5); j < Math.min(lines.length, i+10); j++) {
      console.log(`  [${j+1}]: ${lines[j]}`);
    }
    break;
  }
}
