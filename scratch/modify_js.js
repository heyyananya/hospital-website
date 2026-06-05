const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, '../js/script.js');
const authPath = path.join(__dirname, '../js/auth.js');

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

console.log('Modifying js/script.js...');

// 1. English logo key addition
replaceInFile(scriptPath, 
  `    "brand": "Superspeciality Doctors Consultation",`, 
  `    "brand": "Superspeciality Doctors Consultation",\n    "brand-logo": "Superspeciality <span class=\\"logo-accent\\">Doctors Consultation</span>",`
);

// 2. Gujarati brand translation replacement (replace only the first "brand": "હેલ્થ હબ" after gu: { )
// Since the file has other occurrences, we can target it uniquely by matching the surroundings
replaceInFile(scriptPath,
  `  gu: {\n    "brand": "હેલ્થ હબ",`,
  `  gu: {\n    "brand": "સુપરસ્પેશિયાલિટી ડોકટર્સ કન્સલ્ટેશન",\n    "brand-logo": "સુપરસ્પેશિયાલિટી <span class=\\"logo-accent\\">ડોકટર્સ કન્સલ્ટેશન</span>",`
);

// 3. Gujarati other strings
replaceInFile(scriptPath,
  `    "hero-heading": "પાલનપુર <br><span>હેલ્થ હબ</span>",`,
  `    "hero-heading": "સુપરસ્પેશિયાલિટી <br><span>ડોકટર્સ કન્સલ્ટેશન</span>",`
);

replaceInFile(scriptPath,
  `    "live-status-p": "પાલનપુર હેલ્થ હબમાં ડોક્ટરની ઉપલબ્ધતાના રીઅલ-ટાઇમ સંકેતો તપાસો જેથી કતારના વિલંબ વિના મુલાકાત ગોઠવી શકાય.",`,
  `    "live-status-p": "સુપરસ્પેશિયાલિટી ડોકટર્સ કન્સલ્ટેશનમાં ડોક્ટરની ઉપલબ્ધતાના રીઅલ-ટાઇમ સંકેતો તપાસો જેથી કતારના વિલંબ વિના મુલાકાત ગોઠવી શકાય.",`
);

// Match test-1-text in Gujarati dynamically
let content = fs.readFileSync(scriptPath, 'utf8').replace(/\r\n/g, '\n');
const guTestRegex = /"test-1-text":\s*"\\"(?:પાલનપુર હેલ્થ હબે|પાલનપુર હેલ્થ હબ) મારો કલાકોનો સમય બચાવ્યો\.[^"]+"/;
if (guTestRegex.test(content)) {
  content = content.replace(guTestRegex, `"test-1-text": "\\"સુપરસ્પેશિયાલિટી ડોકટર્સ કન્સલ્ટેશનથી મારો કલાકોનો સમય બચ્યો છે. મેં ઘરેથી જ કાર્ડિયોલોજી બુક કર્યું, Razorpay પર ફી ચૂકવી અને લાઈવ ટોકન સ્ટેટસ મેળવ્યું!\\""`);
  fs.writeFileSync(scriptPath, content, 'utf8');
  console.log('SUCCESS: Replaced gu test-1-text dynamically');
} else {
  console.error('ERROR: Could not find gu test-1-text dynamically!');
}

replaceInFile(scriptPath,
  `    "gal-title": "પાલનપુર હેલ્થ હબની ઝાંખી",`,
  `    "gal-title": "સુપરસ્પેશિયાલિટી ડોકટર્સ કન્સલ્ટેશનની ઝાંખી",`
);

replaceInFile(scriptPath,
  `    "contact-p-loc": "પાલનપુર હેલ્થ હબ, ડીસા હાઇવે ચાર રસ્તા, પાલનપુર, ગુજરાત - ૩૮૫૦૦૧",`,
  `    "contact-p-loc": "સુપરસ્પેશિયાલિટી ડોકટર્સ કન્સલ્ટેશન, ડીસા હાઇવે ચાર રસ્તા, પાલનપુર, ગુજરાત - ૩૮૫૦૦૧",`
);


// 4. Hindi brand translation replacement
replaceInFile(scriptPath,
  `  hi: {\n    "brand": "हेल्थ हब",`,
  `  hi: {\n    "brand": "सुपरस्पेशलिटी डॉक्टर्स कंसल्टेशन",\n    "brand-logo": "सुपरस्पेशलिटी <span class=\\"logo-accent\\">डॉक्टर्स कंसल्टेशन</span>",`
);

replaceInFile(scriptPath,
  `    "hero-heading": "पालनपुर <br><span>हेल्थ हब</span>",`,
  `    "hero-heading": "सुपरस्पेशलिटी <br><span>डॉक्टर्स कंसल्टेशन</span>",`
);

replaceInFile(scriptPath,
  `    "live-status-p": "पालनपुर हेल्थ हब में डॉक्टरों की उपलब्धता की वास्तविक समय की जानकारी देखें ताकि बिना कतार के देरी के अपनी यात्रा की योजना बनाई जा सके।",`,
  `    "live-status-p": "सुपरस्पेशलिटी डॉक्टर्स कंसल्टेशन में डॉक्टरों की उपलब्धता की वास्तविक समय की जानकारी देखें ताकि बिना कतार के देरी के अपनी यात्रा की योजना बनाई जा सके।",`
);

// Match test-1-text in Hindi dynamically
content = fs.readFileSync(scriptPath, 'utf8').replace(/\r\n/g, '\n');
const hiTestRegex = /"test-1-text":\s*"\\"पालनपुर हेल्थ हब ने क्लिनिक में घंटों प्रतीक्षा करने से मेरा समय बचा लिया\.[^"]+"/;
if (hiTestRegex.test(content)) {
  content = content.replace(hiTestRegex, `"test-1-text": "\\"सुपरस्पेशलिटी डॉक्टर्स कंसल्टेशन ने क्लिनिक में घंटों प्रतीक्षा करने से मेरा समय बचा लिया। मैंने घर से कार्डियोलॉजी अपॉइंटमेंट बुक किया, रेज़रपे पर भुगतान किया, और तुरंत लाइव कतार टोकन देखा!\\""`);
  fs.writeFileSync(scriptPath, content, 'utf8');
  console.log('SUCCESS: Replaced hi test-1-text dynamically');
} else {
  console.error('ERROR: Could not find hi test-1-text dynamically!');
}

replaceInFile(scriptPath,
  `    "gal-title": "पालनपुर हेल्थ हब के अंदर",`,
  `    "gal-title": "सुपरस्पेशलिटी डॉक्टर्स कंसल्टेशन के अंदर",`
);

replaceInFile(scriptPath,
  `    "contact-p-loc": "पालनपुर हेल्थ हब, डीसा हाईवे चौराहा, पालनपुर, गुजरात - 385001",`,
  `    "contact-p-loc": "सुपरस्पेशलिटी डॉक्टर्स कंसल्टेशन, डीसा हाईवे चौराहा, पालनपुर, गुजरात - 385001",`
);


// 5. auth.js replacements
console.log('Modifying js/auth.js...');
replaceInFile(authPath,
  `    "auth-gate-p": "પાલનપુર હેલ્થ હબ વર્કસ્પેસ અથવા પેશન્ટ પોર્ટલ ઍક્સેસ કરો.",`,
  `    "auth-gate-p": "સુપરસ્પેશિયાલિટી ડોકટર્સ કન્સલ્ટેશન વર્કસ્પેસ અથવા પેશન્ટ પોર્ટલ ઍક્સેસ કરો.",`
);
replaceInFile(authPath,
  `    "footer-copyright": "&copy; ૨૦૨૬ પાલનપુર હેલ્થ હબ. સ્માર્ટ હોસ્પિટલ સોલ્યુશન્સ."`,
  `    "footer-copyright": "&copy; ૨૦૨૬ સુપરસ્પેશિયાલિટી ડોકટર્સ કન્સલ્ટેશન. સ્માર્ટ હોસ્પિટલ સોલ્યુશન્સ."`
);
replaceInFile(authPath,
  `    "auth-gate-p": "पालनपुर हेल्थ हब वर्कस्पेस या रोगी पोर्टल तक पहुंचें।",`,
  `    "auth-gate-p": "सुपरस्पेशलिटी डॉक्टर्स कंसल्टेशन वर्कस्पेस या रोगी पोर्टल तक पहुंचें।",`
);
replaceInFile(authPath,
  `    "footer-copyright": "&copy; 2026 पालनपुर हेल्थ हब। स्मार्ट अस्पताल समाधान।"`,
  `    "footer-copyright": "&copy; 2026 सुपरस्पेशलिटी डॉक्टर्स कंसल्टेशन। स्मार्ट अस्पताल समाधान।"`
);

console.log('Script finished.');
