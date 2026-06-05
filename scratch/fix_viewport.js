const fs = require('fs');
const path = require('path');

const files = [
  'index.html',
  'portal-login.html',
  'admin-dashboard.html',
  'doctor-dashboard.html',
  'doctor dashboard.html',
  'patient-dashboard.html',
  'receptionist-dashboard.html'
];

const target = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">';
const replacement = '<meta name="viewport" content="width=device-width, initial-scale=1.0">';

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(target)) {
      content = content.replace(target, replacement);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated viewport in ${file}`);
    } else {
      console.log(`Target viewport not found in ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});
