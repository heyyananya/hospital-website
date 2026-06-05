const fs = require('fs');
const files = ['js/patient.js', 'js/doctor.js', 'js/receptionist.js', 'js/admin.js', 'js/auth.js', 'js/init.js', 'js/sync.js'];

for (const file of files) {
  const fullPath = `d:/Hospital_Website_HTML/${file}`;
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.toLowerCase().includes('translation') || content.toLowerCase().includes('faq')) {
      console.log(`Found reference in: ${file}`);
    }
  }
}
