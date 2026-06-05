const fs = require('fs');
const content = fs.readFileSync('d:/Hospital_Website_HTML/js/receptionist.js', 'utf8');

const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.toLowerCase().includes('delete') || line.toLowerCase().includes('remove') || line.toLowerCase().includes('cancel')) {
    console.log(`L${i+1}: ${line.trim()}`);
  }
});
