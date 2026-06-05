const fs = require('fs');
const path = require('path');

const scriptPath = 'd:/Hospital_Website_HTML/js/script.js';
const authPath = 'd:/Hospital_Website_HTML/js/auth.js';

function replaceInFile(filePath, search, replacement) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Normalize content and search to remove carriage returns to prevent comparison mismatch
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const normalizedSearch = search.replace(/\r\n/g, '\n');
  const normalizedRepl = replacement.replace(/\r\n/g, '\n');

  if (!normalizedContent.includes(normalizedSearch)) {
    console.error(`ERROR: Target not found in ${path.basename(filePath)}!`);
    console.log("Search target:", JSON.stringify(normalizedSearch));
    return false;
  }

  const updatedContent = normalizedContent.replace(normalizedSearch, normalizedRepl);
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`SUCCESS: Replaced text in ${path.basename(filePath)}`);
  return true;
}

console.log('--- Modifying js/script.js brand-logo translations ---');

// 1. English logo translation replacement
replaceInFile(scriptPath,
  `    "brand-logo": "Superspeciality <span class=\\"logo-accent\\">Doctors Consultation</span>",`,
  `    "brand-logo": "<span class=\\"logo-top\\">Superspeciality</span><span class=\\"logo-accent logo-bottom\\">Doctors Consultation</span>",`
);

// 2. Gujarati logo translation replacement
replaceInFile(scriptPath,
  `    "brand-logo": "સુપરસ્પેશિયાલિટી <span class=\\"logo-accent\\">ડોકટર્સ કન્સલ્ટેશન</span>",`,
  `    "brand-logo": "<span class=\\"logo-top\\">સુપરસ્પેશિયાલિટી</span><span class=\\"logo-accent logo-bottom\\">ડોકટર્સ કન્સલ્ટેશન</span>",`
);

// 3. Hindi logo translation replacement
replaceInFile(scriptPath,
  `    "brand-logo": "सुपरस्पेशलिटी <span class=\\"logo-accent\\">डॉक्टर्स कंसल्टेशन</span>",`,
  `    "brand-logo": "<span class=\\"logo-top\\">सुपरस्पेशलिटी</span><span class=\\"logo-accent logo-bottom\\">डॉक्टर्स कंसल्टेशन</span>",`
);

console.log('--- Modifying js/auth.js translations ---');

// 4. English auth logo addition
replaceInFile(authPath,
  `  en: {\n    "auth-gate-title": "Secure Gateway Portal",`,
  `  en: {\n    "brand-logo": "<span class=\\"logo-top\\">Superspeciality</span><span class=\\"logo-accent logo-bottom\\">Doctors Consultation</span>",\n    "auth-gate-title": "Secure Gateway Portal",`
);

// 5. Gujarati auth logo addition
replaceInFile(authPath,
  `  gu: {\n    "auth-gate-title": "સુરક્ષિત ગેટવે પોર્ટલ",`,
  `  gu: {\n    "brand-logo": "<span class=\\"logo-top\\">સુપરસ્પેશિયાલિટી</span><span class=\\"logo-accent logo-bottom\\">ડોકટર્સ કન્સલ્ટેશન</span>",\n    "auth-gate-title": "સુરક્ષિત ગેટવે પોર્ટલ",`
);

// 6. Hindi auth logo addition
replaceInFile(authPath,
  `  hi: {\n    "auth-gate-title": "सुरक्षित गेटवे पोर्टल",`,
  `  hi: {\n    "brand-logo": "<span class=\\"logo-top\\">सुपरस्पेशलिटी</span><span class=\\"logo-accent logo-bottom\\">डॉक्टर्स कंसल्टेशन</span>",\n    "auth-gate-title": "सुरक्षित गेटवे पोर्टल",`
);

console.log('Translation updates finished.');
