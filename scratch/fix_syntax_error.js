const fs = require('fs');
const path = require('path');

const scriptPath = 'd:/Hospital_Website_HTML/js/script.js';

let content = fs.readFileSync(scriptPath, 'utf8');
const searchStr = `"test-1-text": "\\"સુપરસ્પેશિયાલિટી ડોકટર્સ કન્સલ્ટેશનથી મારો કલાકોનો સમય બચ્યો છે. મેં ઘરેથી જ કાર્ડિયોલોજી બુક કર્યું, Razorpay પર ફી ચૂકવી અને લાઈવ ટોકન સ્ટેટસ મેળવ્યું!\\""`;

// We search for the broken line (which has an extra double quote at the end)
const brokenSearch = searchStr + '"';
const fixedReplacement = searchStr;

if (content.includes(brokenSearch)) {
  content = content.replace(brokenSearch, fixedReplacement);
  fs.writeFileSync(scriptPath, content, 'utf8');
  console.log('SUCCESS: Fixed Gujarati test-1-text syntax error in script.js');
} else {
  console.error('ERROR: Could not find broken Gujarati test-1-text string in script.js');
}
