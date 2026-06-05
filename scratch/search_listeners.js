const fs = require('fs');
const content = fs.readFileSync('d:/Hospital_Website_HTML/js/script.js', 'utf8');

const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('successModal')) {
    console.log(`L${i+1}: ${line.trim()}`);
  }
});
