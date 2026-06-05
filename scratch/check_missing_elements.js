const fs = require('fs');

const html = fs.readFileSync('d:/Hospital_Website_HTML/index.html', 'utf8');
const js = fs.readFileSync('d:/Hospital_Website_HTML/js/script.js', 'utf8');

const regex = /(?:const|let)\s+(\w+)\s*=\s*document\.getElementById\(\s*['"]([^'"]+)['"]\s*\)/g;
let match;

while ((match = regex.exec(js)) !== null) {
  const varName = match[1];
  const id = match[2];
  const exists = html.includes(`id="${id}"`) || html.includes(`id='${id}'`);
  if (!exists) {
    // Check if there are property accesses or method calls on varName in the JS code
    // e.g. varName.addEventListener, varName.style, etc.
    const propRegex = new RegExp(`\\b${varName}\\.\\w+`, 'g');
    const matches = js.match(propRegex) || [];
    if (matches.length > 0) {
      console.log(`CRITICAL: Missing element id="${id}" (var ${varName}) has property accesses:`, [...new Set(matches)]);
    } else {
      console.log(`INFO: Missing element id="${id}" (var ${varName}) is declared but not directly accessed as an object.`);
    }
  }
}
