const fs = require('fs');
const content = fs.readFileSync('js/script.js', 'utf8').replace(/\r\n/g, '\n');
const search = `    "test-1-text": "\\\"पालनपुर हेल्थ हब ने क्लिनिक में घंटों प्रतीक्षा करने से मेरा समय बचा लिया। मैंने घर से कार्डियोलॉजी अपॉइंटमेंट बुक किया, रेज़रपे पर भुगतान किया, और तुरंत लाइव कतार टोकन देखा!\\\"",`;
const repl = `    "test-1-text": "\\\"सुपरस्पेशलिटी डॉक्टर्स कंसल्टेशन ने क्लिनिक में घंटों प्रतीक्षा करने से मेरा समय बचा लिया। मैंने घर से कार्डियोलॉजी अपॉइंटमेंट बुक किया, रेज़रपे पर भुगतान किया, और तुरंत लाइव कतार टोकन देखा!\\\"",`;

if (content.includes(search)) {
  fs.writeFileSync('js/script.js', content.replace(search, repl), 'utf8');
  console.log('SUCCESS: Hindi test-1-text replaced.');
} else {
  console.error('ERROR: Hindi test-1-text search target not found!');
}
