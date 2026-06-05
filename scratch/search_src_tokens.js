const fs = require('fs');
const files = [
  'd:/Hospital_Website_HTML/src/components/AdminLayout.jsx',
  'd:/Hospital_Website_HTML/src/components/PatientReports.jsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    console.log(`\n=== File: ${file} ===`);
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes('token')) {
        console.log(`Line ${i+1}: ${lines[i].trim()}`);
      }
    }
  }
}
