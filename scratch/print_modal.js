const fs = require('fs');
const content = fs.readFileSync('d:/Hospital_Website_HTML/index.html', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('initial-lang-modal') || lines[i].includes('lang-step-')) {
    console.log(`Line ${i+1}: ${lines[i].trim()}`);
    // Print 10 lines around
    for (let j = Math.max(0, i-5); j < Math.min(lines.length, i+15); j++) {
      console.log(`  [${j+1}]: ${lines[j]}`);
    }
    break;
  }
}
