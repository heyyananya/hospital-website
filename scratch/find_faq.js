const fs = require('fs');

const indexContent = fs.readFileSync('d:/Hospital_Website_HTML/index.html', 'utf8');
const scriptContent = fs.readFileSync('d:/Hospital_Website_HTML/js/script.js', 'utf8');

console.log('=== Index.html FAQ section lines ===');
const indexLines = indexContent.split('\n');
let insideFaq = false;
indexLines.forEach((line, index) => {
    if (line.includes('id="faq"') || line.includes('class="faq"')) {
        insideFaq = true;
    }
    if (insideFaq && index < 750) {
        console.log(`Line ${index + 1}: ${line}`);
    }
});

console.log('=== js/script.js FAQ logic ===');
const scriptLines = scriptContent.split('\n');
scriptLines.forEach((line, index) => {
    if (line.toLowerCase().includes('faq')) {
        console.log(`Line ${index + 1}: ${line.trim()}`);
    }
});
