const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, '../js/script.js');
let content = fs.readFileSync(filepath, 'utf8');

// We want to replace the block starting with "const DISEASE_TRANSLATIONS ="
// and ending with skipStep2 definition with our selectInitialLanguageStep1 function.
const startIdx = content.indexOf('const DISEASE_TRANSLATIONS = {');
const endMarker = `window.skipStep2 = function() {
  window.closeWelcomeModal();
};`;
const endIdx = content.indexOf(endMarker);

if (startIdx === -1) {
  console.error("Could not find start index");
  process.exit(1);
}
if (endIdx === -1) {
  console.error("Could not find end index");
  process.exit(1);
}

const before = content.substring(0, startIdx);
const after = content.substring(endIdx + endMarker.length);

const replacement = `window.selectInitialLanguageStep1 = function(lang) {
  // Save active language
  currentLanguage = lang;
  localStorage.setItem("phh_lang", lang);
  setLanguage(lang);
  window.closeWelcomeModal();
};`;

const newContent = before + replacement + after;
fs.writeFileSync(filepath, newContent, 'utf8');
console.log("js/script.js cleaned up successfully!");
